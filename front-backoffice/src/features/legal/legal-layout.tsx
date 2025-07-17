import { Link } from '@tanstack/react-router'
import chatbotInternLogo from '@/assets/chatbotInternLogo.png'

interface Props {
  children: React.ReactNode
  title: string
}

export default function LegalLayout({ children, title }: Props) {
  return (
    <div className='min-h-svh bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50'>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg dark:bg-slate-900/80'>
        <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
          <Link to='/' className='flex items-center space-x-2'>
            <img
              src={chatbotInternLogo}
              alt='Company Logo'
              className='h-8 w-auto'
            />
            <span className='text-lg font-bold'>Admin Portal</span>
          </Link>
          {/* Optional: Navigation links can go here */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className='container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='prose prose-slate dark:prose-invert lg:prose-lg mx-auto rounded-lg bg-background p-6 shadow-sm sm:p-8 md:p-10'>
          <h1 className='mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl'>
            {title}
          </h1>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className='py-8 text-center text-sm text-muted-foreground'>
        <p>&copy; {new Date().getFullYear()} Korpor. All rights reserved.</p>
        <p className='mt-1'>
          <Link to='/' className='hover:underline'>
            Back to Home
          </Link>
        </p>
      </footer>
    </div>
  )
}
