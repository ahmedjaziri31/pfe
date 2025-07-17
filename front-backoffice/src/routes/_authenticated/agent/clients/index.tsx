import { createFileRoute } from '@tanstack/react-router'
import AgentClients from '@/features/agent/clients'

export const Route = createFileRoute('/_authenticated/agent/clients/')({
  component: AgentClients,
})
