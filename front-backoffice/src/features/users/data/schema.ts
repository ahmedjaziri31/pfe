import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('pending'),
  z.literal('suspended'),
  z.literal('rejected'),
  z.literal('unverified'),
])
export type UserStatus = z.infer<typeof userStatusSchema>
export { userStatusSchema }

const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('agent'),
  z.literal('user'),
])
export type UserRole = z.infer<typeof userRoleSchema>
export { userRoleSchema }

const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  status: userStatusSchema,
  role: userRoleSchema,
  rawApprovalStatus: z.string().optional(),
  isVerified: z.boolean().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  profilePicture: z.string().optional(),
  accountNo: z.string().optional(),
  birthdate: z.string().optional(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
