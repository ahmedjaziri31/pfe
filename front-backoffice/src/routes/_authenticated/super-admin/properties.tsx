import { createFileRoute } from '@tanstack/react-router'
import SuperAdminProperties from '@/features/super-admin/properties'

export const Route = createFileRoute('/_authenticated/super-admin/properties')({
  component: SuperAdminProperties,
})
