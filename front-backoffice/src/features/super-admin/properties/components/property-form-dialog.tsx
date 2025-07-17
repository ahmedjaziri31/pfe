import { useState, useEffect } from 'react'
import { z } from 'zod'
import axiosInstance from '@/api/axios-instance'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash, Star, Upload, File } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Property, PropertyImage, PropertyDocument } from '../index'

// Form validation schema
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Property name must be at least 3 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  goal_amount: z.coerce
    .number()
    .positive({ message: 'Goal amount must be positive' }),
  current_amount: z.coerce
    .number()
    .min(0, { message: 'Current amount cannot be negative' })
    .optional(),
  status: z.enum(['Pending', 'Active', 'Funded', 'Completed', 'Cancelled']),
  property_status: z.enum(['available', 'under_review', 'sold_out', 'rented']),
  location: z
    .string()
    .min(3, { message: 'Location must be at least 3 characters' }),
  property_size: z.coerce
    .number()
    .positive({ message: 'Property size must be positive' }),
  property_type: z.enum(['residential', 'commercial', 'industrial', 'land']),
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().min(0).optional().nullable(),
  construction_year: z.coerce
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
  expected_roi: z.coerce.number().min(0).optional().nullable(),
  rental_yield: z.coerce.number().min(0).optional().nullable(),
  investment_period: z.coerce.number().int().min(1).optional().nullable(),
  minimum_investment: z.coerce.number().positive().optional().nullable(),
  featured: z.boolean().default(false),
})

// Type for the form data
type PropertyFormValues = z.infer<typeof formSchema>

interface PropertyFormDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (refresh: boolean) => void
}

