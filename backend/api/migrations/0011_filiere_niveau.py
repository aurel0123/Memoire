# Generated by Django 5.1.4 on 2025-03-16 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_delete_binome_delete_monome_binome_monome'),
    ]

    operations = [
        migrations.AddField(
            model_name='filiere',
            name='niveau',
            field=models.CharField(choices=[('L3', 'Licence 3'), ('M2', 'Master 2')], default='L3', max_length=2),
        ),
    ]
