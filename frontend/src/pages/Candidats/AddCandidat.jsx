import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ImageDown } from 'lucide-react';
import axios from 'axios';

export default function AddCandidat() {
  const [openForm, setOpenForm] = React.useState(false);
  const [Cardopen, setCardopen] = React.useState(true);
  const navigate = useNavigate();
  const {Id , eventNom} = useParams();
  // Nouvel état pour gérer plusieurs formulaires de candidats
  const [candidatForms, setCandidatForms] = React.useState([{ id: 1, nom: '', prenom: '', telephone: '', description: '', photo: null }]);
  // État pour stocker les données finales des candidats
  const [finalCandidats, setFinalCandidats] = React.useState([]);
  // État pour gérer le chargement pendant l'envoi à l'API
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleGoBack = () => {
    navigate(-1)
  }
  
  const handleImageChange = (event, formId) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        toast.error("L'image doit faire moins de 1MB");
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      
      // Mettre à jour l'image pour le formulaire spécifique
      setCandidatForms(prevForms => 
        prevForms.map(form => 
          form.id === formId 
            ? { ...form, photo: { url: imageUrl, file: file } } 
            : form
        )
      );
    }
  };

  const handleImageClick = (refId) => {
    document.getElementById(`fileInput-${refId}`).click();
  };

  const handleOpenForm = () => {
    setOpenForm(true); 
    setCardopen(false); 
  }
  
  // Fonction pour ajouter un nouveau formulaire de candidat
  const addCandidatForm = () => {
    const newId = candidatForms.length > 0 ? Math.max(...candidatForms.map(form => form.id)) + 1 : 1;
    setCandidatForms([...candidatForms, { id: newId, nom: '', prenom: '', telephone: '', description: '', photo: null }]);
  };
  
  // Fonction pour supprimer un formulaire de candidat
  const removeCandidatForm = (formId) => {
    if (candidatForms.length > 1) {
      setCandidatForms(candidatForms.filter(form => form.id !== formId));
    } else {
      toast.error("Vous devez avoir au moins un candidat");
    }
  };
  
  // Fonction pour mettre à jour les champs de formulaire
  const updateFormField = (formId, field, value) => {
    setCandidatForms(prevForms => 
      prevForms.map(form => 
        form.id === formId 
          ? { ...form, [field]: value } 
          : form
      )
    );
  };

  // Fonction pour valider le format du numéro de téléphone
  const validatePhoneNumber = (phoneNumber) => {
    // Vérifier que le numéro commence par +229 et est suivi de 10 chiffres
    const phoneRegex = /^\+229\s?\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };
  
  // Fonction pour valider un formulaire
  const validateForm = (form) => {
    const { nom, prenom, telephone } = form;
    
    if (!nom.trim()) {
      toast.error(`Le nom du candidat est requis`);
      return false;
    }
    
    if (!prenom.trim()) {
      toast.error(`Le prénom du candidat est requis`);
      return false;
    }
    
    if (!telephone.trim()) {
      toast.error(`Le numéro de téléphone du candidat est requis`);
      return false;
    }
    
    // Validation du format du numéro de téléphone
    if (!validatePhoneNumber(telephone)) {
      toast.error(`Le numéro de téléphone doit commencer par +229 suivi de 10 chiffres`);
      return false;
    }
    
    return true;
  };
  
  // Fonction pour envoyer un candidat à l'API
  const sendCandidatToAPI = async (candidat) => {
    try {
      const formData = new FormData();
      formData.append('nom', candidat.nom);
      formData.append('prenom', candidat.prenom);
      formData.append('telephone', candidat.telephone);
      formData.append('description', candidat.description);
      
      if (candidat.photo) {
        formData.append('photo', candidat.photo);
      }
      
      const response = await axios.post(
        `http://127.0.0.1:8000/api/evenements/${Id}/candidats/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du candidat:', error);
      throw error;
    }
  };
  
  // Fonction pour enregistrer tous les candidats
  const handleSaveCandidats = async (e) => {
    e.preventDefault();
    
    // Vérifier que tous les formulaires sont valides
    const allFormsValid = candidatForms.every(validateForm);
    
    if (!allFormsValid) {
      return;
    }
    
    // Mettre à jour l'état pour indiquer que la soumission est en cours
    setIsSubmitting(true);
    
    try {
      // Préparer les données des candidats
      const candidatsData = candidatForms.map(form => ({
        id: form.id,
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone,
        description: form.description,
        photo: form.photo ? form.photo.file : null
      }));
      
      // Stocker les données dans l'état local
      setFinalCandidats(candidatsData);
      
      // Créer un tableau pour stocker les résultats des requêtes API
      const apiResults = [];
      
      // Envoyer chaque candidat à l'API
      const promises = candidatsData.map(async (candidat) => {
        try {
          const result = await sendCandidatToAPI(candidat);
          apiResults.push(result);
          return result;
        } catch (error) {
          toast.error(`Erreur lors de l'enregistrement de ${candidat.prenom} ${candidat.nom}: ${error.message}`);
          throw error;
        }
      });
      
      // Attendre que toutes les promesses soient résolues
      await Promise.all(promises);
      
      // Afficher un message de succès
      toast.success(`${candidatsData.length} candidat(s) enregistré(s) avec succès!`);
      
      // Réinitialiser le formulaire
      setCandidatForms([{ id: 1, nom: '', prenom: '', telephone: '', description: '', photo: null }]);
      
      // Option 1: Rediriger vers la page des candidats
      navigate(`/dashboard/event/${eventNom}/${Id}/candidats`);
      
      // Option 2: Ou rester sur la page avec le formulaire réinitialisé
      // setOpenForm(false);
      // setCardopen(true);
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des candidats:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement des candidats');
    } finally {
      // Mettre à jour l'état pour indiquer que la soumission est terminée
      setIsSubmitting(false);
    }
  };

  // Fonction pour formater automatiquement le numéro de téléphone lors de la saisie
  const handlePhoneInput = (formId, value) => {
    // Supprimer tous les caractères non numériques sauf le +
    let phone = value.replace(/[^\d+]/g, '');
    
    // S'assurer que le numéro commence par +229
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }
    
    if (!phone. startsWith('+229') && phone.length > 1) {
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
    updateFormField(formId, 'telephone', phone);
  };
  
  return (
    <div>
      <Toaster richColors closeButton position="top-right" />
      <div className="gap-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des candidats</h1>
          <span className="text-sm text-gray-500">
            Créer vos candidats pour l&apos;évènement
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
            Ajouter des candidats à votre événement
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            Vous pouvez ajouter plusieurs candidats en une seule fois. Chaque
            candidat sera invité à participer à l&apos;événement.
          </p>
        </div>
      </div>

      {/* Formulaire d'ajout des candidats */}
      <div className="mt-10">
        {Cardopen && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-500 dark:text-gray-400 mt-6">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-4 text-lg font-medium">Aucun candidat ajouté</p>
            <p className="text-sm text-gray-400 mt-1">
              Ajoutez des candidats en cliquant sur le bouton &#34;Ajouter un
              candidat&#34;
            </p>
            <button
              type="button"
              id="addCandidateEmpty"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleOpenForm}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nouveau candidat
            </button>
          </div>
        )}

        {openForm && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xs">
            <form className="w-full" onSubmit={handleSaveCandidats}>
              {candidatForms.map((form, index) => (
                <div key={form.id} className="mb-8">
                  {index > 0 && (
                    <div className="flex justify-end items-center mb-4">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeCandidatForm(form.id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Supprimer ce candidat
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-6 lg:flex-row flex-col w-full border-2 rounded-xl p-6">
                    <div className="grid items-center gap-3 lg:w-1/3 w-full">
                      <Label>Photo</Label>
                      <div
                        onClick={() => handleImageClick(form.id)}
                        className="border-2 border-dashed border-gray-400 rounded-xl h-48 p-4 w-full text-center cursor-pointer hover:border-gray-500 transition-colors flex flex-col items-center justify-center"
                      >
                        <div className='flex flex-col items-center gap-2'>
                          {
                            form.photo ? (
                              <img 
                                src={form.photo.url} 
                                alt="Selected" 
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
                          id={`fileInput-${form.id}`}
                          className="hidden" 
                          accept="image/png,image/jpeg"
                          onChange={(e) => handleImageChange(e, form.id)}
                        />
                      </div>
                    </div>
                    <div className='lg:w-2/3 w-full flex flex-col gap-4'>
                      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-full">
                        <div className="grid items-center gap-3">
                          <Label>Nom</Label>
                          <Input
                            type="text"
                            value={form.nom}
                            onChange={(e) => updateFormField(form.id, 'nom', e.target.value)}
                            placeholder="Nom du candidat"
                            className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
                          />
                        </div>
                        <div className="grid items-center gap-3">
                          <Label>Prénom</Label>
                          <Input
                            type="text"
                            value={form.prenom}
                            onChange={(e) => updateFormField(form.id, 'prenom', e.target.value)}
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
                          value={form.telephone}
                          onChange={(e) => handlePhoneInput(form.id, e.target.value)}
                          placeholder="+229 XX XX XX XX XX"
                          className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400 w-full"
                        />
                        <p className="text-xs text-gray-500">Format: +229 suivi de 10 chiffres</p>
                      </div>  
                      {/* Description */}
                      <div className="grid items-center gap-3">
                        <Label>Description</Label>
                        <Textarea
                          value={form.description}
                          onChange={(e) => updateFormField(form.id, 'description', e.target.value)}
                          placeholder="Description du candidat"
                          className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400 w-full"
                        />
                      </div>
                    </div>
                  </div>
                  {index < candidatForms.length - 1 && <hr className="my-8 border-gray-200 dark:border-gray-700" />}
                </div>
              ))}
              <div className="flex flex-col gap-4 mt-4 lg:flex-row lg:justify-between sm:items-center border-t border-gray-200 pt-4 dark:border-gray-700">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full sm:w-auto rounded-xl cursor-pointer"
                  onClick={addCandidatForm}
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter un candidat
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto rounded-xl cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    "Enregistrer les candidats"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}