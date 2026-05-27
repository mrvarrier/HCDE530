import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import { exportJSON, exportCSV } from '../utils/export'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ExportButtons({ data }) {
  const handleExportPDF = () => {
    const doc = new jsPDF()
    const { metadata, summary, accessibility, navigation } = data

    // Header
    doc.setFontSize(20)
    doc.setTextColor(59, 130, 246)
    doc.text('UX Audit Report', 14, 20)

    // Metadata
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Page: ${metadata.pageTitle}`, 14, 28)
    doc.text(`File: ${metadata.filename}`, 14, 33)
    doc.text(`Date: ${new Date(metadata.analyzedAt).toLocaleString()}`, 14, 38)
    doc.text(`Size: ${(metadata.htmlSize / 1024).toFixed(1)} KB`, 14, 43)

    // Summary Score
    const totalChecks = summary.passed + summary.totalIssues
    const score = totalChecks > 0 ? Math.round((summary.passed / totalChecks) * 100) : 0
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(`Overall Score: ${score}%`, 14, 53)

    // Summary table
    doc.autoTable({
      startY: 58,
      head: [['Status', 'Count']],
      body: [
        ['Passed', summary.passed.toString()],
        ['Critical Issues', summary.critical.toString()],
        ['Serious Issues', summary.serious.toString()],
        ['Moderate Issues', summary.moderate.toString()],
        ['Minor Issues', summary.minor.toString()],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Accessibility Issues
    let yPosition = doc.lastAutoTable.finalY + 10

    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Accessibility Issues', 14, yPosition)
    yPosition += 5

    const accessibilityIssues = []
    Object.entries(accessibility).forEach(([category, data]) => {
      if (data.issues && data.issues.length > 0) {
        data.issues.forEach(issue => {
          accessibilityIssues.push([
            category.charAt(0).toUpperCase() + category.slice(1),
            issue.severity,
            issue.description.substring(0, 80) + (issue.description.length > 80 ? '...' : '')
          ])
        })
      }
    })

    if (accessibilityIssues.length > 0) {
      doc.autoTable({
        startY: yPosition,
        head: [['Category', 'Severity', 'Description']],
        body: accessibilityIssues,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 25 },
          2: { cellWidth: 120 }
        }
      })
      yPosition = doc.lastAutoTable.finalY + 10
    }

    // Navigation Issues
    if (navigation.issues && navigation.issues.length > 0) {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.text('Navigation Issues', 14, yPosition)
      yPosition += 5

      const navIssues = navigation.issues.map(issue => [
        issue.severity,
        issue.description.substring(0, 100) + (issue.description.length > 100 ? '...' : '')
      ])

      doc.autoTable({
        startY: yPosition,
        head: [['Severity', 'Description']],
        body: navIssues,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 150 }
        }
      })
    }

    // Save PDF
    doc.save(`ux-audit-${Date.now()}.pdf`)
  }

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

          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl hover:from-red-700 hover:to-rose-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
          >
            <FileText className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}
