import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) {
    console.warn("No data to export")
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header]
        const stringValue = value?.toString() ?? ""
        // Escape commas and quotes
        return stringValue.includes(",") || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue
      }).join(",")
    ),
  ].join("\n")

  downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;")
}

/**
 * Export data to Excel format
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName = "Sheet1"
): void {
  if (data.length === 0) {
    console.warn("No data to export")
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Auto-size columns
  const maxWidth = 50
  const wscols = Object.keys(data[0]).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((row) => row[key]?.toString().length ?? 0)
    )
    return { wch: Math.min(maxLength + 2, maxWidth) }
  })
  worksheet["!cols"] = wscols

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

/**
 * Export data to PDF format
 */
export function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  title?: string
): void {
  if (data.length === 0) {
    console.warn("No data to export")
    return
  }

  const doc = new jsPDF()

  // Add title
  if (title) {
    doc.setFontSize(16)
    doc.text(title, 14, 15)
  }

  // Prepare table data
  const headers = Object.keys(data[0])
  const body = data.map((row) =>
    headers.map((header) => row[header]?.toString() ?? "")
  )

  // Add table
  autoTable(doc, {
    startY: title ? 25 : 10,
    head: [headers],
    body,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })

  doc.save(`${filename}.pdf`)
}

/**
 * Download a file with given content
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export multiple sheets to Excel
 */
export function exportMultiSheetExcel(
  sheets: Array<{ name: string; data: Record<string, unknown>[] }>,
  filename: string
): void {
  const workbook = XLSX.utils.book_new()

  sheets.forEach(({ name, data }) => {
    if (data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, name)
    }
  })

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

/**
 * Generate a filename with timestamp
 */
export function generateFilename(prefix: string, extension: string): string {
  const date = new Date()
  const timestamp = date.toISOString().split("T")[0].replace(/-/g, "")
  return `${prefix}_${timestamp}.${extension}`
}
