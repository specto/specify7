import mimetypes
import logging
import json
import re
from functools import wraps
from typing import Dict, Tuple

from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.cache import cache_control
from django.conf import settings
from django import http
from django.db.models.deletion import Collector
from django.db import router
from django.urls import resolve

from openapi_core import create_spec
from openapi_core.validation.request.validators import RequestValidator
from openapi_core.contrib.django import DjangoOpenAPIRequest

from .specify_jar import specify_jar
from . import api, models

logger = logging.getLogger(__name__)

def login_maybe_required(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return http.HttpResponseForbidden()
        return view(request, *args, **kwargs)
    return wrapped

if settings.ANONYMOUS_USER:
    login_maybe_required = lambda func: func


def apply_access_control(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if request.method != "GET" and request.specify_readonly:
            return http.HttpResponseForbidden()
        return view(request, *args, **kwargs)
    return wrapped

class HttpResponseConflict(http.HttpResponse):
    status_code = 409


def generate_openapi_spec(path, parameters, schema, components):
    """Generate a tiny OpenAPI schema for an endpoint.

    Params:
        request: Django request object
        schema: OpenAPI schema for an endpoint
        components:
            OpenAPI components referenced by endpoint's OpenAPI definition

    Returns:
        OpenAPI spec for an endpoint
    """

    return dict(
        openapi='3.0.0',
        info=dict(
            title='',
            version='',
        ),
        servers=[dict(
            url='/'
        )],
        paths={
            path: {
                **schema,
                "parameters": [
                    *[
                        {
                            'name': parameter_name,
                            'in': 'path',
                            'required': True,
                            'schema': {
                                'type': parameter_type
                            }
                        } for parameter_name, parameter_type in parameters.items()
                    ],
                    *(schema["parameters"] if "parameters" in schema else []),
                ]
            },
        },
        components=components
    )


def extract_pattern_from_request(request)->Tuple[str, Dict[str,str]]:
    raw_url = resolve(request.path).route
    stripped_url = re.sub(
        r'^\^?(?P<pattern>[^$]+)\$$',
        '\\1',
        raw_url
    )

    parameters = {}
    def handle_parameter(match_object):
        name = match_object.group('uri_parameter')[1:-1]
        regex_type = match_object.group('type')
        openapi_type = 'number' if regex_type == 'd' else 'string'
        parameters[name] = openapi_type
        return f"{'{'}{name}{'}'}"
    url = re.sub(
        r'\(\?P(?P<uri_parameter><(?P<type>\w+)>)\\\w\+\)',
        handle_parameter,
        stripped_url
    )

    return '/'+url, parameters


def openapi(
    schema,
    components=None,
    validate=True,
    strict=False
):
    """Create a decorator for adding OpenAPI Schema

    Adds OpenAPI schema to a view.
    Validates the request/response objects.
    Throws warnings/errors on invalid requests/responses.

    Params:
        schema: OpenAPI Schema object for an endpoint
        components:
            The definitions of the components that are referenced in the
            endpoint's definition
        validate: Whether to validate request/response objects on requests
        strict:
            If validate is True and validation encountered an error:
                If strict is True: raise Error
                if strict is False: log an Error
    """
    if components is None:
        components = {}

    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            if validate:
                try:
                    django_request = args[0]
                    pattern, parameters = \
                        extract_pattern_from_request(django_request)

                    openapi_request = DjangoOpenAPIRequest(django_request)
                    setattr(
                        openapi_request,
                        'full_url_pattern',
                        pattern
                    )

                    spec=generate_openapi_spec(
                        pattern,
                        parameters,
                        schema,
                        components
                    )
                    parsed_spec=create_spec(spec)
                    validator = RequestValidator(parsed_spec)
                    result = validator.validate(openapi_request)

                    if strict or settings.DEBUG:
                        result.raise_for_errors()
                    else:
                        logger.warning(json.dumps(
                            result.errors,
                            default=lambda x: str(x)
                        ))
                except Exception as error:
                    if settings.DEBUG:
                        raise error
                    elif strict:
                        return http.HttpResponseBadRequest(str(error))
                    else:
                        logger.warning(str(error))
            response = view(*args, **kwargs)
            if validate:
                try:
                    pass
                except Exception as error:
                    if settings.DEBUG:
                        raise error
                    else:
                        logger.error(str(error))

            return response
        setattr(wrapped, '__schema__', {
            'schema': schema,
            'components': components
        })
        return wrapped
    return decorator


def api_view(dispatch_func):
    """Create a Django view function that handles exceptions arising
    in the api logic."""
    @login_maybe_required
    @cache_control(private=True, max_age=2)
    @apply_access_control
    def view(request, *args, **kwargs):
        """RESTful API endpoint for most Specify datamodel resources.
        <model> is the table from the Specify datamodel. <id> is the
        row id.
        """
        try:
            return dispatch_func(request, *args, **kwargs)
        except api.StaleObjectException as e:
            return HttpResponseConflict(e)
        except api.MissingVersionException as e:
            return http.HttpResponseBadRequest(e)
        except http.Http404 as e:
            return http.HttpResponseNotFound(e)
    return view

resource = api_view(api.resource_dispatch)
collection = api_view(api.collection_dispatch)

def raise_error(request):
    """This endpoint intentionally throws an error in the server for
    testing purposes.
    """
    raise Exception('This error is a test. You may now return to your regularly '
                    'scheduled hacking.')

@login_maybe_required
@require_GET
def delete_blockers(request, model, id):
    """Returns a JSON list of fields on <model> that point to related
    resources which prevent the resource <id> of that model from being
    deleted.
    """
    obj = api.get_object_or_404(model, id=int(id))
    using = router.db_for_write(obj.__class__, instance=obj)
    collector = Collector(using=using)
    collector.delete_blockers = []
    collector.collect([obj])
    result = ["%s.%s" % (sub_objs[0].__class__.__name__, field.name)
              for field, sub_objs in collector.delete_blockers]
    return http.HttpResponse(api.toJson(result), content_type='application/json')

@login_maybe_required
@require_GET
def rows(request, model):
    "Returns tuples from the table for <model>."
    return api.rows(request, model)

@require_GET
@cache_control(max_age=365*24*60*60, public=True)
def images(request, path):
    """Returns images and icons from the Specify thickclient jar file
    under edu/ku/brc/specify/images/."""
    mimetype = mimetypes.guess_type(path)[0]
    path = 'edu/ku/brc/specify/images/' + path
    try:
        image = specify_jar.read(path)
    except KeyError as e:
        raise http.Http404(e)
    return http.HttpResponse(image, content_type=mimetype)

@login_maybe_required
@require_GET
@cache_control(max_age=24*60*60, public=True)
def properties(request, name):
    """Returns the <name>.properties file from the thickclient jar file."""
    path = name + '.properties'
    return http.HttpResponse(specify_jar.read(path), content_type='text/plain')


@openapi(schema={
    'post': {
        "requestBody": {
            "required": True,
            "description": "New user's password",
            "content": {
                "application/x-www-form-urlencoded": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "password": {
                                "type": "string",
                                "description": "New user's password",
                            },
                        },
                        'required': ['password'],
                        'additionalProperties': False
                    }
                }
            }
        },
        "responses": {
            "204": {"description": "Success",},
            "403": {"description": "Logged in user is not an admin."}
        }
    },
})
@login_maybe_required
@require_POST
def set_password(request, userid):
    """Set <userid> specify user's password to the value in the 'password'
    POST parameter. Must be logged in as an admin, otherwise HTTP 403
    is returned.
    """
    if not request.specify_user.is_admin():
        return http.HttpResponseForbidden()

    user = models.Specifyuser.objects.get(pk=userid)
    user.set_password(request.POST['password'])
    user.save()
    return http.HttpResponse('', status=204)


