import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { createFileRoute } from '@tanstack/react-router'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  BarChart3,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useAuthStore } from '@/stores/authStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TokenDebugger } from '@/components/debug/token-debugger'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export const Route = createFileRoute('/_authenticated/super-admin/dashboard')({
  component: SuperAdminDashboard,
})

// Direct API endpoint for health check
const HEALTH_CHECK_API = import.meta.env.VITE_API_URL?.replace('/api', '') + '/db-health' || 'http://localhost:5000/db-health'

// Health check data type
interface HealthData {
  status: string
  database: string
  timestamp: string
  message: string
  dbName: string
  tables: {
    name: string
    rows: number | string
    error?: string
  }[]
  tableCount: number
  error?: string
  connectionType?: string
  host?: string
  instanceName?: string
}

// Enhanced placeholder stats
const placeholderStats = {
  totalUsers: 1250,
  newUsersToday: 15,
  usersChangePercent: 1.2, // e.g., 1.2% increase from yesterday
  activeSessions: 78,
  pendingApprovals: 3,
  systemIssues: 1,
  totalInvestments: 575000,
  investmentChangePercent: 5.3, // e.g. 5.3% increase from last month
  totalPlatformEarnings: 75200,
  earningsChangePercent: 2.1, // e.g. 2.1% increase from last month
  totalAgencies: 25,
  topPerformingAgent: { name: 'Jane Doe', deals: 12 },
}

const monthlyInvestmentData = [
  { name: 'Jan', investment: 4000 },
  { name: 'Feb', investment: 3000 },
  { name: 'Mar', investment: 5000 },
  { name: 'Apr', investment: 4500 },
  { name: 'May', investment: 6000 },
  { name: 'Jun', investment: 5500 },
]

const earningsBreakdownData = [
  { name: 'Property Fees', value: 40000 },
  { name: 'Transaction Fees', value: 25000 },
  { name: 'Subscription Fees', value: 10200 },
]
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const agencyPerformanceData = [
  { name: 'Alpha Agency', earnings: 12000, agents: 15 },
  { name: 'Beta Group', earnings: 9500, agents: 10 },
  { name: 'Gamma Realty', earnings: 15000, agents: 22 },
  { name: 'Delta Partners', earnings: 7000, agents: 8 },
]

