import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ImageDown } from 'lucide-react';
import axios from 'axios';

export default function EditCandidat() {
  const navigate = useNavigate();
  const { Id, eventNom, candidatId } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [candidat, setCandidat] = React.useState({
    nom: '',
    prenom: '',
    telephone: '',
    description: '',
    photo: null,
    currentPhotoUrl: null
  });

  // Charger les données du candidat au chargement du composant
  React.useEffect(() => {
    const fetchCandidat = async () => {
      try {
        const response = await axios.get(
          `/api/evenements/${Id}/candidats/${candidatId}/`
        );
        
        const candidatData = response.data;
        setCandidat({
          nom: candidatData.nom || '',
          prenom: candidatData.prenom || '',
          telephone: candidatData.telephone || '',
          description: candidatData.description || '',
          photo: null,
          currentPhotoUrl: candidatData.photo || null
        });
        setIsLoading(false);
      } catch (error) {
        toast.error("Erreur lors du chargement du candidat");
        console.error('Erreur lors du chargement du candidat:', error);
        setIsLoading(false);
      }
    };

    fetchCandidat();
  }, [Id, candidatId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field, value) => {
    setCandidat(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonction pour formater automatiquement le numéro de téléphone lors de la saisie
  const handlePhoneInput = (value) => {
    // Supprimer tous les caractères non numériques sauf le +
    let phone = value.replace(/[^\d+]/g, '');
    
    // S'assurer que le numéro commence par +229
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }
    
    if (!phone.startsWith('+229') && phone.length > 1) {
      if (phone.startsWith('+')) {
        phone = '+229' + phone.substring(1);
      } else {
        phone = '+229' + phone;
      }
    }
    
    // Limiter la longueur à +229 (4 caractères) + 10 chiffres = 14 caractères
    if (phone.length > 14) {
      phone = phone.slice(0, 14);
    }
    
    // Mettre à jour le champ
    handleInputChange('telephone', phone);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        toast.error("L'image doit faire moins de 1MB");
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      
      setCandidat(prev => ({
        ...prev,
        photo: { url: imageUrl, file: file }
      }));
    }
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  // Fonction pour valider le format du numéro de téléphone
  const validatePhoneNumber = (phoneNumber) => {
    // Vérifier que le numéro commence par +229 et est suivi de 10 chiffres
    const phoneRegex = /^\+229\s?\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Fonction pour valider le formulaire
  const validateForm = () => {
    const { nom, prenom, telephone } = candidat;
    
    if (!nom.trim()) {
      toast.error("Le nom du candidat est requis");
      return false;
    }
    
    if (!prenom.trim()) {
      toast.error("Le prénom du candidat est requis");
      return false;
    }
    
    if (!telephone.trim()) {
      toast.error("Le numéro de téléphone du candidat est requis");
      return false;
    }
    
    // Validation du format du numéro de téléphone
    if (!validatePhoneNumber(telephone)) {
      toast.error("Le numéro de téléphone doit commencer par +229 suivi de 10 chiffres");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('nom', candidat.nom);
      formData.append('prenom', candidat.prenom);
      formData.append('telephone', candidat.telephone);
      formData.append('description', candidat.description);
      
      if (candidat.photo && candidat.photo.file) {
        formData.append('photo', candidat.photo.file);
      }
      
      await axios.put(
        `http://127.0.0.1:8000/api/evenements/${Id}/candidats/${candidatId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success("Candidat modifié avec succès!");
      navigate(`/dashboard/event/${eventNom}/${Id}/candidats`);
    } catch (error) {
      console.error('Erreur lors de la modification du candidat:', error);
      toast.error("Une erreur est survenue lors de la modification du candidat");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Toaster richColors closeButton position="top-right" />
      <div className="gap-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Modification du candidat</h1>
          <span className="text-sm text-gray-500">
            Modifier les informations du candidat
          </span>
        </div>
        <Button onClick={handleGoBack} variant="outline" className="mb-4">
          <ArrowLeft size={16} />
          Retour
        </Button>
      </div>

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
            Modification d&apos;un candidat
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            Vous pouvez modifier les informations du candidat pour cet événement.
          </p>
        </div>
      </div>

      {/* Formulaire de modification du candidat */}
      <div className="mt-10">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xs">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex gap-6 lg:flex-row flex-col w-full border-2 rounded-xl p-6">
              <div className="grid items-center gap-3 lg:w-1/3 w-full">
                <Label>Photo</Label>
                <div
                  onClick={handleImageClick}
                  className="border-2 border-dashed border-gray-400 rounded-xl h-48 p-4 w-full text-center cursor-pointer hover:border-gray-500 transition-colors flex flex-col items-center justify-center"
                >
                  <div className='flex flex-col items-center gap-2'>
                    {
                      candidat.photo ? (
                        <img 
                          src={candidat.photo.url} 
                          alt="Selected" 
                          className="w-40 h-40 object-cover rounded-lg"
                        />
                      ) : candidat.currentPhotoUrl ? (
                        <img 
                          src={candidat.currentPhotoUrl} 
                          alt="Current" 
                          className="w-40 h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <ImageDown className="w-12 h-12 opacity-50" />
                          <p className="text-sm text-gray-500">Drag & drop or select image to upload</p>
                          <p className="text-xs text-gray-400">(16:9, PNG or JPEG, max 1MB)</p>
                        </>
                      )
                    }
                  </div>
                  <input 
                    type="file" 
                    id="fileInput"
                    className="hidden" 
                    accept="image/png,image/jpeg"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className='lg:w-2/3 w-full flex flex-col gap-4'>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-full">
                  <div className="grid items-center gap-3">
                    <Label>Nom</Label>
                    <Input
                      type="text"
                      value={candidat.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Nom du candidat"
                      className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
                    />
                  </div>
                  <div className="grid items-center gap-3">
                    <Label>Prénom</Label>
                    <Input
                      type="text"
                      value={candidat.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      placeholder="Prénom du candidat"
                      className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
                    />
                  </div>
                </div>
                {/* Numero de téléphone */}
                <div className="grid items-center gap-3">
                  <Label>Numéro de téléphone</Label>
                  <Input
                    type="tel"
                    value={candidat.telephone}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    placeholder="+229 XX XX XX XX XX"
                    className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400 w-full"
                  />
                  <p className="text-xs text-gray-500">Format: +229 suivi de 10 chiffres</p>
                </div>  
                {/* Description */}
                <div className="grid items-center gap-3">
                  <Label>Description</Label>
                  <Textarea
                    value={candidat.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description du candidat"
                    className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400 w-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button 
                type="button"
                variant="outline" 
                className="rounded-xl"
                onClick={handleGoBack}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Modification en cours...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}