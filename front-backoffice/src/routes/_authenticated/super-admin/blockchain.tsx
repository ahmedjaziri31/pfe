import { createFileRoute } from '@tanstack/react-router'
import { BlockchainManagementPage } from '@/features/super-admin/blockchain'

export const Route = createFileRoute('/_authenticated/super-admin/blockchain')({
  component: BlockchainManagementPage,
})
