# Generated by Django 5.0.3 on 2024-07-25 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate_master',
            name='year',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
