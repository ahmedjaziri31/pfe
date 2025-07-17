import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'

interface CommissionTableProps {
  commissions: any[]
}

export function CommissionTable({ commissions }: CommissionTableProps) {
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
      <tbody>
        {commissions.map((c) => (
          <TableRow key={c.id}>
            <TableCell className='font-medium'>{c.property}</TableCell>
            <TableCell>{format(c.saleDate, 'MMM d, yyyy')}</TableCell>
            <TableCell>${c.saleAmount.toLocaleString()}</TableCell>
            <TableCell>{c.commissionRate}%</TableCell>
            <TableCell>${c.commissionEarned.toLocaleString()}</TableCell>
            <TableCell>{getStatusBadge(c.status)}</TableCell>
          </TableRow>
        ))}
        {commissions.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className='text-center py-4'>
              No commissions found.
            </TableCell>
          </TableRow>
        )}
      </tbody>
    </Table>
  )
}