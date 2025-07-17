import type { TablerIconsProps } from '@tabler/icons-react'

export interface SidebarNavItem {
  title: string
  href: string // Allow full URLs including hashes
  icon?: (props: TablerIconsProps) => JSX.Element // Match Tabler icon type
  isChidren?: boolean
  children?: SidebarNavItem[]
  badge?: string
  disabled?: boolean
}

export interface SidebarConfig {
  items: SidebarNavItem[]
}
