# Generated by Django 2.2.12 on 2021-04-22 16:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0005_takes_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='takes',
            old_name='couse_id',
            new_name='course_id',
        ),
    ]
