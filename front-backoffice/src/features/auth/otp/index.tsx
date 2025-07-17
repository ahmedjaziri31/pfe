import { Link, useSearch } from '@tanstack/react-router'
import chatbotInternLogo from '@/assets/chatbotInternLogo.png'
import { OtpForm } from './components/otp-form'
import { ResetPasswordOtpForm } from './components/reset-password-otp-form'

export default function Otp() {
  const search = useSearch({ from: '/(auth)/otp' })
  const email = (search.email as string) || 'your email address'
  const isPasswordReset = search.type === 'reset-password'
  const otpType = search.type

  let pageTitle = 'Verify Your Email'
  let pageSubtitle = `We've sent a verification code to ${email}. Please enter it below.`
  let footerLinkText = "Didn't receive the code? Resend"
  let footerLinkTo = '/sign-up'
  let centralMessage = 'Protecting Your Account'
  let centralSubMessage =
    'Enter the One-Time Password sent to your email to proceed securely.'

  if (otpType === 'reset-password') {
    pageTitle = 'Check Your Email'
    pageSubtitle = `We've sent a password reset code to ${email}.`
    footerLinkText = "Didn't get the code? Try sending again"
    footerLinkTo = '/forgot-password'
    centralMessage = 'Secure Your Account'
    centralSubMessage = 'Enter the OTP from your email to reset your password.'
  } else if (otpType === 'mfa') {
    pageTitle = 'Two-Factor Authentication'
    pageSubtitle = `Enter the code from your authenticator app or the one sent to ${email}.`
    footerLinkText = 'Having trouble? Contact support'
    footerLinkTo = '/help-center'
    centralMessage = 'Extra Security Layer'
    centralSubMessage =
      'Confirm your identity with the OTP to ensure your account remains secure.'
  }

  return (
    <div className='container relative grid h-svh min-h-[700px] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col overflow-hidden p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-800 to-purple-900 opacity-95' />
        <div className='absolute inset-0 bg-gradient-to-tl from-teal-700 via-cyan-800 to-blue-900 opacity-60 mix-blend-screen' />

        <div className='saturate-125 animate-pulse-slow absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/25 to-purple-600/25 opacity-60 blur-3xl filter' />
        <div className='saturate-125 animate-pulse-slow-delay absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-gradient-to-tl from-teal-500/20 to-cyan-600/20 opacity-50 blur-3xl filter' />
        <div className='absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 opacity-40 blur-2xl brightness-110 filter' />
        <div className='absolute right-10 top-20 h-60 w-60 rounded-full bg-sky-500/15 opacity-50 blur-3xl' />
        <div className='absolute bottom-20 left-10 h-52 w-52 rounded-2xl bg-fuchsia-500/10 opacity-30 blur-2xl' />
        <div className='animate-ping-slow absolute left-1/3 top-10 h-40 w-40 rounded-full border-2 border-sky-400/30 opacity-30' />
        <div className='animate-ping-slow-delay absolute bottom-10 right-1/3 h-32 w-32 rounded-full border border-fuchsia-400/30 opacity-20' />
        <div className='absolute left-1/4 top-1/2 h-24 w-0.5 rotate-12 transform bg-gradient-to-b from-transparent via-sky-300/50 to-transparent opacity-50' />
        <div className='absolute bottom-1/3 right-1/4 h-20 w-0.5 -rotate-6 transform bg-gradient-to-t from-transparent via-fuchsia-300/50 to-transparent opacity-40' />

        <div className='relative z-20 m-auto flex max-w-md flex-col items-center text-center'>
          <div className='mb-10 rounded-full bg-black/30 p-6 shadow-xl backdrop-blur-md'>
            <img
              src={chatbotInternLogo}
              alt='Company Logo - Large'
              className='h-32 w-auto drop-shadow-xl filter md:h-40'
            />
          </div>
          <h2 className='text-4xl font-extrabold tracking-tight text-white shadow-black/50 [text-shadow:0_2px_10px_var(--tw-shadow-color)] md:text-5xl'>
            {centralMessage}
          </h2>
          <p className='mt-5 max-w-md text-lg leading-relaxed text-white/80 [text-shadow:0_1px_5px_rgba(0,0,0,0.5)] md:text-xl'>
            {centralSubMessage}
          </p>
        </div>

        <div className='relative z-20 mt-auto pb-6'>
          <blockquote className='space-y-2 text-center'>
            <p className='rounded-lg bg-black/30 px-6 py-4 text-sm italic text-white/90 shadow-lg backdrop-blur-md'>
              &ldquo;Your security is our priority.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      <div className='flex h-full items-center justify-center bg-background p-6 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              {pageTitle}
            </h1>
            <p className='whitespace-pre-wrap text-sm text-muted-foreground'>
              {pageSubtitle}
            </p>
          </div>

          {isPasswordReset ? <ResetPasswordOtpForm /> : <OtpForm />}

          <p className='mt-4 text-center text-sm text-muted-foreground'>
            {footerLinkText.split('? ')[0]}?{' '}
            <Link
              to={footerLinkTo as any}
              className='font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80'
            >
              {footerLinkText.includes('? ')
                ? footerLinkText.split('? ')[1]
                : footerLinkText.split('?')[1] || 'Click here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
