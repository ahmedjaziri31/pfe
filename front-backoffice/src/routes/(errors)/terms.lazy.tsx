import { createLazyFileRoute } from '@tanstack/react-router'
import TermsOfServicePage from '@/features/legal/terms-of-service'

export const Route = createLazyFileRoute('/(errors)/terms')({
  component: TermsOfServicePage,
})
