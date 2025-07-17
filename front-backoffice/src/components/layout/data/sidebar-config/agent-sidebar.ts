import {
  IconBrowserCheck,
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconMessages,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
  IconChartDots3,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../../types'

export const agentSidebar: SidebarData = {
  user: {
    name: 'Agent',
    email: 'agent@korpor.com',
    avatar: '/avatars/agent.jpg',
  },
  teams: [
    {
      name: 'Korpor Admin',
      logo: Command,
      plan: 'Agent',
    },
  ],
  navGroups: [
    {
      title: 'Work',
      items: [
        {
          title: 'Agent Dashboard',
          url: '/agent/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Client Management',
          url: '/agent/clients',
          icon: IconUsers,
        },
        {
          title: 'Price Prediction',
          url: '/agent/price-prediction',
          icon: IconChartDots3,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: IconChecklist,
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
