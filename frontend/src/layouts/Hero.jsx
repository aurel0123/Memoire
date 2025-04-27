import { Button } from '@/components/ui/button';
import React from 'react';
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Hero() {
  return (
    <section 
      className="w-full h-68 p-10 flex items-center justify-center bg-accent "
      aria-label="Section hero principale"
    >
      
      {/* Contenu optionnel que vous pourriez ajouter plus tard */}
      <div className="w-full  flex items-center justify-center ">
        <div className='flex items-center justify-center flex-col gap-4 text-center p-4'>
          <h1 className='text-4xl font-bold  text-blue-800 ' data-aos="zoom-in">Bienvenue sur Votre Site de Vote en Ligne</h1>
          <p className='text-sm tracking-tight line-clamp-2'>Participez aux événements de vote en ligne sécurisés et transparents pour faire entendre votre voix.</p>
          <Button className="transition-all duration-500  hover:scale-105">
            Découvrir les événements
          </Button>
        </div>
      </div> 
    </section>
  );
}