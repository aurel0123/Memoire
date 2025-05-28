import{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import de useNavigate pour la navigation
import { Users , BookOpen , GraduationCap } from "lucide-react"; // Import de l'icône Users
import axios from "axios";
import StudentsState from "./composants/StudentsState";
import StudentsFilter from "./composants/StudentsFilter";
import StudentsGrid from "./composants/StudentsGrid";


export default function Etudiantsl() {
  const [filieres, setFilieres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedFilere, setSelectedFilere] = useState(null);
  const [nbrStudents, setNbrStudents] = useState(0); // État pour le nombre total d'étudiants
  const [nbrFilieres, setNbrFilieres] = useState(0); // État pour le nombre total de filières
  const navigate = useNavigate(); // Hook pour la navigation
  const stats = [
    {
      title: "Total Étudiants",
      value: nbrStudents.toString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Filières Actives",
      value: nbrFilieres.toString(),  
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Niveaux Disponibles",
      value: "Licence et Master",
      icon: GraduationCap,
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    }
  ]
  const totalStudents = async () => {
    const response = await  axios.get('/api/etudiants/');
    if (response.status === 200) {
      setNbrStudents(response.data.length); // Mettre à jour l'état avec le nombre total d'étudiants
    }
  }
  const totalFilieres = async () => {
    const response = await axios.get('/api/filieres/');
    if (response.status === 200) {
      setNbrFilieres(response.data.length); // Mettre à jour l'état avec le nombre total de filières
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

    fetchFilieres();
    totalStudents(); // Appeler la fonction pour récupérer le nombre total d'étudiants
    totalFilieres(); // Appeler la fonction pour récupérer le nombre total de filières
  }, []);

  // Filtrer les filières en fonction du terme de recherche
  const filteredFilieres = filieres.filter((filiere) => {
    const libelleMatch = filiere.libelle.toLowerCase().includes(searchQuery.toLowerCase())
    const codeMatch = filiere.code.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedLevel === 'all') {
      return libelleMatch || codeMatch
    } else if (selectedLevel === 'licence') {
      return (libelleMatch || codeMatch) && filiere.niveau === 'L3'
    } else if (selectedLevel === 'master') {
      return (libelleMatch || codeMatch) && filiere.niveau === 'M2'
    }

    return false // fallback
  })


  // Gérer le clic sur le bouton "Voir les étudiants"
  const handleViewStudents = (filiereId) => {
    navigate(`listeetu/${filiereId}`); // Rediriger vers la page listeetu.jsx avec l'ID de la filière
  };

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="mb-2 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Etudiants par Filière</h1>
          <span className="text-sm font-normal">Gérez et consultez les étudiants inscrits dans chaque filière de l&apos;établissement</span>
        </div>
        <div className="hidden md:flex items-center gap-4  border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Étudiants</p>
              {
                /* Afficher le nombre total d'étudiants */
                nbrStudents > 0 ? (
                  <p className="text-lg font-semibold">{nbrStudents}</p>
                ) : (
                  <p className="text-lg font-semibold">0</p> // Afficher 0 si aucun étudiant
                )
              }
            </div>
          </div>
        </div>
      </div>
      {/* statistiques */}
      <StudentsState stats={stats} />
      {/* Barre de recherche */}
      <StudentsFilter 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
      />

      {/* Grille d'étudiants */}
      <StudentsGrid
        filieres = {filteredFilieres}
        onFiliereClick = {setSelectedFilere}
        onViewStudents={handleViewStudents}
      />

      {/* Grille de cartes */}
      {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
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
      </div> */}
    </div>
  );
}