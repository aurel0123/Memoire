import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, File, Check, Save, Undo } from 'lucide-react';
import { PvForm } from './composants/PvForm';
import { PvStats } from './composants/PvStats';
import { PvPreview } from './composants/PvPreview';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { PvRecentList } from './composants/PvRecentList';

const PvGeneration = () => {
  const [currentPv, setCurrentPv] = useState({
    studentName: '',
    subject: '',
    date: null,
    time: '',
    room: '',
    juryMembers: [{ name: '', role: 'Président' }],
    summary: '',
    individualNotes: [],
    finalNote: 0,
    status: 'draft',
  });
  
  const [formStep, setFormStep] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Historique des versions pour la fonctionnalité "undo"
  const [pvHistory, setPvHistory] = useState([]);

  const handlePvChange = (updatedPv) => {
    // Sauvegarde l'état actuel dans l'historique
    setPvHistory(prev => [...prev, currentPv]);
    
    // Met à jour le PV actuel
    setCurrentPv(prev => ({
      ...prev,
      ...updatedPv,
      lastUpdated: new Date(),
    }));
  };

  const handleSaveDraft = () => {
    // Simule la sauvegarde d'un brouillon
    toast({
      title: "Brouillon enregistré",
      description: "Votre PV a été sauvegardé en tant que brouillon.",
    });
  };

  const handleSubmit = () => {
    // Simule l'envoi du PV
    setCurrentPv(prev => ({ ...prev, status: 'submitted' }));
    toast("PV envoyé",{
      description: "Le procès-verbal a été soumis avec succès.",
      variant: "default",
    });
  };

  const handleUndo = () => {
    if (pvHistory.length > 0) {
      // Récupère la dernière version de l'historique
      const lastVersion = pvHistory[pvHistory.length - 1];
      setCurrentPv(lastVersion);
      
      // Retire la version utilisée de l'historique
      setPvHistory(prev => prev.slice(0, -1));
      
      toast( "Action annulée",{
        description: "Retour à la version précédente du PV.",
      });
    }
  };

  const handleExportPdf = () => {
    // Simule l'export PDF
    toast("Export PDF",{
      description: "Le PV est en cours d'export au format PDF.",
    });
  };

  return (
      <div className="space-y-6">
        <Toaster richColors position="top-right" />
        {/* En-tête de la page */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Génération de Procès-Verbaux</h1>
          <p className="text-muted-foreground mt-1">
            Créez, modifiez et gérez les procès-verbaux des soutenances.
          </p>
        </div>

        {/* Interface principale */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Partie gauche: Formulaire et actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card shadow-sm rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Édition du PV</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={pvHistory.length === 0}
                  >
                    <Undo className="mr-1 h-4 w-4" />
                    Annuler
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                  >
                    <Save className="mr-1 h-4 w-4" />
                    Enregistrer
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="edit" onClick={() => setIsPreviewMode(false)}>Formulaire</TabsTrigger>
                  <TabsTrigger value="preview" onClick={() => setIsPreviewMode(true)}>Aperçu</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="space-y-4">
                  <PvForm 
                    data={currentPv} 
                    onChange={handlePvChange} 
                    currentStep={formStep}
                    onStepChange={setFormStep}
                  />
                </TabsContent>
                
                <TabsContent value="preview">
                  <PvPreview data={currentPv} />
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={handleExportPdf}>
                  <File className="mr-1 h-4 w-4" />
                  Exporter PDF
                </Button>
                <Button onClick={handleSubmit}>
                  <Check className="mr-1 h-4 w-4" />
                  Valider et envoyer
                </Button>
              </div>
            </div>
            
            {/* Liste des PVs récents */}
            <PvRecentList />
          </div>
          
          {/* Partie droite: Preview, statistiques et timeline */}
          <div className="space-y-6">
            <PvStats />
            
          </div>
        </div>
      </div>
  );
};

export default PvGeneration;
