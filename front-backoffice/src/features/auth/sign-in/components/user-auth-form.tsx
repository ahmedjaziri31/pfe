import { HTMLAttributes, useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UseMutationResult } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { IconAlertCircle } from '@tabler/icons-react'
import {
  SignInRequest,
  SignInResponse,
  AuthError,
} from '@/api/services/auth-service'
import { cn } from '@/lib/utils'
import { useSignIn } from '@/hooks/use-auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

// Placeholder icons - now with actual minimal SVG content
const GoogleIcon = ({ className }: IconProps) => (
  <svg viewBox='0 0 24 24' className={cn('mr-2 h-5 w-5', className)}>
    {/* Simplified Google-like G */}
    <path
      d='M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.29,4.73 12.19,4.73C14.76,4.73 16.04,5.55 17.64,6.54L19.82,4.9C17.64,2.95 15.3,2 12.19,2C6.92,2 2.73,6.08 2.73,12C2.73,17.92 6.92,22 12.19,22C17.64,22 21.54,18.36 21.54,12.81C21.54,12.14 21.47,11.6 21.35,11.1Z'
      fill='#4285F4'
    />
  </svg>
)
const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox='0 0 24 24' className={cn('mr-2 h-5 w-5', className)}>
    {/* Simplified Facebook F */}
    <path
      d='M17,3.5H14C12.67,3.5 11.5,4.67 11.5,6V8.5H9V11.5H11.5V19.5H14.5V11.5H17L17.5,8.5H14.5V6.5C14.5,6.22 14.72,6 15,6H17V3.5Z'
      fill='#1877F2'
    />
  </svg>
)

interface IconProps {
  className?: string
}

const SpinnerIcon = ({ className }: IconProps) => (
  <svg
    className={cn('h-6 w-6 animate-spin text-primary', className)}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    ></circle>
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    ></path>
  </svg>
)

const CheckmarkIcon = ({ className }: IconProps) => (
  <svg
    className={cn('h-5 w-5 text-white', className)} // Icon color is white for green background
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='3'
    stroke='currentColor'
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
  </svg>
)

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(7, { message: 'Password must be at least 7 characters long' }),
  rememberMe: z.boolean().default(false),
})

type SignInHookReturn = {
  signIn: UseMutationResult<SignInResponse, AuthError, SignInRequest>
  failedAttempts: number
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { signIn, failedAttempts } = useSignIn() as SignInHookReturn
  const [captchaState, setCaptchaState] = useState<
    'idle' | 'loading' | 'verified'
  >('idle')
  const [animateCheckmark, setAnimateCheckmark] = useState(false) // New state for animation

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // if (captchaState !== 'verified') { // Real check
    //   alert("Please complete the CAPTCHA.");
    //   return;
    // }
    signIn.mutate({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    })
  }

  const handleCaptchaClick = () => {
    if (captchaState === 'idle' || captchaState === 'verified') {
      // Allow re-verify or initial verify
      setAnimateCheckmark(false) // Reset animation state
      setCaptchaState('loading')
      setTimeout(() => {
        setCaptchaState('verified')
        // Start animation slightly after state change to allow bg to transition
        setTimeout(() => setAnimateCheckmark(true), 50)
      }, 1500) // Simulate network delay
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-4'>
            {/* ... existing email and password fields ... */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1.5'>
                  <FormLabel className='text-sm font-medium'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='name@example.com'
                      {...field}
                      autoComplete='email'
                      disabled={signIn.isPending}
                      className='h-10 border-slate-200 bg-slate-50 transition-colors duration-200 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900'
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-medium text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='text-sm font-medium'>
                      Password
                    </FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-primary transition-colors hover:text-primary/80'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder='********'
                      {...field}
                      autoComplete='current-password'
                      showStrengthIndicator={false}
                      disabled={signIn.isPending}
                      className='h-10 border-slate-200 bg-slate-50 transition-colors duration-200 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900'
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-medium text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rememberMe'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={signIn.isPending}
                      className='data-[state=checked]:border-primary data-[state=checked]:bg-primary'
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-sm font-medium'>
                      Remember me
                    </FormLabel>
                    <FormDescription className='text-xs text-muted-foreground'>
                      Stay signed in for 30 days
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Enhanced CAPTCHA Placeholder Section */}
            <div className='flex min-h-[74px] items-center justify-start rounded-md border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/50'>
              <div
                className={cn(
                  'mr-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-all duration-200 ease-in-out',
                  captchaState === 'idle' &&
                    'border-slate-400 bg-white hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600',
                  captchaState === 'loading' &&
                    'border-transparent bg-transparent p-0.5',
                  captchaState === 'verified' &&
                    'border-green-600 bg-green-500 p-0' // Slightly darker green border
                )}
                onClick={handleCaptchaClick}
                role='checkbox'
                aria-checked={captchaState === 'verified'}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' || (e.key === ' ' && handleCaptchaClick())
                }
              >
                {captchaState === 'idle' && (
                  <div className='h-4 w-4 bg-transparent' />
                )}
                {captchaState === 'loading' && <SpinnerIcon />}
                {captchaState === 'verified' && (
                  <CheckmarkIcon
                    className={cn(
                      'transform transition-all delay-100 duration-300 ease-out',
                      animateCheckmark
                        ? 'scale-100 opacity-100'
                        : 'scale-0 opacity-0'
                    )}
                  />
                )}
              </div>
              <label
                className={cn(
                  'select-none text-sm font-medium transition-colors duration-200',
                  captchaState === 'verified'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-slate-700 dark:text-slate-300'
                )}
              >
                {captchaState === 'idle' && "I'm not a robot"}
                {captchaState === 'loading' && 'Verifying...'}
                {captchaState === 'verified' && 'You are human!'}
              </label>
              {/* reCAPTCHA logo and links */}
              <div className='ml-auto flex flex-col items-center'>
                <img
                  src='https://www.gstatic.com/recaptcha/api2/logo_48.png'
                  alt='reCAPTCHA'
                  width='32'
                  height='32'
                  className='opacity-80'
                />
                <p className='mt-0.5 text-xs text-slate-500 dark:text-slate-400'>
                  reCAPTCHA
                </p>
                <div className='flex space-x-1 text-[10px] text-slate-400 dark:text-slate-500'>
                  <a
                    href='https://policies.google.com/privacy'
                    target='_blank'
                    rel='noreferrer'
                    className='hover:underline'
                  >
                    Privacy
                  </a>
                  <span>-</span>
                  <a
                    href='https://policies.google.com/terms'
                    target='_blank'
                    rel='noreferrer'
                    className='hover:underline'
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
            {/* End CAPTCHA Placeholder Section */}

            <Button
              className='h-11 w-full font-medium shadow-sm transition-all hover:shadow-md'
              disabled={signIn.isPending || captchaState !== 'verified'}
              type='submit'
            >
              {signIn.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Social Login Buttons Divider */}
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-slate-200 dark:border-slate-700' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 font-medium text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>

      {/* Enhanced Social Login Buttons */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Button
          variant='outline'
          type='button'
          className='h-11 w-full border-slate-200 bg-slate-50 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50'
        >
          <GoogleIcon />
          Google
        </Button>
        <Button
          variant='outline'
          type='button'
          className='h-11 w-full border-slate-200 bg-slate-50 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50'
        >
          <FacebookIcon />
          Facebook
        </Button>
      </div>
    </div>
  )
}
