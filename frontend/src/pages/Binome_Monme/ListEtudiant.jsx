import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom"; // Import de useNavigate pour la navigation
import {services} from '@/services/services'
import { User, Users } from "lucide-react";

export default function ListEtudiant() {
  const [filieres, setFilieres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook pour la navigation
  const [binomes , setBinomes] = useState([])
  const [monomes , setMonomes] = useState([])
  const [students, setStudents] = useState([])

  const fetchBinomes = async () => {
    try {
      const response = await services.get('/binomes')
      if(response){
        setBinomes(response)
      }
    } catch (error) {
      console.log("Error lors de la récuération" , error)
    }
  }
  const fetchMonomes = async  () => {
    try {
      const response = await services.get('/monomes')
      if(response) {
        setMonomes(response)
      }
    } catch (error) {
      console.log('Error lors de la récupération' , error)
    }
  }
  const fetchStudents = async () => {
    try {
      const response = await services.get('/etudiants'); 
      if(response){
        setStudents(response)
      }
    } catch (error) {
      console.log('Erreur lors de la récupération', error)
    }
  }
  useEffect(() => {
    // Fonction pour récupérer les filières depuis l'API
    const fetchFilieres = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/filieres/");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des filières");
        }
        const data = await response.json();
        setFilieres(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchStudents(); 
    fetchMonomes();
    fetchBinomes() ; 
    fetchFilieres();
  }, []);
  // Filtrer les filières en fonction du terme de recherche
  const filteredFilieres = filieres.filter(
    (filiere) =>
      filiere.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filiere.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer le clic sur le bouton "Voir les étudiants"
  const handleViewStudents = (filiereId) => {
    navigate(`gestbinome/${filiereId}`); // Rediriger vers la page listeetu.jsx avec l'ID de la filière
  };
  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-4">
        <div className=" space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Équipes Étudiantes
          </h1>
          <span className="text-sm font-normal">
            organisez les binômes (L3) et monômes (M2) par filière pour les
            projets et soutenances
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Binômes L3
                </p>
                <p className="text-2xl font-bold text-emerald-900">{binomes.length || 0}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-blue-200"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Monômes M2
                </p>
                <p className="text-2xl font-bold text-purple-900">{monomes.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Rechercher une filière..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grille de cartes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1rem",
        }}
      >
        {filteredFilieres.map((filiere) => (
          <Card key={filiere.id} className="w-[210px]">
            <CardHeader>
              <CardTitle>{filiere.code}</CardTitle>
              <CardDescription>{filiere.libelle}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleViewStudents(filiere.id)}>
                Voir les étudiants
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
