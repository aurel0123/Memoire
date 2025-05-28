import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import PropTypes from "prop-types";
export default function StudentsFilter({
  searchQuery , onSearchChange , selectedLevel , onLevelChange
}) {
  const levels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'licence', label: 'Licence ' },
    { value: 'master', label: 'Master ' },
  ];
  return (
    <div className="mb-4">
      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une filière par nom ou code..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-11"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => onSearchChange('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filtre par niveau */}
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedLevel} onValueChange={onLevelChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem
                      key={level.value}
                      value={level.value}
                      onClick={() => onLevelChange(level.value)}
                    >
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtres actifs */}
          {(searchQuery || selectedLevel !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Filtres actifs:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Recherche: {searchQuery}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onSearchChange('')}
                  />
                </Badge>
              )}
              {selectedLevel !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Niveau: {levels.find(l => l.value === selectedLevel)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onLevelChange('all')}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

StudentsFilter.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedLevel: PropTypes.string.isRequired,
  onLevelChange: PropTypes.func.isRequired,
}