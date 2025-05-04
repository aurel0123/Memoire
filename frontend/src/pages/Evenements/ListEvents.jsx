import { Button } from '@/components/ui/button'
import { Link} from 'react-router-dom'
import { Plus, Search  } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger , TabsContent } from '@/components/ui/tabs'
import { useEffect , useState } from 'react'
import CardEvent from '@/components/CardEvent'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
export default function ListEvents() {
  const [Events , setEvents] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete , setEventToDelete] = useState(null)
  const [searchTerm , setSearchTerm] = useState('')
  const navigate = useNavigate()
  /* Récuperartion des évènements  */
  const fetch = async() => {
    try{
      const response = await axios.get('/api/evenements/mes_evenements/')
      setEvents(response.data)
    }catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    fetch()
  }, [])

  /* Dialogue de suppresion */
  const DialogDelete =() => {
    return(
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;évènement  ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} type="button">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}  type="button">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
  }
  const prepareDelete = (e, id) => {
    if (e) e.stopPropagation();
    setEventToDelete(id)
    setIsDeleteDialogOpen(true);
  }
  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      await axios.delete(`/api/evenements/${eventToDelete}/`)
      setIsDeleteDialogOpen(false)
      fetch()
      setEventToDelete(null)
    } catch (error) {
      console.log(error)
    }
  }
  /* Fonction pour la recherche */
  const filitiredEvents = Events.filter(
    (events) =>
      events.nom.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  /* Lien pour la modification d'un évènement */
  const handleEdit = (eventId) => {
    navigate(`/dashboard/edit-event/${eventId}`)
  }
  const handleCandidats = (eventId , eventNom) => {
    navigate(`/dashboard/event/${eventNom}/${eventId}/candidats`)
  }
  const handleAddCandidat = (eventId , eventNom) => {
    navigate(`/dashboard/event/${eventNom}/${eventId}/candidats/add`);
}
  return (
    <section>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button asChild className={cn("rounded-xl cursor-pointer")} >
            <Link to="/dashboard/create-event">
              <Plus className="w-4 h-4 mr-2" />
              Créer un évènement
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <Tabs defaultValue="all">
          <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 items-center justify-between gap-4'>
            <TabsList className="gap-6 flex shadow-sm rounded-xl">
              <TabsTrigger
                value="all"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white focus:bg-primary/10 focus:text-primary"
              >
                Tous
              </TabsTrigger>
              <TabsTrigger
                value="encour"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white focus:bg-primary/10 focus:text-primary"
              >
                En cours
              </TabsTrigger>
              <TabsTrigger
                value="coming"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white focus:bg-primary/10 focus:text-primary"
              >
                A venir
              </TabsTrigger>
              <TabsTrigger
                value="finished"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white focus:bg-primary/10 focus:text-primary"
              >
                Terminés
              </TabsTrigger>
            </TabsList>
            <div className='flex items-center px-2 py-1 rounded-xl border border-gray-400'>
              <Search size={24}/>
              <Input  type="search" placeholder='Rechercher un évènement' className="[&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-none border-none shadow-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
          </div>
          <TabsContent value="all" className="mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
              {filitiredEvents.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Aucun événement trouvé</p>
                </div>
              ) : (
                filitiredEvents.map((event) => (
                  <CardEvent
                    key={event.id}
                    nom={event.nom}
                    status={event.status}
                    photo={event.photo}
                    prepareDelete={(e) => prepareDelete(e, event.id)}
                    handleEditEvent = {() => handleEdit(event.id)}
                    handleCandidats = {() => handleCandidats(event.id , event.nom)}
                    handleAddCandidat = {() => handleAddCandidat(event.id , event.nom)}
                  />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="encour" className="mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
              {filitiredEvents.filter((event) => event.status === "en cours").length > 0 ? (
                filitiredEvents
                  .filter((event) => event.status === "en cours")
                  .map((event) => (
                    <CardEvent
                      key={event.id}
                      nom={event.nom}
                      status={event.status}
                      photo={event.photo}
                      prepareDelete={(e) => prepareDelete(e, event.id)}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Aucun événement en cours pour le moment</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="coming" className="mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
              {filitiredEvents.filter((event) => event.status === "à venir").length > 0 ? (
                filitiredEvents
                  .filter((event) => event.status === "à venir")
                  .map((event) => (
                    <CardEvent
                      key={event.id}
                      nom={event.nom}
                      status={event.status}
                      photo={event.photo}
                      prepareDelete={(e) => prepareDelete(e, event.id)}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Aucun événement à venir pour le moment</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="finished" className="mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
              {filitiredEvents.filter((event) => event.status === "terminé").length > 0 ? (
                filitiredEvents
                  .filter((event) => event.status === "terminé")
                  .map((event) => (
                    <CardEvent
                      key={event.id}
                      nom={event.nom}
                      status={event.status}
                      photo={event.photo}
                      prepareDelete={(e) => prepareDelete(e, event.id)}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Aucun événement terminé pour le moment</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {isDeleteDialogOpen && <DialogDelete />}
    </section>
  );
}
