import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { CalendarCheck, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';


// Données fictives
const upcomingDefenses = [
  {
    id: "1",
    studentName: "Sophie Martin",
    title: "Optimisation des algorithmes de traitement d'images médicales",
    date: "2025-05-10",
    time: "09:30",
    status: "pending",
    roomNumber: "A204"
  },
  {
    id: "2",
    studentName: "Lucas Dupont",
    title: "Intégration de l'IA dans les systèmes de recommandation",
    date: "2025-05-12",
    time: "14:00",
    status: "pending",
    roomNumber: "B107"
  },
  {
    id: "3",
    studentName: "Emma Bernard",
    title: "Sécurisation des infrastructures cloud pour les données de santé",
    date: "2025-05-15",
    time: "10:00",
    status: "pending",
    roomNumber: "C301"
  }
];

export function UpcomingDefenses() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Soutenances à venir</CardTitle>
        <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {upcomingDefenses.map((defense) => (
            <div key={defense.id} className="glass-card p-4 rounded-lg animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium line-clamp-2">{defense.title}</h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span>{defense.studentName}</span>
                  </div>
                </div>
                <Badge 
                  variant="secondary"
                  className={cn(
                    "ml-auto",
                    defense.status === 'pending' && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                    defense.status === 'completed' && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                    defense.status === 'canceled' && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  )}
                >
                  {defense.status === 'pending' ? 'À venir' : 
                  defense.status === 'completed' ? 'Terminé' : 'Annulé'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-3 text-sm">
                <div className="flex items-center">
                  <CalendarCheck className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                  <span>
                    {new Date(defense.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' à '}
                    {defense.time}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                  <span>Salle {defense.roomNumber}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl">
                  Voir détails
                </Button>
                <Button variant="default" size="sm" className="text-xs h-8 rounded-xl">
                  Générer PV
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
