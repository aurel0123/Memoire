import React from 'react'
import { StatCard } from './composant/StatCard'
import { Calendar, FileText , Vote , User } from 'lucide-react'
import ChartCard  from './composant/ChartCard'
import { UpcomingDefenses } from './composant/UpcomingDefenses'
import { DefenseCalendar } from './composant/DefenseCalender'
export default function Dashboard() {
  // Données de démonstration pour les graphiques
const defenseData = [
  { name: 'Jan', pv: 5, uv: 3 },
  { name: 'Fév', pv: 3, uv: 4 },
  { name: 'Mar', pv: 8, uv: 6 },
  { name: 'Avr', pv: 7, uv: 5 },
  { name: 'Mai', pv: 12, uv: 9 },
  { name: 'Juin', pv: 0, uv: 0 },
];

const pvStatusData = [
  { name: 'Validés', value: 68 },
  { name: 'En attente', value: 24 },
  { name: 'Brouillons', value: 8 },
];

const juryParticipationData = [
  { name: 'Lun', pv: 6, uv: 8 },
  { name: 'Mar', pv: 8, uv: 7 },
  { name: 'Mer', pv: 10, uv: 9 },
  { name: 'Jeu', pv: 7, uv: 8 },
  { name: 'Ven', pv: 4, uv: 5 },
];
  return (
    <div>
      <div>
        <span className="text-2xl font-bold tracking-tight">
          Tableau de bord
        </span>
        <p className="text-muted-foreground">
          Bienvenue sur la plateforme de gestion des soutenances et PV.
        </p>
      </div>

      {/* Cartes statistique */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <StatCard
          title="Soutenances Mai"
          value="47"
          icon={<Calendar className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="PV générés"
          value="128"
          icon={<FileText className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Votes actifs"
          value="3"
          icon={<Vote className="h-5 w-5" />}
          description="2 votes se terminent aujourd'hui"
        />
        <StatCard
          title="Membres du jury"
          value="24"
          icon={<User className="h-5 w-5" />}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Graphiques de visualisation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
        <ChartCard
          title="Soutenances par mois"
          description="Nombre de soutenances programmées et réalisées"
          type="bar"
          data={defenseData}
          height={250}
        />
        <ChartCard
          title="Participation des membres du jury"
          description="Présence par jour de la semaine"
          type="line"
          data={juryParticipationData}
          height={250}
        />
      </div>

      {/* Contenu Principal */}
      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
        <div className="lg:col-span-2">
          <UpcomingDefenses />
        </div>
        <div>
          <DefenseCalendar />
        </div>
      </div> */}
    </div>
  );
}
