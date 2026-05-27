/**
 * Export Utilities
 * Generate JSON and CSV exports of analysis results
 */

/**
 * Export results as JSON file
 * @param {Object} data - Analysis results
 */
export function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-${data.metadata.filename}-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export results as CSV file
 * @param {Object} data - Analysis results
 */
export function exportCSV(data) {
  const rows = []

  // CSV Header
  rows.push([
    'Category',
    'Severity',
    'Element',
    'Selector',
    'Description',
    'WCAG',
    'Recommendation'
  ])

  // Flatten all issues into CSV rows
  const categories = [
    { name: 'Color Contrast', data: data.accessibility.colorContrast },
    { name: 'Headings', data: data.accessibility.headings },
    { name: 'Images', data: data.accessibility.images },
    { name: 'Forms', data: data.accessibility.forms },
    { name: 'ARIA', data: data.accessibility.aria }
  ]

  categories.forEach(({ name, data }) => {
    if (data && data.issues) {
      data.issues.forEach(issue => {
        rows.push([
          name,
          issue.severity || '',
          issue.element || '',
          issue.selector || '',
          issue.description || '',
          issue.wcag || '',
          issue.recommendation || ''
        ])
      })
    }
  })

  // Add navigation issues
  if (data.navigation && data.navigation.issues) {
    data.navigation.issues.forEach(issue => {
      rows.push([
        'Navigation',
        issue.severity || '',
        issue.element || '',
        issue.selector || '',
        issue.description || '',
        issue.wcag || '',
        issue.recommendation || ''
      ])
    })
  }

  // Convert to CSV string
  const csvContent = rows.map(row =>
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(cell).replace(/"/g, '""')
      return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped
    }).join(',')
  ).join('\n')

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-${data.metadata.filename}-${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
