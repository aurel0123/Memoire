import * as React from 'react';
import axios from 'axios';
import { useKKiaPay } from 'kkiapay-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CreditCard, Phone, Wallet } from 'lucide-react';
import PropTypes from 'prop-types';

// Schéma de validation pour le formulaire
const voteFormSchema = z.object({
  telephone: z.string()
    .min(8, "Le numéro doit contenir au moins 8 chiffres")
    .max(15, "Le numéro ne doit pas dépasser 15 chiffres")
    .regex(/^\d+$/, "Veuillez saisir un numéro de téléphone valide"),
  nombreVotes: z.string()
    .transform(value => parseInt(value, 10))
    .refine(value => value >= 1, "Le nombre de votes doit être d'au moins 1"),
});

export function VoteModal({ isOpen, onClose, candidat, evenementId, Vote_Cost }) {
  const [step, setStep] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const VOTE_COST = Vote_Cost;

  // Utilisation du hook useKKiaPay
  const { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } = useKKiaPay();

  const form = useForm({
    resolver: zodResolver(voteFormSchema),
    defaultValues: {
      telephone: "",
      nombreVotes: "1",
    },
  });

  // Calcul du montant total
  const nombreVotes = parseInt(form.watch('nombreVotes') || "1", 10);
  const montantTotal = nombreVotes * VOTE_COST;

  // Gestion de changement d'étape
  const handleNextStep = () => {
    form.trigger(['telephone', 'nombreVotes']).then((isValid) => {
      if (isValid) {
        setStep(2);
      }
    });
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  // Réinitialiser le modal lorsqu'il se ferme
  React.useEffect(() => {
    if (!isOpen) {
      setStep(1);
      form.reset();
    }
  }, [isOpen, form]);

  // Gestion des événements KKIAPAY
  React.useEffect(() => {
    const successHandler = async (response) => {
      if (response.status === 'successful') {
        try {
          await axios.patch(
            `api/evenements/${evenementId}/candidats/${candidat?.id}/transactions/${response.transaction_id}/`, 
            { status: 'completed' }
          );
          toast.success('Votre vote a été comptabilisé avec succès!');
          onClose();
          window.location.reload();
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la transaction:', error);
          toast.error('Erreur lors de la mise à jour de la transaction');
        }
      }
      setIsProcessing(false);
    };

    const failureHandler = (error) => {
      console.error('Erreur de paiement:', error);
      toast.error('Le paiement a échoué');
      setIsProcessing(false);
    };

    addKkiapayListener('success', successHandler);
    addKkiapayListener('failed', failureHandler);

    return () => {
      removeKkiapayListener('success', successHandler);
      removeKkiapayListener('failed', failureHandler);
    };
  }, [addKkiapayListener, removeKkiapayListener, evenementId, candidat?.id, onClose]);

  // Fonction pour le paiement KKIAPAY
  const processKkiapayPayment = async (data) => {
    try {
      setIsProcessing(true);
      
      // Création de la transaction
      const transactionResponse = await axios.post(
        `api/evenements/${evenementId}/candidats/${candidat?.id}/transactions/`, 
        {
          montant: montantTotal,
          telephone: data.telephone,
          nombreVotes: data.nombreVotes
        }
      );
      
      const transactionId = transactionResponse.data.transaction_id;
      
      // Utilisation de KKIAPAY
      openKkiapayWidget({
        amount: montantTotal,
        api_key: '804828d0ffde11ef9ad34ba68f43bade',
        sandbox: true,
        phone: data.telephone,
        transaction_id: transactionId,
        callback: 'https://votre-domaine.com/callback',
        return_url: 'https://votre-domaine.com/return',
      });
      
      // Fermer le modal après l'ouverture de KKiaPay
      onClose();
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      toast.error('Erreur lors du traitement du paiement');
      setIsProcessing(false);
    }
  };

  // Fonction pour le paiement par Moov Money
  const processMoovMoneyPayment = async () => {
    toast.info('Paiement par Moov Money à implémenter');
  };

  // Fonction pour le paiement par carte bancaire
  const processCreditCardPayment = async () => {
    toast.info('Paiement par carte bancaire à implémenter');
  };

  // Gestion de la soumission du formulaire
  const onSubmit = async (data, paymentMethod) => {
    switch (paymentMethod) {
      case 'kkiapay':
        await processKkiapayPayment(data);
        break;
      case 'moov':
        await processMoovMoneyPayment();
        break;
      case 'card':
        await processCreditCardPayment();
        break;
      default:
        toast.error('Méthode de paiement non prise en charge');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Voter pour' : 'Choisir le mode de paiement'}
            {step === 1 && candidat && ` ${candidat.prenom} ${candidat.nom}`}
          </DialogTitle>
        </DialogHeader>
        
        {candidat && (
          <>
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <img
                    src={candidat.photo}
                    alt={`${candidat.prenom} ${candidat.nom}`}
                    className="h-24 w-24 object-cover rounded-full"
                  />
                </div>
                
                <Form {...form}>
                  <form className="space-y-4">
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de téléphone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez votre numéro"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nombreVotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de votes</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Combien de votes voulez-vous faire?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem>
                      <FormLabel>Montant total</FormLabel>
                      <FormControl>
                        <Input
                          value={`${montantTotal} CFA`}
                          disabled
                          className="bg-gray-100"
                        />
                      </FormControl>
                    </FormItem>
                  </form>
                </Form>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isProcessing}>
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={isProcessing}
                  >
                    Suivant
                  </Button>
                </DialogFooter>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-500">
                  Voter pour <span className="font-bold">{candidat.prenom} {candidat.nom}</span> 
                  <br />
                  Montant à payer: <span className="font-bold">{montantTotal} CFA</span>
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <Card 
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => onSubmit(form.getValues(), 'kkiapay')}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <Wallet className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-medium">KKIAPAY</h3>
                        <p className="text-sm text-gray-500">Mobile Money ou carte bancaire</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => onSubmit(form.getValues(), 'moov')}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <Phone className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Moov Money</h3>
                        <p className="text-sm text-gray-500">Paiement mobile</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => onSubmit(form.getValues(), 'card')}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Carte bancaire</h3>
                        <p className="text-sm text-gray-500">Visa, Mastercard, etc.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousStep} 
                    disabled={isProcessing}
                  >
                    Précédent
                  </Button>
                </DialogFooter>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

VoteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  candidat: PropTypes.object.isRequired,
  evenementId: PropTypes.string.isRequired,
  Vote_Cost: PropTypes.number.isRequired
};
