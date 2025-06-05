import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { userService } from '@/services/user-service'
import { toast } from 'sonner'
import { useUsers } from '../context/user-context'

const userTypes = [
  { label: 'Administrateur', value: 'admin' },
  { label: 'Responsable', value: 'responsable' },
  { label: 'Organisateur', value: 'organisateur' },
  { label: 'Surveillant', value: 'surveillant' },
]

export function UsersActionDialog({ currentRow, open, onOpenChange }) {
  const { fetchUsers } = useUsers()
  const isEdit = !!currentRow

  const form = useForm({
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          nom: '',
          prenom: '',
          username: '',
          email: '',
          type_user: '',
          phone: '',
          password: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await userService.updateUser(currentRow.id, values)
        toast.success('Utilisateur modifié avec succès')
      } else {
        await userService.addUser(values)
        toast.success('Utilisateur créé avec succès')
      }
      form.reset()
      onOpenChange(false)
      fetchUsers() // Actualiser la liste après la modification
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue')
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
          onOpenChange(false)
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifiez les informations de l\'utilisateur ici. ' : 'Créez un nouvel utilisateur ici. '}
            Cliquez sur enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>
        <div className="-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              {['nom', 'prenom', 'username', 'email', 'phone'].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-right">
                        {fieldName
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Entrez ${fieldName}`}
                          className="col-span-4"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="type_user"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Rôle</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Sélectionnez un rôle"
                      className="col-span-4"
                      items={userTypes.map(({ label, value }) => ({ label, value }))}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Mot de passe</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="ex: S3cur3P@ssw0rd"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder="ex: S3cur3P@ssw0rd"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="user-form">
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
