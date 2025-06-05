import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, GraduationCap, Target, User, Users } from "lucide-react";
import PropTypes from "prop-types";
export default function Stats({ dataStudents , dataBinomes ,dataMonomes }) {
  const totalStudents = dataStudents.length

  const totalL3 = dataStudents.filter(l => l.filiere_detail.niveau === "L3").length;
  const totalM2 = dataStudents.filter(l => l.filiere_detail.niveau === "M2").length;

  const stats = [
    {
      title: "Total Étudiants",
      value: totalStudents.toString(),
      subtitle: `${totalL3} L3 + ${totalM2} M2`,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      title: "Binômes L3",
      value: totalBinomes.toString(),
      subtitle: `${totalBinomes * 2} étudiants engagés`,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200"
    },
    {
      title: "Monômes M2",
      value: totalMonomes.toString(),
      subtitle: `${totalMonomes} étudiants individuels`,
      icon: User,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200"
    },
    {
      title: "En Attente",
      value: unassignedStudents.toString(),
      subtitle: `${Math.round((unassignedStudents/totalStudents)*100)}% non assignés`,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200"
    }
  ];
  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${stat.border} bg-gradient-to-br from-white to-gray-50/30`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.bg} border ${stat.border} shadow-sm`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tableau de bord de progression avec distinction binômes/monômes */}
      <Card className="shadow-sm border-blue-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Formation des Équipes par Niveau
            </CardTitle>
            <Badge
              variant="outline"
              className={`${
                assignmentRate >= 80
                  ? "bg-green-50 text-green-700 border-green-200"
                  : assignmentRate >= 60
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {assignmentRate}% assignés
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progression globale */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Étudiants en équipe</span>
              <span className="font-medium">
                {assignedStudents} / {totalStudents}
              </span>
            </div>
            <Progress value={assignmentRate} className="h-3" />
          </div>

          {/* Détails par type d'équipe */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Binômes L3
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-700 mb-1">
                {totalBinomes}
              </div>
              <div className="text-sm text-emerald-600">
                {totalBinomes * 2} étudiants
              </div>
              <div className="text-xs text-emerald-600 mt-1">
                {Math.round(((totalBinomes * 2) / totalL3) * 100)}% des L3
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <User className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Monômes M2
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-700 mb-1">
                {totalMonomes}
              </div>
              <div className="text-sm text-purple-600">
                {totalMonomes} étudiants
              </div>
              <div className="text-xs text-purple-600 mt-1">
                {Math.round((totalMonomes / totalM2) * 100)}% des M2
              </div>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                  En Attente
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-700 mb-1">
                {unassignedStudents}
              </div>
              <div className="text-sm text-amber-600">À assigner</div>
              <div className="text-xs text-amber-600 mt-1">
                Tous niveaux confondus
              </div>
            </div>
          </div>

          {/* Légende explicative */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-blue-700">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Binôme = 2 étudiants de Licence 3</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Monôme = 1 étudiant de Master 2</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

Stats.propTypes = {
  dataStudents: PropTypes.array,
  dataBinomes: PropTypes.array,
  dataMonomes: PropTypes.array
};

