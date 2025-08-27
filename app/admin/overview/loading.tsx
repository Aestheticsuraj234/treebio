import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingPage = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='h-12 w-12 animate-spin text-emerald-500' />
    </div>
  )
}

export default LoadingPage