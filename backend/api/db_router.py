class DatabaseRouter:
    """
    Un routeur pour contrôler les opérations de base de données.
    """
    route_app_labels = {'auth', 'contenttypes', 'sessions', 'admin'}  # Apps Django par défaut
    mysql_app_labels = {'soutenance', 'evenement'}  # Vos apps qui utiliseront MySQL

    def db_for_read(self, model, **hints):
        """
        Suggère la base de données à utiliser pour les lectures.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'default'
        if model._meta.app_label in self.mysql_app_labels:
            return 'mysql_db'
        return None

    def db_for_write(self, model, **hints):
        """
        Suggère la base de données à utiliser pour les écritures.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'default'
        if model._meta.app_label in self.mysql_app_labels:
            return 'mysql_db'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Détermine si une relation est autorisée entre deux objets.
        """
        if (
            obj1._meta.app_label in self.route_app_labels and
            obj2._meta.app_label in self.route_app_labels
        ):
            return True
        if (
            obj1._meta.app_label in self.mysql_app_labels and
            obj2._meta.app_label in self.mysql_app_labels
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Détermine si l'opération de migration doit être exécutée sur la base données spécifiée.
        """
        if app_label in self.route_app_labels:
            return db == 'default'
        if app_label in self.mysql_app_labels:
            return db == 'mysql_db'
        return None