import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  CalendarFold, 
  User,
  UsersRound , 
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
import { useContext , useState} from "react"
import { NavOther } from "./nav-other"

// This is sample data.
const data = {
  teams: [
    {
      name: "Pigier Bénin",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
      url: "/",
    }
  ],
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
          //url: "FilieresList",
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
      items : [
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
  NavOther: [
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
    
  ],
}

export default function AppSidebar(props) {
  const { user , logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);



  return (
    <Sidebar collapsible="icon" {...props} variant="">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Ajout du ScrollArea ici pour que seul le contenu central défile */}
        <ScrollArea className="h-full rounded-md">
          <NavMain items={data.navMain} />
          <NavVote items={data.navEvents} />
          <NavOther items={data.NavOther} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} logoutUser = {logoutUser}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
