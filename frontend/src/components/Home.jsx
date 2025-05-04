import { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  Users, 
  Bell,
  Home,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  PieChart,
  Clock,
  CheckCircle
} from 'lucide-react';

// Composant principal Dashboard
export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [upcomingDefenses, setUpcomingDefenses] = useState([
    { id: 1, studentName: 'Sophie Martin', title: 'Intelligence Artificielle et Systèmes Autonomes', date: '15 Mai 2025', time: '14:00', room: 'A305', status: 'scheduled' },
    { id: 2, studentName: 'Thomas Dubois', title: 'Optimisation des Algorithmes de Compression', date: '18 Mai 2025', time: '10:30', room: 'B210', status: 'confirmed' },
    { id: 3, studentName: 'Léa Bernard', title: 'Cybersécurité des Objets Connectés', date: '22 Mai 2025', time: '15:45', room: 'C112', status: 'pending' },
    { id: 4, studentName: 'Antoine Richard', title: 'Analyse de Données Massives', date: '25 Mai 2025', time: '09:15', room: 'A201', status: 'scheduled' }
  ]);
  
  const [recentReports, setRecentReports] = useState([
    { id: 101, studentName: 'Julie Lambert', title: 'Interfaces Neuronales', date: '29 Avril 2025', status: 'completed' },
    { id: 102, studentName: 'Nicolas Petit', title: 'Systèmes Distribués', date: '02 Mai 2025', status: 'pending_signature' },
    { id: 103, studentName: 'Marie Durand', title: 'Visualisation de Données', date: '03 Mai 2025', status: 'completed' }
  ]);
  
  const [activeVotes, setActiveVotes] = useState([
    { id: 201, title: 'Attribution des salles', participants: 24, completed: 18, deadline: '10 Mai 2025' },
    { id: 202, title: 'Réorganisation des horaires', participants: 32, completed: 14, deadline: '15 Mai 2025' }
  ]);

  const [stats, setStats] = useState({
    completedDefenses: 28,
    upcomingDefenses: 12,
    pendingReports: 7,
    activeVotes: 2
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Effet pour appliquer le mode sombre au body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Menu items de navigation
  const menuItems = [
    { icon: <Home size={20} />, name: 'Vue d\'ensemble', id: 'overview' },
    { icon: <Calendar size={20} />, name: 'Planning', id: 'calendar' },
    { icon: <FileText size={20} />, name: 'Procès-verbaux', id: 'reports' },
    { icon: <CheckCircle size={20} />, name: 'Votes', id: 'votes' },
    { icon: <Users size={20} />, name: 'Utilisateurs', id: 'users' },
    { icon: <Bell size={20} />, name: 'Notifications', id: 'notifications' }
  ];

  // Fonction pour rendre les sections de contenu
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection 
          stats={stats} 
          upcomingDefenses={upcomingDefenses} 
          recentReports={recentReports}
          activeVotes={activeVotes}
          darkMode={darkMode}
        />;
      case 'calendar':
        return <CalendarSection upcomingDefenses={upcomingDefenses} />;
      case 'reports':
        return <ReportsSection recentReports={recentReports} />;
      case 'votes':
        return <VotesSection activeVotes={activeVotes} />;
      case 'users':
        return <UsersSection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        return <OverviewSection 
          stats={stats} 
          upcomingDefenses={upcomingDefenses} 
          recentReports={recentReports}
          activeVotes={activeVotes}
          darkMode={darkMode}
        />;
    }
  };

  // Classes CSS basées sur le mode (clair/sombre)
  const containerClass = darkMode 
    ? 'bg-slate-900 text-white min-h-screen transition-all duration-300' 
    : 'bg-gray-50 text-slate-800 min-h-screen transition-all duration-300';

  const sidebarClass = darkMode
    ? 'bg-slate-800 border-r border-slate-700 transition-all duration-300'
    : 'bg-white border-r border-gray-200 transition-all duration-300';

  const menuItemClass = (id) => {
    const baseClass = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer';
    const activeClass = darkMode 
      ? 'bg-blue-900/50 text-blue-300' 
      : 'bg-blue-50 text-blue-600';
    const inactiveClass = darkMode 
      ? 'text-gray-300 hover:bg-slate-700' 
      : 'text-gray-600 hover:bg-gray-100';
    
    return `${baseClass} ${id === activeSection ? activeClass : inactiveClass}`;
  };

  return (
    <div className={containerClass}>
      <div className="flex">
        {/* Contenu principal */}
        <div className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Section Vue d'ensemble
function OverviewSection({ stats, upcomingDefenses, recentReports, activeVotes, darkMode }) {
  const cardClass = darkMode 
    ? 'bg-slate-800 border border-slate-700 shadow-lg rounded-xl overflow-hidden transition-all duration-300' 
    : 'bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden transition-all duration-300';

  const headerClass = darkMode
    ? 'bg-slate-700 text-white px-6 py-4 border-b border-slate-600'
    : 'bg-gray-50 text-slate-700 px-6 py-4 border-b border-gray-200';

  const statusColors = {
    scheduled: darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
    confirmed: darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800',
    pending: darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800',
    completed: darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800',
    pending_signature: darkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Calendar size={24} />} 
          title="Soutenances à venir" 
          value={stats.upcomingDefenses} 
          trend="+2 cette semaine"
          trendUp={true}
          color="blue"
          darkMode={darkMode}
        />
        <StatCard 
          icon={<FileText size={24} />} 
          title="PV en attente" 
          value={stats.pendingReports} 
          trend="-3 depuis hier"
          trendUp={false}
          color="cyan"
          darkMode={darkMode}
        />
        <StatCard 
          icon={<PieChart size={24} />} 
          title="Votes actifs" 
          value={stats.activeVotes} 
          trend="Inchangé"
          trendUp={null}
          color="indigo"
          darkMode={darkMode}
        />
        <StatCard 
          icon={<Clock size={24} />} 
          title="Soutenances terminées" 
          value={stats.completedDefenses} 
          trend="+5 ce mois"
          trendUp={true}
          color="violet"
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prochaines soutenances */}
        <div className={cardClass}>
          <div className={headerClass}>
            <h2 className="text-lg font-semibold">Prochaines soutenances</h2>
          </div>
          <div className="p-6 divide-y divide-gray-200 dark:divide-slate-700">
            {upcomingDefenses.slice(0, 3).map((defense) => (
              <div key={defense.id} className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{defense.studentName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{defense.title}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs ${statusColors[defense.status]}`}>
                    {defense.status === 'scheduled' && 'Programmée'}
                    {defense.status === 'confirmed' && 'Confirmée'}
                    {defense.status === 'pending' && 'En attente'}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{defense.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{defense.time}</span>
                  </div>
                  <div>Salle {defense.room}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-3 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center w-full">
              Voir toutes les soutenances
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Rapports récents */}
        <div className={cardClass}>
          <div className={headerClass}>
            <h2 className="text-lg font-semibold">Procès-verbaux récents</h2>
          </div>
          <div className="p-6 divide-y divide-gray-200 dark:divide-slate-700">
            {recentReports.map((report) => (
              <div key={report.id} className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{report.studentName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{report.title}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs ${statusColors[report.status]}`}>
                    {report.status === 'completed' && 'Complété'}
                    {report.status === 'pending_signature' && 'Signature en attente'}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={14} />
                  <span>Généré le {report.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-3 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center w-full">
              Voir tous les PV
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Votes actifs */}
      <div className={cardClass}>
        <div className={headerClass}>
          <h2 className="text-lg font-semibold">Votes en cours</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeVotes.map((vote) => (
            <div key={vote.id} className={`border rounded-lg p-4 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <h3 className="font-medium mb-2">{vote.title}</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Participation</span>
                    <span>{Math.round((vote.completed / vote.participants) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(vote.completed / vote.participants) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{vote.completed}/{vote.participants} réponses</span>
                  <span className="text-orange-500 dark:text-orange-400">Fin: {vote.deadline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant de carte statistique
function StatCard({ icon, title, value, trend, trendUp, color, darkMode }) {
  // Gestion des couleurs selon le thème
  const colorStyles = {
    blue: {
      iconBg: darkMode ? 'bg-blue-900/30' : 'bg-blue-100',
      iconColor: darkMode ? 'text-blue-300' : 'text-blue-600',
      border: darkMode ? 'border-blue-900/30' : 'border-blue-200'
    },
    cyan: {
      iconBg: darkMode ? 'bg-cyan-900/30' : 'bg-cyan-100',
      iconColor: darkMode ? 'text-cyan-300' : 'text-cyan-600',
      border: darkMode ? 'border-cyan-900/30' : 'border-cyan-200'
    },
    indigo: {
      iconBg: darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100',
      iconColor: darkMode ? 'text-indigo-300' : 'text-indigo-600',
      border: darkMode ? 'border-indigo-900/30' : 'border-indigo-200'
    },
    violet: {
      iconBg: darkMode ? 'bg-violet-900/30' : 'bg-violet-100',
      iconColor: darkMode ? 'text-violet-300' : 'text-violet-600',
      border: darkMode ? 'border-violet-900/30' : 'border-violet-200'
    }
  };

  const selectedColor = colorStyles[color] || colorStyles.blue;

  const trendColor = trendUp === null 
    ? 'text-gray-500 dark:text-gray-400' 
    : trendUp 
      ? 'text-green-500 dark:text-green-400' 
      : 'text-red-500 dark:text-red-400';

  return (
    <div className={`p-6 rounded-xl border ${selectedColor.border} ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-3 rounded-lg ${selectedColor.iconBg} ${selectedColor.iconColor}`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-xs ${trendColor}`}>{trend}</div>
      </div>
    </div>
  );
}

// Sections placeholder pour les autres onglets
function CalendarSection({ upcomingDefenses }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Planning des soutenances</h1>
      <p>Interface de calendrier et planification à venir</p>
    </div>
  );
}

function ReportsSection({ recentReports }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion des procès-verbaux</h1>
      <p>Interface de génération et gestion des PV à venir</p>
    </div>
  );
}

function VotesSection({ activeVotes }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Votes en ligne</h1>
      <p>Interface de gestion des votes à venir</p>
    </div>
  );
}

function UsersSection() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
      <p>Interface d'administration des utilisateurs à venir</p>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Centre de notifications</h1>
      <p>Interface de gestion des alertes et rappels à venir</p>
    </div>
  );
}