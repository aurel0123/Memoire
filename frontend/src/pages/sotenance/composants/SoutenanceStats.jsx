import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import PropTypes from 'prop-types';

export default function SoutenanceStats({
  soutenances 
}) {
  const totalSoutenances = soutenances.length;
  const plannedSoutenances = soutenances.filter(s => s.statut === 'planifie').length;
  const ongoingSoutenances = soutenances.filter(s => s.statut === 'en cours').length;
  const completedSoutenances = soutenances.filter(s => s.statut === 'termine').length;
  const cancelledSoutenances = soutenances.filter(s => s.statut === 'repporte').length;

  const statCards = [
    {
      title: 'Total Soutenances',
      value: totalSoutenances, // Placeholder value, replace with actual data
      icon: Calendar,
      color: 'bg-purple-100 text-purple-700',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'Planifiées',
      value: plannedSoutenances,
      icon: Clock,
      color: 'bg-orange-100 text-orange-700',
      iconBg: 'bg-orange-500'
    },
    {
      title: 'En Cours',
      value: ongoingSoutenances,
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Terminées',
      value: completedSoutenances ,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700',
      iconBg: 'bg-green-500'
    },
    {
      title: 'Reportées',
      value: cancelledSoutenances,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-700',
      iconBg: 'bg-red-500'
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="shadow-sm border-gray-100">
          <CardContent className="">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-xl font-normal text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

SoutenanceStats.propTypes = {
  soutenances: PropTypes.array.isRequired
}