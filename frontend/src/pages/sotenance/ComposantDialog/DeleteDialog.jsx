import PropTypes from 'prop-types'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
export default function DeleteDialog(
  {
  open , 
  onOpenChange, 
  handleDelete  
}
) {
  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette soutenance ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenChange(false)} type="button">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} type="button">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

DeleteDialog.propTypes = {
  open : PropTypes.bool.isRequired , 
  onOpenChange : PropTypes.func.isRequired, 
  handleDelete : PropTypes.func.isRequired
}