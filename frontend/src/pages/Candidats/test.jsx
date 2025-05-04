import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ImageDown } from 'lucide-react';

export default function AddCandidat() {
  const [openForm, setOpenForm] = React.useState(false);
  const [Cardopen, setCardopen] = React.useState(true);
  const navigate = useNavigate();
  const [candidats, setCandidats] = React.useState([]);
  const [currentCandidat, setCurrentCandidat] = React.useState({
    nom: '',
    prenom: '',
    telephone: '',
    description: '',
    photo: null
  });
  const fileInputRef = React.useRef(null);
  const fileInputRefs = React.useRef({});

  // Synchronisation automatique
  React.useEffect(() => {
    if (currentCandidat.nom || currentCandidat.prenom || currentCandidat.telephone || currentCandidat.description || currentCandidat.photo) {
      setCandidats(prev => {
        // Si c'est le premier candidat
        if (prev.length === 0) {
          return [{ ...currentCandidat, id: Date.now() }];
        }
        // Sinon, mettre à jour le dernier candidat
        const lastIndex = prev.length - 1;
        return prev.map((candidat, index) => 
          index === lastIndex ? { ...currentCandidat, id: candidat.id } : candidat
        );
      });
    }
  }, [currentCandidat]);

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCandidat(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        toast.error("L'image doit faire moins de 1MB");
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setCurrentCandidat(prev => ({
        ...prev,
        photo: {
          url: imageUrl,
          file: file
        }
      }));
    }
  };

  const handleAddCandidat = () => {
    // Ajouter un nouveau candidat vide
    setCandidats(prev => [...prev, { ...currentCandidat, id: Date.now() }]);
    
    // Réinitialiser le formulaire courant
    setCurrentCandidat({
      nom: '',
      prenom: '',
      telephone: '',
      description: '',
      photo: null
    });
  };

  const handleRemoveCandidat = (index) => {
    setCandidats(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveCandidats = () => {
    if (candidats.length === 0) {
      toast.error("Aucun candidat à enregistrer");
      return;
    }
    // TODO: Implémenter la logique de sauvegarde
    console.log("Candidats à sauvegarder:", candidats);
    toast.success("Candidats enregistrés avec succès");
  };

  const handleImageClick = (index = null) => {
    if (index !== null) {
      fileInputRefs.current[index].click();
    } else {
      fileInputRef.current.click();
    }
  };
  

  const handleOpenForm = () => {
    setOpenForm(true);
    setCardopen(false);
  }
  console.log(candidats)
  console.log(currentCandidat)
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

      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 mt-10 flex items-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-3 flex-shrink-0"
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
          <h3 className="font-medium text-indigo-800 dark:text-indigo-300">
            Ajouter des candidats à votre événement
          </h3>
          <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-400">
            Vous pouvez ajouter plusieurs candidats en une seule fois. Chaque
            candidat sera invité à participer à l&apos;événement.
          </p>
        </div>
      </div>

      {/* Formulaire d'ajout des candidats */}
      <div className="mt-10">
        {Cardopen && candidats.length === 0 && (
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
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              Ajouter un candidat
            </button>
          </div>
        )}

        {/* Liste des candidats déjà ajoutés */}
        {candidats.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Candidats ajoutés ({candidats.length})</h2>
            <div className="space-y-4">
              {candidats.map((candidat, index) => (
                <div key={candidat.id || index} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative">
                  <button 
                    onClick={() => handleRemoveCandidat(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="flex gap-6 lg:flex-row flex-col w-full">
                    <div className="grid items-center gap-3 lg:w-1/3 w-full">
                      <Label>Photo</Label>
                      <div
                        onClick={() => handleImageClick(index)}
                        className=" flex justify-center items-center border-2 border-dashed border-gray-400 rounded-xl h-48 p-4 w-full text-center cursor-pointer hover:border-gray-500 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          {candidat.photo ? (
                            <img
                              src={candidat.photo.url}
                              alt="Selected"
                              className="w-40 h-40 object-cover rounded-lg"
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
                          ref={el => fileInputRefs.current[index] = el}
                          className="hidden"
                          accept="image/png,image/jpeg"
                          onChange={(e) => handleImageChange(e, index)}
                        />
                      </div>
                    </div>
                    <div className="lg:w-2/3 w-full flex flex-col gap-4">
                      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-full">
                        <div className="grid items-center gap-3">
                          <Label>Nom</Label>
                          <Input
                            type="text"
                            placeholder="Nom du candidat"
                            className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
                            name="nom"
                            value={candidat.nom}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid items-center gap-3">
                          <Label>Prénom</Label>
                          <Input
                            type="text"
                            placeholder="Prénom du candidat"
                            className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
                            name="prenom"
                            value={candidat.prenom}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      {/* Numero de téléphone */}
                      <div className="grid items-center gap-3">
                        <Label>Numéro de téléphone</Label>
                        <Input
                          type="phone"
                          placeholder="Numéro de téléphone du candidat"
                          className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400 w-full"
                          name="telephone"
                          value={candidat.telephone}
                          onChange={handleInputChange}
                        />
                      </div>
                      {/* Description */}
                      <div className="grid items-center gap-3">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Description du candidat"
                          className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400 w-full"
                          name="description"
                          value={candidat.description}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire pour ajouter un nouveau candidat */}
        {(openForm || candidats.length > 0) && (
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xs">
            <h2 className="text-lg font-medium mb-4">
              {candidats.length > 0 ? "Ajouter un autre candidat" : "Ajouter un candidat"}
            </h2>
            <div className="w-full p-6 border-2 rounded-xl">
              <div className="flex gap-6 lg:flex-row flex-col w-full">
                <div className="grid items-center gap-3 lg:w-1/3 w-full">
                  <Label>Photo</Label>
                  <div
                    onClick={() => handleImageClick()}
                    className="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-xl h-48 p-4 w-full text-center cursor-pointer hover:border-gray-500 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {currentCandidat.photo ? (
                        <img
                          src={currentCandidat.photo.url}
                          alt="Selected"
                          className="w-40 h-40 object-cover rounded-lg"
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
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png,image/jpeg"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="lg:w-2/3 w-full flex flex-col gap-4">
                  <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-full">
                    <div className="grid items-center gap-3">
                      <Label>Nom</Label>
                      <Input
                        type="text"
                        placeholder="Nom du candidat"
                        className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
                        name="nom"
                        value={currentCandidat.nom}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid items-center gap-3">
                      <Label>Prénom</Label>
                      <Input
                        type="text"
                        placeholder="Prénom du candidat"
                        className="col-span-3 border-gray-400 rounded-xl [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400"
                        name="prenom"
                        value={currentCandidat.prenom}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  {/* Numero de téléphone */}
                  <div className="grid items-center gap-3">
                    <Label>Numéro de téléphone</Label>
                    <Input
                      type="phone"
                      placeholder="Numéro de téléphone du candidat"
                      className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400 w-full"
                      name="telephone"
                      value={currentCandidat.telephone}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* Description */}
                  <div className="grid items-center gap-3">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Description du candidat"
                      className="border-gray-400 rounded-xl resize-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-gray-400 w-full"
                      name="description"
                      value={currentCandidat.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-4 lg:flex-row lg:justify-between sm:items-center border-t border-gray-200 pt-4 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl cursor-pointer"
                  onClick={handleAddCandidat}
                >
                  <Plus size={16} />
                  Ajouter un candidat
                </Button>
                <Button
                  className="w-full sm:w-auto rounded-xl cursor-pointer"
                  onClick={handleSaveCandidats}
                >
                  Enregistrer les candidats
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}