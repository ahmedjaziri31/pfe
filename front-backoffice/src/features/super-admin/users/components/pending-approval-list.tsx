import { useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { User } from '@/features/users/data/schema'
import { UserRoleManagement } from './user-role-management'

interface PendingApprovalListProps {
  users: User[]
  onApprove: (userId: string, role: string) => void
  onReject: (userId: string) => void
}

export function PendingApprovalList({
  users,
  onApprove,
  onReject,
}: PendingApprovalListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleApproveClick = (user: User) => {
    setSelectedUser(user)
    setIsRoleDialogOpen(true)
  }

  const handleRejectClick = (userId: string) => {
    onReject(userId)
    toast({
      title: 'User Rejected',
      description: 'The user registration has been rejected',
      variant: 'destructive',
    })
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    onApprove(userId, newRole)
    setIsRoleDialogOpen(false)
    toast({
      title: 'User Approved',
      description: 'The user has been approved with the assigned role',
    })
  }

  // Refined filter to align more closely with toolbar filtering logic
  const pendingUsersToDisplay = users.filter((user) => {
    const currentRawApprovalStatus = user.rawApprovalStatus?.toLowerCase()

    // Primary condition: User needs attention if their raw status is pending or unverified.
    const needsAttention =
      currentRawApprovalStatus === 'pending' ||
      currentRawApprovalStatus === 'unverified'

    // Safeguard: Ensure they haven't been fully processed via a direct approvalStatus update from backend.
    // (This assumes user.approvalStatus is the most up-to-date reflection of actual DB state after an action)
    const notYetProcessed =
      user.approvalStatus !== 'approved' && user.approvalStatus !== 'rejected'

    // Also consider users whose general 'status' field might indicate a pending state,
    // if rawApprovalStatus is not yet populated or is out of sync. This was part of the original logic.
    const legacyPending =
      user.status === 'pending' || user.status === 'unverified'

    return (needsAttention || legacyPending) && notYetProcessed
  })

  // Helper function to get badge color based on approval status and verification
  const getApprovalBadgeColor = (
    approvalStatus?: string,
    isVerified?: boolean
  ) => {
    const statusToCheck = approvalStatus || 'unverified' // Default to unverified if rawApprovalStatus is missing

    if (statusToCheck === 'pending' && isVerified) {
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300' // Email verified, pending admin
    }
    switch (statusToCheck) {
      case 'approved':
        return 'border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300'
      case 'pending':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
      case 'rejected':
        return 'border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300'
      case 'unverified':
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300'
    }
  }

  // Helper to get badge display text based on approval status and verification
  const getApprovalBadgeText = (user: User) => {
    const statusToDisplay =
      user.rawApprovalStatus || user.status || 'unverified'
    if (
      (statusToDisplay === 'pending' || statusToDisplay === 'unverified') &&
      user.isVerified
    ) {
      return 'Email Verified'
    }
    return statusToDisplay
  }

  if (pendingUsersToDisplay.length === 0) {
    return (
      <div className='py-8 text-center'>
        <p className='text-muted-foreground'>
          No pending approvals at this time.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsersToDisplay.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant='outline'
                    className={cn(
                      'capitalize',
                      getApprovalBadgeColor(
                        user.rawApprovalStatus || user.status,
                        user.isVerified
                      )
                    )}
                  >
                    {getApprovalBadgeText(user)}
                  </Badge>
                </TableCell>
                <TableCell>{format(user.createdAt, 'MMM d, yyyy')}</TableCell>
                <TableCell className='space-x-2'>
                  <Button size='sm' onClick={() => handleApproveClick(user)}>
                    Approve
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleRejectClick(user.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className='sm:max-w-[550px]'>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to this user before approval
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserRoleManagement
              user={selectedUser}
              onRoleChange={handleRoleChange}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
