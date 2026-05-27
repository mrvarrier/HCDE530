import { Loader2 } from 'lucide-react'

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 w-24 h-24 border-4 border-purple-200 rounded-full animate-ping"></div>
        {/* Middle ring */}
        <div className="absolute inset-2 w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        {/* Inner spinner */}
        <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      </div>

      <h3 className="mt-8 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Analyzing Your HTML
      </h3>
      <p className="mt-3 text-base text-gray-600 max-w-md text-center">
        Running comprehensive accessibility and navigation checks
      </p>

      {/* Progress indicators */}
      <div className="mt-8 w-full max-w-md space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700">Analyzing color contrast</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
          <span className="text-gray-700">Checking heading hierarchy</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
          <span className="text-gray-700">Validating ARIA attributes</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-200"></div>
          <span className="text-gray-700">Analyzing navigation structure</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-full max-w-md bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 h-3 rounded-full animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]" style={{width: '75%'}}></div>
      </div>
    </div>
  )
}
