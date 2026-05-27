import { Download, FileJson, FileSpreadsheet } from 'lucide-react'
import { exportJSON, exportCSV } from '../utils/export'

export default function ExportButtons({ data }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Download className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-700">Export:</span>
      </div>

      <button
        onClick={() => exportJSON(data)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <FileJson className="h-4 w-4" />
        <span>JSON</span>
      </button>

      <button
        onClick={() => exportCSV(data)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>CSV</span>
      </button>
    </div>
  )
}
