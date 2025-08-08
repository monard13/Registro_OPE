import React, { useState, useCallback, useEffect } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { OperationForm } from './components/OperationForm';
import { OperationsTable } from './components/OperationsTable';
import { splitAmount } from './services/amountSplitter';
import type { Ticket, Operation } from './types';
import { ArrowLeftIcon } from './components/icons/ArrowLeftIcon';

function App(): React.ReactNode {
  const [view, setView] = useState<'main' | 'orders' | 'operations'>('main');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [nextTicketId, setNextTicketId] = useState<number>(1);
  const [operations, setOperations] = useState<Operation[]>([]);

  // --- Data Persistence ---
  useEffect(() => {
    try {
      const savedTickets = localStorage.getItem('tickets');
      if (savedTickets) {
        const parsedTickets = JSON.parse(savedTickets).map((t: any) => ({...t, createdAt: new Date(t.createdAt)}));
        setTickets(parsedTickets);
        if (parsedTickets.length > 0) {
            setNextTicketId(Math.max(...parsedTickets.map((t: Ticket) => t.id)) + 1);
        }
      }
      const savedOperations = localStorage.getItem('operations');
      if (savedOperations) {
          setOperations(JSON.parse(savedOperations));
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error("Failed to save tickets to localStorage", error);
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem('operations', JSON.stringify(operations));
    } catch (error) {
      console.error("Failed to save operations to localStorage", error);
    }
  }, [operations]);


  // --- Ticket Handlers ---
  const handleCalculate = useCallback((total: number) => {
    const results = splitAmount(total);
    const newTicket: Ticket = {
      id: nextTicketId,
      createdAt: new Date(),
      amounts: results,
      links: Array(results.length).fill(''),
      receiptLinks: Array(results.length).fill(''),
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);
    setNextTicketId(prevId => prevId + 1);
  }, [nextTicketId]);

  const handleLinkChange = useCallback((ticketId: number, linkIndex: number, value: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, links: ticket.links.map((l, i) => i === linkIndex ? value : l) } : ticket
      )
    );
  }, []);

  const handleReceiptLinkChange = useCallback((ticketId: number, linkIndex: number, value: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, receiptLinks: ticket.receiptLinks.map((l, i) => i === linkIndex ? value : l) } : ticket
      )
    );
  }, []);

  // --- Operation Handlers ---
  const handleAddOperation = useCallback((op: Omit<Operation, 'id' | 'totalBRL' | 'finalRate'>) => {
    const totalBRL = op.quantity * op.price;
    const finalRate = op.quantity > 0 ? ((totalBRL + op.fee) / op.quantity) : op.price;

    const newOperation: Operation = {
      ...op,
      id: crypto.randomUUID(),
      totalBRL,
      finalRate,
    };
    setOperations(prevOps => [newOperation, ...prevOps]);
  }, []);

  const handleDeleteOperation = useCallback((id: string) => {
    setOperations(prevOps => prevOps.filter(op => op.id !== id));
  }, []);

  const renderMainView = () => (
    <main className="flex flex-col items-center justify-center text-center" style={{ minHeight: '80vh' }}>
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">Control de Operaciones</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 mb-12">BASE SOLUTION</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setView('orders')}
          className="bg-cyan-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transform active:scale-95 transition-all duration-200"
        >
          Crear Orden
        </button>
        <button
          onClick={() => setView('operations')}
          className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform active:scale-95 transition-all duration-200"
        >
          Registrar Operación
        </button>
      </div>
    </main>
  );

  const renderOrdersView = () => (
    <>
      <header className="text-center mb-8 relative">
        <button 
          onClick={() => setView('main')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-700 transition-colors"
          aria-label="Volver al menú principal"
          title="Volver al menú principal"
        >
          <ArrowLeftIcon className="w-6 h-6 text-slate-400" />
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">ORDENES DE TICKET</h1>
        <p className="text-slate-400 text-lg">Divide un monto total en transferencias menores a BRL 99,999.</p>
      </header>
      <main>
        <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-700">
          <CalculatorForm onCalculate={handleCalculate} />
        </div>
        {tickets.length > 0 && (
          <div className="mt-8">
            <ResultsDisplay 
              tickets={tickets} 
              onLinkChange={handleLinkChange}
              onReceiptLinkChange={handleReceiptLinkChange} 
            />
          </div>
        )}
      </main>
    </>
  );

  const renderOperationsView = () => (
     <>
      <header className="text-center mb-8 relative">
        <button 
          onClick={() => setView('main')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-700 transition-colors"
          aria-label="Volver al menú principal"
          title="Volver al menú principal"
        >
          <ArrowLeftIcon className="w-6 h-6 text-slate-400" />
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">REGISTRO DE OPERACIONES</h1>
        <p className="text-slate-400 text-lg">Añade tus transacciones de compra y venta.</p>
      </header>
      <main>
        <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-700">
          <OperationForm onAddOperation={handleAddOperation} tickets={tickets} />
        </div>
        <div className="mt-8">
          <OperationsTable operations={operations} onDeleteOperation={handleDeleteOperation} tickets={tickets} />
        </div>
      </main>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {view === 'main' && renderMainView()}
        {view === 'orders' && renderOrdersView()}
        {view === 'operations' && renderOperationsView()}
        
        {view !== 'main' && (
           <footer className="text-center mt-12 text-slate-500 text-sm">
              <p>Control de Operaciones BASE SOLUTION</p>
           </footer>
        )}
      </div>
    </div>
  );
}

export default App;