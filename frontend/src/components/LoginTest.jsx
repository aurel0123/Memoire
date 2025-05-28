import { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import AuthContext from "@/context/AuthContext";
import { Star, Calendar, Users, Award, ChevronRight, Laptop } from "lucide-react";

// Composant de la page de connexion
export default function LoginPage() {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Première colonne - Logo et fonctionnalités */}
      <FeatureColumn />
      
      {/* Deuxième colonne - Formulaire de connexion */}
      <div className="flex w-1/2 items-center justify-center p-8">
        <LoginForm className="w-full max-w-md" />
      </div>
    </div>
  );
}

// Colonne des fonctionnalités avec animations
function FeatureColumn() {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Gestion d'événements",
      description: "Créez et gérez tous vos événements facilement depuis un tableau de bord intuitif."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Billetterie en ligne",
      description: "Vendez des billets et gérez vos participants en quelques clics."
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Analyse détaillée",
      description: "Suivez les performances de vos événements avec des statistiques en temps réel."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Support premium",
      description: "Notre équipe est disponible 24/7 pour vous accompagner dans vos projets."
    },
    {
      icon: <Laptop className="h-6 w-6" />,
      title: "Plateforme multidevice",
      description: "Accédez à votre espace depuis n'importe quel appareil, n'importe où."
    }
  ];

  // Animation pour changer automatiquement la fonctionnalité mise en avant
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="relative flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-8 text-white">
      {/* Logo animé */}
      <div className="mb-12 animate-pulse">
        <LogoMSpace />
      </div>

      <h2 className="mb-8 text-3xl font-bold">Bienvenue sur M-Space</h2>
      <p className="mb-12 text-center text-lg">
        La plateforme tout-en-un pour vos événements professionnels
      </p>

      {/* Liste des fonctionnalités */}
      <div className="w-full max-w-md space-y-4">
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

// Item de fonctionnalité avec animation
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

// Formulaire de connexion
function LoginForm({ className }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginUser({ email, password });
      
      if (result.success) {
        toast.success("Connexion réussie");
      } else {
        toast.error("Erreur de connexion", {
          description: result.error || "Identifiants invalides",
        });
      }
    } catch (err) {
      toast.error("Erreur de connexion", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Toaster position="top-center" richColors closeButton />
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Se connecter</CardTitle>
          <CardDescription>
            Entrez votre email ci-dessous pour vous connecter à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button 
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Vous n&apos;avez pas de compte?{" "}
              <a href="/inscription" className="text-blue-600 underline underline-offset-4 hover:text-blue-800">
                Devenez Organisateur
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}