import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface ChartData {
  name: string
  earned: number
}

function getMonthKey(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function EarningsChart({ commissions }: { commissions: any[] }) {
  // Generate last 12 months using UTC
  const getLastTwelveMonths = () => {
    const now = new Date()
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now)
      d.setMonth(now.getUTCMonth() - (11 - i))
      return {
        label: d.toLocaleString('default', { month: 'short' }),
        key: getMonthKey(d),
      }
    })
  }

  // Group commission data by YYYY-MM
  const grouped = commissions.reduce<Record<string, number>>((acc, curr) => {
    const date = new Date(curr.saleDate)
    const key = getMonthKey(date)
    acc[key] = (acc[key] || 0) + curr.commissionEarned
    return acc
  }, {})

  // Build chart data for all 12 months
  const chartData = getLastTwelveMonths().map((month) => ({
    name: month.label,
    earned: grouped[month.key] || 0,
  }))

  return (
    <Card className='shadow-sm border border-border bg-card text-card-foreground'>
      <CardHeader>
        <CardTitle>Yearly Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {/* Grid */}
            <CartesianGrid strokeDasharray='3 3' vertical={false} />

            {/* X Axis */}
            <XAxis
              dataKey='name'
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />

            {/* Y Axis */}
            <YAxis
              dataKey='earned'
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              formatter={(value) => [`$${value}`, 'Earnings']}
              cursor={{ opacity: 0.1 }}
            />

            {/* Bars */}
            <Bar
              dataKey='earned'
              type='natural'
              fill='hsl(var(--primary))'
              radius={[6, 6, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}