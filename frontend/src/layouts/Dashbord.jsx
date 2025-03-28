import AppSidebar  from "@/components/app-sidebar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import Searchs from "@/components/Search"
import ThemeSwitch from "@/components/theme-switch"
import ProfileDropdown from "@/components/profile-dropdown"
import { Main } from "@/components/main"
import { Outlet } from "react-router-dom"
export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <header
          className="sticky top-0 z-10 flex h-16 items-center gap-2 px-4 bg-white/30 backdrop-blur-md border-b
          dark:bg-gray-900/50 transition-all"
        >
          {/* Conteneur du header */}
          <div className="flex w-full justify-between items-center">
            {/* Bouton Sidebar + Séparateur */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" />
              <Searchs />
            </div>

            {/* Switch de thème et Profil */}
            <div className="flex items-center gap-4">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </header>
        <Main>
          <Outlet/>
        </Main>
      </SidebarInset>
    </SidebarProvider>
  )
}
