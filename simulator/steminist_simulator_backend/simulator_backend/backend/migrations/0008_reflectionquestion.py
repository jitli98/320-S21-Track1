# Generated by Django 2.2.12 on 2021-04-23 19:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_classassignment'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReflectionQuestion',
            fields=[
                ('rq_id', models.AutoField(primary_key=True, serialize=False)),
                ('reflection_question', models.TextField()),
                ('page_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page')),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'reflection_questions',
            },
        ),
    ]