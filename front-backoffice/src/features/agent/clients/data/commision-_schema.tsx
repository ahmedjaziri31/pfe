import { z } from 'zod'

const commissionStatusSchema = z.union([
  z.literal('paid'),
  z.literal('unpaid'),
  z.literal('disputed'),
])
export type CommissionStatus = z.infer<typeof commissionStatusSchema>

export const commissionSchema = z.object({
  id: z.string(),
  property: z.string(),
  saleDate: z.coerce.date(), // Important: allows parsing strings as Date
  saleAmount: z.number(),
  commissionRate: z.number(),
  commissionEarned: z.number(),
  status: commissionStatusSchema,
})
export type Commission = z.infer<typeof commissionSchema>
export const commissionListSchema = z.array(commissionSchema)