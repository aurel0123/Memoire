import SearchInfo from '@/components/SearchInfo'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SheetContent, SheetHeader, SheetTrigger, Sheet, SheetTitle ,SheetFooter, SheetClose } from '@/components/ui/sheet'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '@/components/ui/table'
import { Ellipsis, User, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate , useParams } from 'react-router'
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,} from "@/components/ui/alert-dialog"
import { buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious ,  PaginationEllipsis, } from '@/components/ui/pagination';


export default function GestBinome() {
    const { filiereId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdateForm, setIsOpenUpdateForm] = useState(false) // État pour gérer l'ouverture du formulaire de mise à jour
    const [binomeToDelete , setBinomeToDelete] = useState(null)
    const [isDeleteDialogOpen,setIsDeleteDialogOpen] = useState(false)
    const [etudiants, setEtudiants] = useState([]);
    const [enseignants , setEnseignants] = useState([])
    const [binomeToUpdate, setBinomeToUpdate] = useState(null);
    const [binomes, setBinomes] = useState([]);
    const [filieres, setFilieres] = useState([]) ; 
    const [loading , setLoading] = useState(true)
    const [monomes , setMonomes] = useState([])
    const [isOpenUpdateFormMonome, setIsOpenUpdateFormMonome] = useState(false) 
    const [monomeToUpdate , setMonomeToUpdate] = useState(null)
    const [monomeToDelete , setMonomeToDelete] =useState(null)
    const [isOpenmonome , setIsOpenmonome] = useState(false)
    const [newMonome , setNewMonome] = useState({
        etudiant_matricule :"", 
        maitre_memoire : "", 
        programmation : "", 
        theme : "" 
    })
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
    const handleChangeMonome = (e) => {
        const { name, value } = e.target;
        setNewMonome((prev) => ({ ...prev, [name]: value }));
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
            const res = await axios.get('/api/binomes/');
            
            if (res.status === 200) {
                const filteredBinomes = res.data.filter(binome => 
                    binome.etudiants[0]?.filiere === parseInt(filiereId) ||
                    binome.etudiants[1]?.filiere === parseInt(filiereId)  // Remplacez 8 par l'ID souhaité
                );
                setBinomes(filteredBinomes);  // Stocke uniquement les binômes filtrés
            }
        } catch (error) {
            toast.error("Erreur", {
                description: `Impossible de charger les binômes: ${error.message}`,
            });
            console.log(error.response)
        } finally {
            setLoading(false);
        }
    };
    const fetchMonome = async () => {
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/monomes/')
            if(response.status === 200){
                const filteredMonomes = response.data.filter(monome => 
                    monome.etudiant.filiere === parseInt(filiereId) 
                );
                setMonomes(filteredMonomes)
            }
        }catch(error){
            toast.error("Erreur" , {
                description : `Impossible de charger les monômes : ${error.message}`
            }) ; 
        }finally {
            setLoading(false)
        }
    }
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
            
            const filteredEtudiants = res.data.filter(
                (etudiant) => etudiant.filiere === parseInt(filiereId)
              );
            setEtudiants(filteredEtudiants)
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
     // Récupérer la filière
    const fetchFiliere = async () => {
       try {
         const response = await fetch(`http://127.0.0.1:8000/api/filieres/${filiereId}/`);
         if (!response.ok) {
           throw new Error(`Erreur HTTP: ${response.status}`);
         }
         const data = await response.json();
         
         setFilieres(data);
       } catch (err) {
         toast.error("Erreur", {
           description: `Impossible de charger la filière: ${err.message}`,
         });
       }
    };
   
     /* Rénitialiser le formulaire d'ajout */
    const resetFormadd= () => {
        setNewBinome({
            etudiants_matricules : ["",""], 
            maitre_memoire : "", 
            programmation : "", 
            theme : ""
        })
    }
    const resetFormaddMonome= () => {
        setNewMonome({
            etudiants_matricules :"",
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
        fetchMonome() ; 
    } , [filiereId])
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
                resetFormadd () ; 
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
    const handleSubmitMonome = async (e) => {
        e.preventDefault();
        
        if (!newMonome.theme || !newMonome.etudiant_matricule) {
            toast.error("Erreur", { description: "Veuillez remplir tous les champs" });
            return;
        }
    
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/monomes/", newMonome);
            if (res.status === 201) {
                toast.success("Monôme ajouté avec succès");
                resetFormaddMonome () ; 
                setIsOpenmonome(false)
                fetchMonome(); 
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
    const handleUpdateMonome = async (e) => {
        e.preventDefault();
        
        if (!newMonome.theme || !newMonome.etudiant_matricule ) {
            toast.error("Erreur", { description: "Veuillez remplir tous les champs" });
            return;
        }
        
        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/monomes/${monomeToUpdate}/`, newMonome);
            if (res.status === 200) {
                toast.success("Binôme modifié avec succès");
                resetFormaddMonome() ; 
                setIsOpenUpdateFormMonome(false);
                fetchMonome(); // Rafraîchir la liste
            }
        } catch (error) {
            if (error) {
                const errorDetails = error.response.data.error;
                
                
                toast.error("Erreur d'assignation", {
                    description: errorDetails
                });
            } else {
                toast.error("Erreur inattendue", {
                    description: error.message || "Une erreur est survenue"
                });
            }
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!newBinome.theme || !newBinome.etudiants_matricules ) {
            toast.error("Erreur", { description: "Veuillez remplir tous les champs" });
            return;
        }
        
        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/binomes/${binomeToUpdate}/`, newBinome);
            if (res.status === 200) {
                toast.success("Binôme modifié avec succès");
                resetFormadd() ; 
                setIsOpenUpdateForm(false);
                fetchBinomes(); // Rafraîchir la liste
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data?.code?.includes('STUDENT_ALREADY_ASSIGNED')) {
                const errorDetails = error.response.data.details;
                const firstErrorKey = Object.keys(errorDetails)[0];
                const errorMessage = errorDetails[firstErrorKey];
                
                toast.error("Erreur d'assignation", {
                    description: errorMessage
                });
            } else {
                toast.error("Erreur inattendue", {
                    description: error.response?.data?.message || "Une erreur est survenue"
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
    const handleDeleteMonme = async () => {
        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/monomes/${monomeToDelete}/`);
            if (res.status === 204) {
                toast.success("Binôme supprimé avec succès");
                fetchMonome(); // Rafraîchir la liste
            }
        } catch (error) {
            toast.error("Erreur", {
                description: `Impossible de supprimer le monôme: ${error.message}`,
            });
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const Deletebinome = ()=> (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {filieres?.niveau == "M2" ? "Êtes-vous sûr de vouloir supprimer le Monôme ? Cette action est irréversible."
              : "Êtes-vous sûr de vouloir supprimer le Binôme ? Cette action est irréversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} type="button">
              Annuler
            </AlertDialogCancel>
                <AlertDialogAction
                    onClick={filieres?.niveau === "M2" ? handleDeleteMonme : handleDelete}
                    className={buttonVariants({ variant: "destructive" })}
                >
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
    const prepareDeleteMonome = (id,e)=>{
        if (e) e.stopPropagation();
        setMonomeToDelete(id);
        setIsDeleteDialogOpen(true);
    }
     // Ajout des états pour la pagination
     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 10;
 
     // Calcul des données paginées
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentBinomes = binomes.slice(indexOfFirstItem, indexOfLastItem);
     const totalPages = Math.ceil(binomes.length / itemsPerPage);
 
     // Fonction pour changer de page
     const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
     // Fonction pour aller à la page précédente
     const goToPreviousPage = () => {
         if (currentPage > 1) {
             setCurrentPage(currentPage - 1);
         }
     };
 
     // Fonction pour aller à la page suivante
     const goToNextPage = () => {
         if (currentPage < totalPages) {
             setCurrentPage(currentPage + 1);
         }
     };
    return (
        <div>
            <Toaster richColors />
            <div className='mb-6'>
                <Button variant='outline' onClick={handleGoback}>Retour</Button>
            </div>
            <div className="mb-2 space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Gestion des Binomes</h1>
                <span className="text-sm font-normal">
                    Filière sélectionnée : {filieres?.code}
                </span>
            </div> 
            <div className='flex w-full justify-between gap-4 items-center mb-4'>
                <SearchInfo className="flex-1"/>
                {
                    filieres?.niveau === "M2" ? (
                        <Button onClick={()=>{setIsOpenmonome(true)}}><User/> Créer un Monôme</Button>
                    ) : ( 
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
                                            <Select onValueChange={(value) => {
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
                                                    setNewBinome({ ...newBinome, etudiants_matricules: newStudents });
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
                                                <Button className="w-full" variant="destructive" onClick={() => { resetFormadd() }}>Annuler</Button>
                                            </SheetClose>
                                        </div>
                                    </SheetFooter>
                                </form>
                            </SheetContent>
                        </Sheet>)
                }
            </div>
            <section className=''>
                <div className='w-full mb-8 overflow-hidden rounded-lg shadow-xs border'>
                    <div className='w-full overflow-x-auto'>
                        {
                            filieres?.niveau === "M2" ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nom(s) et Prenom(s)</TableHead>
                                            <TableHead>Theme</TableHead>
                                            <TableHead>Maitre mémoire</TableHead>
                                            <TableHead>Programmation</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            monomes.map((monome) => (
                                                <TableRow key={monome.id}>
                                                    <TableCell  className="flex gap-1.5">
                                                        {monome.etudiant.nom} {monome.etudiant.prenom}
                                                    </TableCell>
                                                    <TableCell>
                                                        {monome.theme}
                                                    </TableCell>
                                                    <TableCell>
                                                    {enseignants.find(e => e.id === monome.maitre_memoire)?.nom || "Non assigné"}
                                                    {enseignants.find(e => e.id === monome.maitre_memoire)?.prenom && " " + enseignants.find(e => e.id === monome.maitre_memoire)?.prenom}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={getStatusBadgeClass(monome.programmation)}>
                                                            {monome.programmation}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <div className='px-2 rounded hover:bg-accent w-fit'>
                                                                    <Ellipsis size={20} />
                                                                </div>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-32">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuGroup>
                                                                    <DropdownMenuItem onClick={() => {
                                                                        setNewMonome({
                                                                            etudiant_matricule: monome.etudiant.matricule,
                                                                            maitre_memoire: monome.maitre_memoire,
                                                                            theme: monome.theme,
                                                                            programmation: monome.programmation
                                                                        });
                                                                        setMonomeToUpdate(monome.id); // Stocker l'ID du binôme à modifier
                                                                        setIsOpenUpdateFormMonome(true);
                                                                    }}>
                                                                        Modifier
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={(e) => prepareDeleteMonome(monome.id, e)}>
                                                                        Supprimer
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuGroup>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            ) :
                                currentBinomes.length > 0 ?
                                    (
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
                                                {currentBinomes.map((binome) => (
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
                                                                            setBinomeToUpdate(binome.id); // Stocker l'ID du binôme à modifier
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
                                    ) : (
                                        <div className='h-20 flex items-center bg-accent justify-center'>
                                            <span className='text-xl uppercase '>Aucun élément créer</span>
                                        </div>
                                    )

                        }
                        
                    </div>
                </div>
                 {/* Ajout de la pagination en bas du tableau */}
                {binomes.length > itemsPerPage && (
                    <div className="w-full flex justify-center items-end">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        className="cursor-pointer"
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <PaginationItem key={number}>
                                        <PaginationLink
                                            className="cursor-pointer"
                                            isActive={number === currentPage}
                                            onClick={() => paginate(number)}
                                        >
                                            {number}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        className="cursor-pointer"
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </section>

            {/* Affichage du formulaire de modification */}
            {isDeleteDialogOpen && <Deletebinome/>}
            {isOpenUpdateFormMonome && (
                <Sheet open={isOpenUpdateFormMonome} onOpenChange={setIsOpenUpdateFormMonome}>
                    <SheetContent className="overflow-y-auto">
                        <SheetHeader className="border-b pb-4 mb-4">
                            <SheetTitle className="text-xl">Modifier le Monôme</SheetTitle>
                        </SheetHeader>

                        <form onSubmit={handleUpdateMonome} className='h-full flex flex-col justify-between'>
                            <div className="grid gap-6 p-4">
                                {/* Étudiant  */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="etudiant1">Étudiant </Label>
                                    <Select
                                       value={newMonome.etudiant_matricule || ""}
                                       onValueChange={(value) => {
                                           const updatedValue = value === "aucun" ? "" : value;
                                           setNewMonome({ ...newMonome, etudiant_matricule: updatedValue });
                                       }}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un étudiant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Option "Aucun" */}
                                            <SelectItem value="aucun">Aucun</SelectItem>
                                            {etudiants.map((etudiant) => (
                                                <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                                                    {etudiant.nom} {etudiant.prenom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Maître de mémoire */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="maitre_memoire">Maître de mémoire</Label>
                                    <Select
                                        value={newMonome.maitre_memoire?.toString() || ""}
                                        onValueChange={(value) => setNewMonome({
                                            ...newMonome,
                                            maitre_memoire: Number(value)
                                        })}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un enseignant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {enseignants.map((enseignant) => (
                                                <SelectItem
                                                    key={enseignant.id}
                                                    value={enseignant.id.toString()}
                                                >
                                                    {enseignant.nom} {enseignant.prenom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Thème */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="theme">Thème</Label>
                                    <Input
                                        id="theme"
                                        name="theme"
                                        value={newMonome.theme}
                                        onChange={handleChangeMonome}
                                        placeholder="Entrez le thème du mémoire"
                                    />
                                </div>

                                {/* Statut */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="programmation">Statut</Label>
                                    <Select
                                        value={newMonome.programmation}
                                        onValueChange={(value) => setNewMonome({
                                            ...newMonome,
                                            programmation: value
                                        })}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="est programmé">Est programmé</SelectItem>
                                            <SelectItem value="non programmé">Non programmé</SelectItem>
                                            <SelectItem value="refus">Refus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Boutons */}
                            <SheetFooter >
                                <div className='flex gap-2 w-fit'>
                                    <Button type="submit" className="w-full">
                                        Modifier
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setIsOpenUpdateFormMonome(false)}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            )}
            {isOpenUpdateForm && (
                <Sheet open={isOpenUpdateForm} onOpenChange={setIsOpenUpdateForm}>
                    <SheetContent className="overflow-y-auto">
                        <SheetHeader className="border-b pb-4 mb-4">
                            <SheetTitle className="text-xl">Modifier le binôme</SheetTitle>
                        </SheetHeader>

                        <form onSubmit={handleUpdate} className='h-full flex flex-col justify-between'>
                            <div className="grid gap-6 p-4">
                                {/* Étudiant 1 */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="etudiant1">Étudiant 1</Label>
                                    <Select
                                        value={newBinome.etudiants_matricules?.[0] || ""}
                                        onValueChange={(value) => {
                                            const newStudents = [...newBinome.etudiants_matricules];
                                            newStudents[0] = value === "aucun" ? "" : value; // Gestion de "Aucun"
                                            setNewBinome({ ...newBinome, etudiants_matricules: newStudents });
                                        }}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un étudiant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Option "Aucun" */}
                                            <SelectItem value="aucun">Aucun</SelectItem>
                                            {etudiants.map((etudiant) => (
                                                <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                                                    {etudiant.nom} {etudiant.prenom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Étudiant 2 */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="etudiant2">Étudiant 2</Label>
                                    <Select
                                        value={newBinome.etudiants_matricules?.[1] || ""}
                                        onValueChange={(value) => {
                                            const newStudents = [...newBinome.etudiants_matricules];
                                            newStudents[1] = value === "aucun" ? "" : value; // Gestion de "Aucun"
                                            setNewBinome({ ...newBinome, etudiants_matricules: newStudents });
                                        }}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un étudiant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Option "Aucun" */}
                                            <SelectItem value="aucun">Aucun</SelectItem>

                                            {/* Liste des étudiants */}
                                            {etudiants.map((etudiant) => (
                                                <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                                                    {etudiant.nom} {etudiant.prenom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Maître de mémoire */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="maitre_memoire">Maître de mémoire</Label>
                                    <Select
                                        value={newBinome.maitre_memoire?.toString() || ""}
                                        onValueChange={(value) => setNewBinome({
                                            ...newBinome,
                                            maitre_memoire: Number(value)
                                        })}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un enseignant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {enseignants.map((enseignant) => (
                                                <SelectItem
                                                    key={enseignant.id}
                                                    value={enseignant.id.toString()}
                                                >
                                                    {enseignant.nom} {enseignant.prenom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Thème */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="theme">Thème</Label>
                                    <Input
                                        id="theme"
                                        name="theme"
                                        value={newBinome.theme|| " "}
                                        onChange={handleChange}
                                        placeholder="Entrez le thème du mémoire"
                                    />
                                </div>

                                {/* Statut */}
                                <div className="grid items-center gap-3">
                                    <Label htmlFor="programmation">Statut</Label>
                                    <Select
                                        value={newBinome.programmation}
                                        onValueChange={(value) => setNewBinome({
                                            ...newBinome,
                                            programmation: value
                                        })}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="est programmé">Est programmé</SelectItem>
                                            <SelectItem value="non programmé">Non programmé</SelectItem>
                                            <SelectItem value="refus">Refus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Boutons */}
                            <SheetFooter >
                                <div className='flex gap-2 w-fit'>
                                    <Button type="submit" className="w-full">
                                        Modifier
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setIsOpenUpdateForm(false)}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            )}
            {isOpenmonome && (
                <Sheet open={isOpenmonome} onOpenChange ={setIsOpenmonome}>
                    <SheetContent className="overflow-y-auto">
                        <SheetHeader className="border-b pb-4 mb-4">
                            <SheetTitle className="text-xl">Créer un monôme</SheetTitle>
                        </SheetHeader>
                        <form action="" className='h-full flex flex-col justify-between' onSubmit={handleSubmitMonome}>
                            <div className="grid gap-6 p-4">
                                <div className="grid items-center gap-3">
                                    <label htmlFor='etudiant'>Etudiant</label>
                                    <Select
                                        onValueChange={(value) => {
                                            setNewMonome({
                                              ...newMonome,
                                              etudiant_matricule: value === "aucun" ? "" : value
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Choisir l'etudiant"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aucun">Aucun</SelectItem>
                                            {
                                                etudiants.map((etudiant) =>(
                                                    <SelectItem key={etudiant.matricule} value={etudiant.matricule}>
                                                        {etudiant.nom} {etudiant.prenom}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='grig items-center gap-3'>
                                    <label htmlFor='theme'>Thème</label>
                                    <Input id="theme" placeholder ="Entrer le thème de recherche" 
                                        value ={newMonome.theme}
                                        onChange = {(e)=>{setNewMonome({...newMonome, theme : e.target.value})}}
                                    />
                                </div>
                                <div className="grid items-center gap-3">
                                    <label>Maitre mémoire</label>
                                    <Select
                                        value={newMonome.maitre_memoire?.toString() || ""} // Conversion explicite en string
                                        onValueChange={(value) => {
                                            setNewMonome({
                                                 ...newMonome,
                                                 maitre_memoire: value === "aucun" ?null: Number(value) // Conversion en number si nécessaire pour l'API
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Sélectionner un maître mémoire">
                                                {/* Affichage dynamique du nom de l'enseignant sélectionné */}
                                                {enseignants.find(e => e.id === newMonome.maitre_memoire)?.nom + " " + enseignants.find(e => e.id === newMonome.maitre_memoire)?.prenom || ""}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aucun">Aucun</SelectItem>
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
                                    <label>Programmation</label>
                                    <Select
                                       onValueChange={(value) => {
                                        setNewMonome({
                                          ...newMonome,
                                          programmation: value 
                                        });
                                    }}
                                    >
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Choisir le status de programmation"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="est programmé">Est programmé</SelectItem>
                                            <SelectItem value="non programmé">Non programmé</SelectItem>
                                            <SelectItem value="refus">Refus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* Boutons */}
                            <SheetFooter >
                                <div className='flex gap-4 w-fit'>
                                    <Button type="submit" className="w-full">
                                        Créer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setIsOpenmonome(false)}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    )
}
