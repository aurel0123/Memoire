from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.utils import timezone
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.db.models import Count
from .managers import CustomUserManager
import random
import string
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.utils import timezone

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
        RESPONSABLE = 'responsable', 'Responsable'
        ORGANISATION = 'organisation', 'ORGANISATION'

    default_type = Types.ORGANISATION
    # Réduire la longueur du champ
    type_user = models.CharField(_("Type d'utilisateur"), max_length=50, choices=Types.choices, default=default_type)
    is_approved = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"Informations de l'utilisateur {self.nom} {self.prenom} {self.email}"

    def save(self, *args, **kwargs):
        is_new = not self.pk
        # Sauvegarde initiale pour obtenir un ID
        super().save(*args, **kwargs)
       
        # Si utilisateur est un personnel approuvé et n’a pas encore de mot de passe
        if self.type_user == self.Types.ORGANISATION and self.is_approved and not self.has_usable_password():
            password = self.generate_random_password()
            self.set_password(password)
            self.send_approval_email(password)
            super().save(*args, **kwargs)

        if self.type_user == CustomUser.Types.ORGANISATION:
            group_name = 'organisation'

        elif self.type_user == CustomUser.Types.ADMIN:
            group_name = 'admin'
        
        # Récupérer ou créer le groupe correspondant
        group, created = Group.objects.get_or_create(name=group_name)
        
        # Ajouter l'instance au groupe si elle n'y est pas déjà
        if not self.groups.filter(name=group.name).exists():
            self.groups.add(group)
       

    def generate_random_password(self) :
        length = 12
        characters = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choice(characters) for i in range(length))
        return password 

    def send_approval_email(self , password):
        smtp_server = settings.EMAIL_HOST
        smtp_port = settings.EMAIL_PORT
        smtp_username = settings.EMAIL_HOST_USER  # Votre adresse Gmail
        smtp_password = settings.EMAIL_HOST_PASSWORD  # Votre mot de passe ou mot de passe d'application

        message = MIMEMultipart()
        message["From"] = smtp_username
        message["To"] = self.email
        message["Subject"] = "Validation de votre profile"

        # Contenu de l'email
        email_content = f"""
       votre compte a été approuvé 🎉 !

        Voici vos identifiants :
        Email : {self.email}
        Mot de passe : {password}

        Merci de vous connecter et de changer votre mot de passe dès que possible.

        Cordialement,
        L'équipe d'administration de l'université.
        """
        # Attacher le contenu au message
        message.attach(MIMEText(email_content, "plain"))
        
        try:
            # Connexion au serveur SMTP
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()  # Sécuriser la connexion
            server.login(smtp_username, smtp_password)
            
            # Envoi de l'email
            server.send_message(message)
            server.quit()
            
            return True
        except Exception as e:
            # Gestion des erreurs
            print(f"Erreur lors de l'envoi de l'email: {str(e)}")
            return False





class Enseignant(models.Model):
    GRADES = [
        ('PR', 'Professeur'),
        ('MC', 'Maître de conférences'),
        ('DR', 'Docteur'),
        ('ATER', 'Attaché temporaire d\'enseignement et de recherche'),
        ('VAC', 'Vacataire'),
    ]
    
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    grade = models.CharField(max_length=10, choices=GRADES)
    specialite = models.CharField(max_length=100)
    etablissement = models.CharField(max_length=200)
    
    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.grade})"
    
    def get_infos_enseignant(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'prenom': self.prenom,
            'grade': self.grade,
            'specialite': self.specialite,
            'etablissement': self.etablissement
        }

class Filiere(models.Model):
    NIVEAUX = [
        ('L3', 'Licence 3'),
        ('M2', 'Master 2'),
    ]
    
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=10, unique=True)
    libelle = models.CharField(max_length=100)
    niveau = models.CharField(max_length=2, choices=NIVEAUX, default='L3')  # Nouveau champ

    def __str__(self):
        return f"{self.libelle} ({self.code}) - {self.get_niveau_display()}"
    
    def get_infos_filiere(self):
        return {
            'id': self.id,
            'code': self.code,
            'libelle': self.libelle,
            'niveau': self.niveau,  # Ajout du niveau
        }

