import { Loader2 } from 'lucide-react'

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        Analyzing HTML...
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Running accessibility and navigation checks
      </p>
      <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
      </div>
    </div>
  )
}
