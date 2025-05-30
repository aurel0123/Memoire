import SoutenanceHeader from "./composants/SoutenanceHeader";
import { useNavigate } from "react-router";
import SoutenanceStats from "./composants/SoutenanceStats";
import { Toaster } from "@/components/ui/sonner";
import {toast} from 'sonner'
import {  useEffect, useState } from "react";
import axios from "axios";
import SoutenanceFilter from "./composants/SoutenanceFilter";
import SoutenanceTable from "./composants/SoutenanceTable";
import DeleteDialog from "./ComposantDialog/DeleteDialog";
import {services} from '@/services/services'
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

export default function Index() {
  const tableRef = useRef();
  const [soutenances, setSoutenances] = useState([]);
  const [filters, setFilters] = useState({});
  const [filieres, setFilieres] = useState([]);
  const [binomes, setBinomes] = useState([]);
  const [monomes, setMonomes] = useState([]);
  const [enseignant , setEnseignant] = useState([]) ; 
  const [originalSoutenances, setOriginalSoutenances] = useState([]);
  const [deleteSoutenance , setDeleteSoutenance] = useState() ;
  const [isDeleteDialogOpen, setisDeleteDialogOpen] = useState(false);
  const navigate = useNavigate() ; 

  // Fonction pour exporter en Excel
  const exportToExcel = () => {
    const data = filteredSoutenances.map(soutenance => ({
      'N°': filteredSoutenances.indexOf(soutenance) + 1,
      'Salle': soutenance.salle,
      'Date': new Date(soutenance.date_soutenance).toLocaleDateString('fr-FR'),
      'Heure': soutenance.heure_soutenance,
      'Étudiant(s)': soutenance.etudiants.map(e => `${e.nom} ${e.prenom}`).join(', '),
      'Thème': soutenance.themeMemoire,
      'Directeur': soutenance.directeur,
      'Président': soutenance.jury_members[0]?.enseignant?.nom,
      'Examinateur': soutenance.jury_members[1]?.enseignant?.nom,
      'Rapporteur': soutenance.jury_members[2]?.enseignant?.nom,
      'Statut': soutenance.statut
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Soutenances");
    XLSX.writeFile(workbook, "soutenances.xlsx");
  };
  // Fonction pour imprimer
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; }
      }
    `,
  });
  const ViewFormPlanning = () => {
    navigate('/dashboard/new-planning-soutenance');
  }
  const fectchFilieres = async () => {
    try{
      const response = await axios.get('/api/filieres/');
      if (response.status === 200) {
        setFilieres (response.data)
      } else {
        throw new Error('Erreur lors de la récupération des filières');
      }
    }catch(err){
      console.error("Erreur lors de la récupération des filières:", err);
    }
  }
  const fetchSoutenance = async () => {
    try{
      const response = await axios.get('/api/soutenances/');
      if (response.status===200) {
        // Traitez les données des soutenances ici si nécessaire
        setOriginalSoutenances(response.data);
      } else {
        throw new Error('Erreur lors de la récupération des soutenances');
      }
    }catch(error){
      console.error("Erreur lors de la récupération des soutenances:", error);
    }
  }
  const fetchBinomes = async () => {
    try {
      const response = await axios.get('/api/binomes/');
      if (response.status === 200) setBinomes(response.data);
    } catch (err) {
      console.error("Erreur binomes:", err);
    }
  };

  const fetchMonomes = async () => {
    try {
      const response = await axios.get('/api/monomes/');
      if (response.status === 200) setMonomes(response.data);
    } catch (err) {
      console.error("Erreur monomes:", err);
    }
  };
  
  const fetchEnseignants = async () => {
    try {
      const response = await axios.get('api/enseignants')
      if(response.status === 200) {
        setEnseignant(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSoutenance();
    fectchFilieres();
    fetchBinomes();
    fetchMonomes();
    fetchEnseignants(); 
  }, []);

  const enrichSoutenances = (soutenances, binomes, monomes , enseignant) => {
    return soutenances.map((soutenance) => {
      const searchEnseignant = enseignant.find((e)=>e.id === soutenance?.monome || soutenance?.binome); 
      if (soutenance.monome) {
        const monomeData = monomes.find((m) => m.id === soutenance.monome);
        return { ...soutenance, etudiants: [monomeData?.etudiant] , themeMemoire : monomeData.theme , NomEnseignant : searchEnseignant.nom  , PrenomEnseignant : searchEnseignant.prenom};
      }

      if (soutenance.binome) {
        const binomeData = binomes.find((b) => b.id === soutenance.binome);
        return { ...soutenance, etudiants: binomeData?.etudiants || [] , themeMemoire : binomeData.theme , NomEnseignant : searchEnseignant.nom  , PrenomEnseignant : searchEnseignant.prenom};
      }

      return soutenance;
    });
  };

  useEffect(() => {
  if (
    originalSoutenances.length > 0 &&
    binomes.length > 0 &&
    monomes.length > 0
  ) {
    try {
      const enriched = enrichSoutenances(originalSoutenances, binomes, monomes , enseignant);
      setSoutenances(enriched); // ✅ Pas de boucle infinie ici
    } catch (error) {
      console.error("Erreur lors de l'enrichissement des soutenances:", error);
    }
  }
}, [originalSoutenances, binomes, monomes , enseignant]);

  const applyFilters = (soutenances) => {
    return soutenances.filter((soutenance) => {
      const { etudiants = [] } = soutenance;

      // Nom
      if (filters.nom && !etudiants.some((e) =>
        e.nom.toLowerCase().includes(filters.nom.toLowerCase())
      )) {
        return false;
      }

      // Matricule
      if (filters.matricule && !etudiants.some((e) =>
        e.matricule.toLowerCase().includes(filters.matricule.toLowerCase())
      )) {
        return false;
      }

      // Directeur
      if (filters.directeur && !soutenance.directeur.toLowerCase().includes(filters.directeur.toLowerCase())) {
        return false;
      }

      // Filière
      if (filters.filiere && !etudiants.some((e) =>
        e.filiere_detail.id === parseInt(filters.filiere)
      )) {
        return false;
      }

      // Statut
      if (filters.statut && soutenance.statut !== filters.statut) {
        return false;
      }

      return true;
    });
  };

  const handledetele = async (e) => {
    if (e) e.preventDefault();

    try {
      if(!deleteSoutenance) return;

      const response = await services.delete(`soutenances/${deleteSoutenance}/`);

      if(!response.status === 200) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      setisDeleteDialogOpen(false);
      setDeleteSoutenance(null);
      await fetchSoutenance();
      
      toast.success("Succès", {
        description: "Soutenance supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur de suppression:', error.message);
      toast.error("Erreur", {
        description: `Impossible de supprimer la filière: ${error.message}`,
      });
    }
    
  }
  //Fonction pour la suppressions 
  const prepareDelete = (id, e) => {
    if (e) e.stopPropagation();
    setDeleteSoutenance(id);
    setisDeleteDialogOpen(true);
  };

  const filteredSoutenances = applyFilters(soutenances);

  console.log("id" , soutenances);
  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />
      <SoutenanceHeader 
        ViewFormPlanning = {ViewFormPlanning}
        onExport={exportToExcel}
        onPrint={handlePrint}
      />
      <SoutenanceStats soutenances={soutenances}/>
      <SoutenanceFilter
        filieres={filieres}
        setFilters={setFilters}
        filters={filters}
      />
      <SoutenanceTable 
        soutenances={filteredSoutenances} 
        onEdit={(id) => console.log('Edit soutenance:', id)}
        onDelete={prepareDelete}
        tableRef={tableRef}
      />
      <DeleteDialog 
        open = {isDeleteDialogOpen}
        onOpenChange = {setisDeleteDialogOpen}
        handleDelete = {handledetele}
      />
      
    </div>
  )
}
