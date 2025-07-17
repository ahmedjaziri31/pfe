import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Code, 
  ExternalLink, 
  FileText, 
  Settings, 
  Play, 
  Eye, 
  Shield,
  Activity,
  Zap,
  Database
} from 'lucide-react'
import { 
  SmartContract, 
  InvestmentManagerContract, 
  ProjectRegistryContract, 
  RentDistributorContract,
  ProjectStatus
} from './types'

export function SmartContractsInterface() {
  const [contracts, setContracts] = useState<any[]>([])

  // Mock data matching your actual contracts structure
  const mockContracts = [
    {
      id: 'investment-manager',
      name: 'InvestmentManager',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      status: 'deployed',
      network: 'Ethereum Sepolia',
      deployedAt: '2024-06-15T10:30:00Z',
      version: '1.0.0',
      description: 'Manages investment records and tracking for real estate projects',
      gasUsed: 1200000,
      deploymentTx: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'
    },
    {
      id: 'project-registry',
      name: 'ProjectRegistry',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      status: 'deployed',
      network: 'Ethereum Sepolia',
      deployedAt: '2024-06-15T10:25:00Z',
      version: '1.0.0',
      description: 'Registry for managing real estate project lifecycle and status',
      gasUsed: 980000,
      deploymentTx: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567'
    },
    {
      id: 'rent-distributor',
      name: 'RentDistributor',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      status: 'deployed',
      network: 'Ethereum Sepolia',
      deployedAt: '2024-06-15T10:35:00Z',
      version: '1.0.0',
      description: 'Handles proportional rent distribution to project investors',
      gasUsed: 1100000,
      deploymentTx: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678'
    }
  ]

  // Contract functions and events based on your Solidity contracts
  const contractDetails = {
    'investment-manager': {
      functions: [
        {
          name: 'recordInvestment',
          type: 'function',
          description: 'Records a new investment for a project',
          inputs: [
            { name: 'projectId', type: 'uint256' },
            { name: 'investor', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          onlyAdmin: true
        },
        {
          name: 'getInvestment',
          type: 'view',
          description: 'Gets investment details for a project and investor',
          inputs: [
            { name: 'projectId', type: 'uint256' },
            { name: 'investor', type: 'address' }
          ],
          outputs: [
            { name: 'amount', type: 'uint256' },
            { name: 'timestamp', type: 'uint256' }
          ]
        }
      ],
      events: [
        {
          name: 'InvestmentRecorded',
          description: 'Emitted when a new investment is recorded',
          inputs: [
            { name: 'projectId', type: 'uint256', indexed: true },
            { name: 'investor', type: 'address', indexed: true },
            { name: 'amount', type: 'uint256' }
          ]
        }
      ]
    },
    'project-registry': {
      functions: [
        {
          name: 'createProject',
          type: 'function',
          description: 'Creates a new real estate project',
          inputs: [
            { name: 'name', type: 'string' },
            { name: 'goalAmount', type: 'uint256' }
          ],
          onlyAdmin: true
        },
        {
          name: 'updateProject',
          type: 'function',
          description: 'Updates project status and funding amount',
          inputs: [
            { name: 'projectId', type: 'uint256' },
            { name: 'newAmount', type: 'uint256' },
            { name: 'newStatus', type: 'uint8' }
          ],
          onlyAdmin: true
        },
        {
          name: 'projects',
          type: 'view',
          description: 'Gets project details by ID',
          inputs: [{ name: 'projectId', type: 'uint256' }],
          outputs: [
            { name: 'id', type: 'uint256' },
            { name: 'name', type: 'string' },
            { name: 'goalAmount', type: 'uint256' },
            { name: 'currentAmount', type: 'uint256' },
            { name: 'status', type: 'uint8' }
          ]
        }
      ],
      events: [
        {
          name: 'ProjectCreated',
          description: 'Emitted when a new project is created',
          inputs: [
            { name: 'id', type: 'uint256' },
            { name: 'name', type: 'string' },
            { name: 'goalAmount', type: 'uint256' }
          ]
        },
        {
          name: 'ProjectUpdated',
          description: 'Emitted when a project is updated',
          inputs: [
            { name: 'id', type: 'uint256' },
            { name: 'currentAmount', type: 'uint256' },
            { name: 'status', type: 'uint8' }
          ]
        }
      ]
    },
    'rent-distributor': {
      functions: [
        {
          name: 'recordRentDistribution',
          type: 'function',
          description: 'Records rent distribution for a project',
          inputs: [
            { name: 'projectId', type: 'uint256' },
            { name: 'investors', type: 'address[]' },
            { name: 'totalRent', type: 'uint256' }
          ],
          onlyAdmin: true
        }
      ],
      events: [
        {
          name: 'RentCalculated',
          description: 'Emitted when rent share is calculated for an investor',
          inputs: [
            { name: 'investor', type: 'address', indexed: true },
            { name: 'projectId', type: 'uint256' },
            { name: 'amount', type: 'uint256' }
          ]
        }
      ]
    }
  }

  useEffect(() => {
    setContracts(mockContracts)
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatGasUsed = (gas: number) => {
    return new Intl.NumberFormat().format(gas)
  }

  return (
    <div className="space-y-6">
      {/* Contracts Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.filter(c => c.status === 'deployed').length}</div>
            <p className="text-xs text-muted-foreground">Successfully deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gas Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatGasUsed(contracts.reduce((sum, c) => sum + (c.gasUsed || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Deployment costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sepolia</div>
            <p className="text-xs text-muted-foreground">Ethereum testnet</p>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Contracts</CardTitle>
          <CardDescription>
            Real estate investment platform smart contracts deployed on blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Gas Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contract.name}</div>
                      <div className="text-sm text-muted-foreground">v{contract.version}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">
                      {formatAddress(contract.address)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(contract.status)}>
                      {contract.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.network}</TableCell>
                  <TableCell>{contract.gasUsed ? formatGasUsed(contract.gasUsed) : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://sepolia.etherscan.io/address/${contract.address}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Explorer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Contract Details */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Interface</CardTitle>
          <CardDescription>
            Functions and events available in deployed smart contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="investment-manager" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="investment-manager">Investment Manager</TabsTrigger>
              <TabsTrigger value="project-registry">Project Registry</TabsTrigger>
              <TabsTrigger value="rent-distributor">Rent Distributor</TabsTrigger>
            </TabsList>

            {Object.entries(contractDetails).map(([contractId, details]) => (
              <TabsContent key={contractId} value={contractId} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Functions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Functions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {details.functions.map((func: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                {func.name}
                              </code>
                              <Badge variant="outline" className="text-xs">
                                {func.type}
                              </Badge>
                              {func.onlyAdmin && (
                                <Badge variant="destructive" className="text-xs">
                                  Admin Only
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {func.description}
                          </p>
                          {func.inputs && func.inputs.length > 0 && (
                            <div className="text-xs">
                              <strong>Inputs:</strong>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {func.inputs.map((input: any, i: number) => (
                                  <li key={i}>
                                    <code>{input.name}</code> ({input.type})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {func.outputs && func.outputs.length > 0 && (
                            <div className="text-xs mt-2">
                              <strong>Outputs:</strong>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {func.outputs.map((output: any, i: number) => (
                                  <li key={i}>
                                    <code>{output.name}</code> ({output.type})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {details.events.map((event: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {event.name}
                            </code>
                            <Badge variant="secondary" className="text-xs">
                              Event
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {event.description}
                          </p>
                          {event.inputs && event.inputs.length > 0 && (
                            <div className="text-xs">
                              <strong>Parameters:</strong>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {event.inputs.map((input: any, i: number) => (
                                  <li key={i}>
                                    <code>{input.name}</code> ({input.type})
                                    {input.indexed && <span className="text-blue-600"> indexed</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p><strong>Integration Status:</strong> Smart contracts are integrated with the backend blockchain service.</p>
            <p><strong>Usage:</strong> Contracts are called automatically when users make investments, create projects, or receive rent distributions.</p>
            <p><strong>Network:</strong> Currently deployed on Ethereum Sepolia testnet for development and testing.</p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
} 