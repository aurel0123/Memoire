import * as React from 'react'; 
import { useParams } from 'react-router';
import axios from 'axios';
import { Clock, User, ThumbsUp, ArrowLeft, MoreHorizontal, Eye, Edit, Trash, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
// Import du composant VoteModal
import { VoteModal } from './VoteModal'; // Assurez-vous que le chemin d'importation est correct

export default function ViewsEvenement() {
    const { Id, eventNom } = useParams();
    const [Event, setEvent] = React.useState(null);
    const [candidats, setCandidats] = React.useState(null); 
    const [loading, setLoading] = React.useState(true);
    const [decompte, setDecompte] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const navigate = useNavigate();
    
    // État pour gérer le modal de vote
    const [voteModalOpen, setVoteModalOpen] = React.useState(false);
    const [selectedCandidat, setSelectedCandidat] = React.useState(null);
    
    /* Récuperation des candidats */
    const fetchCandidats = async () => {
        try {
            const response = await axios.get(`api/evenements/${Id}/candidats/`)
            setCandidats(response.data); 
        } catch(error) {
            console.log(error)
        }
    }
    
    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`api/evenements/${Id}`); 
            setEvent(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'évènement:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }
    
    const VoteTotal = () => {
        if (!candidats) return 0;
        return candidats.reduce((acc, candidat) => acc + (candidat.votes || 0), 0);
    }

    const NombreCandidats = () => {
        if (!candidats) return 0;
        return candidats.length;
    }

    const DecompteEvenement = () => {
        if (!Event || !Event.date_debut || !Event.date_fin) return 'Dates non définies';
        
        const maintenant = new Date();
        const dateDebut = new Date(Event.date_debut);
        const dateFin = new Date(Event.date_fin);

        if (maintenant < dateDebut) {
            // L'événement n'a pas encore commencé
            const diff = dateDebut - maintenant;
            const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
            const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `Début dans ${jours}j ${heures}h ${minutes}min`;
        } else if (maintenant > dateFin) {
            // L'événement est terminé
            return 'Terminé';
        } else {
            // L'événement est en cours
            const diff = dateFin - maintenant;
            const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
            const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `Fin dans ${jours}j ${heures}h ${minutes}min`;
        }
    };

    React.useEffect(() => {
        fetchEvent();
        fetchCandidats(); 
    }, [Id]);

    React.useEffect(() => {
        // Mise à jour du décompte toutes les minutes
        const interval = setInterval(() => {
            setDecompte(DecompteEvenement());
        }, 60000);

        // Mise à jour initiale
        setDecompte(DecompteEvenement());

        return () => clearInterval(interval);
    }, [Event]);

    // Fonction pour ouvrir le modal de vote avec le candidat sélectionné
    const handleVoteClick = (candidat) => {
        setSelectedCandidat(candidat);
        setVoteModalOpen(true);
    };

    // Fonction pour fermer le modal de vote
    const handleVoteModalClose = () => {
        setVoteModalOpen(false);
        setSelectedCandidat(null);
        
        // Rafraîchir les données des candidats après le vote
        fetchCandidats();
    };

    let nbrVotes = VoteTotal();
    let nbrCandidats = NombreCandidats();
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }
    
    const handleGoBack = () => { 
        navigate(-1);
    };

    if (!Event) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Événement non trouvé</p>
            </div>
        );
    }
    
    // Tri des candidats par nombre de votes (du plus grand au plus petit)
    const sortedCandidats = [...candidats].sort((a, b) => b.votes - a.votes);
    
    /* Filtre des candidats */
    const filteredCandidats = sortedCandidats.filter(
        (candidat) =>
            candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCandidat = () => {
        navigate(`/dashboard/event/${eventNom}/${Id}/candidats/add`);
    }
    
    const handleDeleteCandidat = async (id) => {
      try {
        await axios.delete(`api/evenements/${Id}/candidats/${id}/`);
        fetchCandidats();
        toast.success('Candidat supprimé avec succès');
      } catch (error) {
        console.log(error);
        toast.error('Erreur lors de la suppression du candidat');
      }
    }
    
    const handleEditCandidat = (idCandidat) => {
      navigate(`/dashboard/event/${eventNom}/${Id}/candidats/edit/${idCandidat}`);
    }
    
    
    return (
      <div>
        <Toaster richColors position="top-right" closeButton/>
        
        {/* Modal de vote */}
        <VoteModal 
          isOpen={voteModalOpen} 
          onClose={handleVoteModalClose} 
          candidat={selectedCandidat}
          evenementId={Id}
          Vote_Cost = {Event.montant_minimal}
        />
        
        {/* Button retour */}
        <Button onClick={handleGoBack} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2" size={16} />
          Retour
        </Button>
        
        {/* En-tête avec image */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <div className="w-full h-64">
            {Event.photo ? (
              <img
                src={Event.photo}
                alt={Event.nom}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse">
                Image non disponible
              </div>
            )}
            <div className="absolute inset-0 bg-black opacity-35"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              {Event.nom || "Nom non spécifié"}
            </h1>
            <p className="text-md">
              {Event.description || "Description non disponible"}
            </p>
          </div>
        </div>
        
        {/* Statistiqueset compte à rebours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow flex items-center">
            <Clock className="text-blue-500 mr-3" size={30} />
            <div>
              <h3 className="text-xl text-blue-700">Decompte de l&apos;évènement</h3>
              <p className="tracking-wide text-sm">{decompte}</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow flex items-center">
            <User className="text-green-500 mr-3" size={30} />
            <div>
              <h3 className="text-xl text-green-700">Nombre de candidats</h3>
              <p className="text-sm ">(0{nbrCandidats}) Candidat(s)</p>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow flex items-center">
            <ThumbsUp className="text-purple-500 mr-3" size={30} />
            <div>
              <h3 className="text-xl text-purple-700">Votes totaux</h3>
              <p className="text-sm">{nbrVotes || 'Pas de vote'} Votes </p>
            </div>
          </div>
        </div>
        
        {/* Input search et Button ajout */}
        <div className='flex my-6 gap-4 items-center w-full flex-col md:flex-row lg:flex-row'>
            <div className="flex items-center px-2 py-1 rounded-xl border border-gray-400 w-full">
                <Search size={24} />
                <Input
                type="search"
                placeholder="Rechercher un évènement"
                className="[&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-none border-none shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button className='rounded-xl cursor-pointer' size="lg" onClick={handleAddCandidat}>
                <Plus size={24} />
                Ajouter un candidat
            </Button>
        </div>
        
        {/* Liste des candidats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCandidats.map((candidat, index) => (
            <div
              key={candidat.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105"
            >
              {/* Bannière de position */}
              <div className="h-2 bg-primary"></div>

              <div className="">
                {/* Photo et position */}
                <div className="flex justify-between flex-col items-start">
                  <div className="relative w-full">
                    <img
                      src={candidat.photo}
                      alt={`${candidat.nom} ${candidat.prenom}`}
                      className="object-cover h-48 w-full"
                    />
                    <div className="absolute top-0 right-0 flex items-center bg-gray-100 rounded-full px-3 py-1 m-2">
                      <Heart className="text-red-500 mr-1" size={16} />
                      <span className="font-bold">{candidat.votes} votes</span>
                    </div>
                  </div>
                  {/* Informations du candidat */}
                  <div className="space-y-2 p-2 w-full">
                    <div className="flex justify-between items-center gap-2 mt-2 w-full">
                      <h3 className="text-sm uppercase font-bold">
                        {candidat.prenom} {candidat.nom}
                      </h3>

                      <div>
                        <span className="text-sm uppercase text-gray-500">
                          <span className="font-bold">
                            {index === 0
                              ? "1er"
                              : index === 1
                              ? "2ème"
                              : index === 2
                              ? "3ème"
                              : `${index + 1}ème`}
                          </span>
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {candidat.description}
                    </p>
                    <div className="w-full flex gap-2">
                      {/* Bouton voter - Modifié pour ouvrir le modal */}
                      <Button
                        size="sm"
                        className={cn("rounded-xl cursor-pointer flex-1")}
                        onClick={() => handleVoteClick(candidat)}
                      >
                        Voter
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn("rounded-xl cursor-pointer")}
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <Eye size={16} /> Afficher le candidat
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => handleEditCandidat(candidat.id)}>
                            <Edit size={16} /> Modifier le candidat
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-500 cursor-pointer" onClick= {() => handleDeleteCandidat(candidat.id)}>
                            <Trash size={16} /> Supprimer le candidat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}