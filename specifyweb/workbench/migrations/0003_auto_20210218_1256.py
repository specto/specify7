# Generated by Django 2.2.10 on 2021-02-18 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workbench', '0002_spdataset_visualorder'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spdataset',
            name='rowresults',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='spdataset',
            name='uploadplan',
            field=models.TextField(null=True),
        ),
    ]
