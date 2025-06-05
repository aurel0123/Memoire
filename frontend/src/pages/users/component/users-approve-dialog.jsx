import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { userService } from '@/services/user-service'
import { toast } from 'sonner'
import { useUsers } from '../context/user-context'

export function UsersApproveDialog({ currentRow, open, onOpenChange }) {
  const { fetchUsers } = useUsers()

  if (!currentRow) return null

  const handleApprove = async () => {
    try {
      await userService.approveUser(currentRow.id)
      toast.success('Utilisateur approuvé avec succès')
      onOpenChange(false)
      fetchUsers() // Actualiser la liste après l'approbation
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue lors de l\'approbation')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approuver l'utilisateur</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir approuver l'utilisateur{' '}
            <span className="font-semibold">{currentRow.username}</span> ?
            <br />
            Un email sera envoyé à l'utilisateur avec ses identifiants de connexion.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleApprove}>
            Approuver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 