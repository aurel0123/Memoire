import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function PvStats() {
  // Données de démonstration pour les graphiques
  const pvStatusData = [
    { name: 'Validés', value: 68 },
    { name: 'En attente', value: 24 },
    { name: 'Brouillons', value: 8 },
  ];

  const monthlyPvData = [
    { month: 'Jan', count: 12 },
    { month: 'Fév', count: 18 },
    { month: 'Mar', count: 22 },
    { month: 'Avr', count: 15 },
    { month: 'Mai', count: 24 },
    { month: 'Juin', count: 5 },
  ];

  const COLORS = ['#2563eb', '#f59e42', '#6366f1'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">État des PV</CardTitle>
          <CardDescription>Répartition par statut</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pvStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {pvStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">PV générés par mois</CardTitle>
          <CardDescription>6 derniers mois</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyPvData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} PV`} />
              <Legend />
              <Bar dataKey="count" fill="#2563eb" name="PV générés" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}