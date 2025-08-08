
export interface CalculatorFormProps {
  onCalculate: (totalAmount: number) => void;
}

export interface Ticket {
  id: number;
  createdAt: Date;
  amounts: number[];
  links: string[];
  receiptLinks: string[];
}

export interface ResultsDisplayProps {
  tickets: Ticket[];
  onLinkChange: (ticketId: number, linkIndex: number, value: string) => void;
  onReceiptLinkChange: (ticketId: number, linkIndex: number, value: string) => void;
}

// --- Tipos para Operaciones ---

export type TradingPair = 'USDT/BRL' | 'USDT/TRX';

export interface Operation {
  id: string;
  ticketId: number;
  pair: TradingPair;
  orderNumber: string;
  quantity: number;
  price: number;
  fee: number;
  totalBRL: number;
  finalRate: number;
  date: string; // Formato YYYY-MM-DD
}

export interface OperationFormProps {
  onAddOperation: (operation: Omit<Operation, 'id' | 'totalBRL' | 'finalRate'>) => void;
  tickets: Ticket[];
}

export interface OperationsTableProps {
  operations: Operation[];
  onDeleteOperation: (id: string) => void;
  tickets: Ticket[];
}