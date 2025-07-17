import React, { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
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
import { Button } from '@/components/ui/button'

// Components
import { Listings } from '../clients/components/listings'
import { Investments } from '../clients/components/Investments'
import { CommissionHistory } from '../clients/components/commission-history'
import { commissionListSchema } from '../clients/data/commision-_schema'
import { commissionsData } from '../clients/data/commisions'
import { CreateListingDialog } from '../clients/components/create-listing-dialog'
import { EarningsChart } from '../clients/components/earnings-chart'
import { DataCollectionDialog } from '../clients/components/data-collection-dialog'
import { WeeklyPerformanceChart } from '../clients/components/weekly-performance-chart'

export default function AgentDashboard() {
  const { user } = useAuthStore((state) => state.auth)

  try {
    const commissions = commissionListSchema.parse(commissionsData)
    console.log('Parsed Commissions:', commissions)

    const [createListingOpen, setCreateListingOpen] = useState(false)
    const [dataCollectionOpen, setDataCollectionOpen] = useState(false)

    return (
      <>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            {/* Moved Submit Market Data Button Here */}
            <Button variant='outline' size='sm' onClick={() => setDataCollectionOpen(true)}>
              Submit Market Data
            </Button>

            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          {/* Page Title */}
          <div className='mb-6'>
            <h2 className='text-2xl font-bold tracking-tight'>Agent Dashboard</h2>
            <p className='text-muted-foreground'>
              Welcome back, {user?.email || 'Agent'}
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-3 mb-8'>
            <Card className='shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>Total Earnings</CardTitle>
                <span className='inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700'>
                  +12%
                </span>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>$78,000</div>
                <p className='text-xs text-muted-foreground'>+12% from last week</p>
              </CardContent>
            </Card>

            <Card className='shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>Deals Closed</CardTitle>
                <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700'>
                  +2
                </span>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>18</div>
                <p className='text-xs text-muted-foreground'>This month</p>
              </CardContent>
            </Card>

            <Card className='shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>New Clients</CardTitle>
                <span className='inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700'>
                  +4
                </span>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>24</div>
                <p className='text-xs text-muted-foreground'>+4 this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Investment Opportunities */}
          <div className='mt-8'>
            <h2 className='text-xl font-semibold mb-4'></h2>
            <Investments />
          </div>

          <div className='mt-8'>
            <h2 className='text-xl font-semibold mb-4'>Weekly Performance</h2>
            <WeeklyPerformanceChart />
          </div>

          {/* Listings Section */}
          <div className='mt-8'>
            <Button size='sm' variant='outline' onClick={() => setCreateListingOpen(true)}>
              Create New Listing
            </Button>
            <CreateListingDialog open={createListingOpen} onOpenChange={setCreateListingOpen} />
          </div>

          {/* Commission History */}
          <div className='mt-8'>
            <h2 className='text-xl font-semibold mb-4'>Commission History</h2>
            <CommissionHistory commissions={commissions} />
          </div>

          <div className='mt-8'>
            <h2 className='text-xl font-semibold mb-4'>Earnings Dashboard</h2>
            <EarningsChart commissions={commissions} />
          </div>
        </Main>

        {/* Modal for Submit Market Data */}
        <DataCollectionDialog open={dataCollectionOpen} onOpenChange={setDataCollectionOpen} />
      </>
    )
  } catch (error) {
    console.error('Error parsing commissions:', error)
    return (
      <div>
        <p>Error loading data. Please try refreshing the page.</p>
      </div>
    )
  }
}