export function PropertyFormDialog({
  property,
  open,
  onOpenChange,
}: PropertyFormDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([])
  const [propertyDocuments, setPropertyDocuments] = useState<
    PropertyDocument[]
  >([])
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([])
  const [deletedImages, setDeletedImages] = useState<number[]>([])
  const [deletedDocuments, setDeletedDocuments] = useState<number[]>([])

  // Initialize form with defaults or property values
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      goal_amount: 0,
      current_amount: 0,
      status: 'Pending' as const,
      property_status: 'under_review' as const,
      location: '',
      property_size: 0,
      property_type: 'residential' as const,
      bedrooms: null,
      bathrooms: null,
      construction_year: null,
      expected_roi: null,
      rental_yield: null,
      investment_period: null,
      minimum_investment: null,
      featured: false,
    },
  })

  // Populate form when property changes
  useEffect(() => {
    if (property) {
      form.reset({
        name: property.name,
        description: property.description,
        goal_amount: property.goal_amount,
        current_amount: property.current_amount || 0,
        status: property.status,
        property_status: property.property_status,
        location: property.location,
        property_size: property.property_size,
        property_type: property.property_type,
        bedrooms: property.bedrooms || null,
        bathrooms: property.bathrooms || null,
        construction_year: property.construction_year || null,
        expected_roi: property.expected_roi || null,
        rental_yield: property.rental_yield || null,
        investment_period: property.investment_period || null,
        minimum_investment: property.minimum_investment || null,
        featured: property.featured,
      })

      if (property.images) {
        setPropertyImages(property.images)
      }

      if (property.documents) {
        setPropertyDocuments(property.documents)
      }
    }
  }, [property, form])

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setLoading(true)

      // Create form data to send with file uploads
      const formData = new FormData()

      // Append JSON data
      formData.append('data', JSON.stringify(data))

      // Append image files
      uploadedImages.forEach((file, index) => {
        formData.append(`images`, file)
      })

      // Append document files
      uploadedDocuments.forEach((file, index) => {
        formData.append(`documents`, file)
      })

      // Add image data from existing images
      if (propertyImages.length > 0) {
        formData.append('images', JSON.stringify(propertyImages))
      }

      // Add document data from existing documents
      if (propertyDocuments.length > 0) {
        formData.append('documents', JSON.stringify(propertyDocuments))
      }

      // Add deleted image IDs
      if (deletedImages.length > 0) {
        formData.append('deletedImages', JSON.stringify(deletedImages))
      }

      // Add deleted document IDs
      if (deletedDocuments.length > 0) {
        formData.append('deletedDocuments', JSON.stringify(deletedDocuments))
      }

      if (property) {
        // Update existing property
        await axiosInstance.put(`/properties/${property.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast({
          title: 'Success',
          description: 'Property updated successfully',
        })
      } else {
        // Create new property
        await axiosInstance.post('/properties', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast({
          title: 'Success',
          description: 'Property created successfully',
        })
      }

      onOpenChange(true) // Close dialog and refresh list
    } catch (error) {
      console.error('Error saving property:', error)
      toast({
        title: 'Error',
        description: 'Failed to save property. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setUploadedImages((prev) => [...prev, ...newFiles])

      // Preview images
      const newPropertyImages = newFiles.map((file) => ({
        image_url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        is_primary: false,
      }))

      setPropertyImages((prev) => [...prev, ...newPropertyImages])
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setUploadedDocuments((prev) => [...prev, ...newFiles])

      // Preview documents
      const newPropertyDocuments = newFiles.map((file) => ({
        name: file.name,
        file_url: URL.createObjectURL(file),
        document_type: 'other' as const,
      }))

      setPropertyDocuments((prev) => [...prev, ...newPropertyDocuments])
    }
  }

  const handleDeleteImage = (index: number, id?: number) => {
    if (id) {
      setDeletedImages((prev) => [...prev, id])
    }
    setPropertyImages((prev) => prev.filter((_, i) => i !== index))

    // Also remove from uploadedImages if it's a new upload
    if (!id && uploadedImages[index]) {
      const newUploadedImages = [...uploadedImages]
      newUploadedImages.splice(index, 1)
      setUploadedImages(newUploadedImages)
    }
  }

  const handleDeleteDocument = (index: number, id?: number) => {
    if (id) {
      setDeletedDocuments((prev) => [...prev, id])
    }
    setPropertyDocuments((prev) => prev.filter((_, i) => i !== index))

    // Also remove from uploadedDocuments if it's a new upload
    if (!id && uploadedDocuments[index]) {
      const newUploadedDocuments = [...uploadedDocuments]
      newUploadedDocuments.splice(index, 1)
      setUploadedDocuments(newUploadedDocuments)
    }
  }

  const handleSetPrimaryImage = (index: number) => {
    setPropertyImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>
            {property ? 'Edit Property' : 'Add New Property'}
          </DialogTitle>
          <DialogDescription>
            {property
              ? 'Update the property details below'
              : 'Fill in the details to create a new property listing'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='basic'>Basic Info</TabsTrigger>
                <TabsTrigger value='details'>Details</TabsTrigger>
                <TabsTrigger value='financial'>Financial</TabsTrigger>
                <TabsTrigger value='media'>Media</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value='basic' className='space-y-4 pt-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter property name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe the property'
                          className='min-h-[120px]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g., New York, NY' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='property_type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select property type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='residential'>
                              Residential
                            </SelectItem>
                            <SelectItem value='commercial'>
                              Commercial
                            </SelectItem>
                            <SelectItem value='industrial'>
                              Industrial
                            </SelectItem>
                            <SelectItem value='land'>Land</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value='details' className='space-y-4 pt-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='property_size'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Size (m²)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 120'
                            {...field}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='construction_year'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Construction Year</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 2010'
                            {...field}
                            value={value || ''}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            min={1800}
                            max={new Date().getFullYear()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='bedrooms'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 3'
                            {...field}
                            value={value || ''}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='bathrooms'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 2'
                            {...field}
                            value={value || ''}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            min={0}
                            step={0.5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Pending'>Pending</SelectItem>
                            <SelectItem value='Active'>Active</SelectItem>
                            <SelectItem value='Funded'>Funded</SelectItem>
                            <SelectItem value='Completed'>Completed</SelectItem>
                            <SelectItem value='Cancelled'>Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='property_status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select property status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='available'>Available</SelectItem>
                            <SelectItem value='under_review'>
                              Under Review
                            </SelectItem>
                            <SelectItem value='sold_out'>Sold Out</SelectItem>
                            <SelectItem value='rented'>Rented</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value='financial' className='space-y-4 pt-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='goal_amount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 500000'
                            {...field}
                            min={0}
                            step={1000}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='current_amount'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Current Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 250000'
                            {...field}
                            value={value || ''}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : 0
                              )
                            }
                            min={0}
                            step={1000}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='expected_roi'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Expected ROI (%)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 8.5'
                            {...field}
                            value={value || ''}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            min={0}
                            step={0.1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='rental_yield'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Rental Yield (%)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 5.2'
                            {...field}
                            value={value || ''}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            min={0}
                            step={0.1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='investment_period'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Investment Period (months)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 36'
                            {...field}
                            value={value || ''}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            min={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='minimum_investment'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Minimum Investment ($)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 5000'
                            {...field}
                            value={value || ''}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            min={0}
                            step={100}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value='media' className='space-y-6 pt-4'>
                <div>
                  <h3 className='mb-2 text-lg font-medium'>Property Images</h3>
                  <div className='mb-4'>
                    <label htmlFor='image-upload' className='cursor-pointer'>
                      <div className='flex h-32 items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-4 hover:bg-muted/50'>
                        <div className='flex flex-col items-center gap-2'>
                          <Upload className='h-6 w-6 text-muted-foreground' />
                          <p className='text-sm text-muted-foreground'>
                            Click or drag to upload images
                          </p>
                        </div>
                        <input
                          id='image-upload'
                          type='file'
                          accept='image/*'
                          multiple
                          className='hidden'
                          onChange={handleImageUpload}
                        />
                      </div>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {propertyImages.length > 0 && (
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                      {propertyImages.map((image, index) => (
                        <div key={index} className='relative'>
                          <img
                            src={image.image_url}
                            alt={`Property ${index + 1}`}
                            className='h-24 w-full rounded-md object-cover'
                          />
                          <div className='absolute right-1 top-1 flex space-x-1'>
                            <Button
                              type='button'
                              variant='destructive'
                              size='icon'
                              className='h-6 w-6'
                              onClick={() => handleDeleteImage(index, image.id)}
                            >
                              <Trash className='h-3 w-3' />
                            </Button>
                            <Button
                              type='button'
                              variant={image.is_primary ? 'default' : 'outline'}
                              size='icon'
                              className='h-6 w-6'
                              onClick={() => handleSetPrimaryImage(index)}
                            >
                              <Star className='h-3 w-3' />
                            </Button>
                          </div>
                          {image.is_primary && (
                            <div className='absolute bottom-1 left-1 rounded-sm bg-primary px-1 py-0.5 text-xs text-primary-foreground'>
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className='mb-2 text-lg font-medium'>
                    Property Documents
                  </h3>
                  <div className='mb-4'>
                    <label htmlFor='document-upload' className='cursor-pointer'>
                      <div className='flex h-32 items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-4 hover:bg-muted/50'>
                        <div className='flex flex-col items-center gap-2'>
                          <Upload className='h-6 w-6 text-muted-foreground' />
                          <p className='text-sm text-muted-foreground'>
                            Click or drag to upload documents
                          </p>
                        </div>
                        <input
                          id='document-upload'
                          type='file'
                          multiple
                          className='hidden'
                          onChange={handleDocumentUpload}
                        />
                      </div>
                    </label>
                  </div>

                  {/* Document Previews */}
                  {propertyDocuments.length > 0 && (
                    <div className='space-y-2'>
                      {propertyDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between rounded-md border p-2'
                        >
                          <div className='flex items-center gap-2'>
                            <File className='h-5 w-5 text-muted-foreground' />
                            <span className='max-w-[200px] truncate text-sm'>
                              {doc.name}
                            </span>
                          </div>
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='h-6 w-6'
                            onClick={() => handleDeleteDocument(index, doc.id)}
                          >
                            <Trash className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name='featured'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Featured Property</FormLabel>
                        <FormDescription>
                          Mark as featured to highlight this property on the
                          website.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className='flex items-center justify-between pt-4'>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    if (activeTab === 'basic') {
                      onOpenChange(false)
                    } else if (activeTab === 'details') {
                      setActiveTab('basic')
                    } else if (activeTab === 'financial') {
                      setActiveTab('details')
                    } else if (activeTab === 'media') {
                      setActiveTab('financial')
                    }
                  }}
                >
                  {activeTab === 'basic' ? 'Cancel' : 'Back'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    if (activeTab === 'basic') {
                      setActiveTab('details')
                    } else if (activeTab === 'details') {
                      setActiveTab('financial')
                    } else if (activeTab === 'financial') {
                      setActiveTab('media')
                    }
                  }}
                  disabled={activeTab === 'media'}
                >
                  Next
                </Button>
              </div>
              <Button type='submit' disabled={loading}>
                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {property ? 'Update Property' : 'Create Property'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
