from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'filieres', FiliereViewSet)
router.register(r'enseignants', EnseignantViewSet)
router.register(r'etudiants', EtudiantViewSet)
router.register(r'groupes', GroupeViewSet)
router.register(r'soutenances', SoutenanceViewSet)
router.register(r'proces-verbaux', ProcesVerbalViewSet)
router.register(r'binomes', BinomeViewSet)
router.register(r'monomes', MonomeViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    # Vous pouvez ajouter des URLs pour l'authentification
    path('api-auth/', include('rest_framework.urls')),
]