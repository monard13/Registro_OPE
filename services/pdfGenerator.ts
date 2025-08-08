import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Ticket } from '../types';

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function generateTicketPdf(ticket: Ticket): void {
  const doc = new jsPDF();

  // Calculate total amount
  const totalAmount = ticket.amounts.reduce((sum, current) => sum + current, 0);

  // Header
  doc.setFontSize(20);
  doc.text('Orden de Ticket', 105, 22, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Ticket No: ${ticket.id}`, 14, 35);
  doc.text(`Fecha: ${ticket.createdAt.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}`, 196, 35, { align: 'right' });
  
  doc.setLineWidth(0.5);
  doc.line(14, 40, 196, 40);

  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Monto Total a Depositar:', 14, 50);
  doc.setFont('courier', 'bold');
  doc.text(formatCurrency(totalAmount), 196, 50, { align: 'right' });
  doc.setFont('helvetica', 'normal');

  // Table with split values
  const tableColumn = ["#", "Valor Dividido (BRL)"];
  const tableRows: (string | number)[][] = [];

  ticket.amounts.forEach((amount, index) => {
    const ticketData = [
      index + 1,
      new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount),
    ];
    tableRows.push(ticketData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 60,
    theme: 'grid',
    headStyles: {
        fillColor: [30, 41, 59] // slate-800
    },
    styles: {
        halign: 'right'
    },
    columnStyles: {
        0: { halign: 'center' },
    }
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Este es un documento generado automáticamente. No es un comprobante de pago oficial.', 105, finalY + 15, { align: 'center' });

  // Save the PDF
  doc.save(`orden-ticket-${ticket.id}.pdf`);
}