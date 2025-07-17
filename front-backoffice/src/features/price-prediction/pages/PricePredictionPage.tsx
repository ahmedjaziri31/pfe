import React, { useState, useMemo, useEffect } from 'react'
import {
  Loader2,
  Home,
  Building,
  DollarSign,
  BarChart3,
  CheckCircle2,
  XCircle,
  Info,
  MapPin,
  Activity,
} from 'lucide-react'
// Icons
// Import chart components - assuming recharts is used
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
// For boolean fields
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// Assuming use of actual shadcn/ui components. Replace placeholders if necessary.
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

// Import the AI prediction service
import predictionService, { type PredictionFormData } from '@/api/services/prediction-service'

interface PredictionResult {
  price: number
  currency: string
  message: string
  minPrice: number
  maxPrice: number
  confidence: number
  rangePrices: Array<{ name: string; value: number }>
  model_used?: string
}

const initialFormData: PredictionFormData = {
  total_area: 120,
  rooms: 3,
  bathrooms: 2,
  bedrooms: 2,
  floor: 1,
  terrace: false,
  elevator: true,
  furnished: false,
  air_conditioning: true,
  heating: false,
  security: true,
  garage: false,
  garden: false,
  pool: false,
  latitude: 36.8065, // Default to Tunis
  longitude: 10.1815,
  city: 'Tunis',
  governorate: 'Tunis',
  payment_period_Mois: 1, // Monthly payment for rent
  payment_period_Semaine: 0, // Weekly payment (0 for monthly rent)
}

const propertyTypes = [
  {
    value: 'apartment',
    label: 'Apartment',
    icon: <Building className='mr-2 h-4 w-4' />,
  },
  { value: 'house', label: 'House', icon: <Home className='mr-2 h-4 w-4' /> },
]

const amenityFields: Array<keyof PredictionFormData> = [
  'terrace',
  'elevator',
  'furnished',
  'air_conditioning',
  'heating',
  'security',
  'garage',
  'garden',
  'pool',
]

// Tunisian governorates
const tunisianGovernorates = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
  'Bizerte', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Sousse',
  'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
  'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
]

