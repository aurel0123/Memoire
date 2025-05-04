import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon ,ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import *as React from 'react'; 
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

export default function CreateEvent() {
  const [dateDebut, setDateDebut] = React.useState();
  const [dateFin, setDateFin] = React.useState();
  const [selectedImage, setSelectedImage] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const nomInputRef = React.useRef(null);
  const descriptionInputRef = React.useRef(null);
  const montantInputRef = React.useRef(null);
  const [events, setEvents] = React.useState({});
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  // Utiliser useEffect pour définir l'ID de l'utilisateur une seule fois au montage
  React.useEffect(() => {
    if (user?.id) {
      setEvents(prev => ({...prev, user: user.id}));
    }
  }, [user?.id]); // Se déclenche uniquement quand user.id change

  const handleChange = (event) => {
    const {name, value} = event.target;
    setEvents((prev) => ({...prev, [name]: value}));
  }

  // Gestionnaire pour la date de début
  const handleDateDebutChange = (date) => {
    setDateDebut(date);
    setEvents(prev => ({...prev, date_debut: date}));
  };

  // Gestionnaire pour la date de fin
  const handleDateFinChange = (date) => {
    setDateFin(date);
    setEvents(prev => ({...prev, date_fin: date}));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        toast.error("L'image doit faire moins de 1MB");
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({
        url: imageUrl,
        file: file
      });
      // Mettre à jour l'état events avec le fichier
      setEvents(prev => ({...prev, photo: file}));
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    // Réinitialiser les dates
    setDateDebut(null);
    setDateFin(null);
    
    // Réinitialiser l'image
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Réinitialiser les champs du formulaire
    if (nomInputRef.current) nomInputRef.current.value = '';
    if (descriptionInputRef.current) descriptionInputRef.current.value = '';
    if (montantInputRef.current) montantInputRef.current.value = '';
    
    // Réinitialiser l'état
    setEvents({
      nom: '',
      description: '',
      montant_minimal: '',
      date_debut: null,
      date_fin: null,
      photo: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    if(events.nom && events.date_debut && events.date_fin && events.montant_minimal && events.description && events.photo){
      if(events.date_debut >= events.date_fin){
        toast.error("La date de début ne peut pas être supérieure à la date de fin");
        setIsLoading(false);
        return;
      }

      const eventDataForSubmit = {
        ...events,
        date_debut: new Date(events.date_debut).toISOString(),
        date_fin: new Date(events.date_fin).toISOString()
      };

      const formData = new FormData();
      Object.entries(eventDataForSubmit).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        await axios.post("/api/evenements/", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        
        setTimeout(() => { 
          setIsLoading(false);
          toast.success("L'évènement a été créé avec succès");
          resetForm(); // Réinitialiser le formulaire après le succès
        }, 2000);

        navigate('/dashboard/list-events');
      } catch (error) {
        toast.error("Une erreur est survenue lors de la création de l'évènement", 
          {description : error.message}
        );
        setIsLoading(false);
      }
    } else {
      toast.error("Veuillez remplir tous les champs");
      setIsLoading(false);
    }
  }

  return (
    <section>
      <Toaster richColors closeButton position="top-right" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Créer un évènement
        </h1>
        <span className="text-sm font-normal text-gray-500">Créér vos évènements</span>
      </div>

      {/* Création du formulaire d'évènement */}
      <div className="mt-10">
        <form onSubmit={handleSubmit} className="w-full p-6 border-2 bg-accent rounded-xl">
          <div className="flex flex-col gap-6">
            {/* Input Name */}
            <div className="grid items-center gap-3">
              <Label>Nom</Label>
              <Input
                ref={nomInputRef}
                placeholder="Nom de l'évènement"
                type="text"
                name="nom"
                onChange={handleChange}
                className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
              />
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-full">
              {/* Date Debut */}
              <div className="grid items-center gap-3">
                <Label>Date Début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full text-left font-normal flex justify-between rounded-xl border-gray-400 hover:bg-background",
                        !dateDebut && "text-muted-foreground"
                      )}
                    >
                      {dateDebut ? format(dateDebut, "PPP") : <span>Date Debut</span>}
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateDebut}
                      onSelect={handleDateDebutChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* Date Fin */}
              <div className="grid items-center gap-3">
                <Label>Date Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full text-left font-normal flex justify-between rounded-xl border-gray-400 hover:bg-background",
                        !dateFin && "text-muted-foreground"
                      )}
                    >
                      {dateFin ? format(dateFin, "PPP") : <span>Date Fin</span>}
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFin}
                      onSelect={handleDateFinChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {/* Input Montant minimal */}
            <div className="grid items-center gap-3">
              <Label>Montant minimal</Label>
              <Input
                ref={montantInputRef}
                placeholder="Montant minimal"
                type="number"
                name="montant_minimal"
                onChange={handleChange}
                className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
              />
            </div>
            {/* Description */}
            <div className="grid items-center gap-3">
              <Label>Description</Label>
              <Textarea 
                ref={descriptionInputRef}
                placeholder="Description de l'évènement" 
                name="description"
                onChange={handleChange}
                className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"  
              />
            </div>
            {/* Image Upload */}
            <div className="grid items-center gap-3">
              <Label>Image</Label>
              <div 
                onClick={handleImageClick}
                className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  {selectedImage ? (
                    <img 
                      src={selectedImage.url} 
                      alt="Selected" 
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <ImageDown className="w-12 h-12 opacity-50" />
                      <p className="text-sm text-gray-500">Drag & drop or select image to upload</p>
                      <p className="text-xs text-gray-400">(16:9, PNG or JPEG, max 1MB)</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png,image/jpeg" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-4 rounded-xl cursor-pointer" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer l'évènement"}
          </Button>
        </form>
      </div>
    </section>
  );
}

