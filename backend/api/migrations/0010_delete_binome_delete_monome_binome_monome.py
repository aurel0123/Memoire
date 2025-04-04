# Generated by Django 5.1.4 on 2025-03-15 21:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_etudiant_maitre_memoire'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Binome',
        ),
        migrations.DeleteModel(
            name='Monome',
        ),
        migrations.CreateModel(
            name='Binome',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('theme', models.CharField(max_length=200)),
                ('etudiant1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='binome_etudiant1', to='api.etudiant')),
                ('etudiant2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='binome_etudiant2', to='api.etudiant')),
                ('maitre_memoire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='binomes_encadres', to='api.enseignant')),
            ],
        ),
        migrations.CreateModel(
            name='Monome',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('theme', models.CharField(max_length=200)),
                ('etudiant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='monome_etudiant', to='api.etudiant')),
                ('maitre_memoire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='monomes_encadres', to='api.enseignant')),
            ],
        ),
    ]
