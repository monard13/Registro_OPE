import React, { useState } from 'react';
import type { OperationFormProps, TradingPair, Operation } from '../types';
import { PlusIcon } from './icons/PlusIcon';

export function OperationForm({ onAddOperation, tickets }: OperationFormProps): React.ReactNode {
  const [ticketId, setTicketId] = useState('');
  const [pair, setPair] = useState<TradingPair>('USDT/BRL');
  const [orderNumber, setOrderNumber] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [fee, setFee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!ticketId) {
      setError('Debe seleccionar un número de ticket.');
      return;
    }

    const numQuantity = parseFloat(quantity);
    const numPrice = parseFloat(price);
    const numFee = parseFloat(fee);

    if (isNaN(numQuantity) || isNaN(numPrice) || isNaN(numFee) || numQuantity <= 0 || numPrice <= 0 || numFee < 0) {
      setError('Por favor, ingrese valores numéricos válidos y positivos. La tasa puede ser cero.');
      return;
    }
    if (!orderNumber.trim()) {
      setError('El número de orden no puede estar vacío.');
      return;
    }

    const newOperation: Omit<Operation, 'id' | 'totalBRL' | 'finalRate'> = {
      ticketId: parseInt(ticketId, 10),
      pair,
      orderNumber,
      quantity: numQuantity,
      price: numPrice,
      fee: numFee,
      date,
    };

    onAddOperation(newOperation);

    // Reset form
    setTicketId('');
    setOrderNumber('');
    setQuantity('');
    setPrice('');
    setFee('');
    setError('');
  };
  
  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
        setter(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
            <label htmlFor="ticketId" className="block text-sm font-medium text-slate-300 mb-1">No. Ticket</label>
            <select
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" disabled>Seleccione un Ticket</option>
                {tickets.map(ticket => (
                    <option key={ticket.id} value={ticket.id}>
                        Ticket #{ticket.id}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="pair" className="block text-sm font-medium text-slate-300 mb-1">Par</label>
            <select id="pair" value={pair} onChange={(e) => setPair(e.target.value as TradingPair)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500">
                <option value="USDT/BRL">USDT/BRL</option>
                <option value="USDT/TRX">USDT/TRX</option>
            </select>
        </div>
        <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-slate-300 mb-1">No. da Ordem</label>
            <input type="text" id="orderNumber" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Data</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-300 mb-1">Quantia</label>
            <input type="text" id="quantity" value={quantity} onChange={handleNumericInput(setQuantity)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1">Preco</label>
            <input type="text" id="price" value={price} onChange={handleNumericInput(setPrice)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
            <label htmlFor="fee" className="block text-sm font-medium text-slate-300 mb-1">Taxa</label>
            <input type="text" id="fee" value={fee} onChange={handleNumericInput(setFee)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      
      <button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform active:scale-95 transition-all duration-200">
        <PlusIcon className="w-5 h-5" />
        Añadir Operación
      </button>
    </form>
  );
}