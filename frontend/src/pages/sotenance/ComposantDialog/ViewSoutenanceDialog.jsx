import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import PropTypes from 'prop-types'

export default function ViewSoutenanceDialog({ open, onOpenChange, soutenance }) {
  if (!soutenance) return null;

  // Formatage de l'heure (ex: 10:00:00 => 10h00)
  const formatHeure = (heure) => {
    if (!heure) return '';
    const [h, m] = heure.split(":");
    return `${h}h${m}`;
  };

  // Traduction du statut
  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'planifie': return 'Planifiée';
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminée';
      case 'reporte': return 'Reportée';
      default: return statut;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la soutenance</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pb-2">
          {/* Informations des étudiants */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-base mb-4">Informations des étudiants</h3>
              <div className="space-y-4">
                {soutenance.etudiants.map((etudiant, index) => (
                  <div key={etudiant.matricule} className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nom</p>
                      <p className="font-medium">{etudiant.nom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prénom</p>
                      <p className="font-medium">{etudiant.prenom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Matricule</p>
                      <p className="font-medium">{etudiant.matricule}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Filière</p>
                      <p className="font-medium">{etudiant.filiere_detail?.nom}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informations de la soutenance */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-base mb-4">Informations de la soutenance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Thème</p>
                  <p className="font-medium">{soutenance.themeMemoire}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(soutenance.date_soutenance).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Heure</p>
                  <p className="font-medium">{formatHeure(soutenance.heure_soutenance)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salle</p>
                  <p className="font-medium">{soutenance.salle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="font-medium">{getStatutLabel(soutenance.statut)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Composition du jury */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-base mb-4">Composition du jury</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Directeur</p>
                  <p className="font-medium">{soutenance.directeur}</p>
                </div>
                <Separator />
                {soutenance.jury_members?.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-28">{member.type}</span>
                    <span className="font-medium">{member.enseignant?.nom} {member.enseignant?.prenom}</span>
                    {index < soutenance.jury_members.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

ViewSoutenanceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  soutenance: PropTypes.object
} 