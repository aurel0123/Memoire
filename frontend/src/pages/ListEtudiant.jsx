import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom"; // Import de useNavigate pour la navigation

export default function ListEtudiant() {
    const [filieres, setFilieres] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate(); // Hook pour la navigation
  
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
  
      fetchFilieres();
    }, []);
  
    // Filtrer les filières en fonction du terme de recherche
    const filteredFilieres = filieres.filter((filiere) =>
      filiere.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filiere.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Gérer le clic sur le bouton "Voir les étudiants"
    const handleViewStudents = (filiereId) => {
      navigate(`gestbinome/${filiereId}`); // Rediriger vers la page listeetu.jsx avec l'ID de la filière
    };
  return (
      <div className="max-w-full">
          <div className="mb-2 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Etudiants par Filière</h1>
              <span className="text-sm font-normal">Gérer vos filières</span>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
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
  )
}