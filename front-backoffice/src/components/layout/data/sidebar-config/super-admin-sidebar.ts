import {
  // IconBarrierBlock,
  IconBrowserCheck, // IconBug,
  IconBuilding,
  IconChecklist, // IconError404,
  IconHelp,
  IconLayoutDashboard, // IconLock,
  // IconLockAccess,
  IconMessages,
  IconNotification,
  IconPalette, // IconServerOff,
  IconSettings,
  IconShieldLock,
  IconTool,
  IconUserCog, // IconUserOff,
  // IconUsers,
  IconUsersGroup,
  IconListDetails,
  IconUserCheck,
  IconChartDots3,
} from '@tabler/icons-react'
import type { SidebarConfig } from '@/types/sidebar'
import { Command } from 'lucide-react'
import { type SidebarData } from '../../types'

export const superAdminSidebar: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@korpor.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'Korpor Admin',
      logo: Command,
      plan: 'Super Admin',
    },
  ],
  navGroups: [
    {
      title: 'Administration',
      items: [
        {
          title: 'Super Admin Dashboard',
          url: '/super-admin/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'User Management',
          icon: IconUsersGroup,
          items: [
            {
              title: 'All Users',
              url: '/super-admin/users#all-users',
              icon: IconListDetails,
            },
            {
              title: 'Pending Approvals',
              url: '/super-admin/users#pending-approval',
              icon: IconUserCheck,
            },
            {
              title: 'Roles & Permissions',
              url: '/super-admin/users#roles-permissions',
              icon: IconShieldLock,
            },
          ],
        },
        {
          title: 'Properties',
          url: '/super-admin/properties',
          icon: IconBuilding,
        },
        {
          title: 'Price Prediction',
          url: '/super-admin/price-prediction',
          icon: IconChartDots3,
        },
        {
          title: 'Blockchain Management',
          url: '/super-admin/blockchain',
          icon: IconShieldLock,
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
    // {
    //   title: 'Pages',
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: IconLockAccess,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/sign-in',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/sign-up',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Errors',
    //       icon: IconBug,
    //       items: [
    //         {
    //           title: 'Unauthorized',
    //           url: '/401',
    //           icon: IconLock,
    //         },
    //         {
    //           title: 'Forbidden',
    //           url: '/403',
    //           icon: IconUserOff,
    //         },
    //         {
    //           title: 'Not Found',
    //           url: '/404',
    //           icon: IconError404,
    //         },
    //         {
    //           title: 'Server Error',
    //           url: '/500',
    //           icon: IconServerOff,
    //         },
    //         {
    //           title: 'Maintenance',
    //           url: '/503',
    //           icon: IconBarrierBlock,
    //         },
    //       ],
    //     },
    //   ],
    // },
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

export const superAdminSidebarConfig: SidebarConfig = {
  items: [
    {
      title: 'Dashboard',
      href: '/super-admin/dashboard',
      icon: IconLayoutDashboard,
      isChidren: false,
    },
    {
      title: 'User Management',
      href: '/super-admin/users',
      icon: IconUsersGroup,
      isChidren: true,
      children: [
        {
          title: 'All Users',
          href: '/super-admin/users#all-users',
          icon: IconListDetails,
          isChidren: false,
        },
        {
          title: 'Pending Approvals',
          href: '/super-admin/users#pending-approval',
          icon: IconUserCheck,
          isChidren: false,
        },
        {
          title: 'Roles & Permissions',
          href: '/super-admin/users#roles-permissions',
          icon: IconShieldLock,
          isChidren: false,
        },
      ],
    },
    {
      title: 'Properties',
      href: '/super-admin/properties',
      icon: IconBuilding,
      isChidren: false,
    },
    {
      title: 'Blockchain Management',
      href: '/super-admin/blockchain',
      icon: IconShieldLock,
      isChidren: false,
    },
    {
      title: 'System Settings',
      href: '/super-admin/settings',
      icon: IconSettings,
      isChidren: false,
    },
  ],
}
