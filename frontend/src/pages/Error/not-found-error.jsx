import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundError() {
  const navigate = useNavigate()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>Oups ! Page non trouvée!</span>
        <p className='text-muted-foreground text-center'>
          Il semble que la page que vous recherchez <br/>
          n'existe pas ou ait été supprimée.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)} className="rounded-xl">
            Retour
          </Button>
          <Button onClick={() => navigate('/')} className="rounded-xl">Retour à l'accueil</Button >
        </div>
      </div>
    </div>
  )
}