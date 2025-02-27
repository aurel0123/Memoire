from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.utils import timezone
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager

class LowercaseEmailField(models.EmailField):
    """
    Override EmailField to convert emails to lowercase before saving.
    """
    def to_python(self, value):
        """
        Convert email to lowercase.
        """
        value = super(LowercaseEmailField, self).to_python(value)
        # Value can be None so check that it's a string before lowercasing.
        if isinstance(value, str):
            return value.lower()
        return value

class CustomUser(AbstractBaseUser, PermissionsMixin):
    # Réduire la longueur des champs indexés à 191 caractères max
    email = LowercaseEmailField(unique=True, max_length=191)
    nom = models.CharField(max_length=150)
    prenom = models.CharField(max_length=150)
    username = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    phone_regex = RegexValidator(
        regex=r'^\d{10}$',
        message="phone number should exactly be in 10 digits"
    )
    phone = models.CharField(max_length=150, validators=[phone_regex], blank=True, null=True)

    class Types(models.TextChoices):
        ADMIN = 'admin', 'Administrateur'
        ETUDIANT = 'etudiant', 'Etudiant'
        RESPONSABLE = 'responsable', 'Responsable'

    default_type = Types.ETUDIANT
    # Réduire la longueur du champ
    type_user = models.CharField(_("Type d'utilisateur"), max_length=50, choices=Types.choices, default=default_type)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def __str__(self):
        return f"Informations de l'utilisateur {self.nom} {self.prenom} {self.email}"

    def save(self, *args, **kwargs):
        is_new = not self.id
        # Sauvegarde initiale pour obtenir un ID
        super().save(*args, **kwargs)
        
        # Gestion des groupes en fonction de user_type
        # Récupérer ou créer le groupe correspondant
        # Ajouter l'instance au groupe si elle n'y est pas déjà
        # Sauvegarde finale pour ajouter les groupes
        super().save(*args, **kwargs)