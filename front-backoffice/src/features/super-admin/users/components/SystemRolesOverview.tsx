import {
  ShieldCheck,
  UserCircle,
  Briefcase,
  Users,
  /* Building, ShoppingCart */
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

// Removed Building and ShoppingCart as Manager/Cashier are removed

// Define roles and their descriptions based on updated userRoleSchema
const systemRoles = [
  {
    name: 'Super Admin',
    value: 'superadmin',
    icon: <ShieldCheck className='h-6 w-6 text-red-500' />,
    description:
      'Full system access. Manages all platform settings, users, roles, and critical operations. Highest level of authority.',
    permissions: [
      'Manage all users and roles',
      'Access all system settings',
      'Perform critical system operations',
      'Oversee all platform modules',
    ],
  },
  {
    name: 'Admin',
    value: 'admin',
    icon: <UserCircle className='h-6 w-6 text-orange-500' />,
    description:
      'Manages specific modules or sections of the platform, user accounts within their scope, and operational tasks. High-level administrative access.',
    permissions: [
      'Manage users within assigned scope',
      'Configure specific platform modules',
      'Access operational dashboards',
      'Generate reports',
    ],
  },
  {
    name: 'Agent',
    value: 'agent',
    icon: <Briefcase className='h-6 w-6 text-blue-500' />,
    description:
      'Represents the platform to clients or performs specific operational tasks, such as property management or customer support.',
    permissions: [
      'Manage assigned client accounts/properties',
      'Access operational tools for their tasks',
      'Communicate with users/clients',
      'Update relevant data entries',
    ],
  },
  {
    name: 'User',
    value: 'user',
    icon: <Users className='h-6 w-6 text-green-500' />,
    description:
      'Standard platform user. Accesses core platform features according to their subscription or entitlements.',
    permissions: [
      'Access personal dashboard and profile',
      'Utilize core platform features (e.g., view properties, invest)',
      'Manage personal settings and notifications',
    ],
  },
  // Removed Cashier and Manager roles
]

export function SystemRolesOverview() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>System Roles & Permissions Overview</CardTitle>
          <CardDescription>
            A summary of predefined roles within the platform and their general
            responsibilities. Actual permissions may be more granular and
            configurable elsewhere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[calc(100vh-20rem)]'>
            {' '}
            {/* Adjust height as needed */}
            <div className='grid grid-cols-1 gap-6 p-1 md:grid-cols-2 lg:grid-cols-3'>
              {systemRoles.map((role) => (
                <Card key={role.value} className='flex flex-col'>
                  <CardHeader className='flex flex-row items-start space-x-4 pb-3'>
                    {role.icon}
                    <div>
                      <CardTitle className='text-lg'>{role.name}</CardTitle>
                      <CardDescription className='mt-1 text-xs leading-tight'>
                        {role.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className='flex-grow space-y-2 pt-0'>
                    <h4 className='mb-1 text-sm font-semibold'>
                      Key Responsibilities (Examples):
                    </h4>
                    <ul className='list-inside list-disc space-y-1 text-xs text-muted-foreground'>
                      {role.permissions.map((perm, index) => (
                        <li key={index}>{perm}</li>
                      ))}
                    </ul>
                  </CardContent>
                  {/* <CardFooter>
                    <Button variant="outline" size="sm" disabled>
                      Configure Permissions (Future)
                    </Button>
                  </CardFooter> */}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
