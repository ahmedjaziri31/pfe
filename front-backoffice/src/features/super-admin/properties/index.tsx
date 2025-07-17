import { useState, useEffect } from 'react'
import axiosInstance from '@/api/axios-instance'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PropertyCard } from './components/property-card'
import { PropertyFormDialog } from './components/property-form-dialog'

// Property type definition
export interface Property {
  id: number
  name: string
  description: string
  goal_amount: number
  current_amount: number
  status: 'Pending' | 'Active' | 'Funded' | 'Completed' | 'Cancelled'
  property_status: 'available' | 'under_review' | 'sold_out' | 'rented'
  location: string
  property_size: number
  property_type: 'residential' | 'commercial' | 'industrial' | 'land'
  bedrooms?: number
  bathrooms?: number
  construction_year?: number
  expected_roi?: number
  rental_yield?: number
  investment_period?: number
  minimum_investment?: number
  image_url?: string
  featured: boolean
  created_at: string
  updated_at: string
  images?: PropertyImage[]
  documents?: PropertyDocument[]
  investor_count?: number
  total_invested?: number
  creator_name?: string
  creator_surname?: string
}

export interface PropertyImage {
  id?: number
  project_id?: number
  image_url: string
  cloudinary_public_id?: string
  is_primary?: boolean
  data?: string // For file upload
}

export interface PropertyDocument {
  id?: number
  project_id?: number
  name: string
  file_url: string
  cloudinary_public_id?: string
  document_type:
    | 'contract'
    | 'image'
    | 'title_deed'
    | 'financial_projection'
    | 'other'
  data?: string // For file upload
}

export default function SuperAdminProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  )
  const { toast } = useToast()

  // Fetch properties when component mounts
  useEffect(() => {
    fetchProperties()
  }, [currentPage, searchQuery])

  const fetchProperties = async () => {
    try {
      setLoading(true)

      // Fetch all properties
      const response = await axiosInstance.get('/properties', {
        params: {
          page: currentPage,
          limit: 9,
          search: searchQuery || undefined,
        },
      })

      const data = response.data.data
      setProperties(data.properties)
      setTotalPages(data.pagination.totalPages)

      // Fetch featured properties
      const featuredResponse = await axiosInstance.get('/properties', {
        params: {
          featured: true,
          limit: 4,
        },
      })

      setFeaturedProperties(featuredResponse.data.data.properties)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load properties. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProperty = () => {
    setSelectedProperty(null)
    setOpenDialog(true)
  }

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property)
    setOpenDialog(true)
  }

  const handleDeleteProperty = async (id: number) => {
    try {
      await axiosInstance.delete(`/properties/${id}`)

      toast({
        title: 'Success',
        description: 'Property deleted successfully',
      })

      fetchProperties()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleToggleFeatured = async (id: number) => {
    try {
      await axiosInstance.put(`/properties/${id}/toggle-featured`)

      toast({
        title: 'Success',
        description: 'Property featured status updated successfully',
      })

      fetchProperties()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleDialogClose = (shouldRefresh: boolean) => {
    setOpenDialog(false)
    if (shouldRefresh) {
      fetchProperties()
    }
  }

  return (
    <>
      <Header fixed>
        <Search onSearch={handleSearch} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Property Management
            </h2>
            <p className='text-muted-foreground'>
              Manage all real estate properties and listings
            </p>
          </div>
          <Button onClick={handleCreateProperty}>
            <Plus className='mr-2 h-4 w-4' />
            Add Property
          </Button>
        </div>

        <Tabs defaultValue='all'>
          <TabsList className='mb-4'>
            <TabsTrigger value='all'>All Properties</TabsTrigger>
            <TabsTrigger value='featured'>Featured</TabsTrigger>
          </TabsList>

          <TabsContent value='all' className='space-y-4'>
            {loading ? (
              <div className='flex justify-center py-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
              </div>
            ) : (
              <>
                {properties.length === 0 ? (
                  <div className='flex flex-col items-center justify-center py-12'>
                    <p className='mb-4 text-xl font-semibold'>
                      No properties found
                    </p>
                    <Button onClick={handleCreateProperty}>
                      <Plus className='mr-2 h-4 w-4' />
                      Add Your First Property
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                      {properties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          onEdit={() => handleEditProperty(property)}
                          onDelete={() => handleDeleteProperty(property.id)}
                          onToggleFeatured={() =>
                            handleToggleFeatured(property.id)
                          }
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className='mt-6 flex justify-center'>
                        <div className='flex space-x-2'>
                          <Button
                            variant='outline'
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <div className='flex items-center space-x-1'>
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? 'default' : 'outline'
                                }
                                className='h-8 w-8 p-0'
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            ))}
                          </div>
                          <Button
                            variant='outline'
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value='featured'>
            {loading ? (
              <div className='flex justify-center py-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
              </div>
            ) : (
              <>
                {featuredProperties.length === 0 ? (
                  <div className='flex flex-col items-center justify-center py-12'>
                    <p className='mb-4 text-xl font-semibold'>
                      No featured properties
                    </p>
                    <p className='text-muted-foreground'>
                      Mark properties as featured to display them here.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {featuredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onEdit={() => handleEditProperty(property)}
                        onDelete={() => handleDeleteProperty(property.id)}
                        onToggleFeatured={() =>
                          handleToggleFeatured(property.id)
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {openDialog && (
          <PropertyFormDialog
            property={selectedProperty}
            open={openDialog}
            onOpenChange={handleDialogClose}
          />
        )}
      </Main>
    </>
  )
}
