import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportColumn {
  header: string;
  key: string;
}

// Export to Excel
export const exportToExcel = (data: Record<string, any>[], columns: ExportColumn[], fileName: string) => {
  const rows = data.map(item =>
    columns.reduce((acc, col) => {
      acc[col.header] = item[col.key] ?? '';
      return acc;
    }, {} as Record<string, any>)
  );

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Export to PDF (RTL Arabic support)
export const exportToPDF = (data: Record<string, any>[], columns: ExportColumn[], fileName: string, title: string) => {
  const doc = new jsPDF({ orientation: 'landscape' });

  // Title
  doc.setFontSize(16);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString('ar-EG'), doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

  const headers = columns.map(c => c.header);
  const rows = data.map(item => columns.map(col => String(item[col.key] ?? '')));

  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 28,
    styles: { fontSize: 9, halign: 'center', cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { top: 28 },
  });

  doc.save(`${fileName}.pdf`);
};

// Predefined column configs
export const bookingColumns: ExportColumn[] = [
  { header: 'Customer Name', key: 'customer_name' },
  { header: 'Phone', key: 'customer_phone' },
  { header: 'Email', key: 'customer_email' },
  { header: 'Service', key: 'service_name' },
  { header: 'Date', key: 'scheduled_date' },
  { header: 'Time', key: 'scheduled_time' },
  { header: 'Status', key: 'status_label' },
  { header: 'Notes', key: 'notes' },
  { header: 'Created At', key: 'created_date' },
];

export const orderColumns: ExportColumn[] = [
  { header: 'Customer Name', key: 'customer_name' },
  { header: 'Phone', key: 'customer_phone' },
  { header: 'Email', key: 'customer_email' },
  { header: 'Service', key: 'service_name' },
  { header: 'Amount', key: 'total_amount' },
  { header: 'Status', key: 'status_label' },
  { header: 'Description', key: 'description' },
  { header: 'Created At', key: 'created_date' },
];

const statusMap: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  processing: 'Processing',
};

export const prepareBookingsData = (bookings: any[]) =>
  bookings.map(b => ({
    ...b,
    service_name: b.service?.name || '',
    status_label: statusMap[b.status] || b.status,
    created_date: new Date(b.created_at).toLocaleDateString('en-US'),
  }));

export const prepareOrdersData = (orders: any[]) =>
  orders.map(o => ({
    ...o,
    service_name: o.service?.name || '',
    status_label: statusMap[o.status] || o.status,
    created_date: new Date(o.created_at).toLocaleDateString('en-US'),
  }));
