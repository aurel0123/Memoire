import SearchInfo from '@/components/SearchInfo'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SheetContent, SheetHeader, SheetTrigger, Sheet, SheetTitle ,SheetFooter, SheetClose } from '@/components/ui/sheet'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '@/components/ui/table'
import { Ellipsis, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,} from "@/components/ui/alert-dialog"
import { buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";


export default function GestBinome() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdateForm, setIsOpenUpdateForm] = useState(false) // État pour gérer l'ouverture du formulaire de mise à jour
    const [binomeToDelete , setBinomeToDelete] = useState(null)
    const [isDeleteDialogOpen,setIsDeleteDialogOpen] = useState(false)
    const [etudiants, setEtudiants] = useState([]);
    const [enseignants , setEnseignants] = useState([])
    const [binomes, setBinomes] = useState([]);
    const [filieres, setFilieres] = useState([])
    const [newBinome , setNewBinome] = useState({
        etudiants_matricules: ["", ""], // Initialiser avec deux chaînes vides
        maitre_memoire: "",
        programmation: "", 
        theme: ""   
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBinome((prev) => ({ ...prev, [name]: value }));
    };
    const handleSelectChange = (name, value) => {
        setNewBinome((prev) => ({ ...prev, [name]: value }));
    };
    const navigate = useNavigate()
    const handleGoback = () => {
        navigate(-1)
    }
    const fetchBinomes = async () => {
        try {
          const res = await axios.get('http://127.0.0.1:8000/api/binomes/');
          if (res.status === 200) {
            setBinomes(res.data);
          }
        } catch (error) {
          toast.error("Erreur", {
            description: `Impossible de charger les binômes: ${error.message}`,
          });
        }
    };
    const getStatusBadgeClass = (statut) => {
        switch (statut) {
            case 'est programmé':
                return 'bg-green-100 text-green-800 p-1 text-center rounded-xs px-2';
            case 'non programmé':
                return 'bg-yellow-100 text-yellow-800 p-1 text-center rounded-xs px-2';
            case 'refus':
                return 'bg-red-100 text-red-800 p-1 text-center rounded-xs px-2';
            default:
                return 'bg-gray-100 text-gray-800 p-1 text-center rounded-xs px-2';
        }
    };
    const fetchEtudiants = async ()=> {
        try{
            const res = await axios.get('http://127.0.0.1:8000/api/etudiants/')
            if(res.statusText === "OK") setEtudiants(res.data) ; 
        }catch(error){
            console.error(error)
            toast.error("Erreur", {
                description: `Impossible de charger les étudiants: ${error.message}`,
            });
        }
    }
    const fetchEnseignants = async ()=> {
        try{
            const res = await axios.get('http://127.0.0.1:8000/api/enseignants/')
            if(res.statusText) setEnseignants(res.data) ; 
        }catch(error){
            toast.error("Erreur", {
                description: `Impossible de charger les enseignants: ${error.message}`,
            });
        }
    }
    const fetchFiliere= async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/filieres/')
            if (res.status == 200) setFilieres(res.data)
        } catch (error) {
            console.error(error)
            toast.error ("Erreur" , {
                description : `Impossible de charger les filière : ${error.message}` 
            })
        }
    }
     /* Rénitialiser le formulaire d'ajout */
    const resetFormadd= () => {
        setNewBinome({
            etudiants_matricules : [], 
            maitre_memoire : "", 
            programmation : "", 
            theme : ""
        })
    }
    useEffect(()=> {
        fetchEtudiants() ; 
        fetchEnseignants() ; 
        fetchFiliere() ; 
        fetchBinomes() ; 
    } , [])
    console.log(newBinome)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newBinome.theme || !newBinome.etudiants_matricules || newBinome.etudiants_matricules.length < 2) {
            toast.error("Erreur", { description: "Veuillez remplir tous les champs" });
            return;
        }
    
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/binomes/", newBinome);
            if (res.status === 201) {
                toast.success("Binôme ajouté avec succès");
                resetFormadd ()
                setIsOpen(false)
                fetchBinomes(); 
                //setIsOpenUpdateForm(false); 
            }
        } catch (error) {
            // Vérifie si c'est une erreur de type STUDENT_ALREADY_ASSIGNED
            if (error.response?.data?.code?.includes('STUDENT_ALREADY_ASSIGNED')) {
                 // Extrait le premier message d'erreur disponible
                const errorDetails = error.response.data.details;
                const firstErrorKey = Object.keys(errorDetails)[0];
                const errorMessage = errorDetails[firstErrorKey];
                
                toast.error("Erreur d'assignation", {
                    description: errorMessage // Affiche le message spécifique
                });
            }else{
                 // Gestion des autres erreurs
                    toast.error("Erreur inattendue", {
                        description: error.response?.data?.error || "Une erreur est survenue"
                    });
            }
        }
    };
    const handleDelete = async () => {
        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/binomes/${binomeToDelete}/`);
            if (res.status === 204) {
                toast.success("Binôme supprimé avec succès");
                fetchBinomes(); // Rafraîchir la liste
            }
        } catch (error) {
            toast.error("Erreur", {
                description: `Impossible de supprimer le binôme: ${error.message}`,
            });
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };
    
 
    /* Formulaire de Modification */
    const UpdateForm = () => (
        <Sheet open={isOpenUpdateForm} onOpenChange={() => setIsOpenUpdateForm(!isOpenUpdateForm)}>
            <SheetContent>
                <SheetHeader cclassName="border-b bg-muted">
                    <SheetTitle className="text-xl">Modification du binôme</SheetTitle>
                </SheetHeader>
                <form action="">
                    <div className="grid gap-6 p-4">
                        <div className="grid items-center gap-3">
                            <Label htmlFor="Etudiant 1" className="text-right">
                                Etudiant 1
                            </Label>
                            <Select onValueChange={(value) => handleSelectChange("etudiants_matricules", [value, newBinome.etudiants_matricules?.[1]])}>
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Selectionner un etudiant" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    {
                                        etudiants.map((etudiant) => (
                                            <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                                                {etudiant.nom} {etudiant.prenom}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid items-center gap-3">
                            <Label htmlFor="Etudiant 2" className="text-right">
                                Etudiant 2
                            </Label>
                            <Select onValueChange={(value) => handleSelectChange("etudiants_matricules", [newBinome.etudiants_matricules?.[0], value])}>
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Selectionner un etudiant" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    {
                                        etudiants.map((etudiant) => (
                                            <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                                                {etudiant.nom} {etudiant.prenom}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid items-center gap-3">
                            <Label htmlFor="maitre memoire" className="text-right">
                                Maitre memoire
                            </Label>
                            <Select
                                value={newBinome.maitre_memoire?.toString() || ""} // Conversion explicite en string
                                onValueChange={(value) => {
                                    setNewBinome({
                                        ...newBinome,
                                        maitre_memoire: Number(value) // Conversion en number si nécessaire pour l'API
                                    });
                                }}
                            >
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Sélectionner un maître mémoire">
                                        {/* Affichage dynamique du nom de l'enseignant sélectionné */}
                                        {enseignants.find(e => e.id === newBinome.maitre_memoire)?.nom + " " + enseignants.find(e => e.id === newBinome.maitre_memoire)?.prenom || ""}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {enseignants.map((enseignant) => (
                                        <SelectItem
                                            key={enseignant.id}
                                            value={enseignant.id.toString()} // Conversion forcée en string
                                        >
                                            {enseignant.nom} {enseignant.prenom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid items-center gap-3">
                            <Label htmlFor="theme" className="text-right">
                                Thème du binôme
                            </Label>
                            <Input id="theme" className="col-span-3" placeholder="Enter le thème du binôme"
                                value={newBinome.theme || ""}
                                name="theme"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid items-center gap-3">
                            <Label htmlFor="programmation" className="text-right">
                                Programmation du binôme
                            </Label>
                            <Select defaultValue="est programmé" onValueChange={(value) => handleSelectChange('programmation', value)}>
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Selectionner une option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="est programmé">Est programmé</SelectItem>
                                    <SelectItem value="non programmé">Non programmé</SelectItem>
                                    <SelectItem value="refus">Refus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <SheetFooter >
                        <div className='flex gap-2 w-fit'>
                            <Button type="submit" className="w-full">Modifier</Button>
                            <SheetClose asChild>
                                <Button className="w-full" variant="destructive">Fermer</Button>
                            </SheetClose>
                        </div>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )

    const Deletebinome = ()=> (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le Binôme ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} type="button">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })}  >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
    const prepareDelete = (id,e)=>{
        if (e) e.stopPropagation();
        setBinomeToDelete(id);
        setIsDeleteDialogOpen(true);
    }
    console.log(newBinome)
    return (
        <div>
            <Toaster richColors />
            <div className='mb-6'>
                <Button variant='outline' onClick={handleGoback}>Retour</Button>
            </div>
            <div className="mb-2 space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Gestion des Binomes</h1>
                <span className="text-sm font-normal">Créer , modifier , supprimer le Binome par filières</span>
            </div> 
            <div className='flex w-full justify-between gap-4 items-center mb-4'>
                <SearchInfo className="flex-1"/>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button className='flex'>
                            <Users className='mr-2' /> Créer un binôme
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader className="border-b bg-muted">
                            <SheetTitle className="text-xl">Créer un binome</SheetTitle>
                        </SheetHeader>
                        <form onSubmit={handleSubmit} className='h-full flex flex-col justify-between'>
                            <div className="grid gap-6 p-4">
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="Etudiant 1" className="text-right">
                                        Etudiant 1
                                    </Label>
                                    <Select  onValueChange={(value) => {
                                        const newStudents = [...newBinome.etudiants_matricules];
                                        newStudents[0] = value;
                                        setNewBinome({ ...newBinome, etudiants_matricules: newStudents });
                                        }}
                                        value={newBinome.etudiants_matricules?.[0] || ""}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Selectionner un etudiant" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {
                                                etudiants.map((etudiant) => (
                                                    <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                                                        {etudiant.nom} {etudiant.prenom}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="Etudiant 2" className="text-right">
                                        Etudiant 2
                                    </Label>
                                    <Select 
                                        onValueChange={(value) => {
                                            const newStudents = [...newBinome.etudiants_matricules];
                                            newStudents[1] = value;
                                            setNewBinome({...newBinome, etudiants_matricules: newStudents});
                                        }}
                                        value={newBinome.etudiants_matricules?.[1] || ""}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Selectionner un etudiant" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {
                                                etudiants.map((etudiant) => (
                                                    <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                                                        {etudiant.nom} {etudiant.prenom}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="maitre memoire" className="text-right">
                                        Maitre memoire
                                    </Label>
                                    <Select
                                        value={newBinome.maitre_memoire?.toString() || ""} // Conversion explicite en string
                                        onValueChange={(value) => {
                                            setNewBinome({
                                                ...newBinome,
                                                maitre_memoire: Number(value) // Conversion en number si nécessaire pour l'API
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un maître mémoire">
                                                {/* Affichage dynamique du nom de l'enseignant sélectionné */}
                                                {enseignants.find(e => e.id === newBinome.maitre_memoire)?.nom + " " + enseignants.find(e => e.id === newBinome.maitre_memoire)?.prenom || ""}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {enseignants.map((enseignant) => (
                                                <SelectItem
                                                    key={enseignant.id}
                                                    value={enseignant.id.toString()} // Conversion forcée en string
                                                >
                                                    {enseignant.nom} {enseignant.prenom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="theme" className="text-right">
                                        Thème du binôme
                                    </Label>
                                    <Input id="theme" className="col-span-3" placeholder="Enter le thème du binôme"
                                        value={newBinome.theme || ""}
                                        name="theme"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="programmation" className="text-right">
                                        Programmation du binôme
                                    </Label>
                                    <Select onValueChange={(value) => handleSelectChange('programmation', value)}>
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Selectionner une option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="est programmé">Est programmé</SelectItem>
                                            <SelectItem value="non programmé">Non programmé</SelectItem>
                                            <SelectItem value="refus">Refus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <SheetFooter >
                                <div className='flex gap-2 w-fit'>
                                    <Button type="submit" className="w-full">Ajouter</Button>
                                    <SheetClose asChild>
                                        <Button className="w-full" variant="destructive">Fermer</Button>
                                    </SheetClose>
                                </div>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
            <section className=''>
                <div className='w-full mb-8 overflow-hidden rounded-lg shadow-xs border'>
                    <div className='w-full overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom(s) et Prenom(s)</TableHead>
                                    <TableHead>Theme</TableHead>
                                    <TableHead>Maitre mémoire</TableHead>
                                    <TableHead>Programmation</TableHead>
                                    <TableHead className=""></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {binomes.map((binome) => (
                                    <TableRow key={binome.id}>
                                        <TableCell className="flex gap-1.5">
                                            {binome.etudiants.map((etudiant, index) => (
                                                <span key={etudiant.matricule}>
                                                    {etudiant.nom} {etudiant.prenom}
                                                    {index < binome.etudiants.length - 1 ? " | " : ""}
                                                </span>
                                            ))}
                                        </TableCell>
                                        <TableCell>{binome.theme}</TableCell>
                                        <TableCell>
                                            {enseignants.find(e => e.id === binome.maitre_memoire)?.nom || "Non assigné"}
                                            {enseignants.find(e => e.id === binome.maitre_memoire)?.prenom && " " + enseignants.find(e => e.id === binome.maitre_memoire)?.prenom}
                                        </TableCell>
                                        <TableCell>
                                            <span className={getStatusBadgeClass(binome.programmation)}>
                                                {binome.programmation}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className='flex items-center justify-center'>
                                                    <div className='px-2 rounded hover:bg-accent w-fit'>
                                                        <Ellipsis size={24} />
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-32">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem onClick={() => {
                                                            setNewBinome({
                                                                etudiants_matricules: binome.etudiants.map(e => e.matricule),
                                                                maitre_memoire: binome.maitre_memoire,
                                                                theme: binome.theme,
                                                                programmation: binome.programmation
                                                            });
                                                            setIsOpenUpdateForm(true);
                                                        }}>
                                                            Modifier
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => prepareDelete(binome.id, e)}>
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </section>

            {/* Affichage du formulaire de modification */}
            {isOpenUpdateForm && <UpdateForm />}
            {isDeleteDialogOpen && <Deletebinome/>}
        </div>
    )
}
