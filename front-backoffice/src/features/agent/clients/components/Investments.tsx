import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface Investment {
  id: string
  title: string
  price: number
  status: 'available' | 'pending' | 'completed'
}

const investmentsData: Investment[] = [
  {
    id: '1',
    title: 'Luxury Apartment',
    price: 500000,
    status: 'available',
  },
  {
    id: '2',
    title: 'Villa in Suburbs',
    price: 800000,
    status: 'pending',
  },
  {
    id: '3',
    title: 'Commercial Property',
    price: 2000000,
    status: 'completed',
  },
]

export function Investments() {
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)

  const handleInterest = (investment: Investment) => {
    setSelectedInvestment(investment)
    alert(`Interest expressed for ${investment.title}`)
  }

  const handlePurchase = (investment: Investment) => {
    setSelectedInvestment(investment)
    alert(`Purchase initiated for ${investment.title}`)
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Investment Opportunities</h2>
      <Table>
        <thead>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </thead>
        <tbody>
          {investmentsData.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell className='font-medium'>{investment.title}</TableCell>
              <TableCell>${investment.price.toLocaleString()}</TableCell>
              <TableCell>
                {getStatusBadge(investment.status)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost'>Action</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => handleInterest(investment)}>
                      Express Interest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePurchase(investment)}>
                      Initiate Purchase
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'available':
      return <Badge className='bg-green-100 text-green-800'>Available</Badge>
    case 'pending':
      return (
        <Badge variant='outline' className='border-yellow-200 bg-yellow-50 text-yellow-700'>
          Pending
        </Badge>
      )
    case 'completed':
      return <Badge variant='destructive'>Completed</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}