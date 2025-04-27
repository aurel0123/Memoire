import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import {cn} from '@/lib/utils'
import { Clock, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import axios from 'axios'
import BentoGrid, {BentoGridItem} from '@/components/ui/bento-grid'
// Importation de AOS
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useNavigate } from 'react-router'

export default function Events() {
    const[events, setEvents] = useState()
    const[loading, setLoading] = useState(true)
    const navigate = useNavigate();

    
    const fetchEvents = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/evenements/')
            setEvents(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchEvents()
        
        // Initialisation de AOS
        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
            easing: 'ease-out-cubic'
        })
    }, [])

    // Rafraîchir AOS quand le contenu est chargé
    useEffect(() => {
        if (!loading) {
            AOS.refresh()
        }
    }, [loading, events])

    // Gérer le clic sur le bouton "Voir l'evenement"
    const handleViewsEvent = (eventId) => {
        navigate(`event/${eventId}`); // Rediriger vers la page listeetu.jsx avec l'ID de la filière
    };
    
    return (
        <section className='full mt-20 mb-20'>
            <div className='container'>
                <div className='w-full'>
                    <div 
                        className="mb-10 space-y-1 flex w-full gap-4 flex-col items-center" 
                        data-aos="fade-down" 
                        data-aos-delay="100"
                    >
                        <h1 className="text-2xl font-bold tracking-tight">Découvrez vos prochains évènements</h1>
                    </div>
                    <div>
                        <Tabs
                            orientation='vertical'
                            defaultValue='en cours'
                            className='space-y-6'
                        >
                            <div 
                                className='w-full overflow-x-auto' 
                                data-aos="fade-right" 
                                data-aos-delay="200"
                            >
                                <TabsList className="">
                                    <TabsTrigger value='en cours' className="">En cours</TabsTrigger>
                                    <TabsTrigger value='A venir'>
                                        A venir
                                    </TabsTrigger>
                                    <TabsTrigger value='terminé'>
                                        Terminé
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="en cours">
                                <BentoGrid className="w-full py-6">
                                    {events && events.length > 0 ? (
                                        events.map((event, i) => (
                                            <div
                                                key={i}
                                                data-aos="zoom-in-up"
                                                data-aos-delay={150 + (i * 50)}
                                                data-aos-duration="600"
                                            >
                                                <BentoGridItem
                                                    title={event.nom}
                                                    description={event.description}
                                                    header={event.photo}
                                                    button="Voir les nominé(e)s"
                                                    vote={event.max_votants}
                                                    status={event.status}
                                                    link={() => handleViewsEvent(event.id)}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div data-aos="fade-in">
                                            {loading ? (
                                                <div className="w-full flex justify-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                                </div>
                                            ) : (
                                                <p>Aucun élément chargé</p>
                                            )}
                                        </div>
                                    )}
                                </BentoGrid>
                            </TabsContent>
                        </Tabs>
                        
                        
                    </div>
                </div>
            </div>
        </section>
    )
}