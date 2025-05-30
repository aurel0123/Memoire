import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, MoreHorizontal, Edit, File } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PvRecentList() {
  // Données de démonstration pour la liste des PV récents
  const recentPvs = [
    { 
      id: '1', 
      studentName: 'Marie Dupont', 
      subject: 'Intelligence artificielle appliquée à la vision par ordinateur',
      date: new Date(2023, 4, 15),
      status: 'archived',
      finalNote: 18
    },
    { 
      id: '2', 
      studentName: 'Thomas Martin', 
      subject: 'Développement d\'une application mobile pour la gestion de budget',
      date: new Date(2023, 4, 12),
      status: 'signed',
      finalNote: 15
    },
    { 
      id: '3', 
      studentName: 'Sophie Lefevre', 
      subject: 'Optimisation des requêtes dans les bases de données NoSQL',
      date: new Date(2023, 4, 10),
      status: 'submitted',
      finalNote: 16.5
    },
    { 
      id: '4', 
      studentName: 'Lucas Bernard', 
      subject: 'Étude des systèmes distribués pour le calcul haute performance',
      date: new Date(2023, 4, 5),
      status: 'draft',
      finalNote: null
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'archived':
        return <Badge variant="secondary">Archivé</Badge>;
      case 'signed':
        return <Badge className="bg-green-500">Signé</Badge>;
      case 'submitted':
        return <Badge className="bg-amber-500">Soumis</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">PV récents</CardTitle>
          <CardDescription>
            Les derniers procès-verbaux générés
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Voir tous
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPvs.map((pv) => (
            <div key={pv.id} className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-card hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-primary p-2 rounded-full bg-primary/10">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{pv.studentName}</h4>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">{pv.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <time className="text-xs text-muted-foreground">
                      {format(pv.date, 'dd MMM yyyy', { locale: fr })}
                    </time>
                    {getStatusBadge(pv.status)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pv.finalNote !== null && (
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 rounded">
                    {pv.finalNote}/20
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <File className="mr-2 h-4 w-4" />
                      Exporter PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}