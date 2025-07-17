import { type SidebarData } from '../../types'
import { adminSidebar } from './admin-sidebar'
import { agentSidebar } from './agent-sidebar'
import { superAdminSidebar } from './super-admin-sidebar'
import { userSidebar } from './user-sidebar'

// Role-based navigation configurations
export const sidebarConfigs: Record<string, SidebarData> = {
  superadmin: superAdminSidebar,
  admin: adminSidebar,
  agent: agentSidebar,
  user: userSidebar,
  // Default fallback is the regular user sidebar
  default: userSidebar,
}

// Helper function to get the correct sidebar config based on user role
export const getSidebarConfig = (roles: string[] = []): SidebarData => {
  // Check for roles in priority order (superadmin > admin > agent > user)
  if (roles.includes('superadmin')) return sidebarConfigs.superadmin
  if (roles.includes('admin')) return sidebarConfigs.admin
  if (roles.includes('agent')) return sidebarConfigs.agent
  if (roles.includes('user')) return sidebarConfigs.user

  // Default fallback
  return sidebarConfigs.default
}
