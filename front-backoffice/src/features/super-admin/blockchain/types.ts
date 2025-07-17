export interface Transaction {
  id: number
  userId: number
  type: string
  amount: number
  currency: string
  status: string
  description: string
  reference: string
  balanceType: string
  metadata: any
  processedAt: string | null
  createdAt: string
  updatedAt: string
  // Blockchain fields
  blockchainHash: string | null
  blockNumber: number | null
  gasUsed: number | null
  blockchainStatus: string | null
  contractAddress: string | null
  // Related data
  user: {
    id: number
    name: string
    email: string
    accountNo: string
  } | null
  project: {
    id: number
    name: string
    propertyType: string
    location: string
  } | null
}

export interface TransactionStats {
  totalTransactions: number
  withBlockchainHash: number
  confirmedOnBlockchain: number
  pendingOnBlockchain: number
  failedOnBlockchain: number
}

export interface TransactionResponse {
  transactions: Transaction[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  stats: TransactionStats
}

export interface TransactionFilters {
  search: string
  type: string
  status: string
  blockchainStatus: string
  page: number
  limit: number
}

// Smart Contract types - matching backend structure
export interface SmartContract {
  id: string
  name: string
  address: string
  abi: any[]
  status: 'deployed' | 'pending' | 'failed'
  network: string
  deployedAt: string
  version: string
  description: string
  gasUsed?: number
  deploymentTx?: string
}

export interface ContractFunction {
  name: string
  type: 'function' | 'view' | 'pure'
  inputs: ContractInput[]
  outputs: ContractOutput[]
  stateMutability: string
  payable: boolean
}

export interface ContractInput {
  name: string
  type: string
  indexed?: boolean
}

export interface ContractOutput {
  name: string
  type: string
}

export interface ContractEvent {
  name: string
  inputs: ContractInput[]
  anonymous?: boolean
}

// Investment Manager Contract
export interface InvestmentManagerContract extends SmartContract {
  functions: {
    recordInvestment: ContractFunction
    getInvestment: ContractFunction
  }
  events: {
    InvestmentRecorded: ContractEvent
  }
}

// Project Registry Contract
export interface ProjectRegistryContract extends SmartContract {
  functions: {
    createProject: ContractFunction
    updateProject: ContractFunction
    projects: ContractFunction
  }
  events: {
    ProjectCreated: ContractEvent
    ProjectUpdated: ContractEvent
  }
}

// Rent Distributor Contract
export interface RentDistributorContract extends SmartContract {
  functions: {
    recordRentDistribution: ContractFunction
  }
  events: {
    RentCalculated: ContractEvent
  }
}

// Blockchain Project Status
export enum ProjectStatus {
  Open = 0,
  Funded = 1,
  Closed = 2
}

export interface BlockchainProject {
  id: number
  name: string
  goalAmount: number
  currentAmount: number
  status: ProjectStatus
}

export interface Investment {
  amount: number
  timestamp: number
  projectId: number
  investor: string
}

export interface RentDistribution {
  projectId: number
  investor: string
  amount: number
  timestamp: number
} 