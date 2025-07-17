import {
  Users,
  Home,
  Settings,
  Building,
  Database,
  UserCheck,
  MessagesSquare,
  DollarSign,
  ShieldCheck,
  Buildings,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { getSidebarConfig } from './data/sidebar-config'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get the user's role from auth store
  const { user } = useAuthStore((state) => state.auth)

  // Get the appropriate sidebar configuration based on user role
  const sidebarData = getSidebarConfig(user?.role || [])

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
