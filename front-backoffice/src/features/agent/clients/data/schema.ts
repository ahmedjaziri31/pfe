import { z } from 'zod'

// Status Type
const clientStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('pending'),
])
export type ClientStatus = z.infer<typeof clientStatusSchema>

// Interaction Type
export const interactionTypeSchema = z.union([
  z.literal('call'),
  z.literal('email'),
  z.literal('meeting'),
  z.literal('note'),
])
export type InteractionType = z.infer<typeof interactionTypeSchema>

export const interactionSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  notes: z.string(),
  date: z.coerce.date(),
  type: interactionTypeSchema,
})
export type Interaction = z.infer<typeof interactionSchema>

// Follow-Up Type
export const followUpSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  description: z.string(),
  scheduledDate: z.coerce.date(),
  completed: z.boolean().optional(),
})
export type FollowUp = z.infer<typeof followUpSchema>

// Client Schema with optional CRM fields
export const clientSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: clientStatusSchema,
  assignedDate: z.coerce.date(),
  lastContact: z.coerce.date(),
  leadCategory: z.union([z.literal('hot'), z.literal('warm'), z.literal('cold')]).optional(),
  interactions: z.array(interactionSchema).optional(),
  followUps: z.array(followUpSchema).optional(),
})

export type Client = z.infer<typeof clientSchema>
export const clientListSchema = z.array(clientSchema)