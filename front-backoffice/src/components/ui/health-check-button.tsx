import { useState } from 'react'
import axios from 'axios'
import { API_CONFIG } from '@/config/api'
import {
  Loader2,
  Database,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type HealthCheckStatus = 'idle' | 'loading' | 'success' | 'error'

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

interface HealthCheckButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg'
}

export function HealthCheckButton({
  label = 'Database Health Check',
  className,
  variant = 'outline',
  size = 'default',
}: HealthCheckButtonProps) {
  const [status, setStatus] = useState<HealthCheckStatus>('idle')
  const [isOpen, setIsOpen] = useState(false)
  const [healthData, setHealthData] = useState<HealthData | null>(null)

  const checkHealth = async () => {
    try {
      setStatus('loading')
      setIsOpen(true)

      // In development, use relative path with the Vite proxy
      // In production, use the full URL of the backend
      let healthCheckUrl = '/db-health'

      // If we're in production and know the exact backend URL
      if (import.meta.env.PROD) {
        // Extract hostname from current location instead of hardcoding
        const backendHostname = window.location.hostname.includes('localhost')
          ? 'localhost:5000'
          : window.location.hostname

        const protocol = window.location.protocol
        healthCheckUrl = `${protocol}//${backendHostname}/db-health`
      }

      console.log('Health check URL:', healthCheckUrl)
      const response = await axios.get(healthCheckUrl)
      console.log('Health check response:', response.data)

      setHealthData(response.data)
      setStatus('success')
    } catch (error: any) {
      console.error('Health check failed:', error)
      // Try direct access to the production URL as fallback
      try {
        console.log('Trying fallback to direct production URL')
        const fallbackResponse = await axios.get(
          import.meta.env.VITE_API_URL?.replace('/api', '') + '/db-health' || 'http://localhost:5000/db-health'
        )
        console.log('Fallback response:', fallbackResponse.data)
        setHealthData(fallbackResponse.data)
        setStatus('success')
      } catch (fallbackError: any) {
        console.error('Fallback health check also failed:', fallbackError)
        setHealthData({
          status: 'ERROR',
          database: 'Disconnected',
          timestamp: new Date().toISOString(),
          message: 'Failed to connect to the health check endpoint',
          error: error.response?.data?.message || error.message,
          dbName: '',
          tables: [],
          tableCount: 0,
        })
        setStatus('error')
      }
    }
  }

  // Format timestamp properly
  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A'

    try {
      // Try to parse the timestamp
      const date = new Date(timestamp)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleString()
    } catch (error) {
      console.error('Error formatting timestamp:', error)
      return 'Invalid Date'
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={checkHealth}
        disabled={status === 'loading'}
        data-health-check-button='true'
      >
        {status === 'loading' ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Database className='mr-2 h-4 w-4' />
        )}
        {label}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              {status === 'loading' && (
                <Loader2 className='mr-2 h-5 w-5 animate-spin text-primary' />
              )}
              {status === 'success' && (
                <CheckCircle2 className='mr-2 h-5 w-5 text-green-500' />
              )}
              {status === 'error' && (
                <XCircle className='mr-2 h-5 w-5 text-destructive' />
              )}
              Database Health Check
              {status !== 'loading' && healthData && (
                <Badge
                  variant={status === 'success' ? 'outline' : 'destructive'}
                  className='ml-2'
                >
                  {healthData.status}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {status === 'loading' && 'Checking database connection status...'}
              {status === 'success' && healthData?.message}
              {status === 'error' &&
                'Failed to connect to the database or health check endpoint.'}
            </DialogDescription>
          </DialogHeader>

          {status !== 'loading' && healthData && (
            <div className='space-y-4'>
              <div className='rounded-md bg-muted p-4'>
                <h4 className='mb-2 text-sm font-medium'>Connection Details</h4>
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
                      <div className='font-medium'>Connection Type:</div>
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

              {healthData.error && (
                <div className='rounded-md bg-destructive/10 p-4 text-destructive'>
                  <div className='flex items-center'>
                    <AlertCircle className='mr-2 h-4 w-4' />
                    <h4 className='font-medium'>Error</h4>
                  </div>
                  <p className='mt-1 text-sm'>{healthData.error}</p>
                </div>
              )}

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
                              <td className='py-2 text-left'>{table.name}</td>
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
          )}

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button onClick={checkHealth} disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Checking...
                </>
              ) : (
                'Run Check Again'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
