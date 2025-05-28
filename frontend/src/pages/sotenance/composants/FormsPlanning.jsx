import axios from "axios";
import PlanningFormTwo from "./PlanningFormTwo";
import PlanningHeader from "./PlanningHeader";
import PlanningFormOne from "./planningFormOne";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useNavigate } from "react-router";
export default function FormsPlanning() {
  const [groupes, setGroupes] = React.useState([]);
  const [etudiant1, setEtudiant1] = React.useState('');
  const [etudiant2, setEtudiant2] = React.useState('');
  const [selectedTheme, setSelectedTheme] = React.useState(null);
  const [roleJury, setRoleJury] = React.useState([]); // Ajout de l'état pour le rôle du jury
  const [enseignants, setEnseignants] = React.useState([]); // Ajout de l'état pour les enseignants
  const [directeurNom, setDirecteurNom] = React.useState("");
  const [date, setDate] = React.useState(null);
  const [time, setTime] = React.useState("");
  const [salle, setSalle] = React.useState("");
  const [binomes, setBinomes] = React.useState([]);
  const [monomes, setMonomes] = React.useState([]);
  const navigate = useNavigate();

  const formatLocalDate = (date) => {
    if (!(date instanceof Date)) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Utilisation :
  const formattedDate = formatLocalDate(date);

  const fetchgroupes = async () => {
    try{
      const [binomesResponse, monomesResponse] = await Promise.all([
        axios.get('/api/binomes'),
        axios.get('/api/monomes')
      ])
      if(binomesResponse.status === 200 &&  monomesResponse.status === 200) {
        const binomesData = binomesResponse.data;
        const monomesData = monomesResponse.data ; 
        setBinomes(binomesData);
        setMonomes(monomesData);
        setGroupes([...binomesData, ...monomesData]);; 
      }
    }catch(error){
      console.error("Erreur lors de la récupération des groupes:", error);
    }
  }
  

  const fetchEnseignants = async () => {
    try {
      const response = await axios.get('/api/enseignants');
      if (response.status === 200) {
        const enseignants = response.data ; 
        setEnseignants(enseignants);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des enseignants:", error);
    }
  }
  const resetForm = () => {
  setEtudiant1('');
  setEtudiant2('');
  setSelectedTheme(null);
  setRoleJury([]);
  setDirecteurNom('');
  setDate(null);
  setTime('');
  setSalle('');
};

  React.useEffect(()=>{
    fetchgroupes();
    fetchEnseignants();
  }, []) ;

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isBinome = binomes.find(b => b.theme === selectedTheme);
    const isMonome = monomes.find(m => m.theme === selectedTheme);
    
    
    const formData =  {
    date_soutenance : formattedDate ,
    heure_soutenance : time,
    salle: salle,
    directeur : directeurNom,
    binome: isBinome ? isBinome.id : null,
    monome: isMonome ? isMonome.id : null,
    jury_roles: roleJury.map(j => ({
    enseignant: Number(j.enseignant),
    type: j.type
    })),
  }
    try {
      await axios.post('/api/soutenances/', formData);
      resetForm(); 
      toast.success("Succès", {
        description: "soutenance planifiée avec succès",
      });
      setTimeout(() => {
        navigate('/dashboard/soutenance');
      }
      , 2000);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Erreur", {
        description: `Impossible d'ajouter la filière: ${error.message}`,
      });
    }
  }
  return (
    <div className="space-y-6 p-4">
      <Toaster richColors position="top-right" />
      <PlanningHeader/>
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mt-10 flex items-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-medium text-blue-800 dark:text-blue-300">
            Ajouter des etudiants à un planning de soutenance
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            Avant de créer un planning, vous devez vous assurez que le statut de la programmation des binomes ou monome  doit être sur &#34;est progrmmé&#34;<Button variant="link" asChild><Link to="/dashboard/Etudiantlicence">Ici</Link></Button>.
            Vous pouvez par la suite selectionner le thème du binome ou monomes; Les informations concernant la section &#34;information de l&apos;etudiant&#34; seront automaquement remplie
          </p>
        </div>
      </div>
      <div className=" mt-6">
        <form action="" onSubmit={handleSubmit} >
          <div className="flex w-full gap-x-4 space-y-4  flex-col lg:flex-row">
            {/* Premier élément plus grand */}
            <PlanningFormOne 
              allGroupes = {groupes}
              setEtudiant1={setEtudiant1}
              setEtudiant2={setEtudiant2}
              enseignants={enseignants}
              setRoleJury={setRoleJury}
              directeurNom={directeurNom}
              setDirecteurNom={setDirecteurNom}
              setSelectedTheme={setSelectedTheme}
            />

            {/* Deuxième élément plus petit */}
            <PlanningFormTwo
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              salle={salle}
              setSalle={setSalle}
            />
          </div>
          <div>
            <Separator/>
            <Button type="submit" className="mt-4 w-full lg:w-auto">
              Plannifier la soutenance
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
