from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'filieres', FiliereViewSet)
router.register(r'enseignants', EnseignantViewSet)
router.register(r'etudiants', EtudiantViewSet)
router.register(r'groupes', GroupeViewSet)
router.register(r'soutenances', SoutenanceViewSet)
router.register(r'proces-verbaux', ProcesVerbalViewSet)
router.register(r'binomes', BinomeViewSet)
router.register(r'monomes', MonomeViewSet)
router.register(r'evenements' , EvenementsViewSet)
router.register(r'evenements/(?P<evenement_id>\d+)/candidats', CandidatViewSet, basename='candidat')

urlpatterns = [
    path('api/', include(router.urls)),
    # Vous pouvez ajouter des URLs pour l'authentification
    path('api-auth/', include('rest_framework.urls')),
    path('approuver/<int:user_id>/', approve_personnel, name='approve_personnel'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('inscription/', register_user, name='register'),
    path('connexion/', login_user, name='register'),
    path('refresh-token/', refresh_token, name='refresh-token'),
     path('api/import-etudiants/', import_etudiants, name='import_etudiants'),
    path('evenements/<int:evenement_id>/candidats/<int:pk>/', CandidatDetailView.as_view(), name='candidat_detail'),
    path(
        'api/evenements/<int:evenement_id>/candidats/<int:candidat_id>/details/transactions/',
        TransactionListView.as_view(),
        name='transaction-list'
    ),
    path('api/evenements/<int:evenement_id>/candidats/<int:candidat_id>/transactions/', CreateTransactionView.as_view(), name='create-transaction'),
    path('api/evenements/<int:evenement_id>/candidats/<int:candidat_id>/transactions/<str:transaction_id>/', UpdateTransactionView.as_view(), name='update-transaction'),
    path('api/me/',get_current_user, name='current_user'),
    path('deconnexion/', logout_user, name='logout'),
]