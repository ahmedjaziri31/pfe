import { createContext, useContext, useState, ReactNode } from 'react'
import { Client } from '../data/schema'

interface ClientsContextType {
  selectedClient: Client | null
  setSelectedClient: (client: Client | null) => void

  isEditDialogOpen: boolean
  setIsEditDialogOpen: (isOpen: boolean) => void

  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (isOpen: boolean) => void

  openInteraction: boolean
  setOpenInteraction: (isOpen: boolean) => void

  openFollowUp: boolean
  setOpenFollowUp: (isOpen: boolean) => void
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined)

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [openInteraction, setOpenInteraction] = useState(false)
  const [openFollowUp, setOpenFollowUp] = useState(false)

  return (
    <ClientsContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        openInteraction,
        setOpenInteraction,
        openFollowUp,
        setOpenFollowUp,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export function useClientsContext() {
  const context = useContext(ClientsContext)
  if (!context) {
    throw new Error('useClientsContext must be used within a ClientsProvider')
  }
  return context
}