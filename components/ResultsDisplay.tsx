import React, { useState, useEffect } from 'react';
import type { ResultsDisplayProps, Ticket } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { generateTicketPdf } from '../services/pdfGenerator';

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Helper to format date and time
const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};


export function ResultsDisplay({ tickets, onLinkChange, onReceiptLinkChange }: ResultsDisplayProps): React.ReactNode {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (copiedId !== null) {
      const timer = setTimeout(() => setCopiedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
  };

  const handleDownloadPdf = (ticket: Ticket) => {
    generateTicketPdf(ticket);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg animate-fade-in">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
             <h2 className="text-xl font-bold text-cyan-300">Registro de Órdenes</h2>
        </div>
      
      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-cyan-300 uppercase bg-slate-700 sticky top-0">
                <tr>
                    <th scope="col" className="px-4 py-3">No. Ticket</th>
                    <th scope="col" className="px-4 py-3">Fecha y Hora</th>
                    <th scope="col" className="px-4 py-3">Valores</th>
                    <th scope="col" className="px-4 py-3">Link</th>
                    <th scope="col" className="px-4 py-3">Comprobante</th>
                    <th scope="col" className="px-4 py-3 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => (
                    <React.Fragment key={ticket.id}>
                        {ticket.amounts.map((amount, index) => {
                            const isFirstRow = index === 0;
                            const amountId = `amount-${ticket.id}-${index}`;
                            const linkId = `link-${ticket.id}-${index}`;
                            const receiptId = `receipt-${ticket.id}-${index}`;
                            const linkValue = ticket.links[index] || '';
                            const receiptLinkValue = ticket.receiptLinks[index] || '';

                            return (
                                <tr key={`${ticket.id}-${index}`} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                                    {isFirstRow && (
                                        <td rowSpan={ticket.amounts.length} className="px-4 py-4 font-medium text-slate-100 align-middle text-center border-r border-slate-700">
                                            {ticket.id}
                                        </td>
                                    )}
                                    {isFirstRow && (
                                        <td rowSpan={ticket.amounts.length} className="px-4 py-4 text-slate-300 align-middle text-center border-r border-slate-700">
                                            {formatDateTime(ticket.createdAt)}
                                        </td>
                                    )}
                                    <td className="px-4 py-4 align-middle">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-lg text-slate-200 tracking-wider">
                                              {formatCurrency(amount)}
                                            </span>
                                            <button
                                              onClick={() => handleCopy(amount.toFixed(2).replace('.', ','), amountId)}
                                              className="p-2 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-400 hover:text-white transition-colors flex-shrink-0"
                                              aria-label="Copiar valor"
                                            >
                                              {copiedId === amountId ? (
                                                <CheckIcon className="w-5 h-5 text-green-400" />
                                              ) : (
                                                <CopyIcon className="w-5 h-5" />
                                              )}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 align-middle">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                className="w-full bg-slate-600 border border-slate-500 rounded-md p-2 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                                                placeholder="Pegar link aquí..."
                                                value={linkValue}
                                                onChange={(e) => onLinkChange(ticket.id, index, e.target.value)}
                                                aria-label={`Link para o valor ${formatCurrency(amount)}`}
                                            />
                                            <button
                                                onClick={() => handleCopy(linkValue, linkId)}
                                                disabled={!linkValue}
                                                className="p-2 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-400 hover:text-white transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Copiar link"
                                            >
                                                {copiedId === linkId ? (
                                                  <CheckIcon className="w-5 h-5 text-green-400" />
                                                ) : (
                                                  <CopyIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 align-middle">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                className="w-full bg-slate-600 border border-slate-500 rounded-md p-2 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                                                placeholder="Pegar comprobante aquí..."
                                                value={receiptLinkValue}
                                                onChange={(e) => onReceiptLinkChange(ticket.id, index, e.target.value)}
                                                aria-label={`Comprobante para o valor ${formatCurrency(amount)}`}
                                            />
                                            <button
                                                onClick={() => handleCopy(receiptLinkValue, receiptId)}
                                                disabled={!receiptLinkValue}
                                                className="p-2 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-400 hover:text-white transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Copiar comprobante"
                                            >
                                                {copiedId === receiptId ? (
                                                  <CheckIcon className="w-5 h-5 text-green-400" />
                                                ) : (
                                                  <CopyIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    {isFirstRow && (
                                      <td rowSpan={ticket.amounts.length} className="px-4 py-4 align-middle text-center border-l border-slate-700">
                                        <button
                                          onClick={() => handleDownloadPdf(ticket)}
                                          className="p-2 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-400 hover:text-white transition-colors"
                                          aria-label="Descargar Ticket en PDF"
                                          title="Descargar Ticket en PDF"
                                        >
                                          <DownloadIcon className="w-5 h-5" />
                                        </button>
                                      </td>
                                    )}
                                </tr>
                            )
                        })}
                    </React.Fragment>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                        No hay órdenes generadas todavía.
                    </td>
                  </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}