import {
  IconBrowserCheck,
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
  IconChartDots3,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../../types'

export const adminSidebar: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@korpor.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'Korpor Admin',
      logo: Command,
      plan: 'Admin',
    },
  ],
  navGroups: [
    {
      title: 'Administration',
      items: [
        {
          title: 'Admin Dashboard',
          url: '/admin/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'User Management',
          url: '/admin/users',
          icon: IconUsers,
        },
        {
          title: 'Price Prediction',
          url: '/admin/price-prediction',
          icon: IconChartDots3,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: IconPackages,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
