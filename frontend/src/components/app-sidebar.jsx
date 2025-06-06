import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  CalendarFold, 
  User,
  UsersRound, 
  FolderTree,
  BookMarked
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "@/components/nav-user"
import { NavVote } from "@/components/nav-vote"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import AuthContext from '@/context/AuthContext';
import { useContext, useState, useMemo } from "react"
import { NavOther } from "./nav-other"

// Configuration des menus par type d'utilisateur
const menuConfig = {
  admin: {
    navMain: [
      {
        title: "Dashboard",
        url: "",
        icon: PieChart,
        isActive: true,
      },
      {
        title: "Attribution Salle",
        url: "planificationSalle",
        icon: CalendarFold,
      },
      {
        title: "Filières",
        url: "filiere",
        icon: User,
        isActive: false,
      },  
      {
        title: "Enseignants", 
        url: "Enseignant",
        icon: BookOpen,
      },
      {
        title: "Etudiants",
        url: "#",
        icon: Bot,
        isActive: true,
        items: [
          {
            title: "Licence & Master", 
            url: "Etudiantlicence",
          },
          {
            title: "Binomes & Monomes",
            url: "listeetudiant",
          },
        ],
      },
      {
        title: "Procès-verbaux",
        url: "pv",
        icon: FolderTree,
        isActive: false,
      },  
      {
        title: "Soutenances",
        url: "soutenance",
        icon: BookMarked,
        isActive: false,
      },
    ],
    navEvents: [
      {
        title: "Evènements",
        url: "",
        icon: CalendarFold,
        isActive: true,
        items: [
          {
            title: "Mes évènements",
            url: "list-events",
          },
          {
            title: "Créer un évènement",
            url: "create-event",
          }
        ]
      },
    ],
    navOther: [
      {
        title: "Utilisateurs",
        url: "users",
        icon: UsersRound,
        isActive: true,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ]
  },
  responsable: {
    navMain: [
      {
        title: "Dashboard",
        url: "",
        icon: PieChart,
        isActive: true,
      },
      {
        title: "Attribution Salle",
        url: "planificationSalle",
        icon: CalendarFold,
      },
      {
        title: "Filières",
        url: "filiere",
        icon: User,
        isActive: false,
      },  
      {
        title: "Enseignants", 
        url: "Enseignant",
        icon: BookOpen,
      },
      {
        title: "Etudiants",
        url: "#",
        icon: Bot,
        isActive: true,
        items: [
          {
            title: "Licence & Master", 
            url: "Etudiantlicence",
          },
          {
            title: "Binomes & Monomes",
            url: "listeetudiant",
          },
        ],
      },
      {
        title: "Procès-verbaux",
        url: "pv",
        icon: FolderTree,
        isActive: false,
      },  
      {
        title: "Soutenances",
        url: "soutenance",
        icon: BookMarked,
        isActive: false,
      },
    ],
    navEvents: [],
    navOther: [
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
        ],
      },
    ]
  },
  organisateur: {
    navMain: [],
    navEvents: [
      {
        title: "Evènements",
        url: "",
        icon: CalendarFold,
        isActive: true,
        items: [
          {
            title: "Mes évènements",
            url: "list-events",
          },
          {
            title: "Créer un évènement",
            url: "create-event",
          }
        ]
      },
    ],
    navOther: [
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
        ],
      },
    ]
  },
  surveillant: {
    navMain: [
      {
        title: "Dashboard",
        url: "",
        icon: PieChart,
        isActive: true,
      },
      {
        title: "Soutenances",
        url: "soutenance",
        icon: BookMarked,
        isActive: false,
      },
    ],
    navEvents: [],
    navOther: [
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
        ],
      },
    ]
  }
};

export default function AppSidebar(props) {
  const { user, logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);

  // Configuration de l'équipe (inchangée)
  const teams = [
    {
      name: "Pigier Bénin",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
      url: "/",
    }
  ];

  // Récupération des menus en fonction du type d'utilisateur
  const userMenus = useMemo(() => {
    const userType = profile?.type_user?.toLowerCase() || 'organisateur';
    return menuConfig[userType] || menuConfig.organisateur;
  }, [profile?.type_user]);

  return (
    <Sidebar collapsible="icon" {...props} variant="">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full rounded-md">
          {userMenus.navMain.length > 0 && <NavMain items={userMenus.navMain} />}
          {userMenus.navEvents.length > 0 && <NavVote items={userMenus.navEvents} />}
          {userMenus.navOther.length > 0 && <NavOther items={userMenus.navOther} />}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} logoutUser={logoutUser}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
