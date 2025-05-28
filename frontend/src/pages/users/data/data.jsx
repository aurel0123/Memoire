import {
  Coins,
  Shield,
  Users,
} from 'lucide-react'

// Map des statuts utilisateur vers des classes CSS
export const callTypes = new Map([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
  [
    'non approuvé',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

// Liste des types d'utilisateurs
export const userTypes = [
  {
    label: 'Admin',
    value: 'admin',
    icon: Shield,
  },
  {
    label: 'Responsable',
    value: 'responsable',
    icon: Users,
  },
  {
    label: 'Organisateur',
    value: 'organisateur',
    icon: Coins,
  },
]
