import { ChevronRight } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {Link} from 'react-router-dom'

export function NavVote({items}){
  return(
    <SidebarGroup>
      <SidebarGroupLabel>Gestion des Evènements</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item)=>(
          <Collapsible key={item.title} defaultOpen={item.isActive} asChild>
            <SidebarMenuItem >
              {
                item.items ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>  
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton tooltip={item.title}>  
                   {item.icon && <item.icon />}
                   <Link to={item.url}> 
                     <span>{item.title}</span>
                   </Link>
                   
                  </SidebarMenuButton>
               )
              }
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem)=>(
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}