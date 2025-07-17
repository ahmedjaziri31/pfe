export function exportToCSV(data: any[], filename: string) {
  const csvRows = []
  csvRows.push([
    'Property',
    'Sale Date',
    'Sale Amount',
    'Commission Rate',
    'Earned',
    'Status',
  ].join(','))

  data.forEach((row) => {
    const values = [
      row.property,
      new Date(row.saleDate).toLocaleDateString(),
      row.saleAmount,
      `${row.commissionRate}%`,
      row.commissionEarned,
      row.status,
    ]
    csvRows.push(values.join(','))
  })

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}