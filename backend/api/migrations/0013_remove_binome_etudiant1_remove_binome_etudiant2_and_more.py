# Generated by Django 5.1.4 on 2025-03-27 21:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_remove_etudiant_niveau'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='binome',
            name='etudiant1',
        ),
        migrations.RemoveField(
            model_name='binome',
            name='etudiant2',
        ),
        migrations.AddField(
            model_name='binome',
            name='etudiants',
            field=models.ManyToManyField(related_name='binomes', to='api.etudiant'),
        ),
    ]
