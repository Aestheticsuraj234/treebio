import React from 'react'

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'>
        
      {children}
    </div>
  )
}

export default AuthLayout