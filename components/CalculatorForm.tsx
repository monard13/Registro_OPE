
import React, { useState } from 'react';
import type { CalculatorFormProps } from '../types';

export function CalculatorForm({ onCalculate }: CalculatorFormProps): React.ReactNode {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor, ingrese un monto válido y positivo.');
      return;
    }
    setError('');
    onCalculate(numericAmount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     // Allow only numbers and a single decimal point
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
        setAmount(value);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="total-amount" className="block text-sm font-medium text-slate-300 mb-2">
          Monto Total (BRL)
        </label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R$</span>
            <input
            type="text"
            id="total-amount"
            name="total-amount"
            className="w-full pl-10 pr-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 text-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
            placeholder="Ej: 150000.50"
            value={amount}
            onChange={handleInputChange}
            autoComplete="off"
            />
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transform active:scale-95 transition-all duration-200"
      >
        Calcular Divisiones
      </button>
    </form>
  );
}
