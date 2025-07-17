import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { exportToCSV } from './commission-utils'
import { Commission } from '../data/commision-_schema'

interface CommissionHistoryProps {
  commissions: Commission[]
}

export function CommissionHistory({ commissions }: CommissionHistoryProps) {
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'year'>('all')

  const filtered = () => {
    const now = new Date()
    return commissions.filter((c) => {
      const date = new Date(c.saleDate)
      if (timeframe === 'month') return date.getMonth() === now.getMonth()
      if (timeframe === 'year') return date.getFullYear() === now.getFullYear()
      return true
    })
  }

  const totalEarned = filtered().reduce(
    (sum, c) => sum + c.commissionEarned,
    0
  )

  const handleExport = () => {
    exportToCSV(commissions, 'commissions.csv')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className='bg-green-100 text-green-800'>Paid</Badge>
      case 'unpaid':
        return (
          <Badge variant='outline' className='border-yellow-200 bg-yellow-50 text-yellow-700'>
            Unpaid
          </Badge>
        )
      case 'disputed':
        return <Badge variant='destructive'>Disputed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>Commission History</CardTitle>
          <div className='space-x-2'>
            <Button variant='outline' size='sm' onClick={() => setTimeframe('all')}>
              All Time
            </Button>
            <Button variant='outline' size='sm' onClick={() => setTimeframe('month')}>
              This Month
            </Button>
            <Button variant='outline' size='sm' onClick={() => setTimeframe('year')}>
              This Year
            </Button>
            <Button variant='outline' size='sm' onClick={handleExport}>
              Export as CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[300px] pr-4'>
          <Table>
            <thead>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sale Amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Earned</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </thead>
            <TableBody>
              {filtered().map((c) => (
                <TableRow key={c.id}>
                  <TableCell className='font-medium'>{c.property}</TableCell>
                  <TableCell>{format(c.saleDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell>${c.saleAmount.toLocaleString()}</TableCell>
                  <TableCell>{c.commissionRate}%</TableCell>
                  <TableCell>${c.commissionEarned.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(c.status)}</TableCell>
                </TableRow>
              ))}
              {filtered().length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-4'>
                    No commissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className='mt-4 flex justify-end'>
          <p className='text-lg font-semibold'>
            Total Earned: ${totalEarned.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}