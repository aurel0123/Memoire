import { useParams, useNavigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from 'axios'
import { useEffect, useState, useContext, useRef } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import AuthContext from "@/context/AuthContext";

export default function EditEvent() {
  const [events, setEvents] = useState({});
  const { eventId } = useParams();
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const nomInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const montantInputRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      setEvents(prev => ({ ...prev, user: user.id }));
    }
    fetchevent();
  }, [user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEvents((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateDebutChange = (date) => {
    setDateDebut(date);
    setEvents(prev => ({ ...prev, date_debut: date }));
  };

  const handleDateFinChange = (date) => {
    setDateFin(date);
    setEvents(prev => ({ ...prev, date_fin: date }));
  };

  const resetForm = () => {
    setDateDebut(null);
    setDateFin(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (nomInputRef.current) nomInputRef.current.value = '';
    if (descriptionInputRef.current) descriptionInputRef.current.value = '';
    if (montantInputRef.current) montantInputRef.current.value = '';
    setEvents({
      nom: '',
      description: '',
      montant_minimal: '',
      date_debut: null,
      date_fin: null,
      photo: null
    });
  };

  const fetchevent = async () => {
    try {
      const response = await axios.get(`/api/evenements/${eventId}/`);
      setEvents(response.data);
      setDateDebut(new Date(response.data.date_debut));
      setDateFin(new Date(response.data.date_fin));
      if (response.data.photo) {
        setSelectedImage({
          url: response.data.photo,
          file: null
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement de l'événement");
    }
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
      setEvents(prev => ({ ...prev, photo: file }));
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!events.nom || !events.date_debut || !events.date_fin || !events.montant_minimal || !events.description) {
      toast.error("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    if (events.date_debut >= events.date_fin) {
      toast.error("La date de début ne peut pas être supérieure à la date de fin");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    
    // Ajouter tous les champs sauf la photo
    Object.entries(events).forEach(([key, value]) => {
      if (key !== 'photo' && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Gérer la photo différemment
    if (selectedImage?.file) {
      formData.append('photo', selectedImage.file);
    } else if (selectedImage?.url) {
      // Si c'est une URL existante, ne pas l'envoyer
      // Le backend gardera l'image existante
      delete events.photo;
    }

    // Convertir les dates en ISO
    formData.append('date_debut', new Date(events.date_debut).toISOString());
    formData.append('date_fin', new Date(events.date_fin).toISOString());

    try {
      await axios.put(`/api/evenements/${eventId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      toast.success("L'événement a été modifié avec succès");
      setTimeout(() => {
        navigate("/dashboard/list-events");
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error("Une erreur est survenue lors de la modification de l'événement", {
        description: error.response?.data?.photo?.[0] || error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log(events);
  return (
    <section>
      <Toaster richColors closeButton position="top-right" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Modifier un événement
        </h1>
        <span className="text-sm font-normal">Modifier vos événements</span>
      </div>
      <div className="mt-10">
        <form className="w-full p-6 border-2 bg-accent rounded-xl" onSubmit={handleEdit}>
          <div className="flex flex-col gap-6">
            <div className="grid items-center gap-3">
              <Label>Nom</Label>
              <Input
                placeholder="Nom de l'événement"
                ref={nomInputRef}
                type="text"
                name="nom"
                value={events.nom || ''}
                onChange={handleChange}
                className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
              />
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-full">
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
                    <Calendar mode="single" selected={dateDebut} onSelect={handleDateDebutChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

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
                    <Calendar mode="single" selected={dateFin} onSelect={handleDateFinChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid items-center gap-3">
              <Label>Montant minimal</Label>
              <Input
                placeholder="Montant minimal"
                ref={montantInputRef}
                type="number"
                name="montant_minimal"
                value={events.montant_minimal || ''}
                onChange={handleChange}
                className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
              />
            </div>

            <div className="grid items-center gap-3">
              <Label>Description</Label>
              <Textarea
                placeholder="Description de l'événement"
                name="description"
                value={events.description || ''}
                onChange={handleChange}
                ref={descriptionInputRef}
                className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
              />
            </div>

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
                      <p className="text-sm text-gray-500">
                        Drag & drop or select image to upload
                      </p>
                      <p className="text-xs text-gray-400">
                        (16:9, PNG or JPEG, max 1MB)
                      </p>
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
          <Button type="submit" className="mt-4" disabled={isLoading}>
            {isLoading ? "Modification..." : "Modifier l'événement"}
          </Button>
        </form>
      </div>
    </section>
  );
}
