import  { useEffect , useState } from 'react'
import PropTypes from 'prop-types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users } from 'lucide-react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
export default function StudentsGrid({
  filieres,  
  onViewStudents,
  onFiliereClick
}) {
  const [studentsCountByFiliere, setStudentsCountByFiliere] = useState({})
  const nbrStudents = async () => {
    try {
      const response = await axios.get('/api/etudiants/') ; 
      if (response.status === 200) {
        const counts = {}
        response.data.forEach((student) => {
          const code = student?.filiere_detail?.code
          if (code) {
            counts[code] = (counts[code] || 0) + 1
          }
        })
        setStudentsCountByFiliere(counts)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
    }
  }
  useEffect(() => {
    nbrStudents();
  }, [])
  console.log()
  if (filieres.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Aucune filière trouvée</p>
            <p className="text-sm">Essayez de modifier vos critères de recherche</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        filieres.map((filiere) => {
          const numberOfStudents = studentsCountByFiliere[filiere.code] || 0;
          return(
            <Card key={filiere.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onFiliereClick(filiere.id)}>
              <CardHeader>
                <div className="flex justify-end">
                  <Badge 
                    variant="outline" 
                    className="font-mono text-xs p-1"
                  >
                    {filiere.code}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg font-medium leading-tight mb-2">
                    {filiere.libelle}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium flex items-center justify-start">
                    <Users className="h-4 w-4 inline mr-2 text-muted-foreground" />
                    <div>
                      <span className='text-sm  font-medium text-muted-foreground'>{numberOfStudents} </span>
                      <span className="text-sm text-muted-foreground">
                        {numberOfStudents === 1 ? 'étudiant' : 'étudiants'}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5"
                  >
                    Niveau : {filiere.niveau === 'L3' ? 'Licence' : 'Master'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                {/* Bouton d'action */}
                <Button 
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-colors rounded-xl"
                  variant="outline"
                  onClick = { ()=> onViewStudents(filiere.id) }
                >
                  <span>Voir les étudiants</span>
                  <ArrowRight className="ml-2 h-4 w-4 hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          )
        })
      }
    </div>
  )
}

StudentsGrid.propTypes = {
  filieres: PropTypes.array.isRequired,
  onFiliereClick: PropTypes.func.isRequired, 
  onViewStudents: PropTypes.func.isRequired
}