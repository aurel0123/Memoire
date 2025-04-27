import * as React from 'react'; 
import { useParams } from 'react-router';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import axios from 'axios';
import { Clock, User , ThumbsUp , ArrowLeft} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link  , useNavigate} from 'react-router-dom';
export default function Candidats(){
    const {Id} = useParams();
    const [Event, setEvent] = React.useState(null);
    const [candidats, setCandidats] = React.useState(null); 
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    /* Récuperation des candidats */

    const fetchCandidats = async () =>{
        try{
            const response =  await axios.get(`api/evenements/${Id}/candidats/`)
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
    
    React.useEffect(() => {
        fetchEvent();
        fetchCandidats(); 
    }, [Id]);

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

    
    return (
        <div>
            {/* Button retout */}
            <Button onClick={handleGoBack} variant="outline" className='mb-4'>
                <ArrowLeft className="mr-2" size={16} />
                Retour
            </Button>
            {/* En-tête avec image */}
            <div className="relative rounded-lg overflow-hidden mb-6">
                <div className='w-full h-64'>
                    {Event.photo ? (
                        <img src={Event.photo} alt={Event.nom} className='w-full h-full object-cover' />
                    ) : (
                        <div className='w-full h-full bg-gray-200 animate-pulse'>
                            Image non disponible
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-35"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">{Event.nom || 'Nom non spécifié'}</h1>
                    <p className="text-md">{Event.description || 'Description non disponible'}</p>
                </div>
            </div>
            {/* Statistiqueset compte à rebours */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg shadow flex items-center">
                    <Clock className="text-blue-500 mr-3" size={24} />
                    <div>
                        <h3 className="text-sm text-blue-700">Fin des votes dans</h3>
                        <p className="font-bold"></p>
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow flex items-center">
                    <User className="text-green-500 mr-3" size={24} />
                    <div>
                        <h3 className="text-sm text-green-700">Nombre de candidats</h3>
                        <p className="font-bold">4</p>
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow flex items-center">
                    <ThumbsUp className="text-purple-500 mr-3" size={24} />
                    <div>
                        <h3 className="text-sm text-purple-700">Votes totaux</h3>
                        <p className="font-bold">{event.totalVotes}</p>
                    </div>
                </div>
            </div>
            {/* Liste des candidats */}
            <div className='grid grid-cols-4 gap-4'>
                <Card>
                    <CardContent>
                        <div className='relative h-48 w-full'>
                        <div className="w-full h-full overflow-hidden rounded-t-xl">
                            <img
                                className="w-full h-full object-cover transition-all duration-500 group-hover/bento:scale-110 group-hover/bento:brightness-110"
                                
                            />
                            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover/bento:opacity-25 rounded-t-xl cursor-pointer"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}