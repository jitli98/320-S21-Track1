# Generated by Django 2.2.12 on 2021-04-25 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_session_most_recent_access'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='is_finished',
            field=models.BooleanField(default=False),
        ),
    ]