class Etudiant(models.Model):
    NIVEAUX = [
        ('L3', 'Licence 3'),
        ('M2', 'Master 2'),
    ]
    
    matricule = models.CharField(max_length=20, primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    lieu_naissance = models.CharField(max_length=100)
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE, related_name='etudiants')  
    maitre_memoire = models.ForeignKey(Enseignant, on_delete=models.CASCADE, related_name='etudiants_encadres' , null=True , blank=True)
    
    def _str_(self):
        return f"{self.prenom} {self.nom} ({self.matricule})"
    
    def get_infos_etudiant(self):
        return {
            'matricule': self.matricule,
            'nom': self.nom,
            'prenom': self.prenom,
            'date_naissance': self.date_naissance,
            'lieu_naissance': self.lieu_naissance,
            'filiere': self.filiere.code,
            'maitre_memoire': self.maitre_memoire.get_infos_enseignant()
        }
    
    def est_en_licence(self):
        return self.filiere.niveau == 'L3'
        print(filiere.niveau)
    def est_en_master(self):
        return self.filiere.niveau in ['M1', 'M2']

class Groupe(models.Model):
    id_groupe = models.AutoField(primary_key=True)
    etudiants = models.ManyToManyField(Etudiant, related_name='groupes')
    type_groupe = models.CharField(max_length=10, editable=False)  # 'BINOME' ou 'MONOME'
    
    def _str_(self):
        return f"Groupe {self.id_groupe} ({self.type_groupe})"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Le type de groupe sera défini dans les sous-classes
    
    def get_type_groupe(self):
        return self.type_groupe
    
""" class Binome(models.Model):
    etudiant1 = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='binome_etudiant1')
    etudiant2 = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='binome_etudiant2')
    maitre_memoire = models.ForeignKey(Enseignant, on_delete=models.CASCADE, related_name='binomes_encadres')
    theme = models.CharField(max_length=200)

    def __str__(self):
        return f"Binôme {self.etudiant1} et {self.etudiant2}"

    def clean(self):
        # Vérifier que les deux étudiants sont en Licence 3
        if not self.etudiant1.est_en_licence() or not self.etudiant2.est_en_licence():
            raise ValidationError(_("Les deux étudiants doivent être en Licence 3."))
        
        # Vérifier que les deux étudiants sont différents
        if self.etudiant1 == self.etudiant2:
            raise ValidationError(_("Un binôme doit être composé de deux étudiants différents."))
         """

class Binome(models.Model):
    PROGRAMMATION = [
        ('est programmé', 'Est programmé'),
        ('non programmé', 'Non programmé'),
        ('refus', 'Refus')
    ]
    
    etudiants = models.ManyToManyField(
        Etudiant, 
        related_name='binomes',
        verbose_name=_("Étudiants du binôme")
    )
    
    maitre_memoire = models.ForeignKey(
        Enseignant,
        on_delete=models.CASCADE,
        related_name='binomes_encadres',
        verbose_name=_("Maître de mémoire")
    )
    
    theme = models.CharField(
        max_length=200,
        verbose_name=_("Thème de recherche")
    )
    
    programmation = models.CharField(
        max_length=50,
        choices=PROGRAMMATION,
        default='non programmé',
        verbose_name=_("Statut de programmation")
    )

    def __str__(self):
        # Version sécurisée sans risque de récursion
        return f"Binôme #{self.id} - {self.theme[:50]}"

    def save(self, *args, **kwargs):
        """
        Surcharge de la méthode save pour forcer la validation
        """
        self.full_clean()  # Force la validation clean()
        super().save(*args, **kwargs)
        
        # Après la sauvegarde, vous pouvez ajouter les étudiants si nécessaire
        # (si vous les passez lors de la création)

    def clean(self):
        """
        Validation modifiée pour éviter d'accéder à la relation ManyToMany
        """
        # Ne pas valider les relations si l'objet n'est pas encore créé
        if not self.pk:
            return
            
        etudiants = list(self.etudiants.all())

        # Optimisation: un seul accès à la base de données
        etudiants = list(self.etudiants.all())
        etudiants_ids = [e.matricule for e in etudiants]
        
        # Vérification du nombre d'étudiants
        if len(etudiants) <1 or len(etudiants) > 2:
            raise ValidationError(_("Un binôme doit être composé de au moin un étudiants."))
        
        # Vérification des étudiants différents
        if len(etudiants_ids) != len(set(etudiants_ids)):
            raise ValidationError(_("Les étudiants d'un binôme doivent être différents."))
        
        # Vérification du niveau licence
        if any(not etudiant.est_en_licence() for etudiant in etudiants):
            raise ValidationError(_("Tous les étudiants doivent être en Licence 3."))
        

   
    class Meta:
        verbose_name = _("Binôme")
        verbose_name_plural = _("Binômes")


