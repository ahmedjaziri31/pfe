import { useEffect } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { jwtDecode } from 'jwt-decode'
import AuthService from '@/api/services/auth-service'
import { useAuthStore } from '@/stores/authStore'
import { useValidateToken, useRefreshToken } from '@/hooks/use-auth'

// This route will handle authentication checks for all protected routes
export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: async ({ context }) => {
    const auth = useAuthStore.getState().auth
    const hasToken = !!auth.accessToken
    const hasUser = !!auth.user

    // If we have a token but no user (could happen if cookie exists but app just loaded)
    // try to decode the token to get the user
    if (hasToken && !hasUser) {
      try {
        // User will be loaded automatically when we set the token again
        auth.setAccessToken(auth.accessToken)
      } catch (error) {
        console.error('Failed to restore user from token:', error)
      }
    }

    // If there's no access token but there is a refresh token, try refreshing first
    if (
      (!hasToken || !auth.user?.exp || auth.user.exp * 1000 < Date.now()) &&
      auth.refreshToken
    ) {
      try {
        // We need to create a temporary instance here since we're not in a React component
        const response = await context.queryClient.fetchQuery({
          queryKey: ['refreshToken'],
          queryFn: async () => {
            return AuthService.refreshToken({ refreshToken: auth.refreshToken })
          },
        })

        if (response?.accessToken) {
          auth.setAccessToken(response.accessToken)
          if (response.refreshToken) {
            auth.setRefreshToken(response.refreshToken)
          }
          // Token refreshed successfully, proceed
          return { user: auth.user }
        }
      } catch (error) {
        console.error('Failed to refresh token:', error)
        // Fall through to redirect
      }
    }

    // Final check - do we have a valid authenticated user?
    if (!auth.isAuthenticated()) {
      // Redirect to login if not authenticated
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: window.location.pathname,
        },
      })
    }

    // Return the current user for use in the component
    return { user: auth.user }
  },
  loader: async ({ context }) => {
    // Prefetch the validation query to ensure token is valid
    await context.queryClient.prefetchQuery({
      queryKey: ['validateToken'],
      queryFn: () => AuthService.validateToken(),
      retry: 1, // Only retry once to avoid infinite loops
    })
  },
  component: Index,
})

function Index() {
  const { user } = Route.useRouteContext()
  const validateToken = useValidateToken()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    // Handle token validation failure
    if (validateToken.isError) {
      // Try to refresh the token if validation fails
      refreshToken.mutate()
    }
  }, [validateToken.isError, refreshToken])

  return (
    <div className='container py-6'>
      <h1 className='mb-4 text-2xl font-bold'>Welcome, {user?.email}</h1>
      <p className='text-muted-foreground'>
        You're logged in to the authenticated dashboard.
      </p>
    </div>
  )
}
