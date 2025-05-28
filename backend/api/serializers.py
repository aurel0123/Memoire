from rest_framework import serializers
from .models import Enseignant, Etudiant, Filiere, Groupe, Monome, Binome, Soutenance, ProcesVerbal , Evenements , CustomUser , Candidat  , Transaction , RoleJury
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

class RoleJurySerializer(serializers.ModelSerializer):
    enseignant = EnseignantSerializer(read_only=True)
    enseignant_id = serializers.PrimaryKeyRelatedField(
        queryset=Enseignant.objects.all(), 
        source='enseignant',
        write_only=True
    )

    class Meta:
        model = RoleJury
        fields = ['id', 'type', 'enseignant', 'enseignant_id']
class SoutenanceSerializer(serializers.ModelSerializer):
    jury_roles = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )
    jury_members = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Soutenance
        fields = [
            'id', 'date_soutenance', 'heure_soutenance', 'salle',
            'statut', 'binome', 'monome','directeur' ,'jury_roles', 'jury_members'
        ]
        read_only_fields = ['statut']

    def get_jury_members(self, obj):
        roles = obj.jury_membres.all()
        return RoleJurySerializer(roles, many=True).data
    def get_statut(self, obj):
        return obj.determiner_statut()

class ProcesVerbalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcesVerbal
        fields = '__all__'


class MonomeSerializer(serializers.ModelSerializer):
    etudiant = EtudiantSerializer(read_only=True)
    
    # Solution 1: Si vous voulez un seul matricule (relation OneToOne/ForeignKey)
    etudiant_matricule = serializers.CharField(
        write_only=True,
        required=True,
        #source='etudiant.matricule'  # Accède au matricule via la relation
    )
    class Meta:
        model = Monome
        fields =  ['id', 'etudiant', 'etudiant_matricule', 'maitre_memoire', 'theme', 'programmation']
    def update(self, instance, validated_data):
        # Récupère etudiant_matricule seulement s'il est présent
        etudiant_matricule = validated_data.pop('etudiant_matricule', None)
        
        # Mise à jour des autres champs
        instance = super().update(instance, validated_data)
        
        # Gestion de l'étudiant seulement si matricule fourni
        if etudiant_matricule is not None:
            try:
                etudiant = Etudiant.objects.get(matricule=etudiant_matricule)
                instance.etudiant = etudiant
            except Etudiant.DoesNotExist:
                raise serializers.ValidationError(
                    {'etudiant_matricule': f"Aucun étudiant trouvé avec le matricule {etudiant_matricule}"}
                )
        
        instance.save()
        return instance

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

    def update(self, instance, validated_data):
        etudiants_matricules = validated_data.pop('etudiants_matricules', None)
        
        # Mettre à jour les autres champs
        instance = super().update(instance, validated_data)
        
        # Gestion spécifique des étudiants
        if etudiants_matricules:
            etudiants = Etudiant.objects.filter(matricule__in=etudiants_matricules)
            instance.etudiants.set(etudiants)
        
        return instance

class EvenementsSerializer(serializers.ModelSerializer) : 

    class Meta : 
        model = Evenements 
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        #fields = '__all__'  # Si vous voulez tous les champs  
        fields = ['id', 'email', 'nom', 'prenom', 'is_approved', 'username' ,  'type_user','phone', 'is_active']  # Liste des champs que vous voulez afficher


class CandidatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidat
        fields = ['id', 'nom', 'prenom', 'photo', 'description', 'link', 'votes', 'evenement','telephone']
        read_only_fields = ['evenement']

class TransactionSerializer(serializers.ModelSerializer):
    telephone = serializers.CharField(write_only=True, required=True)
    nombreVotes = serializers.IntegerField(write_only=True, required=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_id', 'montant', 'status', 'date_transaction', 'candidat', 'telephone', 'nombreVotes']
        read_only_fields = ['id', 'transaction_id', 'date_transaction']
    
    def create(self, validated_data):
        # Extraire les champs non-modèle
        telephone = validated_data.pop('telephone', None)
        nombre_votes = validated_data.pop('nombreVotes', 1)
        
        # Générer un ID unique pour la transaction
        import uuid
        validated_data['transaction_id'] = str(uuid.uuid4())
        
        # Créer la transaction
        transaction = super().create(validated_data)
        
        return transaction