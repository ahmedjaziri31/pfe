import { createFileRoute } from '@tanstack/react-router'
import AgentDashboard from '@/features/agent/dashboard'

export const Route = createFileRoute('/_authenticated/agent/dashboard')({
  component: AgentDashboard,
})
