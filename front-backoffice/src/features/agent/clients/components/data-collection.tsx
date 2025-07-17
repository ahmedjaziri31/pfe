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

export function DataCollection() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted data:', formData)
    alert('Data submitted successfully!')
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
    })
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Submit Market Data</h2>
      <form onSubmit={handleSubmit}>
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
        </div>
        <DialogFooter>
          <Button type='submit'>Submit Data</Button>
        </DialogFooter>
      </form>
    </div>
  )
}