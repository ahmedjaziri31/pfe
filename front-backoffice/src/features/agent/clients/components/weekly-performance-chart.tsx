import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceData {
  name: string
  'This Week': number
  'Last Week': number
}

const data: PerformanceData[] = [
  { name: 'Mon', 'This Week': 1500, 'Last Week': 1200 },
  { name: 'Tue', 'This Week': 2200, 'Last Week': 1800 },
  { name: 'Wed', 'This Week': 1800, 'Last Week': 2000 },
  { name: 'Thu', 'This Week': 2500, 'Last Week': 2300 },
  { name: 'Fri', 'This Week': 2000, 'Last Week': 1900 },
  { name: 'Sat', 'This Week': 2000, 'Last Week': 1900 },
  { name: 'Sun', 'This Week': 2550, 'Last Week': 2000 },

]

export function WeeklyPerformanceChart() {
  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle>Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey='name' />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value, name) => [`$${value}`, name]} />
            <Line type='monotone' dataKey='This Week' stroke='#FF6B6B' strokeWidth={2} dot />
            <Line type='monotone' dataKey='Last Week' stroke='#8ECDC6' strokeDasharray='5 5' dot />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}