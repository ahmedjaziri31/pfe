import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, ExternalLink, Eye, TrendingUp, DollarSign, Users, Activity, Shield, User, Info, Code } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import axiosInstance from '@/api/axios-instance'
import { useAuthStore } from '@/stores/authStore'
import { Transaction, TransactionStats, TransactionResponse, TransactionFilters } from './types'
import { SmartContractsInterface } from './SmartContractsInterface'

export function BlockchainManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<TransactionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [hasAdminAccess, setHasAdminAccess] = useState(false)
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    type: 'all',
    status: 'all',
    blockchainStatus: 'all',
    page: 1,
    limit: 20
  })
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })

  // Get user from auth store
  const { user } = useAuthStore((state) => state.auth)

  // Check if user has admin privileges
  const checkUserAccess = async () => {
    try {
      // First try to get user info from auth/me
      const response = await axiosInstance.get('/auth/me')
      setUserInfo(response.data)
      
      const userRole = response.data?.user?.role || response.data?.role
      const isAdmin = userRole === 'admin' || userRole === 'superadmin' || userRole === 'super_admin'
      setHasAdminAccess(isAdmin)
      
      return isAdmin
    } catch (error: any) {
      console.error('Error checking user access:', error)
      // Fallback to token-based role check if available
      if (user?.role && Array.isArray(user.role)) {
        const isAdmin = user.role.includes('admin') || user.role.includes('superadmin') || user.role.includes('super_admin')
        setHasAdminAccess(isAdmin)
        return isAdmin
      }
      setHasAdminAccess(false)
      return false
    }
  }

  // Fetch transactions - adapts to user privileges
  const fetchTransactions = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      
      if (hasAdminAccess) {
        // Admin: Use admin transactions endpoint with full data
        await fetchAdminTransactions()
      } else {
        // Regular user: Use wallet transactions endpoint
        await fetchUserTransactions()
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch transactions',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch admin-level transactions with full blockchain data
  const fetchAdminTransactions = async () => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
      includeUser: 'true',
      includeProject: 'true',
      includeBlockchain: 'true'
    })

    // Add filters
    if (filters.search) params.append('search', filters.search)
    if (filters.type !== 'all') params.append('type', filters.type)
    if (filters.status !== 'all') params.append('status', filters.status)
    if (filters.blockchainStatus !== 'all') params.append('blockchainStatus', filters.blockchainStatus)

    const response = await axiosInstance.get(`/admin/transactions?${params}`)
    const data: TransactionResponse = response.data.data
    
    setTransactions(data.transactions)
    setStats(data.stats)
    setPagination(data.pagination)
  }

  // Fetch user-level transactions (own transactions only)
  const fetchUserTransactions = async () => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString()
    })

    // Add basic filters that work with wallet endpoint
    if (filters.type !== 'all') params.append('type', filters.type)
    if (filters.status !== 'all') params.append('status', filters.status)

    const response = await axiosInstance.get(`/wallet/transactions?${params}`)
    const data = response.data.data
    
    // Adapt wallet transaction format to match admin format
    const adaptedTransactions = data.transactions.map((tx: any) => ({
      id: tx.id,
      userId: tx.user_id || tx.userId,
      type: tx.type,
      amount: parseFloat(tx.amount),
      currency: tx.currency || 'USD',
      status: tx.status,
      description: tx.description,
      reference: tx.reference,
      balanceType: tx.balance_type || tx.balanceType,
      metadata: tx.metadata,
      processedAt: tx.processed_at || tx.processedAt,
      createdAt: tx.created_at || tx.createdAt,
      updatedAt: tx.updated_at || tx.updatedAt,
      // Blockchain fields (may be limited for regular users)
      blockchainHash: tx.blockchain_hash || tx.blockchainHash,
      blockNumber: tx.block_number || tx.blockNumber,
      gasUsed: tx.gas_used || tx.gasUsed,
      blockchainStatus: tx.blockchain_status || tx.blockchainStatus,
      contractAddress: tx.contract_address || tx.contractAddress,
      // User info (current user only)
      user: {
        id: userInfo?.user?.id || userInfo?.id,
        name: userInfo?.user?.name || userInfo?.name,
        email: userInfo?.user?.email || userInfo?.email,
        accountNo: userInfo?.user?.accountNo || userInfo?.accountNo
      },
      project: tx.project || null
    }))
    
    setTransactions(adaptedTransactions)
    
    // Generate basic stats for user transactions
    const userStats = {
      totalTransactions: data.pagination?.total || adaptedTransactions.length,
      withBlockchainHash: adaptedTransactions.filter(tx => tx.blockchainHash).length,
      confirmedOnBlockchain: adaptedTransactions.filter(tx => tx.blockchainStatus === 'confirmed').length,
      pendingOnBlockchain: adaptedTransactions.filter(tx => tx.blockchainStatus === 'pending').length,
      failedOnBlockchain: adaptedTransactions.filter(tx => tx.blockchainStatus === 'failed').length
    }
    setStats(userStats)
    
    setPagination(data.pagination || {
      total: adaptedTransactions.length,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(adaptedTransactions.length / filters.limit)
    })
  }

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      const hasAccess = await checkUserAccess()
      if (hasAccess !== null) {
        fetchTransactions()
      }
    }
    initializeComponent()
  }, [])

  // Refresh data when page changes
  useEffect(() => {
    if (hasAdminAccess !== null) {
      fetchTransactions()
    }
  }, [filters.page, hasAdminAccess])

  const handleRefresh = async () => {
    setRefreshing(true)
    await checkUserAccess()
    await fetchTransactions(false)
    setRefreshing(false)
  }

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
    // For user transactions, search is limited, so we'll apply it client-side
    if (value && !hasAdminAccess) {
      setTimeout(() => fetchTransactions(), 300) // Debounce search
    }
  }

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
    setTimeout(() => fetchTransactions(), 100)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      blockchainStatus: 'all',
      page: 1,
      limit: 20
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'failed':
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getBlockchainStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      <Main fixed>
        <div className='mb-6 flex flex-shrink-0 items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>
              {hasAdminAccess ? 'Blockchain Management' : 'My Blockchain Transactions'}
            </h1>
            <p className='text-muted-foreground'>
              {hasAdminAccess 
                ? 'Monitor and manage all blockchain transactions' 
                : 'View your personal blockchain transaction history'
              }
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className='space-y-6'>
          {/* Access Level Info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <strong>Access Level:</strong> 
                    <Badge variant={hasAdminAccess ? 'default' : 'secondary'} className="ml-2">
                      {hasAdminAccess ? 'Admin (All Transactions)' : 'User (Personal Transactions)'}
                    </Badge>
                  </div>
                  {userInfo && (
                    <div>
                      <strong>User:</strong> {userInfo.user?.name || userInfo.name || 'Unknown'} 
                      ({userInfo.user?.email || userInfo.email})
                    </div>
                  )}
                </div>
                {!hasAdminAccess && (
                  <div className="text-sm text-muted-foreground">
                    💡 Contact admin for full system access
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Main Content Tabs */}
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Smart Contracts
              </TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              {/* Stats Overview */}
              {stats && (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Total Transactions</CardTitle>
                      <Activity className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>{stats.totalTransactions}</div>
                      <p className='text-xs text-muted-foreground'>
                        {hasAdminAccess ? 'All system transactions' : 'Your transactions'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Blockchain Linked</CardTitle>
                      <Shield className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>{stats.withBlockchainHash}</div>
                      <p className='text-xs text-muted-foreground'>
                        With blockchain hash
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Confirmed</CardTitle>
                      <TrendingUp className='h-4 w-4 text-green-500' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold text-green-600'>{stats.confirmedOnBlockchain}</div>
                      <p className='text-xs text-muted-foreground'>
                        Blockchain confirmed
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Pending</CardTitle>
                      <Activity className='h-4 w-4 text-yellow-500' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold text-yellow-600'>{stats.pendingOnBlockchain}</div>
                      <p className='text-xs text-muted-foreground'>
                        Awaiting confirmation
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Failed</CardTitle>
                      <Activity className='h-4 w-4 text-red-500' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold text-red-600'>{stats.failedOnBlockchain}</div>
                      <p className='text-xs text-muted-foreground'>
                        Blockchain failed
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>Filter transactions by various criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <div>
                      <label className='text-sm font-medium mb-2 block'>Search</label>
                      <Input
                        placeholder={hasAdminAccess ? "Search by description, reference, hash, user..." : "Search transactions..."}
                        value={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className='text-sm font-medium mb-2 block'>Type</label>
                      <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
                          <SelectItem value="rental_income">Rental Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className='text-sm font-medium mb-2 block'>Status</label>
                      <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className='text-sm font-medium mb-2 block'>Blockchain Status</label>
                      <Select value={filters.blockchainStatus} onValueChange={(value) => handleFilterChange('blockchainStatus', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Blockchain Status</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='flex gap-2 mt-4'>
                    <Button onClick={clearFilters} variant="outline" size="sm">
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Transactions</CardTitle>
                      <CardDescription>
                        {hasAdminAccess ? 'All system transactions with blockchain data' : 'Your personal transaction history'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                      Loading transactions...
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            {hasAdminAccess && <TableHead>User</TableHead>}
                            <TableHead>Blockchain</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell>
                                <div className="text-sm">
                                  {formatDate(tx.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {tx.type.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {formatAmount(tx.amount, tx.currency)}
                                </div>
                                {tx.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {tx.description}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(tx.status)}>
                                  {tx.status.toUpperCase()}
                                </Badge>
                              </TableCell>
                              {hasAdminAccess && (
                                <TableCell>
                                  {tx.user ? (
                                    <div className="text-sm">
                                      <div className="font-medium">{tx.user.name}</div>
                                      <div className="text-xs text-muted-foreground">{tx.user.email}</div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">N/A</span>
                                  )}
                                </TableCell>
                              )}
                              <TableCell>
                                <div className="space-y-1">
                                  {tx.blockchainStatus && (
                                    <Badge variant={getBlockchainStatusBadgeVariant(tx.blockchainStatus)} className="text-xs">
                                      {tx.blockchainStatus.toUpperCase()}
                                    </Badge>
                                  )}
                                  {tx.blockchainHash && (
                                    <div className="text-xs text-muted-foreground font-mono">
                                      {tx.blockchainHash.substring(0, 12)}...
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {tx.blockchainHash && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                              onClick={() => {
          // Open blockchain explorer in new tab
          window.open(`https://sepolia.etherscan.io/tx/${tx.blockchainHash}`, '_blank')
        }}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Explorer
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                              disabled={pagination.page === 1}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                              disabled={pagination.page === pagination.totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}

                      {transactions.length === 0 && (
                        <div className="text-center py-8">
                          <div className="text-muted-foreground">
                            {hasAdminAccess 
                              ? 'No transactions found matching your criteria' 
                              : 'No transactions found. Start investing to see your transaction history here!'
                            }
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Smart Contracts Tab */}
            <TabsContent value="contracts">
              <SmartContractsInterface />
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}