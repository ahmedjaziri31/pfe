import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Client, ClientStatus } from '../data/schema'
import { useClientsContext } from '../context/clients-context'

export function ClientsDialogs() {
  const {
    selectedClient,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  } = useClientsContext()

  const [formData, setFormData] = useState<Omit<Client, 'id' | 'assignedDate' | 'lastContact'>>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    status: 'active',
  })

  useEffect(() => {
    if (selectedClient) {
      setFormData({
        firstName: selectedClient.firstName,
        lastName: selectedClient.lastName,
        email: selectedClient.email,
        phoneNumber: selectedClient.phoneNumber,
        status: selectedClient.status,
      })
    }
  }, [selectedClient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    console.log('Updated client:', formData)
    alert('Client updated successfully!')
    setIsEditDialogOpen(false)
  }

  const handleDelete = () => {
    if (selectedClient) {
      alert(`Client ${selectedClient.id} deleted`)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>Make changes to the client information here.</DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='firstName' className='text-right'>First Name</Label>
                <Input id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='lastName' className='text-right'>Last Name</Label>
                <Input id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='email' className='text-right'>Email</Label>
                <Input id='email' name='email' value={formData.email} onChange={handleChange} className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='phoneNumber' className='text-right'>Phone Number</Label>
                <Input id='phoneNumber' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='status' className='text-right'>Status</Label>
                <Select name='status' value={formData.status} onValueChange={(value: ClientStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                    <SelectItem value='pending'>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}