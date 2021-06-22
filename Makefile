VIRTUAL_ENV ?= /usr

PYTHON = $(VIRTUAL_ENV)/bin/python
PIP = $(VIRTUAL_ENV)/bin/pip
MYPY = $(VIRTUAL_ENV)/bin/mypy

.PHONY: clean runserver webpack_watch pip_requirements django_migrations frontend build

build: frontend specifyweb/settings/build_version.py specifyweb/settings/secret_key.py

frontend:
	$(MAKE) -C specifyweb/frontend/js_src

pip_requirements:
	$(PIP) install --upgrade -r requirements.txt

django_migrations: python_prep
	$(PYTHON) manage.py migrate notifications workbench

specifyweb/settings/build_version.py: .FORCE
	if [ -z "${BUILD_VERSION}" ]; \
	then echo "VERSION = '`git describe --tags`'" > $@; \
	else echo "VERSION = '${BUILD_VERSION}'" > $@; \
	fi

specifyweb/settings/secret_key.py:
	echo "# Make this unique, and don't share it with anybody.\n# This value was autogenerated." > $@
	printf "SECRET_KEY = '%b'\n" $$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c 50) >> $@

clean:
	rm -f specifyweb/settings/build_version.py
	rm -f specifyweb/settings/secret_key.py
	$(MAKE) -C specifyweb/frontend/js_src clean

runserver:
	$(PYTHON) manage.py runserver

webpack_watch:
	$(MAKE) -C specifyweb/frontend/js_src watch

typecheck:
	$(MYPY) --follow-imports silent specifyweb/workbench specifyweb/specify/schema.py specifyweb/specify/load_datamodel.py

.FORCE:
