import { createLazyFileRoute } from '@tanstack/react-router'
import PrivacyPolicyPage from '@/features/legal/privacy-policy'

export const Route = createLazyFileRoute('/(errors)/privacy')({
  component: PrivacyPolicyPage,
})
