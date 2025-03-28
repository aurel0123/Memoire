# Generated by Django 5.1.4 on 2025-03-11 11:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_filiere_id_alter_filiere_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='etudiant',
            name='filiere',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='etudiants', to='api.filiere'),
        ),
        migrations.AlterField(
            model_name='etudiant',
            name='maitre_memoire',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='etudiants_encadres', to='api.enseignant'),
        ),
    ]
