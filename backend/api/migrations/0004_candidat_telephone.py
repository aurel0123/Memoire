# Generated by Django 5.1.6 on 2025-04-28 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_evenements_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='candidat',
            name='telephone',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
