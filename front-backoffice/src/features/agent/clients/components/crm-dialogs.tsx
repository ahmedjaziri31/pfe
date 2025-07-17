import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { useClientsContext } from '../context/clients-context'
import { Client, InteractionType } from '../data/schema'

export function CrmDialogs() {
  const {
    selectedClient,
    openInteraction,
    setOpenInteraction,
    openFollowUp,
    setOpenFollowUp,
  } = useClientsContext()

  const [interactionData, setInteractionData] = useState<{
    type: InteractionType
    notes: string
    date: Date
  }>({
    type: 'call',
    notes: '',
    date: new Date(),
  })

  const [followUpData, setFollowUpData] = useState<{
    description: string
    scheduledDate: Date
  }>({
    description: '',
    scheduledDate: new Date(),
  })

  const handleAddInteraction = () => {
    console.log('New interaction:', {
      clientId: selectedClient?.id,
      ...interactionData,
    })
    alert('Interaction added!')
    setOpenInteraction(false)
  }

  const handleScheduleFollowUp = () => {
    console.log('New follow-up:', {
      clientId: selectedClient?.id,
      ...followUpData,
    })
    alert('Follow-up scheduled!')
    setOpenFollowUp(false)
  }

  return (
    <>
      {/* Add Interaction Dialog */}
      <Dialog open={openInteraction} onOpenChange={setOpenInteraction}>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); handleAddInteraction() }}>
            <DialogHeader>
              <DialogTitle>Add Interaction</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='type' className='text-right'>Type</Label>
                <Select
                  value={interactionData.type}
                  onValueChange={(value: InteractionType) =>
                    setInteractionData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='call'>Call</SelectItem>
                    <SelectItem value='email'>Email</SelectItem>
                    <SelectItem value='meeting'>Meeting</SelectItem>
                    <SelectItem value='note'>Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='notes' className='text-right'>Notes</Label>
                <Input
                  id='notes'
                  name='notes'
                  value={interactionData.notes || ''}
                  onChange={(e) =>
                    setInteractionData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='date' className='text-right'>Date</Label>
                <Calendar
                  mode='single'
                  selected={interactionData.date}
                  onSelect={(date) =>
                    setInteractionData((prev) => ({
                      ...prev,
                      date: date || prev.date,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Follow-Up Dialog */}
      <Dialog open={openFollowUp} onOpenChange={setOpenFollowUp}>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); handleScheduleFollowUp() }}>
            <DialogHeader>
              <DialogTitle>Schedule Follow-Up</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='description' className='text-right'>Description</Label>
                <Input
                  id='description'
                  name='description'
                  value={followUpData.description || ''}
                  onChange={(e) =>
                    setFollowUpData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='scheduledDate' className='text-right'>Scheduled Date</Label>
                <Calendar
                  mode='single'
                  selected={followUpData.scheduledDate}
                  onSelect={(date) =>
                    setFollowUpData((prev) => ({
                      ...prev,
                      scheduledDate: date || prev.scheduledDate,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}