class Monome(models.Model):
    PROGRAMMATION = [
        ('est programmé', 'Est programmé'),
        ('non programmé', 'Non programmé'),
        ('refus', 'Refus')
    ]

    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='monome_etudiant')
    maitre_memoire = models.ForeignKey(Enseignant, on_delete=models.CASCADE, related_name='monomes_encadres')
    theme = models.CharField(max_length=200)
    programmation = models.CharField(max_length=50 , choices=PROGRAMMATION, default = "non programmé" , verbose_name=_("Status de programmation"))

    def __str__(self):
        return f"Monôme {self.etudiant}"

    def clean(self):
        # Vérifier que l'étudiant est en Master 2 ou en Licence 3
        if not (self.etudiant.est_en_master()):
            raise ValidationError(_("L'étudiant doit être en Master 2"))
        


class RoleJury(models.Model):
    TYPES_ROLE = [
        ('PRES', 'Président'),
        ('EXAM', 'Examinateur'),
        ('RAPP', 'Rapporteur'),
    ]
    
    type = models.CharField(max_length=4, choices=TYPES_ROLE)
    enseignant = models.ForeignKey(Enseignant, on_delete=models.CASCADE, related_name='roles')
    soutenance = models.ForeignKey('Soutenance', on_delete=models.CASCADE, related_name='roles_jury')
    
    class Meta:
        unique_together = ('enseignant', 'soutenance')
    
    def _str_(self):
        return f"{self.get_type_display()} - {self.enseignant}"
    
    def affecter_role(self, nouveau_type):
        self.type = nouveau_type
        self.save()

class Soutenance(models.Model):
    id = models.AutoField(primary_key=True)
    date_soutenance = models.DateField()
    heure_soutenance = models.TimeField()
    salle = models.CharField(max_length=50)
    resultat = models.CharField(max_length=100, blank=True, null=True)
    mention = models.CharField(max_length=100, blank=True, null=True)
    observations = models.TextField(blank=True)
    groupe = models.OneToOneField(Groupe, on_delete=models.CASCADE, related_name='soutenance')
    membres_jury = models.ManyToManyField(Enseignant, through=RoleJury, related_name='soutenances')
    
    def _str_(self):
        return f"Soutenance du {self.date_soutenance} à {self.heure_soutenance} en {self.salle}"
    
    def clean(self):
        # Vérifier que le jury compte exactement 3 membres
        if self.membres_jury.count() != 3:
            raise ValidationError(_("Une soutenance doit avoir exactement 3 membres dans le jury."))
        
        # Vérifier que le maître de mémoire fait partie du jury
        for etudiant in self.groupe.etudiants.all():
            if etudiant.maitre_memoire not in self.membres_jury.all():
                raise ValidationError(_("Le maître de mémoire doit faire partie du jury."))
    
    def planifier_soutenance(self, date, heure, salle):
        self.date_soutenance = date
        self.heure_soutenance = heure
        self.salle = salle
        self.save()
    
    def enregistrer_resultat(self, resultat, mention, observations=''):
        self.resultat = resultat
        self.mention = mention
        self.observations = observations
        self.save()
        
        # Mettre à jour les PV des étudiants
        for etudiant in self.groupe.etudiants.all():
            try:
                pv = ProcesVerbal.objects.get(etudiant=etudiant)
                pv.est_valide = True
                pv.save()
            except ProcesVerbal.DoesNotExist:
                pass

