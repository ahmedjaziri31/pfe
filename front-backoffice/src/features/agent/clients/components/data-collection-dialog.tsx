// features/agent/components/data-collection-dialog.tsx
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

interface FormData {
  feedback: string
  rentalData: {
    tenantName: string
    leaseDuration: number
    rentAmount: number
  }
  performanceMetrics: {
    viewings: number
    inquiries: number
    conversionRate: number
  }
}

const initialFormData = {
  feedback: '',
  rentalData: {
    tenantName: '',
    leaseDuration: 0,
    rentAmount: 0,
  },
  performanceMetrics: {
    viewings: 0,
    inquiries: 0,
    conversionRate: 0,
  },
}

export function DataCollectionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const keys = name.split('.')
    if (keys.length === 2) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0] as keyof Omit<FormData, 'feedback'>],
          [keys[1]]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleRentalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      rentalData: {
        ...prev.rentalData,
        [name]: value,
      },
    }))
  }

  const handlePerformanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      performanceMetrics: {
        ...prev.performanceMetrics,
        [name]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted market data:', formData)
    alert('Market data submitted successfully!')
    setFormData(initialFormData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Market Data</DialogTitle>
          </DialogHeader>

          {/* Market Feedback */}
          <div className='grid gap-4 py-4'>
            <div>
              <Label htmlFor='feedback'>Market Feedback</Label>
              <Textarea
                id='feedback'
                name='feedback'
                value={formData.feedback}
                onChange={handleInputChange}
                placeholder='Enter your observations about current market trends...'
                className='mt-1'
              />
            </div>

            {/* Rental Data */}
            <div className='mt-6'>
              <h3 className='text-lg font-semibold mb-2'>Rental Data</h3>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='tenantName' className='text-right'>
                  Tenant Name
                </Label>
                <Input
                  id='tenantName'
                  name='tenantName'
                  value={formData.rentalData.tenantName}
                  onChange={handleRentalChange}
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4 mt-2'>
                <Label htmlFor='leaseDuration' className='text-right'>
                  Lease Duration (months)
                </Label>
                <Input
                  id='leaseDuration'
                  name='leaseDuration'
                  type='number'
                  value={formData.rentalData.leaseDuration}
                  onChange={handleRentalChange}
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4 mt-2'>
                <Label htmlFor='rentAmount' className='text-right'>
                  Rent Amount ($)
                </Label>
                <Input
                  id='rentAmount'
                  name='rentAmount'
                  type='number'
                  value={formData.rentalData.rentAmount}
                  onChange={handleRentalChange}
                  className='col-span-3'
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className='mt-6'>
              <h3 className='text-lg font-semibold mb-2'>Performance Metrics</h3>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='viewings' className='text-right'>
                  Viewings
                </Label>
                <Input
                  id='viewings'
                  name='viewings'
                  type='number'
                  value={formData.performanceMetrics.viewings}
                  onChange={handlePerformanceChange}
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4 mt-2'>
                <Label htmlFor='inquiries' className='text-right'>
                  Inquiries
                </Label>
                <Input
                  id='inquiries'
                  name='inquiries'
                  type='number'
                  value={formData.performanceMetrics.inquiries}
                  onChange={handlePerformanceChange}
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4 mt-2'>
                <Label htmlFor='conversionRate' className='text-right'>
                  Conversion Rate (%)
                </Label>
                <Input
                  id='conversionRate'
                  name='conversionRate'
                  type='number'
                  value={formData.performanceMetrics.conversionRate}
                  onChange={handlePerformanceChange}
                  className='col-span-3'
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type='submit'>Submit Data</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}