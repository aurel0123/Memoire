# Generated by Django 5.1.4 on 2025-03-11 14:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_etudiant_maitre_memoire'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='etudiant',
            name='theme',
        ),
    ]