function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [loadingHealth, setLoadingHealth] = useState(false)
  const [healthError, setHealthError] = useState<string | null>(null)
  const accessToken = useAuthStore((state) => state.auth.accessToken)

  const fetchHealthData = useCallback(async () => {
    if (activeTab !== 'system') return

    setLoadingHealth(true)
    setHealthError(null)
    try {
      const response = await axios.get(HEALTH_CHECK_API)
      setHealthData(response.data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch health data'
      setHealthError(errorMessage)
      setHealthData(null)
    } finally {
      setLoadingHealth(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchHealthData()
  }, [fetchHealthData])

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A'

    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleString()
    } catch (_) {
      return 'Invalid Date'
    }
  }

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main fixed className='flex flex-col pt-20'>
        <div className='mb-4 px-4 lg:px-8'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Super Admin Dashboard
          </h1>
        </div>

        <div className='flex-grow overflow-auto px-4 lg:px-8'>
          <Tabs
            defaultValue='overview'
            value={activeTab}
            onValueChange={setActiveTab}
            className='h-full'
          >
            <TabsList className='mb-4'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='system'>System Health</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='mt-0 space-y-6'>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Total Users
                    </CardTitle>
                    <Users className='h-5 w-5 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {placeholderStats.totalUsers.toLocaleString()}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      +{placeholderStats.newUsersToday} today (
                      {placeholderStats.usersChangePercent > 0 ? '+' : ''}
                      {placeholderStats.usersChangePercent}%)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Active Sessions
                    </CardTitle>
                    <BarChart3 className='h-5 w-5 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {placeholderStats.activeSessions}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Currently online users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Pending Approvals
                    </CardTitle>
                    <Users className='h-5 w-5 text-orange-500' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {placeholderStats.pendingApprovals}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      User registrations awaiting review
                    </p>
                  </CardContent>
                  <CardFooter>
                    <a
                      href='/super-admin/users#all-users&status=pending&status=unverified'
                      className='flex items-center text-xs text-primary hover:underline'
                    >
                      View List <ArrowRight className='ml-1 h-3 w-3' />
                    </a>
                  </CardFooter>
                </Card>

                <Card
                  className={
                    placeholderStats.systemIssues > 0
                      ? 'border-destructive shadow-lg shadow-destructive/20'
                      : 'border-green-500'
                  }
                >
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      System Status
                    </CardTitle>
                    <ShieldAlert
                      className={`h-5 w-5 ${placeholderStats.systemIssues > 0 ? 'text-destructive' : 'text-green-500'}`}
                    />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${placeholderStats.systemIssues > 0 ? 'text-destructive' : 'text-green-600'}`}
                    >
                      {placeholderStats.systemIssues > 0
                        ? `${placeholderStats.systemIssues} Issue(s)`
                        : 'Operational'}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {placeholderStats.systemIssues > 0
                        ? 'Critical alerts needing attention'
                        : 'All systems running smoothly'}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant='link'
                      size='sm'
                      className='h-auto p-0 text-xs text-primary'
                      onClick={() => setActiveTab('system')}
                    >
                      Check System Health{' '}
                      <ArrowRight className='ml-1 h-3 w-3' />
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                <Card className='lg:col-span-1'>
                  <CardHeader>
                    <CardTitle>Total Investments</CardTitle>
                    <CardDescription>
                      Cumulative value of all investments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold'>
                      ${placeholderStats.totalInvestments.toLocaleString()}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {placeholderStats.investmentChangePercent > 0 ? '+' : ''}
                      {placeholderStats.investmentChangePercent}% from last
                      month
                    </p>
                  </CardContent>
                </Card>

                <Card className='lg:col-span-1'>
                  <CardHeader>
                    <CardTitle>Platform Earnings</CardTitle>
                    <CardDescription>Total revenue generated.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold'>
                      ${placeholderStats.totalPlatformEarnings.toLocaleString()}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {placeholderStats.earningsChangePercent > 0 ? '+' : ''}
                      {placeholderStats.earningsChangePercent}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className='lg:col-span-1'>
                  <CardHeader>
                    <CardTitle>Earnings Breakdown</CardTitle>
                    <CardDescription>Revenue sources.</CardDescription>
                  </CardHeader>
                  <CardContent className='h-[200px] w-full pt-2'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart>
                        <Pie
                          data={earningsBreakdownData}
                          dataKey='value'
                          nameKey='name'
                          cx='50%'
                          cy='50%'
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          labelLine={false}
                          label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            percent,
                            index,
                          }) => {
                            const RADIAN = Math.PI / 180
                            const radius =
                              innerRadius + (outerRadius - innerRadius) * 0.5
                            const x = cx + radius * Math.cos(-midAngle * RADIAN)
                            const y = cy + radius * Math.sin(-midAngle * RADIAN)
                            return (
                              <text
                                x={x}
                                y={y}
                                fill='white'
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline='central'
                                fontSize={10}
                              >
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            )
                          }}
                        >
                          {earningsBreakdownData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                              strokeWidth={0}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            `$${value.toLocaleString()}`,
                            name,
                          ]}
                        />
                        <Legend
                          iconSize={10}
                          wrapperStyle={{ fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <Card className='xl:col-span-1'>
                  <CardHeader>
                    <CardTitle>Investment Trends</CardTitle>
                    <CardDescription>
                      Monthly investment volume over the last 6 months.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='h-[300px] w-full pr-6'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart
                        data={monthlyInvestmentData}
                        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray='3 3'
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey='name'
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `$${value.toLocaleString()}`,
                            'Investment',
                          ]}
                        />
                        <Legend verticalAlign='top' height={36} />
                        <Line
                          type='monotone'
                          dataKey='investment'
                          stroke='hsl(var(--primary))'
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className='xl:col-span-1'>
                  <CardHeader>
                    <CardTitle>Agency Performance</CardTitle>
                    <CardDescription>
                      Earnings and agent counts for top agencies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='h-[300px] w-full pr-4'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart
                        data={agencyPerformanceData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray='3 3'
                          strokeOpacity={0.3}
                        />
                        <XAxis dataKey='name' fontSize={12} tickLine={false} />
                        <YAxis
                          yAxisId='left'
                          orientation='left'
                          stroke='#8884d8'
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <YAxis
                          yAxisId='right'
                          orientation='right'
                          stroke='#82ca9d'
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name === 'earnings'
                              ? `$${value.toLocaleString()}`
                              : value,
                            name.charAt(0).toUpperCase() + name.slice(1),
                          ]}
                        />
                        <Legend verticalAlign='top' height={36} />
                        <Bar
                          yAxisId='left'
                          dataKey='earnings'
                          fill='#8884d8'
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                        <Bar
                          yAxisId='right'
                          dataKey='agents'
                          fill='#82ca9d'
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='system' className='mt-0 space-y-4'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle>System Component Health</CardTitle>
                      <CardDescription>
                        Database and other critical component status.
                      </CardDescription>
                    </div>
                    <div className='flex items-center gap-2'>
                      {process.env.NODE_ENV === 'development' &&
                        accessToken && (
                          <TokenDebugger token={accessToken} buttonSize='sm' />
                        )}
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={fetchHealthData}
                        disabled={loadingHealth}
                      >
                        {loadingHealth ? (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <RefreshCw className='mr-2 h-4 w-4' />
                        )}
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingHealth ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='h-8 w-8 animate-spin text-primary' />
                      <span className='ml-2'>Loading health data...</span>
                    </div>
                  ) : healthError ? (
                    <div className='rounded-md bg-destructive/10 p-4 text-destructive'>
                      <h3 className='font-medium'>Error loading health data</h3>
                      <p className='mt-1 text-sm'>{healthError}</p>
                      <Button
                        variant='outline'
                        className='mt-2'
                        size='sm'
                        onClick={fetchHealthData}
                      >
                        Try again
                      </Button>
                    </div>
                  ) : healthData ? (
                    <div className='space-y-6'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='text-lg font-medium'>
                            Database Status
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            Cloud SQL connection is{' '}
                            {healthData.database.toLowerCase()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            healthData.status === 'OK'
                              ? 'outline'
                              : 'destructive'
                          }
                          className='px-3 py-1 text-sm'
                        >
                          {healthData.status === 'OK' ? (
                            <CheckCircle2 className='mr-1 h-4 w-4 text-green-500' />
                          ) : (
                            <XCircle className='mr-1 h-4 w-4 text-destructive' />
                          )}
                          {healthData.status}
                        </Badge>
                      </div>
                      <div className='rounded-md bg-muted p-4'>
                        <h4 className='mb-2 text-sm font-medium'>
                          Connection Details
                        </h4>
                        <div className='grid grid-cols-2 gap-2 text-sm'>
                          <div className='font-medium'>Status:</div>
                          <div>{healthData.database || 'Unknown'}</div>
                          <div className='font-medium'>Database:</div>
                          <div>{healthData.dbName || 'Unknown'}</div>
                          <div className='font-medium'>Tables:</div>
                          <div>{healthData.tableCount || 0}</div>
                          <div className='font-medium'>Timestamp:</div>
                          <div>{formatTimestamp(healthData.timestamp)}</div>
                          {healthData.connectionType && (
                            <>
                              <div className='font-medium'>
                                Connection Type:
                              </div>
                              <div>{healthData.connectionType}</div>
                            </>
                          )}
                          {healthData.host && (
                            <>
                              <div className='font-medium'>Host:</div>
                              <div>{healthData.host}</div>
                            </>
                          )}
                          {healthData.instanceName && (
                            <>
                              <div className='font-medium'>Instance:</div>
                              <div>{healthData.instanceName}</div>
                            </>
                          )}
                        </div>
                      </div>
                      {healthData.tables && healthData.tables.length > 0 && (
                        <div>
                          <h4 className='mb-2 text-sm font-medium'>
                            Tables ({healthData.tables.length})
                          </h4>
                          <ScrollArea className='h-[200px] rounded-md border'>
                            <div className='p-4'>
                              <table className='w-full'>
                                <thead>
                                  <tr className='border-b'>
                                    <th className='pb-2 text-left font-medium'>
                                      Table Name
                                    </th>
                                    <th className='pb-2 text-right font-medium'>
                                      Row Count
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {healthData.tables.map((table) => (
                                    <tr
                                      key={table.name}
                                      className='border-b border-dashed last:border-0'
                                    >
                                      <td className='py-2 text-left'>
                                        {table.name}
                                      </td>
                                      <td className='py-2 text-right'>
                                        {table.error ? (
                                          <span className='text-destructive'>
                                            {table.error}
                                          </span>
                                        ) : (
                                          table.rows
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='p-8 text-center text-muted-foreground'>
                      <p>No health data available. Click refresh to fetch.</p>
                      <Button
                        variant='outline'
                        className='mt-2'
                        onClick={fetchHealthData}
                        disabled={loadingHealth}
                      >
                        {loadingHealth ? (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <RefreshCw className='mr-2 h-4 w-4' />
                        )}
                        Check Health Status
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className='text-sm text-muted-foreground'>
                  Last updated:{' '}
                  {healthData ? formatTimestamp(healthData.timestamp) : 'Never'}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}