class ProcesVerbal(models.Model):
    numero_pv = models.CharField(max_length=50, primary_key=True)
    date_creation = models.DateField(auto_now_add=True)
    est_valide = models.BooleanField(default=False)
    etudiant = models.OneToOneField(Etudiant, on_delete=models.CASCADE, related_name='proces_verbal')
    
    def _str_(self):
        return f"PV n°{self.numero_pv} - {self.etudiant}"
    
    def generer_pv(self):
        # Cette méthode serait implémentée pour générer le contenu du PV
        return True
    
    def imprimer_pv(self):
        # Cette méthode serait implémentée pour l'impression
        if not self.est_valide:
            raise ValidationError(_("Le PV doit être validé avant d'être imprimé."))
        return True
    
    def valider_pv(self):
        self.est_valide = True
        self.save()



""" Gestion des evenements  """

class Evenements (models.Model) : 
    STATUS_CHOICES  = [
        ('en cours' , 'En cours') , 
        ('terminé' , 'Terminé') , 
        ('à venir' , 'A venir') , 
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='evenements')
    nom = models.CharField(max_length=100)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    description = models.TextField()
    photo = models.ImageField(upload_to='evenements/', blank=True, null=True)
    montant_minimal = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Montant requis pour voter
    max_votants = models.PositiveIntegerField(default=0)  
    status = models.CharField(max_length=20,choices=STATUS_CHOICES , default='à venir')
    montant_minimal = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Montant requis pour voter
    max_votants = models.PositiveIntegerField(default=0)  

    def __str__(self):
        return self.nom

    def is_active(self):
        """Retourne si l'événement est actif (en cours)"""
        return self.get_status() == 'en cours'

    def is_upcoming(self):
        """Retourne si l'événement est à venir"""
        return self.get_status() == 'à venir'

    def is_finished(self):
        """Retourne si l'événement est terminé"""
        return self.get_status() == 'terminé'

    def total_votants(self):
        """Retourne le nombre total de votants pour cet événement"""
        return self.transaction_set.count()

    def remaining_votants(self):
        """Retourne le nombre de votants restants pour l'événement"""
        return self.max_votants - self.total_votants()

    def get_status(self):
        """Retourne l'état actuel de l'événement basé sur la date"""
        now = timezone.now()
        if now < self.date_debut:
            return 'à venir'
        elif self.date_debut <= now <= self.date_fin:
            return 'en cours'
        else:
            return 'terminé'

class Candidat(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE ) # Utilisateur qui a créé le candidat
    evenement = models.ForeignKey('Evenements', on_delete=models.CASCADE, related_name='candidats')
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='candidats/', blank=True, null=True)
    description = models.TextField(blank=True)
    telephone = models.CharField(max_length=100, blank=True, null=True)
    link = models.URLField(blank=True, null=True)  # Lien unique pour voter
    votes = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('nom', 'prenom', 'evenement')  # Unicité dans un événement
        ordering = ['-votes']

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.evenement.nom}"

    def pourcentage_votes(self):
        total_votes = sum([c.votes for c in self.evenement.candidats.all()])
        if total_votes == 0:
            return 0
        return (self.votes / total_votes) * 100

    def total_votes(self):
        """Retourne le nombre de votes pour ce candidat"""
        return self.transactions.count()


class Transaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='transactions', blank=True, null=True)
    candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=100, unique=True)  # ID unique généré pour chaque transaction
    montant = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Montant payé pour voter (si applicable)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending')
    date_transaction = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.transaction_id} - {self.candidat.nom} {self.candidat.prenom}"


