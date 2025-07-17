import { format } from 'date-fns'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table'
import { useClientsContext } from '../context/clients-context'
import { Client, ClientStatus } from '../data/schema'

interface ClientsTableProps {
  data: Client[]
}

export function ClientsTable({ data }: ClientsTableProps) {
  const {
    setSelectedClient,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setOpenInteraction,
    setOpenFollowUp,
  } = useClientsContext()

  const handleRowClick = (client: Client) => {
    setSelectedClient(client)
  }

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge className='border-green-200 bg-green-50 text-green-700'>
            Active
          </Badge>
        )
      case 'inactive':
        return (
          <Badge className='border-gray-200 bg-gray-50 text-gray-700'>
            Inactive
          </Badge>
        )
      case 'pending':
        return (
          <Badge className='border-yellow-200 bg-yellow-50 text-yellow-700'>
            Pending
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className='rounded-md border overflow-hidden'>
      <Table>
        <thead>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Date</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead className='w-[80px]'></TableHead>
          </TableRow>
        </thead>
        <TableBody>
          {data.map((client) => (
            <TableRow
              key={client.id}
              onClick={() => handleRowClick(client)}
              className='cursor-pointer hover:bg-muted/40 transition-colors'
            >
              <TableCell className='font-medium'>
                {client.firstName} {client.lastName}
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phoneNumber}</TableCell>
              <TableCell>{getStatusBadge(client.status)}</TableCell>
              <TableCell>{format(client.assignedDate, 'MMM d, yyyy')}</TableCell>
              <TableCell>{format(client.lastContact, 'MMM d, yyyy')}</TableCell>
              <TableCell
                onClick={(e) => e.stopPropagation()}
                className='text-right'
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <DotsHorizontalIcon className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedClient(client)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedClient(client)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedClient(client)
                        setOpenInteraction(true)
                      }}
                    >
                      Add Interaction
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedClient(client)
                        setOpenFollowUp(true)
                      }}
                    >
                      Schedule Follow-Up
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}