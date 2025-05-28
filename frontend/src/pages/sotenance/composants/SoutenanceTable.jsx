import PropTypes from 'prop-types'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Clock, Edit, Eye, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { useRef } from 'react';

export default function SoutenanceTable({
  soutenances ,
  onEdit , 
  onDelete
}) {
  const tableRef = useRef();
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };
  const getStatutColor = (statut) => {
    switch (statut) {
      case 'planifie': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'en_cours': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'termine': return 'bg-green-100 text-green-700 border-green-200';
      case 'reporte': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  

  return (
    <div ref={tableRef}>
      <Card>
        <CardContent className="p-2">
          <div className="overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className=" font-semibold ">Jury</TableHead>
                  <TableHead className=" font-semibold ">Salle</TableHead>
                  <TableHead className=" font-semibold ">Date et heure</TableHead>
                  <TableHead className=" font-semibold ">Étudiant</TableHead>
                  <TableHead className=" font-semibold ">Thème</TableHead>
                  <TableHead className=" font-semibold ">Directeur</TableHead>
                  <TableHead className=" font-semibold ">President</TableHead>
                  <TableHead className=" font-semibold ">Examinateur</TableHead>
                  <TableHead className=" font-semibold ">Rapportteur</TableHead>
                  <TableHead className=" font-semibold ">Statut</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soutenances.map((soutenance , index) => (
                  <TableRow key={soutenance.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      {index = index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        {soutenance.salle}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold space-y-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(soutenance.date_soutenance)}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                          {soutenance.heure_soutenance}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {
                          soutenance.etudiants.map((etudiant , i) => {
                            return (
                              <div key={i}>
                                <div className='font-medium'>
                                  {etudiant.nom} {etudiant.prenom}
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium text-sm leading-tight line-clamp-2">
                          {soutenance.themeMemoire}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {soutenance.directeur}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div>
                          <br />
                            {soutenance.jury_members[0].enseignant.nom}
                          <br />
                          <span className="text-muted-foreground">
                            {soutenance.jury_members[0].enseignant.prenom}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div>
                          <br />
                            {soutenance.jury_members[1].enseignant.nom}
                          <br />
                          <span className="text-muted-foreground">
                            {soutenance.jury_members[1].enseignant.prenom}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div>
                          <br />
                            {soutenance.jury_members[2].enseignant.nom}
                          <br />
                          <span className="text-muted-foreground">
                            {soutenance.jury_members[2].enseignant.prenom}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatutColor(soutenance.statut)}
                      >
                        {soutenance.statut === 'planifie' && 'Planifiée'}
                        {soutenance.statut === 'en_cours' && 'En cours'}
                        {soutenance.statut === 'termine' && 'Terminée'}
                        {soutenance.statut === 'reporte' && 'Reportée'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(soutenance.id)}
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log('View details')}
                          className="h-8 w-8 p-0 hover:bg-green-100"
                        >
                          <Eye className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(soutenance.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

SoutenanceTable.propTypes = {
  soutenances: PropTypes.array.isRequired , 
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}
