import { SimpleToolPage } from '@/components/SimpleToolPage'

export function ExcelToPdf() {
  return (
    <SimpleToolPage
      tool="excel-to-pdf"
      title="Excel to PDF"
      description="Convert a .xls or .xlsx file to PDF."
      submitLabel="Convert to PDF"
      accept={{
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      }}
    />
  )
}
