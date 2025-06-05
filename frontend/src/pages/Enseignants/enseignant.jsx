import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
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
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, AlertCircle, X } from "lucide-react";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Enseignant() {
  const [enseignants, setEnseignants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEnseignant, setNewEnseignant] = useState({ nom: "", prenom: "", grade: "", specialite: "", etablissement: "" });
  const [editEnseignant, setEditEnseignant] = useState({ id: null, nom: "", prenom: "", grade: "", specialite: "", etablissement: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [enseignantToDelete, setEnseignantToDelete] = useState(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Récupérer les enseignants depuis l'API
  const fetchEnseignants = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/enseignants/");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEnseignants(data);
      setError(null);
    } catch (err) {
      setError(`Erreur lors de la récupération des enseignants: ${err.message}`);
      toast({
        title: "Erreur",
        description: `Impossible de charger les enseignants: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les enseignants au montage du composant
  useEffect(() => {
    fetchEnseignants();
  }, []);

  // Ajouter un enseignant
  const handleAddEnseignant = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!newEnseignant.nom || !newEnseignant.prenom || !newEnseignant.grade || !newEnseignant.specialite || !newEnseignant.etablissement) {
        toast.error("Champs requis",{
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/enseignants/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEnseignant),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsAddSheetOpen(false);
      setNewEnseignant({ nom: "", prenom: "", grade: "", specialite: "", etablissement: "" });
      await fetchEnseignants();
      
      toast.success("Succès",{
        description: "Enseignant ajouté avec succès",
        action: {
          label: "OK",
          onClick: () => console.log("Action confirmée"),
        },
        duration: 5000,
      });
    } catch (err) {
      toast.error("Erreur",{
        description: `Impossible d'ajouter l'enseignant: ${err.message}`
      });
    }
  };

  // Modifier un enseignant
  const handleEditEnseignant = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!editEnseignant.nom || !editEnseignant.prenom || !editEnseignant.grade || !editEnseignant.specialite || !editEnseignant.etablissement) {
        toast.error("Champs requis", {
          description: "Veuillez remplir tous les champs", 
        });
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/enseignants/${editEnseignant.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editEnseignant),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsEditSheetOpen(false);
      setEditEnseignant({ id: null, nom: "", prenom: "", grade: "", specialite: "", etablissement: "" });
      await fetchEnseignants();
      
      toast("Succès",{
        description: "Enseignant modifié avec succès",
        action: {
          label: "OK",
          onClick: () => console.log("Action confirmée"),
        },
        duration: 5000,
      });
    } catch (err) {
      toast( "Erreur",{
        description: `Impossible de modifier l'enseignant: ${err.message}`
      });
    }
  };

  // Supprimer un enseignant
  const handleDeleteEnseignant = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!enseignantToDelete) return;

      const response = await fetch(`http://127.0.0.1:8000/api/enseignants/${enseignantToDelete}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsDeleteDialogOpen(false);
      setEnseignantToDelete(null);
      await fetchEnseignants();
      
      toast.success("Succès",{
        description: "Enseignant supprimé avec succès",
      });
    } catch (err) {
      toast.error("Erreur",{
        description: `Impossible de supprimer l'enseignant: ${err.message}`,
      });
    }
  };

  // Préparer la suppression
  const prepareDelete = (id, e) => {
    if (e) e.stopPropagation();
    setEnseignantToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Préparer la modification
  const prepareEdit = (enseignant, e) => {
    if (e) e.stopPropagation();
    setEditEnseignant({
      id: enseignant.id,
      nom: enseignant.nom,
      prenom: enseignant.prenom,
      grade: enseignant.grade,
      specialite: enseignant.specialite,
      etablissement: enseignant.etablissement,
    });
    setIsEditSheetOpen(true);
  };

  // Filtrer les enseignants basés sur la recherche
  const filteredEnseignants = enseignants.filter(
    (enseignant) =>
      enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.etablissement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les enseignants pour la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnseignants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);

  // Gérer le changement de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <>
      <div className="mb-2 space-y-1">
        <Toaster richColors  />
        <h1 className="text-2xl font-bold tracking-tight">Enseignant</h1>
        <span className="text-sm font-normal">
          Gérer vos listes d'enseignants
        </span>
      </div>
      <div>
        <div className="flex gap-6 items-center">
          <Input
            type="search"
            placeholder="Rechercher"
            className={cn("rounded-xl")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className={cn("rounded-xl cursor-pointer")} type="button">
                <Plus className="mr-2" /> Ajouter un enseignant
              </Button>
            </SheetTrigger>
            <SheetContent>
              <form onSubmit={handleAddEnseignant}>
                <SheetHeader className="border-b bg-muted">
                  <SheetTitle>Ajouter un enseignant</SheetTitle>
                </SheetHeader>
                <div className="grid gap-6 p-4">
                  <div className="grid items-center gap-3">
                    <Label htmlFor="nom" className="text-right">
                      Nom
                    </Label>
                    <Input 
                      id="nom" 
                      placeholder="Nom" 
                      className="col-span-3" 
                      value={newEnseignant.nom}
                      onChange={(e) => setNewEnseignant({...newEnseignant, nom: e.target.value})}
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="prenom" className="text-right">
                      Prénom
                    </Label>
                    <Input
                      id="prenom"
                      placeholder="Prénom"
                      className="col-span-3"
                      value={newEnseignant.prenom}
                      onChange={(e) => setNewEnseignant({...newEnseignant, prenom: e.target.value})}
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="grade" className="text-right">
                      Grade
                    </Label>
                    <Select
                      value={newEnseignant.grade}
                      onValueChange={(value) => setNewEnseignant({...newEnseignant, grade: value})}
                    >
                      <SelectTrigger className="col-span-3" style={{width: "100%"}}>
                        <SelectValue placeholder="Sélectionner un grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PR">Professeur</SelectItem>
                        <SelectItem value="MC">Maître de conférences</SelectItem>
                        <SelectItem value="DR">Docteur</SelectItem>
                        <SelectItem value="ATER">Attaché temporaire d'enseignement et de recherche</SelectItem>
                        <SelectItem value="VAC">Vacataire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="specialite" className="text-right">
                      Spécialité
                    </Label>
                    <Input
                      id="specialite"
                      placeholder="Spécialité"
                      className="col-span-3"
                      value={newEnseignant.specialite}
                      onChange={(e) => setNewEnseignant({...newEnseignant, specialite: e.target.value})}
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="etablissement" className="text-right">
                      Établissement
                    </Label>
                    <Input
                      id="etablissement"
                      placeholder="Établissement"
                      className="col-span-3"
                      value={newEnseignant.etablissement}
                      onChange={(e) => setNewEnseignant({...newEnseignant, etablissement: e.target.value})}
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
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : error ? (
            <div className="flex justify-center py-8 text-red-500">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">Nom</TableHead>
                  <TableHead className="w-1/6">Prénom</TableHead>
                  <TableHead className="w-1/6">Grade</TableHead>
                  <TableHead className="w-1/6">Spécialité</TableHead>
                  <TableHead className="w-1/6">Établissement</TableHead>
                  <TableHead className="w-1/6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnseignants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Aucun enseignant trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnseignants.map((enseignant) => (
                    <TableRow key={enseignant.id}>
                      <TableCell className="w-1/6">{enseignant.nom}</TableCell>
                      <TableCell className="w-1/6">{enseignant.prenom}</TableCell>
                      <TableCell className="w-1/6">{enseignant.grade}</TableCell>
                      <TableCell className="w-1/6">{enseignant.specialite}</TableCell>
                      <TableCell className="w-1/6">{enseignant.etablissement}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex gap-2">
                          <Sheet open={isEditSheetOpen && editEnseignant.id === enseignant.id} onOpenChange={(open) => {
                            if (!open) setEditEnseignant({ id: null, nom: "", prenom: "", grade: "", specialite: "", etablissement: "" });
                            setIsEditSheetOpen(open);
                          }}>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                type="button"
                                onClick={(e) => prepareEdit(enseignant, e)}
                              >
                                <Pencil className="h-4 w-4 text-blue-500" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <form onSubmit={handleEditEnseignant}>
                                <SheetHeader className="border-b bg-muted">
                                  <SheetTitle>Modifier l'enseignant</SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-6 p-4">
                                  <div className="grid items-center gap-3">
                                    <Label htmlFor="edit-nom" className="text-right">
                                      Nom
                                    </Label>
                                    <Input
                                      id="edit-nom"
                                      value={editEnseignant.nom}
                                      onChange={(e) => setEditEnseignant({...editEnseignant, nom: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid items-center gap-3">
                                    <Label htmlFor="edit-prenom" className="text-right">
                                      Prénom
                                    </Label>
                                    <Input
                                      id="edit-prenom"
                                      value={editEnseignant.prenom}
                                      onChange={(e) => setEditEnseignant({...editEnseignant, prenom: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid items-center gap-3">
                                    <Label htmlFor="edit-grade" className="text-right">
                                      Grade
                                    </Label>
                                    <Select
                                      value={editEnseignant.grade}
                                      onValueChange={(value) => setEditEnseignant({...editEnseignant, grade: value})}
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Sélectionner un grade" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="PR">Professeur</SelectItem>
                                        <SelectItem value="MC">Maître de conférences</SelectItem>
                                        <SelectItem value="DR">Docteur</SelectItem>
                                        <SelectItem value="ATER">Attaché temporaire d'enseignement et de recherche</SelectItem>
                                        <SelectItem value="VAC">Vacataire</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid items-center gap-3">
                                    <Label htmlFor="edit-specialite" className="text-right">
                                      Spécialité
                                    </Label>
                                    <Input
                                      id="edit-specialite"
                                      value={editEnseignant.specialite}
                                      onChange={(e) => setEditEnseignant({...editEnseignant, specialite: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid items-center gap-3">
                                    <Label htmlFor="edit-etablissement" className="text-right">
                                      Établissement
                                    </Label>
                                    <Input
                                      id="edit-etablissement"
                                      value={editEnseignant.etablissement}
                                      onChange={(e) => setEditEnseignant({...editEnseignant, etablissement: e.target.value})}
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
                            type="button"
                            onClick={(e) => prepareDelete(enseignant.id, e)}
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
        </div>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} type="button">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEnseignant} type="button">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}