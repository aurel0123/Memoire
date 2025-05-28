import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Calendar, GraduationCap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from 'prop-types';

export default function SoutenanceFilter({
  filieres,
  filters,
  setFilters
}) {
  const statuts = [
    { value: 'planifie', label: 'Planifiée', color: 'bg-orange-100 text-orange-700' },
    { value: 'en_cours', label: 'En cours', color: 'bg-blue-100 text-blue-700' },
    { value: 'termine', label: 'Terminée', color: 'bg-green-100 text-green-700' },
    { value: 'reporte', label: 'Reportée', color: 'bg-red-100 text-red-700' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value === "all" ? "" : value
    }));
  };

  return (
    <Card className="shadow-sm border-purple-100">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              name="nom"
              placeholder="Rechercher par nom, matricule, directeur..."
              className="pl-12 h-12 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-100"
              value={filters.nom || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            
            <Select 
              value={filters.filiere || "all"}
              onValueChange={(value) => handleSelectChange("filiere", value)}
            >
              <SelectTrigger className="w-48 h-12 bg-white border-gray-200">
                <SelectValue placeholder="Filière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les filières</SelectItem>
                {filieres.map((filiere) => (
                  <SelectItem key={filiere.code} value={filiere.id.toString()}>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {filiere.libelle}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.statut || "all"}
              onValueChange={(value) => handleSelectChange("statut", value)}
            >
              <SelectTrigger className="w-40 h-12 bg-white border-gray-200">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statuts.map((statut) => (
                  <SelectItem key={statut.value} value={statut.value}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {statut.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

SoutenanceFilter.propTypes = {
  filieres: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired
};