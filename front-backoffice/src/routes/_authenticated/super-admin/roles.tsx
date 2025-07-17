import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

function RolesManagement() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Roles & Permissions
          </h2>
          <p className='text-muted-foreground'>
            Manage system roles and their associated permissions
          </p>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Role Configuration</CardTitle>
              <CardDescription>
                Define system roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Role management functionality coming soon. Currently, roles and
                permissions are managed through the user management interface.
              </p>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/super-admin/roles')({
  component: RolesManagement,
})
