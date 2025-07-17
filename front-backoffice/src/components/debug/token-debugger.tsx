import { useState } from 'react'
import { IconBug } from '@tabler/icons-react'
import { getTokenDetails } from '@/utils/tokenUtils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface TokenDebuggerProps {
  token: string
  buttonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon'
  buttonText?: string
}

export function TokenDebugger({
  token,
  buttonVariant = 'outline',
  buttonSize = 'sm',
  buttonText = 'Debug Token',
}: TokenDebuggerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tokenDetails = getTokenDetails(token)

  // Format property value for display
  const formatValue = (value: any): string => {
    if (value === undefined || value === null) return 'null'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  // Create the token details content as JSX element
  const tokenDetailsContent = (
    <div className='mt-4 grid gap-4'>
      {tokenDetails.valid ? (
        <>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>Token Status</span>
            <Badge variant={tokenDetails.isExpired ? 'destructive' : 'default'}>
              {tokenDetails.isExpired ? 'Expired' : 'Valid'}
            </Badge>
          </div>

          <div className='mt-2 rounded-md border p-4'>
            <h4 className='mb-2 font-medium'>Token Details</h4>
            {Object.entries(tokenDetails).map(([key, value]) => (
              <div key={key} className='mb-2 grid grid-cols-3 gap-2'>
                <span className='col-span-1 font-mono text-sm'>{key}:</span>
                <code className='col-span-2 overflow-auto rounded bg-muted p-1 text-sm'>
                  {formatValue(value)}
                </code>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='text-destructive'>
          Invalid token format. Error: {tokenDetails.message || 'Unknown error'}
        </div>
      )}
    </div>
  )

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => setIsOpen(true)}
      >
        <IconBug className='mr-2 h-4 w-4' />
        {buttonText}
      </Button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title='JWT Token Debugger'
        desc='View decoded information from your JWT token.'
        cancelBtnText='Close'
        confirmText='Copy Token'
        destructive={false}
        className='max-w-3xl'
        handleConfirm={() => {
          navigator.clipboard.writeText(token)
          setIsOpen(false)
        }}
      >
        {tokenDetailsContent}
      </ConfirmDialog>
    </>
  )
}
