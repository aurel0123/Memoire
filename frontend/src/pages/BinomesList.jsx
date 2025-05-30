import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BinomesList() {
  const { filiereId } = useParams();
  const [binomes, setBinomes] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBinome, setNewBinome] = useState({
    etudiant1: "",
    etudiant2: "",
    maitre_memoire: "",
    theme: "",
  });
  const [editBinome, setEditBinome] = useState({
    id: null,
    etudiant1: "",
    etudiant2: "",
    maitre_memoire: "",
    theme: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [binomeToDelete, setBinomeToDelete] = useState(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const navigate = useNavigate();

  const fetchBinomes = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/binomes/?filiere=${filiereId}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setBinomes(data);
    } catch (err) {
      setError(`Erreur lors de la récupération des binômes: ${err.message}`);
      toast.error("Erreur", {
        description: `Impossible de charger les binômes: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    

    const fetchEtudiants = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/etudiants/");
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setEtudiants(data);
      } catch (err) {
        toast.error("Erreur", {
          description: `Impossible de charger les étudiants: ${err.message}`,
        });
      }
    };

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

    fetchBinomes();
    fetchEtudiants();
    fetchEnseignants();
  }, [filiereId]);

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

      setIsAddSheetOpen(false);
      setNewBinome({
        etudiant1: "",
        etudiant2: "",
        maitre_memoire: "",
        theme: "",
      });
      await fetchBinomes();
      toast.success("Succès", {
        description: "Binôme ajouté avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible d'ajouter le binôme: ${err.message}`,
      });
    }
  };

  const handleEditBinome = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/binomes/${editBinome.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editBinome),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsEditSheetOpen(false);
      setEditBinome({
        id: null,
        etudiant1: "",
        etudiant2: "",
        maitre_memoire: "",
        theme: "",
      });
      await fetchBinomes();
      toast.success("Succès", {
        description: "Binôme modifié avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de modifier le binôme: ${err.message}`,
      });
    }
  };

  const handleDeleteBinome = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/binomes/${binomeToDelete}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsDeleteDialogOpen(false);
      setBinomeToDelete(null);
      await fetchBinomes();
      toast.success("Succès", {
        description: "Binôme supprimé avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de supprimer le binôme: ${err.message}`,
      });
    }
  };

  const prepareDelete = (id) => {
    setBinomeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const prepareEdit = (binome) => {
    setEditBinome({
      id: binome.id,
      etudiant1: binome.etudiant1,
      etudiant2: binome.etudiant2,
      maitre_memoire: binome.maitre_memoire,
      theme: binome.theme,
    });
    setIsEditSheetOpen(true);
  };

  return (
    <>
      <Toaster richColors />
      <div className="mb-2 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Liste des Binômes</h1>
        <span className="text-sm font-normal">Filière sélectionnée : {filiereId}</span>
      </div>

      <div className="mb-4">
        <Button onClick={() => navigate(-1)}>Retour</Button>
        <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <SheetTrigger asChild>
            <Button className="ml-2">
              <Plus className="mr-2" /> Ajouter un binôme
            </Button>
          </SheetTrigger>
          <SheetContent>
            <form onSubmit={handleAddBinome}>
              <SheetHeader className="border-b bg-muted">
                <SheetTitle>Ajouter un binôme</SheetTitle>
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
                <Button type="submit">Ajouter</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">Chargement...</div>
      ) : error ? (
        <div className="flex justify-center py-8 text-red-500">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Étudiant 1</TableHead>
              <TableHead>Étudiant 2</TableHead>
              <TableHead>Maître de mémoire</TableHead>
              <TableHead>Thème</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {binomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Aucun binôme trouvé pour cette filière.
                </TableCell>
              </TableRow>
            ) : (
              binomes.map((binome) => (
                <TableRow key={binome.id}>
                  <TableCell>{binome.etudiant1}</TableCell>
                  <TableCell>{binome.etudiant2}</TableCell>
                  <TableCell>{binome.maitre_memoire}</TableCell>
                  <TableCell>{binome.theme}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Sheet
                        open={isEditSheetOpen && editBinome.id === binome.id}
                        onOpenChange={(open) => {
                          if (!open)
                            setEditBinome({
                              id: null,
                              etudiant1: "",
                              etudiant2: "",
                              maitre_memoire: "",
                              theme: "",
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
                            onClick={() => prepareEdit(binome)}
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <form onSubmit={handleEditBinome}>
                            <SheetHeader className="border-b bg-muted">
                              <SheetTitle>Modifier le binôme</SheetTitle>
                            </SheetHeader>
                            <div className="grid gap-6 p-4">
                              <div className="grid items-center gap-3">
                                <Label htmlFor="edit-etudiant1" className="text-right">
                                  Étudiant 1
                                </Label>
                                <Select
                                  value={editBinome.etudiant1}
                                  onValueChange={(value) =>
                                    setEditBinome({ ...editBinome, etudiant1: value })
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
                                <Label htmlFor="edit-etudiant2" className="text-right">
                                  Étudiant 2
                                </Label>
                                <Select
                                  value={editBinome.etudiant2}
                                  onValueChange={(value) =>
                                    setEditBinome({ ...editBinome, etudiant2: value })
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
                                <Label htmlFor="edit-maitre_memoire" className="text-right">
                                  Maître de mémoire
                                </Label>
                                <Select
                                  value={editBinome.maitre_memoire}
                                  onValueChange={(value) =>
                                    setEditBinome({ ...editBinome, maitre_memoire: value })
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
                                <Label htmlFor="edit-theme" className="text-right">
                                  Thème
                                </Label>
                                <Input
                                  id="edit-theme"
                                  value={editBinome.theme}
                                  onChange={(e) =>
                                    setEditBinome({ ...editBinome, theme: e.target.value })
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
                        onClick={() => prepareDelete(binome.id)}
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
              Êtes-vous sûr de vouloir supprimer ce binôme ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBinome}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}