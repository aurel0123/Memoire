from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from django.core.exceptions import ValidationError

# Create your views here.


class FiliereViewSet(viewsets.ModelViewSet):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer

class EnseignantViewSet(viewsets.ModelViewSet):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer

class EtudiantViewSet(viewsets.ModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer

class GroupeViewSet(viewsets.ModelViewSet):
    queryset = Groupe.objects.all()
    serializer_class = GroupeSerializer

class SoutenanceViewSet(viewsets.ModelViewSet):
    queryset = Soutenance.objects.all()
    serializer_class = SoutenanceSerializer

class ProcesVerbalViewSet(viewsets.ModelViewSet):
    queryset = ProcesVerbal.objects.all()
    serializer_class = ProcesVerbalSerializer


from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Count
from .models import Binome
from .serializers import BinomeSerializer
from django.core.exceptions import ValidationError

class BinomeViewSet(viewsets.ModelViewSet):
    queryset = Binome.objects.all()
    serializer_class = BinomeSerializer

    def create(self, request, *args, **kwargs):
        """
        Surcharge de la méthode create pour empêcher la création de doublons.
        """
        etudiants_matricules = request.data.get("etudiants_matricules", [])
        maitre_memoire = request.data.get("maitre_memoire")
        theme = request.data.get("theme")
        programmation = request.data.get("programmation")

        # Vérification que au moin un etudiant est bien fournis
        if not etudiants_matricules :
            return Response(
                {"error": "Un binôme doit être composé de au moin un étudiants."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Récupération des étudiants à partir de leur matricule
        etudiants = list(Etudiant.objects.filter(matricule__in=etudiants_matricules))

        # Vérification que les deux étudiants existent bien
        if len(etudiants) < 1:
            return Response(
                {"error": "Certains étudiants fournis ne sont pas trouvés."},
                status=status.HTTP_400_BAD_REQUEST
            )

        etudiants_ids = [e.matricule for e in etudiants]

        # Vérification des doublons de binôme (même paire d'étudiants)
        binomes_existants = Binome.objects.annotate(etudiant_count=Count("etudiants")).filter(
            etudiant_count=2, etudiants__in=etudiants
        )

        for binome in binomes_existants:
            if set(binome.etudiants.values_list("matricule", flat=True)) == set(etudiants_ids):
                return Response(
                    {"error": f"Un binôme avec ces deux étudiants existe déjà (Binôme #{binome.id})."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Vérification des doublons de thème
        if Binome.objects.filter(theme=theme).exists():
            return Response(
                {"error": f"Un binôme avec le thème '{theme}' existe déjà."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ajout des vérifications de l'étudiant déjà associé à un autre binôme
        errors = {}
        for etudiant in etudiants:
            if Binome.objects.filter(etudiants=etudiant).exclude(theme=theme).exists():
                errors[str(etudiant.matricule)] = f"L'étudiant {etudiant.nom} {etudiant.prenom} est déjà associé à un autre binôme."

        if errors:
            return Response(
                {'status': 'error', 'code': 'STUDENT_ALREADY_ASSIGNED', 'details': errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Création du binôme si aucune erreur
        try:
            binome = Binome.objects.create(maitre_memoire_id=maitre_memoire, theme=theme, programmation=programmation)
            binome.etudiants.set(etudiants)  # Associer les étudiants au binôme
            serializer = self.get_serializer(binome)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update (self, request , *args , **kwargs) :

        instance = self.get_object()
        etudiants_matricules = request.data.get("etudiants_matricules", [])
        maitre_memoire = request.data.get("maitre_memoire", instance.maitre_memoire_id)
        theme = request.data.get("theme", instance.theme)
        programmation = request.data.get("programmation", instance.programmation)
        #Verifier si au moin un etudiant a été fournis
        if not etudiants_matricules : 
            return Response(
                {"error" : "Un binôme doit être au moin composé de au moin un etudiant"}, 
                status = status.HTTP_400_BAD_REQUEST
            )
        # Récupération des étudiants à partir de leur matricule
        etudiants = list(Etudiant.objects.filter(matricule__in=etudiants_matricules))

        # Vérification que les deux étudiants existent bien
        if len(etudiants) < 1:
            return Response(
                {"error": "Certains étudiants fournis ne sont pas trouvés."},
                status=status.HTTP_400_BAD_REQUEST
            )
        etudiants_ids = [e.matricule for e in etudiants]
        
        binomes_existants = Binome.objects.exclude(id=instance.id).annotate(
        etudiant_count=Count("etudiants")
        ).filter(etudiant_count=2, etudiants__in=etudiants)

        for binome in binomes_existants:
            if set(binome.etudiants.values_list("matricule", flat=True)) == set(etudiants_ids):
                return Response(
                    {"error": f"Un binôme avec ces deux étudiants existe déjà (Binôme #{binome.id})."},
                    status=status.HTTP_400_BAD_REQUEST
                )


class MonomeViewSet(viewsets.ModelViewSet):
    queryset = Monome.objects.all()
    serializer_class = MonomeSerializer
