import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/auth/sso-callback-complete')({
  component: SSOCallbackComplete,
})

function SSOCallbackComplete() {
  const navigate = useNavigate()

  useEffect(() => {
    // Simple redirect back to sign-in since we're not using Clerk anymore
    navigate({ to: '/sign-in' })
  }, [navigate])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='w-full max-w-md rounded-lg border border-border bg-background p-8 shadow-sm'>
        <h1 className='mb-4 text-center text-2xl font-semibold'>
          Authentication Redirecting...
        </h1>
        <p className='text-center text-muted-foreground'>
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  )
}
