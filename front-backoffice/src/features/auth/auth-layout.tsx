import { Link } from '@tanstack/react-router'
import chatbotInternLogo from '@/assets/chatbotInternLogo.png'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <div className='mb-8 flex items-center justify-center'>
          <Link to='/' className='flex flex-col items-center text-center'>
            <img
              src={chatbotInternLogo}
              alt='Company Logo'
              className='mb-3 h-16 w-auto'
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const textFallback = document.createElement('span')
                textFallback.textContent = 'Company Logo'
                target.parentNode?.insertBefore(
                  textFallback,
                  target.nextSibling
                )
              }}
            />
            <h1 className='text-xl font-semibold text-white'>Admin Portal</h1>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
