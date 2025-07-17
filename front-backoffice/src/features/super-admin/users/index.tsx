import { useState, useEffect, useCallback } from 'react'
import {
  CheckIcon,
  ListFilterIcon,
  RefreshCwIcon,
  UserCheckIcon,
  ZapIcon,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  UsersActionDialog,
  type UserForm,
} from '@/features/users/components/users-action-dialog'
import { columns } from '@/features/users/components/users-columns'
import {
  UsersInviteDialog,
  type UserInviteFormValues,
} from '@/features/users/components/users-invite-dialog'
import { UsersTable } from '@/features/users/components/users-table'
import UsersProvider, { useUsers } from '@/features/users/context/users-context'
import type { User, UserStatus } from '@/features/users/data/schema'
import { SystemRolesOverview } from './components/SystemRolesOverview'

// Import the auth store

// Mock Data was removed to avoid linter errors

// This mock data will be used as fallback if API fails
const _MOCK_PENDING_USERS: User[] = [
  {
    id: 'usr_004',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phoneNumber: '555-0104',
    status: 'pending',
    role: 'user', // Initial role, might be changed on approval
    createdAt: new Date('2024-07-29T10:00:00Z'),
    updatedAt: new Date('2024-07-29T10:00:00Z'),
  },
  {
    id: 'usr_006',
    firstName: 'Frank',
    lastName: 'Miller',
    email: 'frank.miller@example.com',
    phoneNumber: '555-0106',
    status: 'pending',
    role: 'user',
    createdAt: new Date('2024-07-30T09:00:00Z'),
    updatedAt: new Date('2024-07-30T09:00:00Z'),
  },
]

// Main container component that provides the Users context
export default function SuperAdminUsers() {
  return (
    <UsersProvider>
      <UsersContent />
    </UsersProvider>
  )
}

