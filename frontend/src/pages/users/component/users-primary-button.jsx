import { MailPlus , UserPlus } from 'lucide-react'  
import { Button } from '@/components/ui/button'
import { useUsers } from '../context/user-context'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1 rounded-xl' onClick={() => setOpen('add')}>
        <span>Ajouter un utilisateur</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}