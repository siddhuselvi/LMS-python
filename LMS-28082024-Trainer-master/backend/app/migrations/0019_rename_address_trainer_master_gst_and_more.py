# Generated by Django 5.0.3 on 2024-08-27 05:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_screenshots'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trainer_master',
            old_name='address',
            new_name='gst',
        ),
        migrations.AddField(
            model_name='trainer_master',
            name='certification',
            field=models.TextField(blank=True, max_length=5000, null=True),
        ),
        migrations.AddField(
            model_name='trainer_master',
            name='location',
            field=models.TextField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='trainer_master',
            name='pan_number',
            field=models.TextField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='trainer_master',
            name='photo',
            field=models.BinaryField(blank=True, null=True),
        ),
    ]