// Inner component that uses the Users context
function UsersContent() {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all-users')
  const { toast } = useToast()
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  const accessToken = useAuthStore((state) => state.auth.accessToken) // Get accessToken from store

  // Helper function to identify pending users - make it more specific
  const isPendingUser = useCallback((user: User): boolean => {
    // Only show users where both status and rawApprovalStatus are pending,
    // or at least rawApprovalStatus is pending (backend source of truth)
    return user.rawApprovalStatus === 'pending'
  }, [])

  const fetchAllUsers = useCallback(
    async (page = 1, limit = 100, sortBy = 'createdAt', sortOrder = 'desc') => {
      setLoading(true)
      if (!accessToken) {
        toast({
          title: 'Authentication Error',
          description: 'No token found.',
          variant: 'destructive',
        })
        setAllUsers([])
        setLoading(false)
        return
      }
      try {
        const response = await fetch(
          `/api/users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch users')
        }
        const result = await response.json()
        setAllUsers(result.data || [])
      } catch (error: unknown) {
        // Typed error
        const message =
          error instanceof Error ? error.message : 'Could not load users.'
        toast({
          title: 'Error Fetching Users',
          description: message,
          variant: 'destructive',
        })
        setAllUsers([])
      } finally {
        setLoading(false)
      }
    },
    [accessToken, toast]
  )

  useEffect(() => {
    if (accessToken) fetchAllUsers()
  }, [accessToken, fetchAllUsers])

  useEffect(() => {
    // Keep track of the last URL to detect changes
    let lastUrl = window.location.href

    const handleUrlChange = () => {
      const hash = window.location.hash.replace(/^#/, '')
      const isUsersPage = window.location.pathname.includes('/users')

      if (!isUsersPage) return

      if (
        hash === 'roles-permissions' ||
        hash === 'all-users' ||
        hash === 'pending-approval'
      ) {
        setActiveTab(hash)
      } else if (hash === '') {
        // If there's no hash, check if there are pending users
        const pendingCount = allUsers.filter(isPendingUser).length
        if (pendingCount > 0) {
          setActiveTab('pending-approval')
          // Use replace state instead of directly modifying location.hash to avoid
          // creating additional history entries
          window.history.replaceState(null, '', `#pending-approval`)
        } else {
          setActiveTab('all-users')
          window.history.replaceState(null, '', `#all-users`)
        }
      } else {
        setActiveTab('all-users')
        window.history.replaceState(null, '', `#all-users`)
      }
    }

    // Set up multiple ways to detect navigation:

    // 1. Check for URL changes using an interval (catches all navigation methods)
    const intervalId = setInterval(() => {
      const currentUrl = window.location.href
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl
        handleUrlChange()
      }
    }, 200)

    // 2. Listen for hash changes (for anchor links and manual hash changes)
    const onHashChange = () => {
      lastUrl = window.location.href
      handleUrlChange()
    }
    window.addEventListener('hashchange', onHashChange)

    // 3. Listen for popstate events (browser back/forward)
    const onPopState = () => {
      lastUrl = window.location.href
      handleUrlChange()
    }
    window.addEventListener('popstate', onPopState)

    // 4. Run once on mount to set initial state
    handleUrlChange()

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onPopState)
    }
  }, [allUsers, isPendingUser])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    window.location.hash = value
  }

  const refreshUsersList = useCallback(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  const mapRawApprovalToFormStatus = useCallback(
    (rawApprovalStatus?: string): UserStatus => {
      if (!rawApprovalStatus) return 'pending'
      switch (rawApprovalStatus.toLowerCase()) {
        case 'approved':
          return 'active'
        case 'rejected':
          return 'rejected'
        case 'pending':
          return 'pending'
        case 'unverified':
          return 'unverified'
        case 'suspended':
          return 'suspended'
        default:
          return 'pending'
      }
    },
    []
  )

  const handleOpenEditDialog = useCallback(
    (userToEdit: User) => {
      setCurrentRow(userToEdit)
      setOpen('edit')
    },
    [setCurrentRow, setOpen]
  )

  const handleOpenAddDialog = useCallback(() => {
    setCurrentRow(null)
    setOpen('add')
  }, [setCurrentRow, setOpen])

  const handleApproveClick = useCallback(
    (userToApprove: User) => {
      setCurrentRow(userToApprove)
      setOpen('assignRoleBeforeApproval')
    },
    [setCurrentRow, setOpen]
  )

  const handleAssignRoleAndApprove = useCallback(
    async (userId: string, roleName: User['role']) => {
      setLoading(true)
      if (!accessToken) {
        toast({
          title: 'Auth Error',
          description: 'No token',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
      try {
        const response = await fetch(
          `/api/admin/user-management/users/${userId}/approve-pending`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ roleName }),
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Approve failed')
        }
        const result = await response.json()
        toast({
          title: 'User Approved',
          description: `User ${result.user.name || userId} approved as ${roleName}.`,
        })
        refreshUsersList()
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown error during approval.'
        toast({
          title: 'Approve Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
        setOpen(null)
        setCurrentRow(null)
      }
    },
    [accessToken, toast, refreshUsersList, setLoading, setOpen, setCurrentRow]
  )

  const handleRejectAction = useCallback(
    async (userId: string) => {
      setLoading(true)
      if (!accessToken) {
        toast({
          title: 'Auth Error',
          description: 'No token',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
      try {
        const response = await fetch(
          `/api/admin/user-management/users/${userId}/reject-pending`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Reject failed')
        }
        const result = await response.json()
        toast({
          title: 'User Rejected',
          description: `User ${result.user.name || userId} rejected.`,
        })
        refreshUsersList()
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown error during rejection.'
        toast({
          title: 'Reject Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [accessToken, toast, refreshUsersList, setLoading]
  )

  interface BackendUserUpdatePayload {
    name?: string
    surname?: string
    email?: string
    phoneNumber?: string
    roleName?: User['role']
    status?: UserStatus
    isVerified?: boolean
    walletAddress?: string
    password?: string
    notes?: string
    profilePicture?: string
    accountNo?: string
    birthdate?: string
  }

  const handleUserUpdate = useCallback(
    async (userData: UserForm) => {
      setLoading(true)
      if (!accessToken || !currentRow) {
        toast({
          title: 'Update Error',
          description: 'User context or token missing.',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
      try {
        const backendPayload: BackendUserUpdatePayload = {}

        if (userData.firstName !== currentRow.firstName)
          backendPayload.name = userData.firstName
        if (userData.lastName !== currentRow.lastName)
          backendPayload.surname = userData.lastName
        if (userData.email !== currentRow.email)
          backendPayload.email = userData.email
        if (userData.phoneNumber !== (currentRow.phoneNumber || ''))
          backendPayload.phoneNumber = userData.phoneNumber
        if (userData.role !== currentRow.role)
          backendPayload.roleName = userData.role
        if (userData.isVerified !== currentRow.isVerified)
          backendPayload.isVerified = userData.isVerified

        if (userData.profilePicture !== (currentRow.profilePicture || ''))
          backendPayload.profilePicture = userData.profilePicture
        if (userData.accountNo !== (currentRow.accountNo || ''))
          backendPayload.accountNo = userData.accountNo

        const currentBirthdateStr = currentRow.birthdate
          ? new Date(currentRow.birthdate).toISOString().split('T')[0]
          : ''
        const formBirthdateStr = userData.birthdate
          ? new Date(userData.birthdate).toISOString().split('T')[0]
          : ''
        if (formBirthdateStr !== currentBirthdateStr)
          backendPayload.birthdate = userData.birthdate

        const initialFormStatus = mapRawApprovalToFormStatus(
          currentRow.rawApprovalStatus
        )
        if (userData.status !== initialFormStatus)
          backendPayload.status = userData.status

        if (userData.walletAddress)
          backendPayload.walletAddress = userData.walletAddress
        if (userData.notes) backendPayload.notes = userData.notes
        if (userData.password && userData.password.length > 0)
          backendPayload.password = userData.password

        if (Object.keys(backendPayload).length === 0) {
          toast({
            title: 'No Changes',
            description: 'No details were modified.',
          })
          setLoading(false)
          setOpen(null)
          setCurrentRow(null)
          return
        }

        const response = await fetch(
          `/api/admin/user-management/users/${currentRow.id}/update-details`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(backendPayload),
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Update failed')
        }
        const result = await response.json()
        toast({
          title: 'User Updated',
          description: `User ${result.user.name || currentRow.firstName} updated.`,
        })
        refreshUsersList()
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown error during update.'
        toast({
          title: 'Update Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
        setOpen(null)
        setCurrentRow(null)
      }
    },
    [
      accessToken,
      currentRow,
      toast,
      refreshUsersList,
      setLoading,
      setOpen,
      setCurrentRow,
      mapRawApprovalToFormStatus,
    ]
  )

  interface BackendUserCreatePayload
    extends Omit<BackendUserUpdatePayload, 'status'> {
    status: UserStatus // status for creation is UserStatus, backend maps to approvalStatus
  }

  const handleCreateUser = useCallback(
    async (userData: UserForm) => {
      setLoading(true)
      if (!accessToken) {
        toast({
          title: 'Auth Error',
          description: 'No token',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
      try {
        const backendPayload: BackendUserCreatePayload = {
          name: userData.firstName,
          surname: userData.lastName,
          email: userData.email,
          roleName: userData.role,
          status: userData.status,
        }
        if (userData.phoneNumber)
          backendPayload.phoneNumber = userData.phoneNumber
        if (userData.isVerified !== undefined)
          backendPayload.isVerified = userData.isVerified
        if (userData.walletAddress)
          backendPayload.walletAddress = userData.walletAddress
        if (userData.password) backendPayload.password = userData.password
        if (userData.notes) backendPayload.notes = userData.notes
        if (userData.profilePicture)
          backendPayload.profilePicture = userData.profilePicture
        if (userData.accountNo) backendPayload.accountNo = userData.accountNo
        if (userData.birthdate) backendPayload.birthdate = userData.birthdate

        const response = await fetch(`/api/admin/user-management/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(backendPayload),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Create failed')
        }
        const result = await response.json()
        toast({
          title: 'User Created',
          description: `User ${result.user.name || userData.firstName} created.`,
        })
        refreshUsersList()
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown error during creation.'
        toast({
          title: 'Creation Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
        setOpen(null)
      }
    },
    [accessToken, toast, refreshUsersList, setLoading, setOpen]
  )

  const handleDeleteAction = useCallback(
    async (userId: string) => {
      setLoading(true)
      if (!accessToken) {
        toast({
          title: 'Auth Error',
          description: 'No token',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
      try {
        const response = await fetch(
          `/api/admin/user-management/users/${userId}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Delete failed')
        }
        toast({ title: 'User Deleted', description: `User ${userId} deleted.` })
        refreshUsersList()
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown error during deletion.'
        toast({
          title: 'Delete Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [accessToken, toast, refreshUsersList, setLoading]
  )

  const handleSendInvite = useCallback(
    async (values: UserInviteFormValues) => {
      setLoading(true)
      if (!accessToken) {
        toast({
          title: 'Auth Error',
          description: 'No token',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
      try {
        const response = await fetch(
          `/api/admin/user-management/users/invite`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              email: values.email,
              roleName: values.roleName,
              description: values.desc,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to send invitation')
        }

        toast({
          title: 'Invitation Sent',
          description: `Invitation email sent to ${values.email}.`,
        })
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown error sending invitation.'
        toast({
          title: 'Invitation Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
        setOpen(null)
      }
    },
    [accessToken, toast, setLoading, setOpen]
  )

  const handleOpenInviteDialog = useCallback(() => {
    setOpen('invite')
  }, [setOpen])

  // Update the PendingApprovalActions component with enhanced design
  const PendingApprovalActions = ({ users }: { users: User[] }) => {
    if (users.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
          <div className='mb-3 rounded-full bg-muted p-2'>
            <CheckIcon className='h-5 w-5' />
          </div>
          <p>No pending users to approve</p>
        </div>
      )
    }

    return (
      <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'>
        {users.map((user) => (
          <div
            key={user.id}
            className='flex flex-col overflow-hidden rounded-md border bg-card shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md'
          >
            {/* Header with user info */}
            <div className='p-3 pb-2'>
              <div className='flex items-center gap-2'>
                {/* Smaller user avatar */}
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary'>
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='truncate font-medium'>
                    {user.firstName} {user.lastName}
                  </div>
                  <div className='truncate text-xs text-primary'>
                    {user.email}
                  </div>
                </div>
                <Badge
                  variant='secondary'
                  className='h-5 bg-yellow-100 px-2 py-0 text-xs text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                >
                  Pending
                </Badge>
              </div>
            </div>

            {/* User details */}
            <div className='grid flex-1 grid-cols-2 gap-x-2 gap-y-1 border-b border-t bg-muted/20 px-3 py-2 text-xs'>
              <div className='text-muted-foreground'>Role:</div>
              <div className='text-right font-medium capitalize'>
                {user.role}
              </div>

              <div className='text-muted-foreground'>Registered:</div>
              <div className='text-right font-medium'>
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>

              {user.phoneNumber && (
                <>
                  <div className='text-muted-foreground'>Phone:</div>
                  <div className='truncate text-right font-medium'>
                    {user.phoneNumber}
                  </div>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className='mt-auto flex gap-2 border-t p-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleRejectAction(user.id)}
                className='h-7 flex-1 border-destructive/30 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive'
              >
                Reject
              </Button>
              <Button
                size='sm'
                className='h-7 flex-1 bg-green-600 text-xs hover:bg-green-700'
                onClick={() => handleApproveClick(user)}
              >
                Approve
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main fixed className='flex flex-col pt-20'>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              User Management
            </h1>
            <p className='text-muted-foreground'>
              Manage all users, their roles, and approval status.
            </p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleOpenInviteDialog} variant='outline'>
              Invite User
            </Button>
            <Button onClick={handleOpenAddDialog}>Add User</Button>
          </div>
        </div>
        <div className='flex-grow overflow-y-auto'>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className='flex h-full flex-col space-y-4'
          >
            <TabsList className='flex-shrink-0'>
              <TabsTrigger value='all-users'>All Users</TabsTrigger>
              <TabsTrigger value='pending-approval'>
                Pending Approval
                {allUsers.filter(isPendingUser).length > 0 && (
                  <Badge variant='secondary' className='ml-2'>
                    {allUsers.filter(isPendingUser).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value='roles-permissions'>
                Roles & Permissions
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value='all-users'
              className='flex-grow space-y-4 outline-none'
            >
              <UsersTable
                columns={columns}
                data={allUsers}
                loading={loading}
                onEditUser={handleOpenEditDialog}
                onDeleteUser={handleDeleteAction}
                onApproveUser={handleApproveClick}
                onRejectUser={handleRejectAction}
              />
            </TabsContent>
            <TabsContent
              value='pending-approval'
              className='flex-grow space-y-6 outline-none'
            >
              <div className='mb-6 rounded-lg bg-gradient-to-r from-primary/10 to-transparent p-6'>
                <div className='flex flex-wrap items-center justify-between'>
                  <div>
                    <h2 className='flex items-center gap-2 text-2xl font-semibold'>
                      <UserCheckIcon className='h-6 w-6 text-primary' />
                      Pending Approvals
                    </h2>
                    <p className='mt-1 text-muted-foreground'>
                      Review and manage users waiting for account approval.
                    </p>
                  </div>
                  <div className='mt-4 flex items-center gap-3 sm:mt-0'>
                    <Badge variant='outline' className='px-3 py-1'>
                      {allUsers.filter(isPendingUser).length} pending
                    </Badge>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={refreshUsersList}
                      disabled={loading}
                      className='flex items-center gap-1'
                    >
                      <RefreshCwIcon className='h-4 w-4' />
                      {loading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className='space-y-8'>
                {/* Quick Approval Actions */}
                <div className='space-y-4'>
                  <div className='mb-2 flex items-center justify-between'>
                    <h3 className='flex items-center gap-2 text-lg font-medium'>
                      <ZapIcon className='h-5 w-5 text-primary' />
                      Quick Approval Actions
                    </h3>
                  </div>
                  <div className='rounded-lg border bg-card shadow-sm'>
                    <PendingApprovalActions
                      users={allUsers.filter(isPendingUser)}
                    />
                  </div>
                </div>

                {/* Detailed Data View */}
                <div className='space-y-4'>
                  <h3 className='mb-2 flex items-center gap-2 text-lg font-medium'>
                    <ListFilterIcon className='h-5 w-5 text-primary' />
                    Detailed Data View
                  </h3>
                  <div className='rounded-lg border bg-card p-4 shadow-sm'>
                    <UsersTable
                      columns={columns}
                      data={allUsers.filter(isPendingUser)}
                      loading={loading}
                      hideFilters={true}
                      onEditUser={handleOpenEditDialog}
                      onDeleteUser={handleDeleteAction}
                      onApproveUser={handleApproveClick}
                      onRejectUser={handleRejectAction}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value='roles-permissions'
              className='flex-grow space-y-4 outline-none'
            >
              <SystemRolesOverview />
            </TabsContent>
          </Tabs>
        </div>

        {(open === 'edit' || open === 'add') && (
          <UsersActionDialog
            currentRow={open === 'edit' && currentRow ? currentRow : undefined}
            open={true}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null)
                setCurrentRow(null)
              }
            }}
            onSave={open === 'add' ? handleCreateUser : handleUserUpdate}
          />
        )}

        {open === 'assignRoleBeforeApproval' && currentRow && (
          <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
            onClick={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
          >
            <div
              className='mx-4 w-full max-w-md rounded-lg border bg-card p-6 shadow-xl'
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className='mb-2 text-lg font-semibold'>
                Assign Role to: {currentRow.email}
              </h3>
              <p className='mb-6 text-sm text-muted-foreground'>
                Select a role before approving this user.
              </p>
              <div className='mb-6 space-y-3'>
                <Button
                  onClick={() =>
                    handleAssignRoleAndApprove(currentRow!.id, 'user')
                  }
                  className='w-full justify-center'
                >
                  Approve as User
                </Button>
                <Button
                  onClick={() =>
                    handleAssignRoleAndApprove(currentRow!.id, 'admin')
                  }
                  className='w-full justify-center'
                >
                  Approve as Admin
                </Button>
                {/* TODO: Add other roles (e.g., 'agent') dynamically from userTypes or a config */}
              </div>
              <Button
                variant='outline'
                onClick={() => {
                  setOpen(null)
                  setCurrentRow(null)
                }}
                className='w-full'
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {open === 'invite' && (
          <UsersInviteDialog
            open={true}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null)
              }
            }}
            onSendInvite={handleSendInvite}
            isLoading={loading}
          />
        )}
      </Main>
    </>
  )
}
