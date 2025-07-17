import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { User } from '@/features/users/data/schema'

interface UserRoleManagementProps {
  user: User
  onRoleChange: (userId: string, newRole: string) => void
}

export function UserRoleManagement({
  user,
  onRoleChange,
}: UserRoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const { toast } = useToast()

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
  }

  const handleSaveRole = () => {
    onRoleChange(user.id, selectedRole)
    toast({
      title: 'Role updated',
      description: `${user.firstName} ${user.lastName} is now a ${selectedRole}`,
    })
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle>User Role Management</CardTitle>
        <CardDescription>
          Change roles and permissions for {user.firstName} {user.lastName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6'>
          <div className='grid gap-2'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>User Info</Label>
                <div className='mt-1'>
                  <div>
                    <strong>Name:</strong> {user.firstName} {user.lastName}
                  </div>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <Badge variant='outline'>{user.status}</Badge>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor='role'>Role</Label>
                <Select value={selectedRole} onValueChange={handleRoleChange}>
                  <SelectTrigger id='role' className='mt-1'>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='user'>User</SelectItem>
                    <SelectItem value='agent'>Agent</SelectItem>
                    <SelectItem value='admin'>Admin</SelectItem>
                    <SelectItem value='superadmin'>Super Admin</SelectItem>
                    <SelectItem value='manager'>Manager</SelectItem>
                    <SelectItem value='cashier'>Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='mt-4 flex justify-end'>
              <Button onClick={handleSaveRole}>Save Role</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
