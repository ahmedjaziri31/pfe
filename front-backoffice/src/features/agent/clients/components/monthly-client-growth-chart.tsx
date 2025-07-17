import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function MonthlyClientGrowthChart({ clients }: { clients: any[] }) {
  const groupByMonth = () => {
    const grouped = clients.reduce<Record<string, number>>((acc, client) => {
      const date = new Date(client.assignedDate)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const now = new Date()
    const chartData = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now)
      d.setMonth(now.getMonth() - (11 - i))
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return {
        name: d.toLocaleString('default', { month: 'short' }),
        count: grouped[key] || 0,
      }
    })

    return chartData
  }

  const chartData = groupByMonth()

  return (
    <Card className='flex h-full flex-col shadow-sm'>
      <CardHeader>
        <CardTitle>Monthly Client Growth</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center'>
        <div className='mx-auto w-full max-w-[700px]'>
          <ResponsiveContainer width='100%' height={320}>
            <LineChart
              data={chartData}
              margin={{ top: 20, bottom: 10, left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='name' />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Line
                type='monotone'
                dataKey='count'
                stroke='hsl(var(--primary))'
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
