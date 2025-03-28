from rest_framework import serializers
from .models import Enseignant, Etudiant, Filiere, Groupe, Monome, Binome, Soutenance, ProcesVerbal
from rest_framework.exceptions import ValidationError
class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = '__all__'

class EnseignantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enseignant
        fields = '__all__'

class EtudiantSerializer(serializers.ModelSerializer):
    filiere_detail = FiliereSerializer(source='filiere', read_only=True)
    maitre_memoire_detail = EnseignantSerializer(source='maitre_memoire', read_only=True)  # Correction ici

    class Meta:
        model = Etudiant
        fields = '__all__'
        
    # Pour afficher les détails de la filière au lieu de juste l'ID
    

class GroupeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groupe
        fields = '__all__'

class SoutenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Soutenance
        fields = '__all__'

class ProcesVerbalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcesVerbal
        fields = '__all__'


class MonomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monome
        fields = '__all__'

class BinomeSerializer(serializers.ModelSerializer):
    etudiants = EtudiantSerializer(many=True, read_only=True)  # Lecture seule
    etudiants_matricules = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=True
    )

    class Meta:
        model = Binome
        fields = ['id', 'etudiants', 'etudiants_matricules', 'maitre_memoire', 'theme', 'programmation']
