import { useClientsContext } from '../context/clients-context'
import { Client } from '../data/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function CrmSection() {
  const {
    selectedClient,
    setOpenInteraction,
    setOpenFollowUp,
  } = useClientsContext()

  if (!selectedClient) return null

  return (
    <div className='mt-8'>
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle>Client CRM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='text-lg font-medium'>{selectedClient.firstName} {selectedClient.lastName}</h3>
              <p className='text-sm text-muted-foreground'>Status: {capitalize(selectedClient.status)}</p>
            </div>
            <div>
              <Badge variant='outline'>{capitalize(selectedClient.status)}</Badge>
            </div>
          </div>
          <div className='mb-4'>
            <p className='text-sm text-muted-foreground'>Last Contact</p>
            <p className='font-medium'>{format(selectedClient.lastContact, 'MMM d, yyyy')}</p>
          </div>
          <div className='space-x-2'>
            <Button size='sm' variant='outline' onClick={() => setOpenInteraction(true)}>
              Add Interaction
            </Button>
            <Button size='sm' variant='outline' onClick={() => setOpenFollowUp(true)}>
              Schedule Follow-Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}