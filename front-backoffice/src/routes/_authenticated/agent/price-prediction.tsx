import { createFileRoute } from '@tanstack/react-router'
import PricePredictionPage from '@/features/price-prediction/pages/PricePredictionPage'

export const Route = createFileRoute('/_authenticated/agent/price-prediction')({
  component: PricePredictionPage,
})
