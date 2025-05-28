import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Star, Calendar, Users, Award, ChevronRight, Laptop } from "lucide-react";

export default function FeatureColumn() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Gestion des soutenances académiques",
      description: "Créez et gérez vos planning de soutenance facilement depuis un tableau de bord intuitif."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Vote en ligne sécurisé",
      description: "Organisez des votes en ligne pour élire la miss PIGIER BENIN."
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Programmation et gestion des salles",
      description: "Calendrier interactif pour visualisation des salles"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="relative h-auto md:h-full flex w-full md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-6 md:p-8 text-white">
      {/* Logo animé */}
      <div className="mb-8 md:mb-12 animate-pulse">
        <LogoMSpace />
      </div>

      <h2 className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold">Bienvenue sur M-Space</h2>
      <p className="mb-8 md:mb-12 text-center text-base md:text-lg">
        La plateforme tout-en-un pour vos événements professionnels
      </p>

      {/* Liste des fonctionnalités */}
      <div className="w-full max-w-md space-y-4 pb-8 md:pb-0">
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            feature={feature}
            isActive={index === activeFeature}
            onClick={() => setActiveFeature(index)}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureItem({ feature, isActive, onClick }) {
  return (
    <div 
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-all duration-300",
        isActive 
          ? "bg-white/20 transform translate-x-2" 
          : "bg-transparent hover:bg-white/10"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "rounded-full bg-white/30 p-3 transition-all",
        isActive ? "bg-white text-blue-600" : ""
      )}>
        {feature.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{feature.title}</h3>
        <p className={cn(
          "text-sm transition-all duration-300",
          isActive ? "text-white opacity-100" : "text-white/70"
        )}>
          {feature.description}
        </p>
      </div>
      <ChevronRight className={cn(
        "h-5 w-5 transition-all duration-300",
        isActive ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
}

// Logo M-Space
function LogoMSpace() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-blue-600 font-bold text-2xl">
        M
      </div>
      <span className="text-2xl font-bold">-Space</span>
    </div>
  );
}