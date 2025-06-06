import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import NavBar from '@/components/NavBar';
import BentoGrid, { BentoGridItem } from '@/components/ui/bento-grid';
import { VoteModal } from './VoteModal';
import { Button } from '@/components/ui/button';

export default function Event() {
  const { eventId } = useParams()
  const [candidats, setCandidats] = useState([])
  const [event, setEvent] = useState({})
  const [selectedCandidat, setSelectedCandidat] = useState(null)
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  const fetchCandidats = async() => {
    try {
      const response = await axios.get(`/api/evenements/${eventId}/candidats/`)
      if (response.status === 200) {
        setCandidats(response.data)
      }
    } catch(error) {
      console.log(error)
      const errorMessage = error.response?.data?.error || "Une erreur s'est produite lors de la récupération des données."
      toast.error("Message d'erreur", {description: errorMessage})
    }
  }
  
  const fetchEvent = async() => {
    try {
      const response = await axios.get(`/api/evenements/${eventId}/`)
      if (response.status === 200) {
        setEvent(response.data)
      }
    } catch(error) {
      console.log(error)
      const errorMessage = error.response?.data?.error || "Une erreur s'est produite lors de la récupération des données."
      toast.error("Message d'erreur", {description: errorMessage})
    }
  }

  // Fonction pour ouvrir le modal de vote
  const handleVoteClick = (candidat) => {
    // Vérifier si l'événement est toujours en cours
    const now = new Date();
    const endDate = new Date(event.date_fin);
    if (now > endDate) {
      toast.error("Erreur", {
        description: "Cet événement est terminé."
      });
      return;
    }
    setSelectedCandidat(candidat);
    setIsVoteModalOpen(true);
  };

  // Fonction pour fermer le modal de vote
  const handleCloseVoteModal = () => {
    setIsVoteModalOpen(false);
    setSelectedCandidat(null);
  };
  
  // Fonction pour calculer le temps restant
  const calculateTimeRemaining = () => {
    if (!event.date_fin) return;
    
    const now = new Date();
    const endDate = new Date(event.date_fin);
    const totalSeconds = Math.max(0, (endDate - now) / 1000);
    
    if (totalSeconds <= 0) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    setTimeRemaining({ days, hours, minutes, seconds });
  };
  
  useEffect(() => {
    fetchCandidats()
    fetchEvent()
  }, [eventId])
  
  // Mettre à jour le compteur chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);
    
    // Calcul initial
    calculateTimeRemaining();
    
    // Nettoyer le timer
    return () => clearInterval(timer);
  }, [event.date_fin]);
  
  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar/>
      <div>
        <Toaster position="top-center" richColors closeButton />
        
        <div className="h-64 relative bg-blue-700 w-full">
          <div className="container mx-auto relative">
            <div className="absolute left-0 right-0 top-24 bg-white rounded-xl shadow-md px-36 py-6 min-h-80">
              <h2 className="text-xl font-bold mb-4">Détails de l'événement</h2>
              
              <div className="mt-4 flex gap-4 justify-between">
                <div className=''>
                  <h2 className='text-2xl font-bold '>{event.nom}</h2>
                  <p className="my-4">{event.description}</p>
                  
                  <div className="mt-4">
                    <span className='text-sm font-semibold'>Termine dans : </span>
                    <div className="flex space-x-3 mt-1">
                      <div className="flex flex-col items-center">
                        <div className="text-xl font-bold bg-blue-100 rounded px-3 py-1">{timeRemaining.days}</div>
                        <div className="text-xs">Jours</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xl font-bold bg-blue-100 rounded px-3 py-1">{timeRemaining.hours}</div>
                        <div className="text-xs">Heures</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xl font-bold bg-blue-100 rounded px-3 py-1">{timeRemaining.minutes}</div>
                        <div className="text-xs">Minutes</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xl font-bold bg-blue-100 rounded px-3 py-1">{timeRemaining.seconds}</div>
                        <div className="text-xs">Secondes</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-64 h-64'>
                  {event.photo && (
                    <img className='object-cover w-full h-full rounded' src={event.photo} alt={event.nom} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-64"></div>
        
        <div className="container mx-auto mt-4 p-6 flex flex-col items-start">
          <h3 className="text-xl font-bold">Liste des Candidats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
            {candidats.length > 0 ? (
              candidats.map((candidat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={candidat.photo} 
                      alt={`${candidat.prenom} ${candidat.nom}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-semibold text-gray-800">{candidat.prenom} {candidat.nom}</h4>
                    <p className="text-gray-600 mt-2">{candidat.description}</p>
                    <div className="mt-4">
                      <Button 
                        onClick={() => handleVoteClick(candidat)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Voter
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-8">Aucun candidat pour cet événement</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de vote */}
      {selectedCandidat && (
        <VoteModal
          isOpen={isVoteModalOpen}
          onClose={handleCloseVoteModal}
          candidat={selectedCandidat}
          evenementId={eventId}
          Vote_Cost={event.cout_vote || 100}
        />
      )}
    </div>
  )
}