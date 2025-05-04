import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as XLSX from 'xlsx';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Users, User, Import } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchInfo from "@/components/SearchInfo";


export default function ListeEtu() {
  const { filiereId } = useParams();
  const [etudiants, setEtudiants] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [filiere, setFiliere] = useState(null); // Ajout de l'état pour la filière
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEtudiant, setNewEtudiant] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    date_naissance: "",
    lieu_naissance: "",
    filiere: filiereId,
  });
  const [editEtudiant, setEditEtudiant] = useState({
    id: null,
    matricule: "",
    nom: "",
    prenom: "",
    date_naissance: "",
    lieu_naissance: "",
    filiere: filiereId,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [etudiantToDelete, setEtudiantToDelete] = useState(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isBinomeSheetOpen, setIsBinomeSheetOpen] = useState(false);
  const [isMonomeSheetOpen, setIsMonomeSheetOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [newBinome, setNewBinome] = useState({
    etudiant1: "",
    etudiant2: "",
    maitre_memoire: "",
    theme: "",
  });
  const [newMonome, setNewMonome] = useState({
    etudiant: "",
    maitre_memoire: "",
    theme: "",
  });
  const [file , setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/import-etudiants/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'importation");
      }
  
      const data = await response.json();
      toast.success("Succès", {
        description: data.message || "Importation réussie",
      });
      
      // Fermer la prévisualisation et rafraîchir les données
      setShowPreview(false);
      setFile(null);
      setExcelData([]);
      await fetchEtudiants();
    } catch (error) {
      toast.error("Erreur", {
        description: error.message || "Erreur lors de l'importation",
      });
    }
  };
  // Récupérer les étudiants
  const fetchEtudiants = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/etudiants/");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      const filteredEtudiants = data.filter(
        (etudiant) => etudiant.filiere === parseInt(filiereId)
      );
      setEtudiants(filteredEtudiants);
      setError(null);
    } catch (err) {
      setError(`Erreur lors de la récupération des étudiants: ${err.message}`);
      toast.error("Erreur", {
        description: `Impossible de charger les étudiants: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les enseignants
  const fetchEnseignants = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/enseignants/");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEnseignants(data);
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de charger les enseignants: ${err.message}`,
      });
    }
  };

  // Récupérer la filière
  const fetchFiliere = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/filieres/${filiereId}/`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      
      setFiliere(data);
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de charger la filière: ${err.message}`,
      });
    }
  };

  useEffect(() => {
    fetchEtudiants();
    fetchEnseignants();
    fetchFiliere(); // Charger la filière au montage du composant
  }, [filiereId]);

  // Ajouter un étudiant
  const handleAddEtudiant = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/etudiants/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEtudiant),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsAddSheetOpen(false);
      setNewEtudiant({
        matricule: "",
        nom: "",
        prenom: "",
        date_naissance: "",
        lieu_naissance: "",
        filiere: filiereId,
      });
      await fetchEtudiants();
      toast.success("Succès", {
        description: "Étudiant ajouté avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible d'ajouter l'étudiant: ${err.message}`,
      });
    }
  };

  // Modifier un étudiant
  const handleEditEtudiant = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/etudiants/${editEtudiant.matricule}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editEtudiant),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsEditSheetOpen(false);
      setEditEtudiant({
        id: null,
        matricule: "",
        nom: "",
        prenom: "",
        date_naissance: "",
        lieu_naissance: "",
        filiere: filiereId,
      });
      fetchEtudiants();
      toast.success("Succès", {
        description: "Étudiant modifié avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de modifier l'étudiant: ${err.message}`,
      });
    }
  };

  // Supprimer un étudiant
  const handleDeleteEtudiant = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/etudiants/${etudiantToDelete}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsDeleteDialogOpen(false);
      setEtudiantToDelete(null);
      await fetchEtudiants();
      toast.success("Succès", {
        description: "Étudiant supprimé avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de supprimer l'étudiant: ${err.message}`,
      });
    }
  };

  // Ajouter un binôme
  const handleAddBinome = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/binomes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBinome),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsBinomeSheetOpen(false);
      setNewBinome({
        etudiant1: "",
        etudiant2: "",
        maitre_memoire: "",
        theme: "",
      });
      toast.success("Succès", {
        description: "Binôme créé avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de créer le binôme: ${err.message}`,
      });
    }
  };

  // Ajouter un monôme
  const handleAddMonome = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/monomes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMonome),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsMonomeSheetOpen(false);
      setNewMonome({
        etudiant: "",
        maitre_memoire: "",
        theme: "",
      });
      toast.success("Succès", {
        description: "Monôme créé avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de créer le monôme: ${err.message}`,
      });
    }
  };

  // Préparer la suppression
  const prepareDelete = (id) => {
    setEtudiantToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Préparer la modification
  const prepareEdit = (etudiant) => {
    setEditEtudiant({
      matricule: etudiant.matricule,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      date_naissance: etudiant.date_naissance,
      lieu_naissance: etudiant.lieu_naissance,
      filiere: etudiant.filiere,
    });
    setIsEditSheetOpen(true);
  };

  // Retour à la page précédente
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setFile(file);
  
    try {
      const data = await readExcelFile(file);
      setExcelData(data);
      setShowPreview(true);
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de lire le fichier Excel",
      });
    }
  };
  
  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  console.log(newEtudiant);
  return (
    <>
      <Toaster richColors />
      <Button onClick={handleGoBack}>Retour</Button>
      <div className="mb-2 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Liste des Étudiants
        </h1>
        <span className="text-sm font-normal">
          Filière sélectionnée : {filiere?.code}
        </span>
      </div>
     
      <div className="mb-4 flex items-center gap-6">
        <Input 
          type="search"
          placeholder="Rechercher"
          className="rounded-xl"
        />
        <div className="flex items-center gap-2">
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className="ml-2 rounded-xl">
                <Plus className="mr-2" /> Ajouter un étudiant
              </Button>
            </SheetTrigger>
            <SheetContent>
              <form onSubmit={handleAddEtudiant}>
                <SheetHeader className="border-b bg-muted">
                  <SheetTitle>Ajouter un étudiant</SheetTitle>
                </SheetHeader>
                <div className="grid gap-6 p-4">
                  <div className="grid items-center gap-3">
                    <Label htmlFor="matricule" className="text-right">
                      Matricule
                    </Label>
                    <Input
                      id="matricule"
                      value={newEtudiant.matricule}
                      onChange={(e) =>
                        setNewEtudiant({
                          ...newEtudiant,
                          matricule: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="nom" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="nom"
                      value={newEtudiant.nom}
                      onChange={(e) =>
                        setNewEtudiant({ ...newEtudiant, nom: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="prenom" className="text-right">
                      Prénom
                    </Label>
                    <Input
                      id="prenom"
                      value={newEtudiant.prenom}
                      onChange={(e) =>
                        setNewEtudiant({ ...newEtudiant, prenom: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="date_naissance" className="text-right">
                      Date de naissance
                    </Label>
                    <Input
                      id="date_naissance"
                      type="date"
                      value={newEtudiant.date_naissance}
                      onChange={(e) =>
                        setNewEtudiant({
                          ...newEtudiant,
                          date_naissance: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="lieu_naissance" className="text-right">
                      Lieu de naissance
                    </Label>
                    <Input
                      id="lieu_naissance"
                      value={newEtudiant.lieu_naissance}
                      onChange={(e) =>
                        setNewEtudiant({
                          ...newEtudiant,
                          lieu_naissance: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <SheetFooter>
                  <Button type="submit">Ajouter</Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
          <div className="relative">
            <Button
              type="button"
              className="bg-green-600 dark:bg-green-800 hover:bg-green-700 dark:hover:bg-green-700 rounded-xl flex items-center gap-2"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <Import className="w-4 h-4" />
              Importer Excel
            </Button>

            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ display: "none" }}
            />
          </div>

        </div>
       {/*  {filiere && filiere.niveau === "L3" && (
          <>
            <Sheet open={isBinomeSheetOpen} onOpenChange={setIsBinomeSheetOpen}>
              <SheetTrigger asChild>
                <Button className="ml-2">
                  <Users className="mr-2" /> Créer un binôme
                </Button>
              </SheetTrigger>
              <SheetContent>
                <form onSubmit={handleAddBinome}>
                  <SheetHeader className="border-b bg-muted">
                    <SheetTitle>Créer un binôme</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-6 p-4">
                    <div className="grid items-center gap-3">
                      <Label htmlFor="etudiant1" className="text-right">
                        Étudiant 1
                      </Label>
                      <Select
                        value={newBinome.etudiant1}
                        onValueChange={(value) =>
                          setNewBinome({ ...newBinome, etudiant1: value })
                        }
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="Sélectionner un étudiant" />
                        </SelectTrigger>
                        <SelectContent>
                          {etudiants.map((etudiant) => (
                            <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                              {etudiant.nom} {etudiant.prenom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-3">
                      <Label htmlFor="etudiant2" className="text-right">
                        Étudiant 2
                      </Label>
                      <Select
                        value={newBinome.etudiant2}
                        onValueChange={(value) =>
                          setNewBinome({ ...newBinome, etudiant2: value })
                        }
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="Sélectionner un étudiant" />
                        </SelectTrigger>
                        <SelectContent>
                          {etudiants.map((etudiant) => (
                            <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                              {etudiant.nom} {etudiant.prenom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-3">
                      <Label htmlFor="maitre_memoire" className="text-right">
                        Maître de mémoire
                      </Label>
                      <Select
                        value={newBinome.maitre_memoire}
                        onValueChange={(value) =>
                          setNewBinome({ ...newBinome, maitre_memoire: value })
                        }
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="Sélectionner un enseignant" />
                        </SelectTrigger>
                        <SelectContent>
                          {enseignants.map((enseignant) => (
                            <SelectItem key={enseignant.id} value={enseignant.id}>
                              {enseignant.nom} {enseignant.prenom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-3">
                      <Label htmlFor="theme" className="text-right">
                        Thème
                      </Label>
                      <Input
                        id="theme"
                        value={newBinome.theme}
                        onChange={(e) =>
                          setNewBinome({ ...newBinome, theme: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <Button type="submit">Créer</Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
            <Sheet open={isMonomeSheetOpen} onOpenChange={setIsMonomeSheetOpen}>
              <SheetTrigger asChild>
                <Button className="ml-2">
                  <User className="mr-2" /> Créer un monôme
                </Button>
              </SheetTrigger>
              <SheetContent>
                <form onSubmit={handleAddMonome}>
                  <SheetHeader className="border-b bg-muted">
                    <SheetTitle>Créer un monôme</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-6 p-4">
                    <div className="grid items-center gap-3">
                      <Label htmlFor="etudiant" className="text-right">
                        Étudiant
                      </Label>
                      <Select
                        value={newMonome.etudiant}
                        onValueChange={(value) =>
                          setNewMonome({ ...newMonome, etudiant: value })
                        }
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="Sélectionner un étudiant" />
                        </SelectTrigger>
                        <SelectContent>
                          {etudiants.map((etudiant) => (
                            <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                              {etudiant.nom} {etudiant.prenom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-3">
                      <Label htmlFor="maitre_memoire" className="text-right">
                        Maître de mémoire
                      </Label>
                      <Select
                        value={newMonome.maitre_memoire}
                        onValueChange={(value) =>
                          setNewMonome({ ...newMonome, maitre_memoire: value })
                        }
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="Sélectionner un enseignant" />
                        </SelectTrigger>
                        <SelectContent>
                          {enseignants.map((enseignant) => (
                            <SelectItem key={enseignant.id} value={enseignant.id}>
                              {enseignant.nom} {enseignant.prenom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-3">
                      <Label htmlFor="theme" className="text-right">
                        Thème
                      </Label>
                      <Input
                        id="theme"
                        value={newMonome.theme}
                        onChange={(e) =>
                          setNewMonome({ ...newMonome, theme: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <Button type="submit">Créer</Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </>
        )}
        {filiere && filiere.niveau === "M2" && (
          <Sheet open={isMonomeSheetOpen} onOpenChange={setIsMonomeSheetOpen}>
            <SheetTrigger asChild>
              <Button className="ml-2">
                <User className="mr-2" /> Créer un monôme
              </Button>
            </SheetTrigger>
            <SheetContent>
              <form onSubmit={handleAddMonome}>
                <SheetHeader className="border-b bg-muted">
                  <SheetTitle>Créer un monôme</SheetTitle>
                </SheetHeader>
                <div className="grid gap-6 p-4">
                  <div className="grid items-center gap-3">
                    <Label htmlFor="etudiant" className="text-right">
                      Étudiant
                    </Label>
                    <Select
                      value={newMonome.etudiant}
                      onValueChange={(value) =>
                        setNewMonome({ ...newMonome, etudiant: value })
                      }
                    >
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Sélectionner un étudiant" />
                      </SelectTrigger>
                      <SelectContent>
                        {etudiants.map((etudiant) => (
                          <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                            {etudiant.nom} {etudiant.prenom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="maitre_memoire" className="text-right">
                      Maître de mémoire
                    </Label>
                    <Select
                      value={newMonome.maitre_memoire}
                      onValueChange={(value) =>
                        setNewMonome({ ...newMonome, maitre_memoire: value })
                      }
                    >
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Sélectionner un enseignant" />
                      </SelectTrigger>
                      <SelectContent>
                        {enseignants.map((enseignant) => (
                          <SelectItem key={enseignant.id} value={enseignant.id}>
                            {enseignant.nom} {enseignant.prenom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="theme" className="text-right">
                      Thème
                    </Label>
                    <Input
                      id="theme"
                      value={newMonome.theme}
                      onChange={(e) =>
                        setNewMonome({ ...newMonome, theme: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <SheetFooter>
                  <Button type="submit">Créer</Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        )} */}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">Chargement...</div>
      ) : error ? (
        <div className="flex justify-center py-8 text-red-500">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matricule</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Lieu de naissance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etudiants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucun étudiant trouvé pour cette filière.
                </TableCell>
              </TableRow>
            ) : (
              etudiants.map((etudiant) => (
                <TableRow key={etudiant.matricule}>
                  <TableCell>{etudiant.matricule}</TableCell>
                  <TableCell>{etudiant.nom}</TableCell>
                  <TableCell>{etudiant.prenom}</TableCell>
                  <TableCell>{etudiant.date_naissance}</TableCell>
                  <TableCell>{etudiant.lieu_naissance}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Sheet
                        open={
                          isEditSheetOpen && editEtudiant.id === etudiant.id
                        }
                        onOpenChange={(open) => {
                          if (!open)
                            setEditEtudiant({
                              id: null,
                              matricule: "",
                              nom: "",
                              prenom: "",
                              date_naissance: "",
                              lieu_naissance: "",
                              filiere: filiereId,
                            });
                          setIsEditSheetOpen(open);
                        }}
                      >
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            type="button"
                            onClick={() => prepareEdit(etudiant)}
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <form onSubmit={handleEditEtudiant}>
                            <SheetHeader className="border-b bg-muted">
                              <SheetTitle>Modifier l'étudiant</SheetTitle>
                            </SheetHeader>
                            <div className="grid gap-6 p-4">
                              <div className="grid items-center gap-3">
                                <Label
                                  htmlFor="edit-matricule"
                                  className="text-right"
                                >
                                  Matricule
                                </Label>
                                <Input
                                  id="edit-matricule"
                                  value={editEtudiant.matricule}
                                  onChange={(e) =>
                                    setEditEtudiant({
                                      ...editEtudiant,
                                      matricule: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid items-center gap-3">
                                <Label htmlFor="edit-nom" className="text-right">
                                  Nom
                                </Label>
                                <Input
                                  id="edit-nom"
                                  value={editEtudiant.nom}
                                  onChange={(e) =>
                                    setEditEtudiant({...editEtudiant,nom: e.target.value,})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid items-center gap-3">
                                <Label
                                  htmlFor="edit-prenom"
                                  className="text-right"
                                >
                                  Prénom
                                </Label>
                                <Input
                                  id="edit-prenom"
                                  value={editEtudiant.prenom}
                                  onChange={(e) =>
                                    setEditEtudiant({
                                      ...editEtudiant,
                                      prenom: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid items-center gap-3">
                                <Label
                                  htmlFor="edit-date_naissance"
                                  className="text-right"
                                >
                                  Date de naissance
                                </Label>
                                <Input
                                  id="edit-date_naissance"
                                  type="date"
                                  value={editEtudiant.date_naissance}
                                  onChange={(e) =>
                                    setEditEtudiant({
                                      ...editEtudiant,
                                      date_naissance: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid items-center gap-3">
                                <Label
                                  htmlFor="edit-lieu_naissance"
                                  className="text-right"
                                >
                                  Lieu de naissance
                                </Label>
                                <Input
                                  id="edit-lieu_naissance"
                                  value={editEtudiant.lieu_naissance}
                                  onChange={(e) =>
                                    setEditEtudiant({
                                      ...editEtudiant,
                                      lieu_naissance: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <SheetFooter>
                              <Button type="submit">Enregistrer</Button>
                            </SheetFooter>
                          </form>
                        </SheetContent>
                      </Sheet>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => prepareDelete(etudiant.matricule)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEtudiant}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay noir semi-transparent */}
          <div className="absolute inset-0 bg-black opacity-50" />

          {/* Contenu de la modale */}
          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Prévisualisation du fichier Excel</h3>
              
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {excelData.length > 0 &&
                      Object.keys(excelData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {excelData.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {excelData.length > 10 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  + {excelData.length - 10} autres lignes...
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700">
                Importer
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(false)} className="mr-2">
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}