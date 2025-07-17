import { useState } from 'react'
import {
  MoreVertical,
  Edit,
  Trash,
  Star,
  MapPin,
  Home,
  Ruler,
  Users,
  DollarSign,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Property } from '../index'

interface PropertyCardProps {
  property: Property
  onEdit: () => void
  onDelete: () => void
  onToggleFeatured: () => void
}

export function PropertyCard({
  property,
  onEdit,
  onDelete,
  onToggleFeatured,
}: PropertyCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  // Get the property image
  const propertyImage =
    property.image_url ||
    (property.images && property.images.length > 0
      ? property.images.find((img) => img.is_primary)?.image_url ||
        property.images[0].image_url
      : '/images/property-placeholder.jpg')

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default'
      case 'Pending':
        return 'outline'
      case 'Funded':
        return 'success'
      case 'Completed':
        return 'secondary'
      case 'Cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getPropertyStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success'
      case 'under_review':
        return 'outline'
      case 'sold_out':
        return 'secondary'
      case 'rented':
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <>
      <Card className='overflow-hidden transition-all hover:shadow-md'>
        <CardHeader className='p-0'>
          <div className='relative h-48 w-full'>
            <img
              src={propertyImage}
              alt={property.name}
              className='h-full w-full object-cover'
            />
            {/* Status badges */}
            <div className='absolute left-2 top-2 flex flex-wrap gap-2'>
              <Badge variant={getStatusBadgeVariant(property.status)}>
                {property.status}
              </Badge>
              <Badge
                variant={getPropertyStatusBadgeVariant(
                  property.property_status
                )}
              >
                {property.property_status.replace('_', ' ')}
              </Badge>
              {property.featured && (
                <Badge
                  variant='secondary'
                  className='bg-yellow-500 hover:bg-yellow-600'
                >
                  <Star className='mr-1 h-3 w-3' /> Featured
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className='absolute right-2 top-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='secondary' size='icon'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className='mr-2 h-4 w-4' /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onToggleFeatured}>
                    <Star className='mr-2 h-4 w-4' />
                    {property.featured
                      ? 'Remove from Featured'
                      : 'Mark as Featured'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteAlert(true)}
                    className='text-destructive focus:text-destructive'
                  >
                    <Trash className='mr-2 h-4 w-4' /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-4'>
          <h3 className='mb-1 text-xl font-bold'>{property.name}</h3>

          <div className='mb-3 flex items-center text-sm text-muted-foreground'>
            <MapPin className='mr-1 h-4 w-4' /> {property.location}
          </div>

          <p className='mb-4 line-clamp-2 text-sm text-muted-foreground'>
            {property.description}
          </p>

          <div className='grid grid-cols-2 gap-2'>
            <div className='flex items-center text-sm'>
              <Home className='mr-1 h-4 w-4 text-muted-foreground' />
              {property.property_type}
            </div>

            <div className='flex items-center text-sm'>
              <Ruler className='mr-1 h-4 w-4 text-muted-foreground' />
              {property.property_size} m²
            </div>

            {property.bedrooms && (
              <div className='flex items-center text-sm'>
                <span className='mr-1 font-medium'>Beds:</span>{' '}
                {property.bedrooms}
              </div>
            )}

            {property.bathrooms && (
              <div className='flex items-center text-sm'>
                <span className='mr-1 font-medium'>Baths:</span>{' '}
                {property.bathrooms}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className='flex-col items-start border-t p-4'>
          <div className='mb-2 flex w-full items-center justify-between'>
            <div className='flex items-center'>
              <Users className='mr-1 h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>
                {property.investor_count || 0} investors
              </span>
            </div>

            <Badge variant='outline' className='font-normal'>
              ROI {property.expected_roi || 0}%
            </Badge>
          </div>

          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center font-medium'>
              <DollarSign className='h-4 w-4' />
              {formatCurrency(property.goal_amount)}
            </div>

            <div className='text-xs text-muted-foreground'>
              Added {formatDate(property.created_at)}
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the property "{property.name}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete()
                setShowDeleteAlert(false)
              }}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
