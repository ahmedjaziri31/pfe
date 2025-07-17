// features/agent/components/listings.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Types
interface Metadata {
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
}

type ListingStatus = 'draft' | 'published';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: string;
  status: ListingStatus;
  images: string[];
  metadata: Metadata;
}

const initialListing: Listing = {
  id: '',
  title: '',
  description: '',
  price: 0,
  location: '',
  propertyType: '',
  status: 'draft',
  images: [],
  metadata: {},
};

export function Listings() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Listing>(initialListing);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [name]: value ? Number(value) : undefined,
      },
    }));
  };

  const handlePropertyTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, propertyType: value }));
  };

  const handleStatusChange = (value: ListingStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted listing:', formData);
    alert('Listing saved successfully!');
    setFormData(initialListing); // reset form
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create New Listing</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[700px]'>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Listing</DialogTitle>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              {/* Basic Info */}
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='title' className='text-right'>Title</Label>
                <Input
                  id='title'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  className='col-span-3'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='description' className='text-right'>Description</Label>
                <Textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className='col-span-3 h-32'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='price' className='text-right'>Price</Label>
                <Input
                  id='price'
                  name='price'
                  type='number'
                  value={formData.price}
                  onChange={handleInputChange}
                  className='col-span-3'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='location' className='text-right'>Location</Label>
                <Input
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  className='col-span-3'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='propertyType' className='text-right'>Property Type</Label>
                <Select
                  onValueChange={handlePropertyTypeChange}
                  value={formData.propertyType}
                >
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select property type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='apartment'>Apartment</SelectItem>
                    <SelectItem value='house'>House</SelectItem>
                    <SelectItem value='condo'>Condo</SelectItem>
                    <SelectItem value='townhouse'>Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='status' className='text-right'>Status</Label>
                <Select
                  onValueChange={handleStatusChange as (value: string) => void}
                  value={formData.status}
                >
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='draft'>Draft</SelectItem>
                    <SelectItem value='published'>Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Metadata */}
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='squareFootage' className='text-right'>Square Footage</Label>
                <Input
                  id='squareFootage'
                  name='squareFootage'
                  type='number'
                  value={formData.metadata.squareFootage ?? ''}
                  onChange={handleMetadataChange}
                  className='col-span-3'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='bedrooms' className='text-right'>Bedrooms</Label>
                <Input
                  id='bedrooms'
                  name='bedrooms'
                  type='number'
                  value={formData.metadata.bedrooms ?? ''}
                  onChange={handleMetadataChange}
                  className='col-span-3'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='bathrooms' className='text-right'>Bathrooms</Label>
                <Input
                  id='bathrooms'
                  name='bathrooms'
                  type='number'
                  value={formData.metadata.bathrooms ?? ''}
                  onChange={handleMetadataChange}
                  className='col-span-3'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='amenities' className='text-right'>Amenities</Label>
                <Input
                  id='amenities'
                  name='amenities'
                  placeholder='Comma-separated list'
                  value={formData.metadata.amenities?.join(', ') ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        amenities: e.target.value
                          .split(',')
                          .map((item) => item.trim()),
                      },
                    }))
                  }
                  className='col-span-3'
                />
              </div>

              {/* Image Upload */}
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='images' className='text-right'>Images</Label>
                <input
                  id='images'
                  name='images'
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='col-span-3'
                />
              </div>
            </div>

            <DialogFooter>
              <Button type='submit'>Save Listing</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}