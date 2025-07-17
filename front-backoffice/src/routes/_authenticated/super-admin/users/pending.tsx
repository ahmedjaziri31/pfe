import { createFileRoute } from '@tanstack/react-router'
import SuperAdminUsers from '@/features/super-admin/users'

export const Route = createFileRoute(
  '/_authenticated/super-admin/users/pending'
)({
  component: SuperAdminUsers,
})
