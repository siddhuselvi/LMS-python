# Generated by Django 5.0.3 on 2024-08-16 06:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_trainer_master_bank_name_trainer_master_resume_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trainer_master',
            name='bank_name',
        ),
        migrations.RemoveField(
            model_name='trainer_master',
            name='resume',
        ),
        migrations.RemoveField(
            model_name='trainer_master',
            name='user_name',
        ),
    ]
