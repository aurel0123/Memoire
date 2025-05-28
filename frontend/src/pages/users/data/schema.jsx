// Définition des valeurs possibles pour les statuts et rôles
export const userStatusValues = ['active', 'inactive', 'invited', 'suspended']
export const userRoleValues = ['admin', 'responsable', 'surveillant', 'organisateur']

// Représente un utilisateur (pas une validation stricte ici, juste un modèle)
export const createUser = ({
  id,
  nom,
  prenom,
  username,
  email,
  phone,
  status,
  role,
  createdAt,
  updatedAt,
}) => ({
  id,
  nom,
  prenom,
  username,
  email,
  phone,
  status,
  role,
  createdAt: new Date(createdAt),
  updatedAt: new Date(updatedAt),
})

// Exemple de fonction de validation manuelle si nécessaire
export function isValidUser(user) {
  return (
    typeof user.id === 'string' &&
    typeof user.nom === 'string' &&
    typeof user.prenom === 'string' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.phone === 'number' &&
    userStatusValues.includes(user.status) &&
    userRoleValues.includes(user.role) &&
    !isNaN(new Date(user.createdAt).getTime()) &&
    !isNaN(new Date(user.updatedAt).getTime())
  )
}

// Exemple de liste d'utilisateurs
export const userList = []
