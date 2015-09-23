from django.db.models import signals
from django.dispatch import receiver
from django.db import connection

from specifyweb.specify.models import Specifyuser, Spprincipal, Collection


@receiver(signals.post_save, sender=Specifyuser)
def added_user(sender, instance, created, raw, **kwargs):
    if raw or not created: return
    user = instance
    cursor = connection.cursor()

    for collection in Collection.objects.all():
        principal = Spprincipal.objects.create(
            groupsubclass='edu.ku.brc.af.auth.specify.principal.UserPrincipal',
            grouptype=None,
            name=user.name,
            priority=80,
        )
        cursor.execute('update spprincipal set usergroupscopeid = %s where spprincipalid = %s',
                       (collection.id, principal.id))
        cursor.execute('insert specifyuser_spprincipal(SpecifyUserID, SpPrincipalID) values (%s, %s)',
                       (user.id, principal.id))

@receiver(signals.pre_delete, sender=Specifyuser)
def deleting_user(sender, instance, **kwargs):
    user = instance
    cursor = connection.cursor()
    cursor.execute('delete from specifyuser_spprincipal where SpecifyUserID = %s', [user.id])
