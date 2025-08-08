import React, { useState, useMemo } from 'react';
import type { OperationsTableProps, TradingPair, Operation, Ticket } from '../types';
import { TrashIcon } from './icons/TrashIcon';

const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat('pt-BR', options).format(num);

export function OperationsTable({ operations, onDeleteOperation, tickets }: OperationsTableProps): React.ReactNode {
  const [activePair, setActivePair] = useState<TradingPair>('USDT/BRL');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(''); // '' for all tickets

  const filteredOperations = useMemo(() => 
    operations
    .filter(op => op.pair === activePair)
    .filter(op => selectedTicketId ? op.ticketId === parseInt(selectedTicketId, 10) : true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [operations, activePair, selectedTicketId]
  );

  const totals = useMemo(() => {
    const count = filteredOperations.length;
    if (count === 0) {
      return { sumQuantia: 0, avgPreco: 0, sumTaxa: 0, sumTotalBRL: 0, avgFinalRate: 0 };
    }
    const sumQuantia = filteredOperations.reduce((acc, op) => acc + op.quantity, 0);
    const sumTotalBRL = filteredOperations.reduce((acc, op) => acc + op.totalBRL, 0);
    const sumPreco = filteredOperations.reduce((acc, op) => acc + op.price, 0);
    const sumTaxa = filteredOperations.reduce((acc, op) => acc + op.fee, 0);
    const sumFinalRate = filteredOperations.reduce((acc, op) => acc + op.finalRate, 0);
    
    return {
      sumQuantia,
      avgPreco: sumPreco / count,
      sumTaxa, // Changed from avgTaxa to sumTaxa
      sumTotalBRL,
      avgFinalRate: sumFinalRate / count,
    };
  }, [filteredOperations]);

  const TabButton = ({ pair, children }: { pair: TradingPair, children: React.ReactNode }) => (
    <button
      onClick={() => setActivePair(pair)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        activePair === pair 
          ? 'bg-slate-700 text-indigo-300 border-b-2 border-indigo-400' 
          : 'text-slate-400 hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-700 px-4 pt-2 gap-2">
            <div className="flex">
                <TabButton pair="USDT/BRL">USDT/BRL</TabButton>
                <TabButton pair="USDT/TRX">USDT/TRX</TabButton>
            </div>
            <div className="pb-2 sm:pb-0">
                <label htmlFor="ticketFilter" className="sr-only">Filtrar por Ticket</label>
                <select
                    id="ticketFilter"
                    value={selectedTicketId}
                    onChange={(e) => setSelectedTicketId(e.target.value)}
                    className="p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500 text-sm"
                    aria-label="Filtrar por Ticket"
                >
                    <option value="">Todos los Tickets</option>
                    {tickets.map(ticket => (
                        <option key={ticket.id} value={ticket.id}>
                            Ticket #{ticket.id}
                        </option>
                    ))}
                </select>
            </div>
        </div>
      
      <div className="overflow-x-auto relative p-4">
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-indigo-300 uppercase bg-slate-700">
                <tr>
                    <th scope="col" className="px-4 py-3">No. Ticket</th>
                    <th scope="col" className="px-4 py-3">No. da Ordem</th>
                    <th scope="col" className="px-4 py-3 text-right">Quantia</th>
                    <th scope="col" className="px-4 py-3 text-right">Preco</th>
                    <th scope="col" className="px-4 py-3 text-right">Taxa</th>
                    <th scope="col" className="px-4 py-3 text-right">Total BRL</th>
                    <th scope="col" className="px-4 py-3 text-right">Taxa Final</th>
                    <th scope="col" className="px-4 py-3 text-center">Data</th>
                    <th scope="col" className="px-4 py-3 text-center">Acción</th>
                </tr>
            </thead>
            <tbody>
                {filteredOperations.map((op) => (
                  <tr key={op.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="px-4 py-4 font-medium text-slate-100 text-center">{op.ticketId}</td>
                      <td className="px-4 py-4">{op.orderNumber}</td>
                      <td className="px-4 py-4 text-right font-mono">{formatNumber(op.quantity, { minimumFractionDigits: 4 })}</td>
                      <td className="px-4 py-4 text-right font-mono">{formatNumber(op.price, { minimumFractionDigits: 4 })}</td>
                      <td className="px-4 py-4 text-right font-mono">{formatNumber(op.fee, { minimumFractionDigits: 4 })}</td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-slate-100">{formatNumber(op.totalBRL, { style: 'currency', currency: 'BRL' })}</td>
                      <td className="px-4 py-4 text-right font-mono">{formatNumber(op.finalRate, { minimumFractionDigits: 8 })}</td>
                      <td className="px-4 py-4 text-center">{new Date(op.date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-4 text-center">
                          <button onClick={() => onDeleteOperation(op.id)} className="p-2 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-600 transition-colors" aria-label="Eliminar operación">
                              <TrashIcon className="w-5 h-5" />
                          </button>
                      </td>
                  </tr>
                ))}
                {filteredOperations.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400">
                        No hay operaciones registradas para {activePair}
                        {selectedTicketId && ` en el Ticket #${selectedTicketId}`}.
                    </td>
                  </tr>
                )}
            </tbody>
            <tfoot>
                <tr className="font-bold text-indigo-200 bg-slate-700">
                    <td colSpan={2} className="px-4 py-3 text-right">Totales</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(totals.sumQuantia, { minimumFractionDigits: 4 })}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(totals.avgPreco, { minimumFractionDigits: 4 })}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(totals.sumTaxa, { minimumFractionDigits: 4 })}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(totals.sumTotalBRL, { style: 'currency', currency: 'BRL' })}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(totals.avgFinalRate, { minimumFractionDigits: 8 })}</td>
                    <td colSpan={2}></td>
                </tr>
            </tfoot>
        </table>
      </div>
    </div>
  );
}