export default function PricePredictionPage() {
  const [predictionType, setPredictionType] = useState<'sell' | 'rent'>('sell')
  const [propertyType, setPropertyType] = useState<string>(propertyTypes[0].value)
  const [formData, setFormData] = useState<PredictionFormData>(initialFormData)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiServiceStatus, setAiServiceStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')
  
  const { toast } = useToast()

  // Check AI service health on component mount
  useEffect(() => {
    checkAIServiceHealth()
  }, [])

  const checkAIServiceHealth = async () => {
    setAiServiceStatus('checking')
    try {
      const health = await predictionService.checkHealth()
      setAiServiceStatus(health.success ? 'available' : 'unavailable')
      
      if (!health.success) {
        toast({
          title: "AI Service Unavailable",
          description: "Price predictions may not work properly. Please check if the AI service is running on port 5001.",
          variant: "destructive"
        })
      }
    } catch (error) {
      setAiServiceStatus('unavailable')
      toast({
        title: "Connection Error",
        description: "Cannot connect to AI service. Please ensure the Flask server is running.",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    let processedValue: string | number = value
    if (type === 'number') {
      processedValue = parseFloat(value)
      if (isNaN(processedValue)) {
        processedValue = 0
      }
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }))
  }

  const handleSwitchChange = (name: keyof PredictionFormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'propertyType') {
      setPropertyType(value)
    } else if (name === 'governorate') {
      setFormData((prev) => ({ ...prev, governorate: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setPredictionResult(null)

    try {
      // Determine model name based on property type and prediction type
      const modelName = `${propertyType}_${predictionType === 'sell' ? 'buying' : 'rent'}`
      
      // Validate form data
      const validationErrors = predictionService.validatePredictionData(modelName, formData)
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '))
      setIsLoading(false)
      return
    }

      // Prepare data for the specific model
      let predictionData = { ...formData }
      
      // Handle model-specific field mappings
      if (modelName.includes('rent')) {
        // For rent models, use bathrooms_number instead of bathrooms
        predictionData.bathrooms_number = formData.bathrooms
        delete predictionData.bathrooms
        
        // For apartment rent, use floor_number instead of floor
        if (propertyType === 'apartment') {
          predictionData.floor_number = formData.floor
          delete predictionData.floor
        }
        
        // Ensure both payment period fields are present (Flask API requires both)
        predictionData.payment_period_Mois = formData.payment_period_Mois || 1
        predictionData.payment_period_Semaine = formData.payment_period_Semaine || 0
      }

      console.log('Submitting prediction request:', {
        modelName,
        data: predictionData
      })

      // Call AI prediction service
      const response = await predictionService.predictPrice(modelName, predictionData)
      
      if (!response.success || !response.prediction) {
        throw new Error(response.error || 'Prediction failed')
      }

      // Extract prediction value (assuming it's an array with one value)
      const predictedPrice = Array.isArray(response.prediction) 
        ? response.prediction[0] 
        : response.prediction

      // Calculate price range (15% variance)
      const variancePercentage = 0.15
      const minPrice = Math.floor((predictedPrice * (1 - variancePercentage)) / 100) * 100
      const maxPrice = Math.floor((predictedPrice * (1 + variancePercentage)) / 100) * 100

    // Generate range data for chart
    const rangePrices = [
      { name: 'Min', value: minPrice },
        { name: 'Low Estimate', value: Math.floor((predictedPrice * 0.95) / 100) * 100 },
        { name: 'AI Prediction', value: Math.floor(predictedPrice / 100) * 100 },
        { name: 'High Estimate', value: Math.floor((predictedPrice * 1.05) / 100) * 100 },
      { name: 'Max', value: maxPrice },
    ]

    setPredictionResult({
        price: Math.floor(predictedPrice / 100) * 100,
        currency: response.currency || 'TND',
        message: `AI-powered ${predictionType} price prediction for your ${propertyType} in ${formData.city}, ${formData.governorate}.`,
      minPrice,
      maxPrice,
        confidence: response.confidence || 0.85,
      rangePrices,
        model_used: response.model_name
      })

      toast({
        title: "Prediction Complete",
        description: `AI model successfully predicted the ${predictionType} price for your ${propertyType}.`,
      })

    } catch (error: any) {
      console.error('Prediction error:', error)
      setError(error.message || 'Failed to get price prediction. Please try again.')
      
      toast({
        title: "Prediction Failed",
        description: error.message || "Unable to get price prediction from AI service.",
        variant: "destructive"
      })
    } finally {
    setIsLoading(false)
    }
  }

  const currentPropertyIcon = useMemo(() => {
    return (
      propertyTypes.find((pt) => pt.value === propertyType)?.icon || (
        <Home className='mr-2 h-4 w-4' />
      )
    )
  }, [propertyType])

  return (
    <div className='flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950'>
      {/* Header with AI Service Status */}
      <div className="border-b bg-white dark:bg-slate-900 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI Price Prediction</h1>
              <p className="text-muted-foreground">Get accurate property valuations powered by machine learning</p>
            </div>
            <div className="flex items-center gap-2">
              <Activity className={`h-4 w-4 ${
                aiServiceStatus === 'available' ? 'text-green-500' : 
                aiServiceStatus === 'unavailable' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <span className={`text-sm font-medium ${
                aiServiceStatus === 'available' ? 'text-green-600' : 
                aiServiceStatus === 'unavailable' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                AI Service {aiServiceStatus === 'checking' ? 'Checking...' : 
                          aiServiceStatus === 'available' ? 'Online' : 'Offline'}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkAIServiceHealth}
                disabled={aiServiceStatus === 'checking'}
              >
                {aiServiceStatus === 'checking' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
        <div className='container mx-auto max-w-6xl space-y-8'>
          <Tabs
            value={predictionType}
            onValueChange={(value) => {
              setPredictionType(value as 'sell' | 'rent')
              setPredictionResult(null)
              setError(null)
            }}
            className='w-full'
          >
            <TabsList className='mx-auto grid h-12 w-full max-w-md grid-cols-2 rounded-lg'>
              <TabsTrigger
                value='sell'
                className='h-full rounded-md text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
              >
                Sell Price
              </TabsTrigger>
              <TabsTrigger
                value='rent'
                className='h-full rounded-md text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
              >
                Rent Price
              </TabsTrigger>
            </TabsList>

            {/* Shared Form within a Card */}
            <Card className='mt-6 border-slate-200 shadow-lg dark:border-slate-800'>
              <CardHeader className='border-b bg-slate-50 dark:bg-slate-900/50'>
                <div className='flex items-center space-x-3'>
                  {React.cloneElement(currentPropertyIcon, {
                    className: 'h-6 w-6 text-primary',
                  })}
                  <CardTitle className='text-xl'>
                    AI-Powered Property Valuation for{' '}
                    {predictionType === 'sell' ? 'Sale' : 'Rent'}
                  </CardTitle>
                </div>
                <CardDescription>
                  Our machine learning models analyze property characteristics to provide accurate price predictions.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className='grid gap-6 py-6 md:gap-8'>
                  {/* Section for Basic Info */}
                  <div className='grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3'>
                    <div>
                      <Label htmlFor='propertyType' className='text-sm font-medium'>
                        Property Type
                      </Label>
                      <Select
                        value={propertyType}
                        onValueChange={(value) => handleSelectChange('propertyType', value)}
                        name='propertyType'
                      >
                        <SelectTrigger className='mt-1.5 h-10 w-full'>
                          <SelectValue placeholder='Select property type' />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((pt) => (
                            <SelectItem
                              key={pt.value}
                              value={pt.value}
                              className='flex items-center'
                            >
                              {React.cloneElement(pt.icon, {
                                className: 'mr-2 h-4 w-4 opacity-70',
                              })}
                              {pt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor='total_area' className='text-sm font-medium'>
                        Total Area (m²) *
                      </Label>
                      <Input
                        id='total_area'
                        name='total_area'
                        type='number'
                        value={formData.total_area}
                        onChange={handleInputChange}
                        className='mt-1.5 h-10'
                        placeholder='e.g., 120'
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor='rooms' className='text-sm font-medium'>
                        Number of Rooms *
                      </Label>
                      <Input
                        id='rooms'
                        name='rooms'
                        type='number'
                        value={formData.rooms}
                        onChange={handleInputChange}
                        className='mt-1.5 h-10'
                        placeholder='e.g., 3'
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor='bathrooms' className='text-sm font-medium'>
                        Number of Bathrooms *
                      </Label>
                      <Input
                        id='bathrooms'
                        name='bathrooms'
                        type='number'
                        value={formData.bathrooms || ''}
                        onChange={handleInputChange}
                        className='mt-1.5 h-10'
                        placeholder='e.g., 2'
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor='bedrooms' className='text-sm font-medium'>
                        Number of Bedrooms *
                      </Label>
                      <Input
                        id='bedrooms'
                        name='bedrooms'
                        type='number'
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className='mt-1.5 h-10'
                        placeholder='e.g., 2'
                        required
                      />
                    </div>
                    {propertyType === 'apartment' && (
                    <div>
                      <Label htmlFor='floor' className='text-sm font-medium'>
                          Floor Number *
                      </Label>
                      <Input
                        id='floor'
                        name='floor'
                        type='number'
                          value={formData.floor || ''}
                        onChange={handleInputChange}
                        className='mt-1.5 h-10'
                          placeholder='e.g., 3'
                          required
                      />
                    </div>
                    )}
                  </div>

                  {/* Location Section */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold flex items-center gap-2'>
                      <MapPin className='h-5 w-5' />
                      Location Details
                    </h3>
                    <div className='grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4'>
                  <div>
                        <Label htmlFor='governorate' className='text-sm font-medium'>
                          Governorate *
                    </Label>
                        <Select
                          value={formData.governorate}
                          onValueChange={(value) => handleSelectChange('governorate', value)}
                          name='governorate'
                        >
                          <SelectTrigger className='mt-1.5 h-10 w-full'>
                            <SelectValue placeholder='Select governorate' />
                          </SelectTrigger>
                          <SelectContent>
                            {tunisianGovernorates.map((gov) => (
                              <SelectItem key={gov} value={gov}>
                                {gov}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                  </div>
                  <div>
                        <Label htmlFor='city' className='text-sm font-medium'>
                          City/Municipality *
                    </Label>
                        <Input
                          id='city'
                          name='city'
                          type='text'
                          value={formData.city}
                          onChange={handleInputChange}
                          className='mt-1.5 h-10'
                          placeholder='e.g., Tunis'
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor='latitude' className='text-sm font-medium'>
                          Latitude *
                        </Label>
                        <Input
                          id='latitude'
                          name='latitude'
                          type='number'
                          step='any'
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className='mt-1.5 h-10'
                          placeholder='36.8065'
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor='longitude' className='text-sm font-medium'>
                          Longitude *
                        </Label>
                        <Input
                          id='longitude'
                          name='longitude'
                          type='number'
                          step='any'
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className='mt-1.5 h-10'
                          placeholder='10.1815'
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rent-specific fields */}
                  {predictionType === 'rent' && (
                    <div className='space-y-4'>
                      <h3 className='text-lg font-semibold'>Rental Details</h3>
                      <div className='grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2'>
                        <div>
                          <Label htmlFor='payment_period_Mois' className='text-sm font-medium'>
                            Monthly Payment Period
                          </Label>
                          <Input
                            id='payment_period_Mois'
                            name='payment_period_Mois'
                            type='number'
                            value={formData.payment_period_Mois || ''}
                            onChange={handleInputChange}
                            className='mt-1.5 h-10'
                            placeholder='1 for monthly'
                          />
                        </div>
                        <div>
                          <Label htmlFor='payment_period_Semaine' className='text-sm font-medium'>
                            Weekly Payment Period
                          </Label>
                          <Input
                            id='payment_period_Semaine'
                            name='payment_period_Semaine'
                            type='number'
                            value={formData.payment_period_Semaine || ''}
                            onChange={handleInputChange}
                            className='mt-1.5 h-10'
                            placeholder='0 for monthly rent'
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amenities Section */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Property Features</h3>
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                      {amenityFields.map((field) => {
                        // Skip elevator for houses
                        if (field === 'elevator' && propertyType === 'house') return null
                        
                        return (
                          <div key={field} className='flex items-center space-x-2'>
                            <Switch
                              id={field}
                              checked={Boolean(formData[field])}
                              onCheckedChange={(checked) => handleSwitchChange(field, checked)}
                            />
                        <Label
                              htmlFor={field}
                              className='text-sm font-medium capitalize cursor-pointer'
                        >
                              {field.replace('_', ' ')}
                        </Label>
                      </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className='border-t bg-slate-50 dark:bg-slate-900/50'>
                  <div className='flex w-full flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
                  <Button
                    type='submit'
                      disabled={isLoading || aiServiceStatus === 'unavailable'}
                      className='flex-1 h-12 text-base font-medium'
                  >
                    {isLoading ? (
                        <>
                      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                          Getting AI Prediction...
                        </>
                    ) : (
                        <>
                      <BarChart3 className='mr-2 h-5 w-5' />
                          Get AI Price Prediction
                        </>
                      )}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setFormData(initialFormData)
                        setPredictionResult(null)
                        setError(null)
                      }}
                      className='h-12 px-8'
                    >
                      Reset Form
                  </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant='destructive'>
                <XCircle className='h-4 w-4' />
                <AlertTitle>Prediction Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* AI Service Offline Warning */}
            {aiServiceStatus === 'unavailable' && (
              <Alert variant='destructive'>
                <XCircle className='h-4 w-4' />
                <AlertTitle>AI Service Unavailable</AlertTitle>
                <AlertDescription>
                  The AI prediction service is currently offline. Please ensure the Flask server is running on port 5001.
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2" 
                    onClick={checkAIServiceHealth}
                  >
                    Retry Connection
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Results Display */}
            {predictionResult && (
              <Card className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30'>
                <CardHeader>
                  <div className='flex items-center space-x-3'>
                    <CheckCircle2 className='h-6 w-6 text-green-600' />
                    <CardTitle className='text-xl text-green-800 dark:text-green-200'>
                      AI Prediction Results
                    </CardTitle>
                  </div>
                  <CardDescription className='text-green-700 dark:text-green-300'>
                    {predictionResult.message}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Main Price Display */}
                  <div className='text-center'>
                    <div className='text-4xl font-bold text-green-800 dark:text-green-200'>
                      {predictionResult.price.toLocaleString()} {predictionResult.currency}
                    </div>
                    <div className='text-sm text-green-600 dark:text-green-400 mt-1'>
                      Confidence: {Math.round(predictionResult.confidence * 100)}%
                      {predictionResult.model_used && (
                        <span className="ml-2">• Model: {predictionResult.model_used}</span>
                      )}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                    <div className='text-center'>
                      <div className='text-sm text-green-600 dark:text-green-400'>
                        Minimum Estimate
                      </div>
                      <div className='text-xl font-semibold text-green-800 dark:text-green-200'>
                        {predictionResult.minPrice.toLocaleString()} {predictionResult.currency}
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-sm text-green-600 dark:text-green-400'>
                        AI Prediction
                      </div>
                      <div className='text-xl font-semibold text-green-800 dark:text-green-200'>
                        {predictionResult.price.toLocaleString()} {predictionResult.currency}
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-sm text-green-600 dark:text-green-400'>
                        Maximum Estimate
                      </div>
                      <div className='text-xl font-semibold text-green-800 dark:text-green-200'>
                        {predictionResult.maxPrice.toLocaleString()} {predictionResult.currency}
                      </div>
                    </div>
                  </div>

                  {/* Price Range Chart */}
                  <div className='h-64'>
                      <ResponsiveContainer width='100%' height='100%'>
                      <AreaChart data={predictionResult.rangePrices}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                          <YAxis
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip
                          formatter={(value: any) => [`${value.toLocaleString()} ${predictionResult.currency}`, 'Price']}
                          />
                          <Area
                            type='monotone'
                            dataKey='value'
                          stroke='#16a34a'
                          fill='#16a34a'
                          fillOpacity={0.3}
                        />
                        <ReferenceLine
                          x='AI Prediction'
                          stroke='#dc2626'
                          strokeDasharray='5 5'
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                  </div>

                  {/* Additional Info */}
                  <Alert>
                    <Info className='h-4 w-4' />
                    <AlertTitle>About This Prediction</AlertTitle>
                    <AlertDescription>
                      This prediction is generated by our machine learning model trained on Tunisian real estate data. 
                      The model considers property features, location data, and market trends to provide accurate valuations. 
                      Actual market prices may vary based on current market conditions, property condition, and negotiation.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
