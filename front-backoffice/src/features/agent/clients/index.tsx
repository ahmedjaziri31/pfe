import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useAuthStore } from '@/stores/authStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ClientStatusChart } from './components/ClientStatusChart'
import { ClientsDialogs } from './components/clients-dialogs'
import { ClientsTable } from './components/clients-table'
import { CrmDialogs } from './components/crm-dialogs'
import { CrmSection } from './components/crm-section'
import { MonthlyClientGrowthChart } from './components/monthly-client-growth-chart'
import { ClientsProvider } from './context/clients-context'
import { clientsData } from './data/clients'
import { clientListSchema } from './data/schema'

export default function AgentClients() {
  const { user } = useAuthStore((state) => state.auth)

  const clients = clientListSchema.parse(clientsData)

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive' | 'pending'
  >('all')
  const [leadCategoryFilter, setLeadCategoryFilter] = useState<
    'all' | 'hot' | 'warm' | 'cold'
  >('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClients = clients.filter((client) => {
    if (statusFilter !== 'all' && client.status !== statusFilter) return false
    if (
      leadCategoryFilter !== 'all' &&
      client.leadCategory !== leadCategoryFilter
    )
      return false
    if (
      !client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  return (
    <ClientsProvider>
      <Header fixed>
        <div className='flex items-center gap-4'>
          <Search />
          <div className='relative w-[250px]'>
            <span className='pointer-events-none absolute left-3 top-2.5 text-muted-foreground'>
              <MagnifyingGlassIcon className='h-4 w-4' />
            </span>
            <Input
              placeholder='Search clients...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='mx-auto w-full max-w-screen-xl px-6 py-8 pt-24'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Client Management
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Manage your assigned clients and CRM details.
          </p>
        </div>

        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card className='h-full shadow-sm'>
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className='p-0 px-4'>
              <ClientStatusChart clients={filteredClients} />
            </CardContent>
          </Card>

          <MonthlyClientGrowthChart clients={filteredClients} />
        </div>

        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-wrap gap-2'>
            <Select onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Filter by Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value: any) => setLeadCategoryFilter(value)}
            >
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Filter by Lead' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Leads</SelectItem>
                <SelectItem value='hot'>Hot</SelectItem>
                <SelectItem value='warm'>Warm</SelectItem>
                <SelectItem value='cold'>Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='w-full'>
          <Card className='mb-8 w-full shadow-sm'>
            <CardHeader>
              <CardTitle className='text-xl'>Assigned Clients</CardTitle>
              <CardDescription>
                Click a row to view CRM details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientsTable data={filteredClients} />
            </CardContent>
          </Card>

          <CrmSection />
        </div>

        <ClientsDialogs />
        <CrmDialogs />
      </Main>
    </ClientsProvider>
  )
}
