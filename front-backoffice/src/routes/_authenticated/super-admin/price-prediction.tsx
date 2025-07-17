import { createFileRoute } from '@tanstack/react-router'
import PricePredictionPage from '@/features/price-prediction/pages/PricePredictionPage'

export const Route = createFileRoute(
  '/_authenticated/super-admin/price-prediction'
)({
  component: PricePredictionPage,
})
