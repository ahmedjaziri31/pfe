import { format } from 'date-fns'
import { exportToCSV } from './commission-utils'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CommissionDashboardProps {
  commissions: any[]
}

export function CommissionDashboard({ commissions }: CommissionDashboardProps) {
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

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle>Earnings Dashboard</CardTitle>
        <div className='flex justify-end space-x-2'>
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
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={filtered()}>
            <XAxis dataKey='name' />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`$${value}`, 'Earned']} />
            <Bar dataKey='earned' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className='mt-4 flex justify-end'>
          <p className='text-lg font-semibold'>
            Total Earned: ${totalEarned.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}