@openapi(schema={
    'post': {
        "requestBody": {
            "required": True,
            "description": "Set or clear the admin status for a user.",
            "content": {
                "application/x-www-form-urlencoded": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "admin_status": {
                                "type": "string",
                                'enum': ['true', 'false'],
                                "description": "Whether the user should be given admin status.",
                            },
                        },
                        'required': ['admin_status'],
                        'additionalProperties': False
                    }
                }
            }
        },
        "responses": {
            "204": {"description": "Success",},
            "403": {"description": "Logged in user is not an admin."}
        }
    },
})
@login_maybe_required
@require_POST
def set_admin_status(request, userid):
    """Sets <userid> specify user's is-admin status to 'true' or 'false'
    according to the 'admin_status' POST parameter. Must be logged in
    as an admin, otherwise HTTP 403 is returned.
    """
    if not request.specify_user.is_admin():
        return http.HttpResponseForbidden()

    user = models.Specifyuser.objects.get(pk=userid)
    if request.POST['admin_status'] == 'true':
        user.set_admin()
        return http.HttpResponse('true', content_type='text/plain')
    else:
        user.clear_admin()
        return http.HttpResponse('false', content_type='text/plain')

@require_GET
def support_login(request):
    """If the ALLOW_SUPPORT_LOGIN setting is True, requesting this
    endpoint with a valid 'token' GET parameter will log in without a
    password according to the data encoded in the token. Tokens are
    generated by using the 'python manage.py support_login' command
    line tool on the server.
    """
    if not settings.ALLOW_SUPPORT_LOGIN:
        return http.HttpResponseForbidden()

    from django.contrib.auth import login, authenticate

    user = authenticate(token=request.GET['token'])
    if user is not None:
        login(request, user)
        return http.HttpResponseRedirect('/')
    else:
        return http.HttpResponseForbidden()
