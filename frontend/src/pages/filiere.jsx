import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, AlertCircle} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Filiere() {
  const [filieres, setFilieres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFiliere, setNewFiliere] = useState({ code: "", libelle: "", niveau: "L3" });
  const [editFiliere, setEditFiliere] = useState({ id: null, code: "", libelle: "", niveau: "L3" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filiereToDelete, setFiliereToDelete] = useState(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // Récupérer les filières depuis l'API
  const fetchFilieres = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/filieres/");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setFilieres(data);
      setError(null);
    } catch (err) {
      setError(`Erreur lors de la récupération des filières: ${err.message}`);
      toast({
        title: "Erreur",
        description: `Impossible de charger les filières: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les filières au montage du composant
  useEffect(() => {
    fetchFilieres();
  }, []);

  // Ajouter une filière
  const handleAddFiliere = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!newFiliere.code || !newFiliere.libelle || !newFiliere.niveau) {
        toast.error("Champs requis", {
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/filieres/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFiliere),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsAddSheetOpen(false);
      setNewFiliere({ code: "", libelle: "", niveau: "L3" });
      await fetchFilieres();
      
      toast.success("Succès", {
        description: "Filière ajoutée avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible d'ajouter la filière: ${err.message}`,
      });
    }
  };

  // Modifier une filière
  const handleEditFiliere = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!editFiliere.code || !editFiliere.libelle || !editFiliere.niveau) {
        toast.error("Champs requis", {
          description: "Veuillez remplir tous les champs",
        });
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/filieres/${editFiliere.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: editFiliere.code,
          libelle: editFiliere.libelle,
          niveau: editFiliere.niveau,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsEditSheetOpen(false);
      setEditFiliere({ id: null, code: "", libelle: "", niveau: "L3" });
      await fetchFilieres();
      
      toast.success("Succès", {
        description: "Filière modifiée avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de modifier la filière: ${err.message}`,
      });
    }
  };

  // Supprimer une filière
  const handleDeleteFiliere = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!filiereToDelete) return;

      const response = await fetch(`http://127.0.0.1:8000/api/filieres/${filiereToDelete}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setIsDeleteDialogOpen(false);
      setFiliereToDelete(null);
      await fetchFilieres();
      
      toast.success("Succès", {
        description: "Filière supprimée avec succès",
      });
    } catch (err) {
      toast.error("Erreur", {
        description: `Impossible de supprimer la filière: ${err.message}`,
      });
    }
  };

  // Préparer la suppression
  const prepareDelete = (id, e) => {
    if (e) e.stopPropagation();
    setFiliereToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Préparer la modification
  const prepareEdit = (filiere, e) => {
    if (e) e.stopPropagation();
    setEditFiliere({
      id: filiere.id,
      code: filiere.code,
      libelle: filiere.libelle,
      niveau: filiere.niveau,
    });
    setIsEditSheetOpen(true);
  };

  // Filtrer les filières basées sur la recherche
  const filteredFilieres = filieres.filter(
    (filiere) =>
      filiere.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filiere.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="mb-2 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Filière</h1>
        <span className="text-sm font-normal">
          Gérer vos listes de filières
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
                <Plus className="mr-2" /> Ajouter une filière
              </Button>
            </SheetTrigger>
            <SheetContent>
              <form onSubmit={handleAddFiliere}>
                <SheetHeader className="border-b bg-muted">
                  <SheetTitle>Ajouter une filière</SheetTitle>
                </SheetHeader>
                <div className="grid gap-6 p-4">
                  <div className="grid items-center gap-3">
                    <Label htmlFor="code" className="text-right">
                      Code
                    </Label>
                    <Input 
                      id="code" 
                      placeholder="CIB" 
                      className="col-span-3" 
                      value={newFiliere.code}
                      onChange={(e) => setNewFiliere({...newFiliere, code: e.target.value})}
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="libelle" className="text-right">
                      Libellé
                    </Label>
                    <Input
                      id="libelle"
                      placeholder="Commerce International Banc"
                      className="col-span-3"
                      value={newFiliere.libelle}
                      onChange={(e) => setNewFiliere({...newFiliere, libelle: e.target.value})}
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label htmlFor="niveau" className="text-right">
                      Niveau
                    </Label>
                    <Select
                      value={newFiliere.niveau}
                      onValueChange={(value) => setNewFiliere({...newFiliere, niveau: value})}
                    >
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L3">Licence 3</SelectItem>
                        <SelectItem value="M2">Master 2</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <TableHead className="w-2/5">Code</TableHead>
                  <TableHead className="w-2/5">Libellé</TableHead>
                  <TableHead className="w-1/5">Niveau</TableHead>
                  <TableHead className="w-1/5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFilieres.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Aucune filière trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFilieres.map((filiere) => (
                    <TableRow key={filiere.id}>
                      <TableCell className="w-2/5">{filiere.code}</TableCell>
                      <TableCell className="w-2/5">{filiere.libelle}</TableCell>
                      <TableCell className="w-1/5">
                        {filiere.niveau === "L3" ? "Licence 3" : "Master 2"}
                      </TableCell>
                      <TableCell className="w-1/5">
                        <div className="flex gap-2">
                          <Sheet open={isEditSheetOpen && editFiliere.id === filiere.id} onOpenChange={(open) => {
                            if (!open) setEditFiliere({ id: null, code: "", libelle: "", niveau: "L3" });
                            setIsEditSheetOpen(open);
                          }}>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                type="button"
                                onClick={(e) => prepareEdit(filiere, e)}
                              >
                                <Pencil className="h-4 w-4 text-blue-500" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <form onSubmit={handleEditFiliere}>
                                <SheetHeader className="border-b bg-muted">
                                  <SheetTitle>Modifier la filière</SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-6 p-4">
                                  <div className="grid items-center gap-3">
                                    <Label htmlFor="edit-code" className="text-right">
                                      Code
                                    </Label>
                                    <Input
                                      id="edit-code"
                                      value={editFiliere.code}
                                      onChange={(e) => setEditFiliere({...editFiliere, code: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid items-center gap-3">
                                    <Label htmlFor="edit-libelle" className="text-right">
                                      Libellé
                                    </Label>
                                    <Input
                                      id="edit-libelle"
                                      value={editFiliere.libelle}
                                      onChange={(e) => setEditFiliere({...editFiliere, libelle: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid items-center gap-3">
                                    <Label htmlFor="edit-niveau" className="text-right">
                                      Niveau
                                    </Label>
                                    <Select
                                      value={editFiliere.niveau}
                                      onValueChange={(value) => setEditFiliere({...editFiliere, niveau: value})}
                                    >
                                      <SelectTrigger className="col-span-3 w-full">
                                        <SelectValue placeholder="Sélectionner un niveau" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="L3">Licence 3</SelectItem>
                                        <SelectItem value="M2">Master 2</SelectItem>
                                      </SelectContent>
                                    </Select>
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
                            onClick={(e) => prepareDelete(filiere.id, e)}
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
              Êtes-vous sûr de vouloir supprimer cette filière ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} type="button">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFiliere} type="button">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}