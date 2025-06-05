import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { userService } from '@/services/user-service'
import { toast } from 'sonner'
import { useUsers } from '../context/user-context'

export function UsersDeleteDialog({ currentRow, open, onOpenChange }) {
  const [value, setValue] = useState('')
  const { fetchUsers } = useUsers()

  if (!currentRow) return null

  const handleDelete = async () => {
    if (value !== currentRow.username) {
      toast.error('Le nom d\'utilisateur ne correspond pas')
      return
    }

    try {
      await userService.deleteUser(currentRow.id)
      toast.success('Utilisateur supprimé avec succès')
      onOpenChange(false)
      setValue('')
      fetchUsers() // Actualiser la liste après la suppression
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue lors de la suppression')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'utilisateur</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Pour confirmer, veuillez saisir le nom d'utilisateur{' '}
            <span className="font-semibold">{currentRow.username}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Entrez le nom d'utilisateur"
          />
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={value !== currentRow.username}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
