import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { HealthCheckButton } from '@/components/ui/health-check-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/_authenticated/admin/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div className='space-y-4 p-4'>
      <h1 className='text-xl font-semibold'>Admin Dashboard</h1>

      <Tabs defaultValue='overview'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='system'>System</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Welcome, Admin!</CardTitle>
              <CardDescription>
                This is your admin dashboard where you can manage users and
                system settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Admin specific content goes here */}
              <p>Admin-specific widgets and charts will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='system' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Check the status of your database and system components.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-medium'>Database Connection</h3>
                  <p className='text-sm text-muted-foreground'>
                    Check the health and status of your database connection
                  </p>
                </div>
                <HealthCheckButton
                  label='Check Database Health'
                  variant='outline'
                />
              </div>
            </CardContent>
            <CardFooter className='text-sm text-muted-foreground'>
              System health checks help identify issues with database
              connectivity and performance.
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
