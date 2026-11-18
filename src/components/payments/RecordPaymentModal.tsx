import React, { useState } from 'react';
import { X, Smartphone, Banknote, CreditCard } from 'lucide-react';
import { Client, PaymentRecord } from '../../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  initialClient?: Client | null;
  onRecord: (record: Partial<PaymentRecord>) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  clients,
  initialClient,
  onRecord
}) => {
  const [selectedClientId, setSelectedClientId] = useState(initialClient?.id || clients[0]?.id || '');
  const [amount, setAmount] = useState(initialClient?.amount || 1000);
  const [method, setMethod] = useState<'UPI' | 'Cash' | 'Card' | 'Bank Transfer'>('UPI');
  const [validity, setValidity] = useState('1 Month');

  if (!isOpen) return null;

  const currentClient = clients.find(c => c.id === selectedClientId) || initialClient;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;

    const todayStr = '05 Oct 2024';
    const expiryStr = '05 Nov 2024';

    onRecord({
      clientId: currentClient.id,
      clientName: currentClient.name,
      amount,
      date: todayStr,
      expiryDate: expiryStr,
      validity,
      status: 'Paid',
      paymentMethod: method,
      receiptNo: `REC-2024-${Math.floor(1000 + Math.random() * 9000)}`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#121722] border border-[#1E273A] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#1A2335] shrink-0">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Record Fee Payment
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A2234]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Select Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                const cl = clients.find(c => c.id === e.target.value);
                if (cl) setAmount(cl.amount);
              }}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id} className="bg-[#121722]">
                  {c.name} ({c.phone}) - {c.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Amount Received (₹)
            </label>
            <div className="relative">
              <span className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs">₹</span>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl pl-8 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all min-h-[42px] ${
                  method === 'UPI'
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-[#151C2B] border-[#20293D] text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Cash')}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all min-h-[42px] ${
                  method === 'Cash'
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-[#151C2B] border-[#20293D] text-gray-400 hover:text-white'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Card')}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all min-h-[42px] ${
                  method === 'Card'
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-[#151C2B] border-[#20293D] text-gray-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Card</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Validity
            </label>
            <select
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80"
            >
              <option value="1 Month">1 Month (30 Days)</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1A2335]">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#182030] hover:bg-[#202B40] text-gray-300 text-xs font-semibold min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-red-600/30 min-h-[44px]"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
