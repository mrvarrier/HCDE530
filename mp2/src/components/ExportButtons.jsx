import { Download, FileJson, FileSpreadsheet } from 'lucide-react'
import { exportJSON, exportCSV } from '../utils/export'

export default function ExportButtons({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
            <Download className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Export Report</h3>
            <p className="text-sm text-gray-600">Download analysis results</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportJSON(data)}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
          >
            <FileJson className="h-5 w-5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => exportCSV(data)}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  )
}
