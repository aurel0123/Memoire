import { MailPlus , UserPlus } from 'lucide-react'  
import { Button } from '@/components/ui/button'
import { useUsers } from '../context/user-context'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1 rounded-xl'
        onClick={() => setOpen('invite')}
      >
        <span>Inviter</span> <MailPlus size={18} />
      </Button>
      <Button className='space-x-1 rounded-xl' onClick={() => setOpen('add')}>
        <span>Add un utilisateur</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}