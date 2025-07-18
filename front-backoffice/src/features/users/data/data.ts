import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
  IconUser,
  IconHeadset,
} from '@tabler/icons-react'
import { UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  ['pending', 'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200'],
  ['rejected', 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const userTypes = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: IconUserShield,
  },
  {
    label: 'Agent',
    value: 'agent',
    icon: IconHeadset,
  },
  {
    label: 'User',
    value: 'user',
    icon: IconUser,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: IconUsersGroup,
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: IconCash,
  },
] as const
