import { Button } from '@/components/ui/button'
import { Download, Plus, Printer } from 'lucide-react'
import PropTypes from 'prop-types'

export default function SoutenanceHeader({ ViewFormPlanning, onExport, onPrint }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className=""> 
          <h1 className="text-2xl font-bold tracking-tight text-coloor-text">
            Gestion des Plannings de Soutenance
          </h1>
          <p className="text-muted-foreground mt-1">
            Planifiez et gérez les soutenances de mémoire pour tous les niveaux
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          className="hidden md:flex items-center gap-2"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          Exporter
        </Button>
        
        <Button 
          variant="outline" 
          className="hidden md:flex items-center gap-2"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
        
        <Button 
          onClick={() => ViewFormPlanning()}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Planning
        </Button>
      </div>
    </div>
  )
}

SoutenanceHeader.propTypes = {
  ViewFormPlanning: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired
}