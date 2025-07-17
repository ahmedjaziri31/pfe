// Empty implementation to prevent import errors
// This file exists only to satisfy imports while we transition away from Clerk
import { Button } from '@/components/ui/button'

interface ClerkAuthButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  provider: 'google' | 'facebook'
  className?: string
  disabled?: boolean
}

// Empty implementation that does nothing
export function ClerkAuthButton({
  variant = 'default',
  size = 'default',
  provider,
  className,
  disabled,
}: ClerkAuthButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      type='button'
    >
      {provider === 'google' ? 'Google' : 'Facebook'}
    </Button>
  )
}

// Empty implementation that does nothing
export function ClerkCallbackHandler() {
  return null
}
