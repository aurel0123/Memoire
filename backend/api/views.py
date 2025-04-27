from django.shortcuts import render ,get_object_or_404, redirect
from rest_framework import viewsets , status , generics
from .models import *
from .serializers import *
from django.core.exceptions import ValidationError
from django.contrib import messages
from django.http import Http404 ,JsonResponse
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt 
from rest_framework.decorators import permission_classes, api_view , action , authentication_classes
import json
from rest_framework_simplejwt import tokens
from rest_framework.permissions import AllowAny , IsAuthenticatedOrReadOnly , IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken , AccessToken
from rest_framework.exceptions import AuthenticationFailed , PermissionDenied
from django.utils import timezone
from django.utils.timezone import now
from django.middleware import csrf

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
        if not etudiants_matricules: 
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
        # Vérification des doublons de thème (en excluant l'instance actuelle)
        if Binome.objects.exclude(id=instance.id).filter(theme=theme).exists():
            return Response(
                {"error": f"Un binôme avec le thème '{theme}' existe déjà."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérification des étudiants déjà associés à d'autres binômes
        errors = {}
        for etudiant in etudiants:
        # On vérifie si l'étudiant est dans d'autres binômes que celui qu'on modifie
            if Binome.objects.filter(etudiants=etudiant).exclude(id=instance.id).exists():
                errors[str(etudiant.matricule)] = f"L'étudiant {etudiant.nom} {etudiant.prenom} est déjà associé à un autre binôme."

        if errors:
            return Response(
                {'status': 'error', 'code': 'STUDENT_ALREADY_ASSIGNED', 'details': errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mise à jour du binôme si aucune erreur
        try:
            instance.maitre_memoire_id = maitre_memoire
            instance.theme = theme
            instance.programmation = programmation
            instance.save()
            instance.etudiants.set(etudiants)  # Mettre à jour la relation many-to-many
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MonomeViewSet(viewsets.ModelViewSet):
    queryset = Monome.objects.all()
    serializer_class = MonomeSerializer

    def create(self, request, *args, **kwargs):
        etudiant_matricule = request.data.get('etudiant_matricule')
        maitre_memoire = request.data.get("maitre_memoire")
        theme = request.data.get("theme")
        programmation = request.data.get("programmation")

        if not etudiant_matricule:
            return Response(
                {"error": "Un Monome doit être composé d'un étudiant."},
                status=status.HTTP_400_BAD_REQUEST
            )

        etudiant = Etudiant.objects.filter(matricule=etudiant_matricule).first()

        if not etudiant:
            return Response(
                {"error": "L'étudiant avec ce matricule n'existe pas."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Monome.objects.filter(theme=theme).exists():
            return Response(
                {"error": f"Le thème '{theme}' est déjà utilisé."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Modifié: Filtrez par le champ de relation 'etudiant' au lieu de 'etudiant_matricule'
        if Monome.objects.filter(etudiant__matricule=etudiant_matricule).exists():
            return Response(
                {"error": "Cet étudiant est déjà associé à un autre Monome."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Modifié: Utilisez le champ de relation 'etudiant' au lieu de 'etudiant_matricule'
        monome = Monome.objects.create(
            etudiant=etudiant,
            maitre_memoire_id=maitre_memoire,
            theme=theme,
            programmation=programmation
        )

        serializer = self.get_serializer(monome)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        etudiant_matricule = request.data.get('etudiant_matricule')
        maitre_memoire = request.data.get("maitre_memoire")
        theme = request.data.get("theme")
        programmation = request.data.get("programmation")

        # Vérification de l'étudiant
        if etudiant_matricule:
            etudiant = Etudiant.objects.filter(matricule=etudiant_matricule).first()
            if not etudiant:
                return Response(
                    {"error": "L'étudiant avec ce matricule n'existe pas."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Vérifie si un autre monôme utilise déjà cet étudiant
            if Monome.objects.exclude(pk=instance.pk).filter(etudiant__matricule=etudiant_matricule).exists():
                return Response(
                    {"error": "Cet étudiant est déjà associé à un autre Monome."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Vérification du thème
        if theme and Monome.objects.exclude(pk=instance.pk).filter(theme=theme).exists():
            return Response(
                {"error": f"Le thème '{theme}' est déjà utilisé."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mise à jour partielle
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

@csrf_exempt
def approve_personnel(request, user_id):
    if request.method == 'POST': 
        # Récupérer l'utilisateur via l'ID
        user = get_object_or_404(CustomUser, id=user_id)

        # Approuver le profil et sauvegarder
        password = user.generate_random_password()
        user.set_password(password)
        user.is_approved = True
        
        # Envoyer l'email (le message ou la méthode d'envoi doit être définie dans send_approval_email)
        user.send_approval_email(password)
        
        # Sauvegarder l'utilisateur avec les nouvelles informations
        user.save()

        # Retourner une réponse indiquant que tout s'est bien passé
        return JsonResponse({'message': 'Personnel approuvé et mail envoyé avec succès ✅'})      
    
    # Retourner une erreur si la méthode n'est pas POST
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        user_data = {
            'email': request.data.get('email'),
            'nom': request.data.get('nom'),
            'prenom': request.data.get('prenom'),
        }

        # Vérifier les champs requis
        if not all(user_data.values()):
            return Response({'error': 'Tous les champs sont requis.'}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si l'utilisateur existe
        if CustomUser.objects.filter(email=user_data['email']).exists():
            return Response({'error': 'Cet utilisateur existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)

        # Création de l'utilisateur
        user = CustomUser.objects.create(**user_data)
        user.type_user = CustomUser.Types.ORGANISATION
        user.save()

        # Génération des tokens JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': CustomUserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def get_user_tokens(user):
    refresh = tokens.RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        # Vérifier si l'utilisateur est déjà connecté
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            return Response({
                'error': 'Vous êtes déjà connecté',
                'message': 'Veuillez d\'abord vous déconnecter'
            }, status=status.HTTP_400_BAD_REQUEST)

        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Tous les champs sont requis.'}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'Utilisateur introuvable.'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_approved:
            return Response({'error': 'Votre compte n\'est pas encore approuvé.'}, status=status.HTTP_403_FORBIDDEN)

        if not user.check_password(password):
            return Response({'error': 'Mot de passe incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        # Génération des tokens
        tokens = get_user_tokens(user)
        
        # Retourner les tokens et les informations de l'utilisateur
        return Response({
            'tokens': tokens,
            #'user': CustomUserSerializer(user).data,
            'message': 'Connexion réussie'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({
                'error': 'Refresh token manquant'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Vérifier et rafraîchir le token
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            return Response({
                'access': access_token, 
                'message': 'Token rafraîchi avec succès'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': 'Token invalide ou expiré',
                'details': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    if request.user.is_authenticated:
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
    return Response({'detail': 'Non authentifié'}, status=401)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_user(request):
    response = Response({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response


class EvenementsViewSet(viewsets.ModelViewSet) : 
    queryset = Evenements.objects.all()
    serializer_class = EvenementsSerializer  
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user = self.request.user   

        if not user.is_authenticated:
            raise PermissionDenied('Vous devez être connecté pour créer un événement.') 
        if not user.is_approved:
            raise PermissionDenied('Votre compte n\'est pas encore approuvé.')
        event = serializer.save(user=user)

        event.status = event.get_status()
        event.save()
        
        return Response({'message' : 'Evènement créer avec succes'} ,status=status.HTTP_200_OK)

    def list(self, request , *args , **kwargs) : 
        events = self.queryset.all()

        for event in events : 
            event.status= event.get_status()
            event.save()

        # Appelle la méthode d'origine pour retourner la réponse avec les événements
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    def perform_update(self, serializer):
        user = self.request.user
        evenement = self.get_object()
        if not user.is_authenticated or( evenement.user != user and not user.is_staff):
            raise PermissionDenied("Vous ne pouvez modifier que vos propres événements.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if not user.is_authenticated or (instance.user != user and not user.is_staff):
            raise PermissionDenied("Vous ne pouvez supprimer que vos propres événements.")
        instance.delete()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticatedOrReadOnly])
    def mes_evenements(self, request):
        """Renvoie les événements de l'utilisateur connecté. Si admin, renvoie tout."""
        user = request.user
        if user.is_staff:
            evenements = Evenements.objects.all()
        else:
            evenements = Evenements.objects.filter(user=user)
        serializer = self.get_serializer(evenements, many=True)
        return Response(serializer.data)

    def nettoyer_evenements_termines(self):
        """Supprime les événements terminés depuis plus de 24 heures."""
        expiration = now() - timedelta(hours=24)
        Evenements.objects.filter(date_fin__lt=expiration).delete()


class CandidatViewSet(viewsets.ModelViewSet):
    serializer_class = CandidatSerializer

    def get_queryset(self):
        """Retourne les candidats associés à un événement donné."""
        evenement_id = self.kwargs['evenement_id']
        return Candidat.objects.filter(evenement_id=evenement_id)

    def perform_create(self, serializer):
        """Associe un candidat à un événement et à l'utilisateur authentifié."""
        user = self.request.user

        if not user.is_authenticated:
            raise PermissionDenied("Vous devez être connecté pour créer un candidat.")
        
        # Récupération de l'événement
        evenement_id = self.kwargs['evenement_id']
        evenement = Evenements.objects.get(id=evenement_id)
        # Création du candidat et association avec l'événement et l'utilisateur
        serializer.save(user=user, evenement=evenement)

    def perform_update(self, serializer):
        """Vérifie que l'utilisateur peut mettre à jour son propre candidat."""
        user = self.request.user
        candidat = self.get_object()

        if not user.is_authenticated or candidat.user != user:
            raise PermissionDenied("Vous ne pouvez modifier que vos propres candidats.")
        
        # Mise à jour du candidat
        serializer.save()

    def perform_destroy(self, instance):
        """Vérifie que l'utilisateur peut supprimer son propre candidat."""
        user = self.request.user

        if not user.is_authenticated or instance.user != user:
            raise PermissionDenied("Vous ne pouvez supprimer que vos propres candidats.")
        
        # Suppression du candidat
        instance.delete()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticatedOrReadOnly])
    def mes_candidats(self, request):
        """Retourne les candidats créés par l'utilisateur ou tous les candidats si admin."""
        user = request.user
        if user.is_staff:
            candidats = Candidat.objects.all()  # Si admin, retourne tous les candidats
        else:
            candidats = Candidat.objects.filter(user=user)  # Sinon, retourne ceux créés par l'utilisateur
        serializer = self.get_serializer(candidats, many=True)
        return Response(serializer.data)

class CandidatDetailView(generics.RetrieveAPIView):
    queryset = Candidat.objects.all()
    serializer_class = CandidatSerializer

    def get_object(self):
        """Retourne l'objet candidat en fonction de l'id et de l'événement."""
        evenement_id = self.kwargs['evenement_id']
        candidat_id = self.kwargs['pk']
        try:
            return Candidat.objects.get(id=candidat_id, evenement_id=evenement_id)
        except Candidat.DoesNotExist:
            raise PermissionDenied("Candidat non trouvé dans cet événement.")

class TransactionListView(generics.ListAPIView):
    """Liste des transactions pour un événement et un candidat (GET)"""
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        evenement_id = self.kwargs['evenement_id']
        candidat_id = self.kwargs['candidat_id']
        return Transaction.objects.filter(
            evenement_id=evenement_id, 
            candidat_id=candidat_id
        )

class CreateTransactionView(generics.CreateAPIView):
    """Création d'une transaction pour un vote (POST)"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        evenement_id = kwargs['evenement_id']
        candidat_id = kwargs['candidat_id']
        
        try:
            evenement = Evenements.objects.get(id=evenement_id)
            candidat = Candidat.objects.get(id=candidat_id)
        except (Evenements.DoesNotExist, Candidat.DoesNotExist):
            return Response(
                {"detail": "Événement ou candidat introuvable"},
                status=status.HTTP_404_NOT_FOUND
            )

        transaction_data = {
            'candidat': candidat.id,
            'montant': 0,
            'status': 'completed',
            'date_transaction': timezone.now()
        }

        serializer = self.get_serializer(data=transaction_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Mise à jour du compteur de votes
        candidat.votes += 1
        candidat.save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

