# Generated by Django 2.2.12 on 2021-04-11 17:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ActionPage',
            fields=[
                ('action_page_id', models.AutoField(primary_key=True, serialize=False)),
                ('chosen_choice', models.IntegerField(null=True)),
                ('result_page', models.IntegerField(null=True)),
            ],
            options={
                'db_table': 'action_page',
            },
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('course_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'courses',
            },
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('page_id', models.AutoField(primary_key=True, serialize=False)),
                ('page_type', models.CharField(max_length=200)),
                ('page_title', models.CharField(max_length=200)),
                ('version_id', models.IntegerField()),
                ('body', models.TextField()),
                ('next_page', models.IntegerField()),
                ('x_coordinate', models.IntegerField()),
                ('y_coordinate', models.IntegerField()),
            ],
            options={
                'db_table': 'pages',
            },
        ),
        migrations.CreateModel(
            name='Scenario',
            fields=[
                ('scenario_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_id', models.IntegerField()),
                ('public', models.BooleanField()),
                ('is_finished', models.BooleanField()),
                ('date_created', models.DateField()),
            ],
            options={
                'db_table': 'scenarios',
            },
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('session_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_id', models.IntegerField()),
                ('date_started', models.DateTimeField()),
                ('is_finished', models.BooleanField()),
                ('course_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Course')),
                ('scenario_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Scenario')),
            ],
            options={
                'db_table': 'sessions',
            },
        ),
        migrations.CreateModel(
            name='Stakeholder',
            fields=[
                ('stakeholder_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('description', models.TextField()),
                ('job', models.TextField()),
                ('introduction', models.TextField()),
                ('photopath', models.TextField()),
                ('scenario_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Scenario')),
            ],
            options={
                'db_table': 'stakeholders',
            },
        ),
        migrations.CreateModel(
            name='Version',
            fields=[
                ('version_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=500)),
                ('num_conversation', models.IntegerField()),
                ('first_page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page')),
                ('scenario_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Scenario')),
            ],
            options={
                'db_table': 'versions',
            },
        ),
        migrations.CreateModel(
            name='StakeholderPage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page')),
                ('stakeholder_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Stakeholder')),
            ],
            options={
                'db_table': 'stakeholder_page',
            },
        ),
        migrations.AddField(
            model_name='stakeholder',
            name='version_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version'),
        ),
        migrations.CreateModel(
            name='SessionTime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_taken', models.DateTimeField()),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('course_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Course')),
                ('page_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page')),
                ('session_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Session')),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'session_times',
            },
        ),
        migrations.AddField(
            model_name='session',
            name='version_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version'),
        ),
        migrations.CreateModel(
            name='ScenarioForUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('scenario_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Scenario')),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'scenario_for_user',
            },
        ),
        migrations.CreateModel(
            name='Response',
            fields=[
                ('response_id', models.AutoField(primary_key=True, serialize=False)),
                ('date_taken', models.DateTimeField()),
                ('choice', models.TextField()),
                ('course_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Course')),
                ('page_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page')),
                ('session_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Session')),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'responses',
            },
        ),
        migrations.CreateModel(
            name='ReflectionsTaken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reflections', models.TextField()),
                ('date_taken', models.DateTimeField()),
                ('course_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Course')),
                ('page_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page')),
                ('session_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Session')),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'reflections_taken',
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('issue_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('importance_score', models.IntegerField()),
                ('scenario_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Scenario')),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'issues',
            },
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invitation_key', models.TextField()),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'invitations',
            },
        ),
        migrations.CreateModel(
            name='GenericPage',
            fields=[
                ('generic_page_id', models.AutoField(primary_key=True, serialize=False)),
                ('page_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page')),
            ],
            options={
                'db_table': 'generic_page',
            },
        ),
        migrations.CreateModel(
            name='Coverage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coverage_score', models.FloatField()),
                ('issue_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Issue')),
                ('stakeholder_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Stakeholder')),
            ],
            options={
                'db_table': 'coverage',
            },
        ),
        migrations.CreateModel(
            name='ConversationsHad',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_id', models.IntegerField()),
                ('date_taken', models.DateTimeField()),
                ('score', models.FloatField()),
                ('conversation_id', models.IntegerField()),
                ('session_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Session')),
                ('stakeholder_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Stakeholder')),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'conversations_had',
            },
        ),
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('conversation_id', models.AutoField(primary_key=True, serialize=False)),
                ('question', models.TextField()),
                ('response_id', models.TextField()),
                ('stakeholder_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Stakeholder')),
            ],
            options={
                'db_table': 'conversations',
            },
        ),
        migrations.CreateModel(
            name='Choice',
            fields=[
                ('choices_id', models.AutoField(primary_key=True, serialize=False)),
                ('choice_text', models.TextField()),
                ('next_page', models.IntegerField()),
                ('action_page_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.ActionPage')),
            ],
            options={
                'db_table': 'choice',
            },
        ),
        migrations.CreateModel(
            name='Change',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('asset_changed', models.CharField(max_length=1000)),
                ('new_content', models.TextField()),
                ('forked_from', models.IntegerField()),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'changes',
            },
        ),
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('content', models.TextField()),
                ('version_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Version')),
            ],
            options={
                'db_table': 'asset',
            },
        ),
        migrations.AddField(
            model_name='actionpage',
            name='page_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page'),
        ),
    ]
