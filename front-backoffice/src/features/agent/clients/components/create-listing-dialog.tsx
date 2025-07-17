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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
interface CreateListingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateListingDialog({ open, onOpenChange }: CreateListingDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'apartment',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted listing:', formData)
    alert('Listing saved successfully!')
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      propertyType: 'apartment',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Listing</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='title' className='text-right'>Title</Label>
              <Input id='title' name='title' value={formData.title} onChange={handleInputChange} className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>Description</Label>
              <Textarea id='description' name='description' value={formData.description} onChange={handleInputChange} className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price' className='text-right'>Price</Label>
              <Input id='price' name='price' type='number' value={formData.price} onChange={handleInputChange} className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='location' className='text-right'>Location</Label>
              <Input id='location' name='location' value={formData.location} onChange={handleInputChange} className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='propertyType' className='text-right'>Property Type</Label>
              <Select name='propertyType' value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select property type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='apartment'>Apartment</SelectItem>
                  <SelectItem value='house'>House</SelectItem>
                  <SelectItem value='commercial'>Commercial Property</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Save Listing</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}