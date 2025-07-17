'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Client = {
  status: 'active' | 'inactive' | 'pending'
}

type Props = {
  clients: Client[]
}

const COLORS = ['#34D399', '#F87171', '#FBBF24'] // green, red, yellow

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      dominantBaseline='central'
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function ClientStatusChart({ clients }: Props) {
  const statusCount = clients.reduce(
    (acc, client) => {
      acc[client.status]++
      return acc
    },
    { active: 0, inactive: 0, pending: 0 }
  )

  const data = [
    { name: 'Active', value: statusCount.active },
    { name: 'Inactive', value: statusCount.inactive },
    { name: 'Pending', value: statusCount.pending },
  ]

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle>Client Status</CardTitle>
      </CardHeader>
      <CardContent className='h-[300px] p-2'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={50}
              dataKey='value'
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                  stroke='#fff'
                />
              ))}
              <Label
                value='Clients'
                position='center'
                style={{ fontSize: 14, fill: '#4B5563' }}
              />
            </Pie>
            <Tooltip />
            <Legend verticalAlign='bottom' height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
