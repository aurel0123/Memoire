import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, User } from "lucide-react"; // Import des icônes

export default function FilieresList() {
  const [filieres, setFilieres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

  const filteredFilieres = filieres.filter((filiere) =>
    filiere.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filiere.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewBinomes = (filiereId) => {
    navigate(`binomes/${filiereId}`);
  };

  const handleViewMonomes = (filiereId) => {
    navigate(`monomes/${filiereId}`);
  };

  return (
    <>
      <div className="mb-2 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Filières</h1>
        <span className="text-sm font-normal">Gérer vos filières</span>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Rechercher une filière..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        {filteredFilieres.map((filiere) => (
          <Card key={filiere.id} className="w-[210px]">
            <CardHeader>
              <CardTitle>{filiere.code}</CardTitle>
              <CardDescription>{filiere.libelle}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              {/* Afficher le bouton des binômes uniquement si la filière n'est pas en M2 */}
              {filiere.niveau !== "M2" && (
                <Button
                  onClick={() => handleViewBinomes(filiere.id)}
                  title="Voir les binômes"
                  aria-label="Voir les binômes"
                >
                  <Users className="h-4 w-4" /> {/* Icône Users */}
                </Button>
              )}
              {/* Toujours afficher le bouton des monômes */}
              <Button
                onClick={() => handleViewMonomes(filiere.id)}
                title="Voir les monômes"
                aria-label="Voir les monômes"
              >
                <User className="h-4 w-4" /> {/* Icône User */}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}