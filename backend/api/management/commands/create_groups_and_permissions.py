from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):
    help = "Crée des groupes et leur assigne des permissions"

    def handle(self, *args, **kwargs):
        groups_permissions = {
            'organisateur': [
                'add_evenements',
                'change_evenements',
                'delete_evenements',
                'view_evenements',
            ],
            'responsable' : [
                'add_filiere'
            ],
            'admin': [
                'all'
            ]
        }

        for group_name, perms in groups_permissions.items():
            group, created = Group.objects.get_or_create(name=group_name)

            if 'all' in perms:
                permissions = Permission.objects.all()
                group.permissions.set(permissions)  # Remplace toutes les permissions actuelles
                self.stdout.write(self.style.SUCCESS(f"Toutes les permissions ont été ajoutées au groupe {group_name}"))
            else:
                for perm_codename in perms:
                    try:
                        permission = Permission.objects.get(codename=perm_codename)
                        group.permissions.add(permission)
                        self.stdout.write(self.style.SUCCESS(f"Permission {perm_codename} ajoutée au groupe {group_name}"))
                    except Permission.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"Attention: La permission {perm_codename} n'existe pas"))

            self.stdout.write(self.style.SUCCESS(f"Groupe {group_name} mis à jour avec ses permissions."))