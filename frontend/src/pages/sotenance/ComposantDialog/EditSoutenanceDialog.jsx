import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import { toast } from "sonner"
import axios from "axios"

export default function EditSoutenanceDialog({ open, onOpenChange, soutenance, onSuccess }) {
  const [date, setDate] = useState(soutenance ? new Date(soutenance.date_soutenance) : null)
  const [time, setTime] = useState(soutenance?.heure_soutenance || "")
  const [salle, setSalle] = useState(soutenance?.salle || "")
  const [directeur, setDirecteur] = useState(soutenance?.directeur || "")
  const [juryMembers, setJuryMembers] = useState(soutenance?.jury_members || [])
  const [enseignants, setEnseignants] = useState([])

  // Synchronisation des champs à chaque changement de soutenance
  useEffect(() => {
    if (soutenance) {
      setDate(soutenance.date_soutenance ? new Date(soutenance.date_soutenance) : null);
      setTime(soutenance.heure_soutenance || "");
      setSalle(soutenance.salle || "");
      setDirecteur(soutenance.directeur || "");
      setJuryMembers(soutenance.jury_members || []);
    }
  }, [soutenance]);

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const response = await axios.get('/api/enseignants')
        if (response.status === 200) {
          setEnseignants(response.data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des enseignants:", error)
      }
    }
    fetchEnseignants()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = {
        date_soutenance: date ? format(date, "yyyy-MM-dd") : soutenance.date_soutenance,
        heure_soutenance: time,
        salle: salle,
        directeur: directeur,
        jury_roles: juryMembers.map(j => ({
          enseignant: Number(j.enseignant?.id || j.enseignant),
          type: j.type
        }))
      }

      const response = await axios.put(`/api/soutenances/${soutenance.id}/`, formData)
      
      if (response.status === 200) {
        toast.success("Succès", {
          description: "Soutenance modifiée avec succès"
        })
        onSuccess?.()
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      toast.error("Erreur", {
        description: `Impossible de modifier la soutenance: ${error.message}`
      })
    }
  }

  const updateJuryMember = (index, field, value) => {
    const newJuryMembers = [...juryMembers]
    if (field === 'enseignant') {
      // On stocke l'ID pour l'envoi, mais on garde l'objet pour l'affichage
      const enseignantObj = enseignants.find(e => e.id.toString() === value)
      newJuryMembers[index] = { ...newJuryMembers[index], enseignant: enseignantObj || value }
    } else {
      newJuryMembers[index] = { ...newJuryMembers[index], [field]: value }
    }
    setJuryMembers(newJuryMembers)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la soutenance</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Sélectionner une date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Heure</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {time || "Sélectionner une heure"}
                    <Clock className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border-none bg-transparent focus:outline-none"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Salle</Label>
              <Input
                value={salle}
                onChange={(e) => setSalle(e.target.value)}
                placeholder="Entrer la salle"
              />
            </div>

            <div className="space-y-2">
              <Label>Directeur</Label>
              <Input
                value={directeur}
                onChange={(e) => setDirecteur(e.target.value)}
                placeholder="Entrer le nom du directeur"
              />
            </div>
          </div>

          {/* Composition du jury */}
          <div className="space-y-4">
            <h3 className="font-semibold">Composition du jury</h3>
            {juryMembers.map((member, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Enseignant</Label>
                  <Select
                    value={member.enseignant?.id?.toString() || member.enseignant?.toString()}
                    onValueChange={(value) => updateJuryMember(index, 'enseignant', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un enseignant" />
                    </SelectTrigger>
                    <SelectContent>
                      {enseignants.map((enseignant) => (
                        <SelectItem key={enseignant.id} value={enseignant.id.toString()}>
                          {enseignant.nom} {enseignant.prenom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Select
                    value={member.type}
                    onValueChange={(value) => updateJuryMember(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRES">Président</SelectItem>
                      <SelectItem value="RAPP">Rapporteur</SelectItem>
                      <SelectItem value="EXAM">Examinateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

EditSoutenanceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  soutenance: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
} 