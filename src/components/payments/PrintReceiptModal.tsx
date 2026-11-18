import React from 'react';
import { X, Printer, Dumbbell, CheckCircle2 } from 'lucide-react';
import { Payment } from '../../types/database';
import { useGym } from '../../context/GymContext';

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  planName?: string;
  outstandingBalancePaise?: number;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  planName = 'Standard Membership',
  outstandingBalancePaise = 0
}) => {
  const { settings } = useGym();

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const amountRupees = Math.round(payment.amount_paise / 100);
  const outstandingRupees = Math.round(outstandingBalancePaise / 100);

  // Format date
  const paymentDate = new Date(payment.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-dark-surface border-b border-dark-border print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Payment Receipt Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-8 overflow-y-auto space-y-6 bg-white text-gray-900 rounded-b-2xl font-sans" id="printable-receipt">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-gray-950">
                  {settings.gym_name}
                </h1>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-xs">
                {settings.address}
              </p>
              <p className="text-xs text-gray-600">
                Phone: {settings.phone} | Email: {settings.email}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                PAID & VERIFIED
              </span>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Receipt Number
              </p>
              <p className="text-sm font-black text-gray-950">
                {payment.receipt_number}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {paymentDate}
              </p>
            </div>
          </div>

          {/* Member Details */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 uppercase font-bold text-[10px] block">
                Billed To (Member)
              </span>
              <p className="text-sm font-black text-gray-950 mt-0.5">
                {payment.member_name || 'Member'}
              </p>
              <p className="text-gray-600 mt-0.5">
                Member ID: <span className="font-semibold text-gray-900">{payment.member_code || 'FZ-XXXX'}</span>
              </p>
            </div>

            <div>
              <span className="text-gray-500 uppercase font-bold text-[10px] block">
                Payment Particulars
              </span>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">
                Method: <span className="font-bold">{payment.method}</span> ({payment.payment_source})
              </p>
              {payment.external_payment_id && (
                <p className="text-[11px] text-gray-600 truncate mt-0.5">
                  Ref ID: {payment.external_payment_id}
                </p>
              )}
              <p className="text-[11px] text-gray-600 mt-0.5">
                Recorded By: {payment.recorded_by}
              </p>
            </div>
          </div>

          {/* Receipt Breakdown Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-gray-500 uppercase text-[10px]">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 font-semibold text-gray-900">
                  {planName} Fee Payment
                  {payment.notes && (
                    <span className="block text-[11px] text-gray-500 font-normal mt-0.5">
                      Notes: {payment.notes}
                    </span>
                  )}
                </td>
                <td className="py-3 text-right font-black text-sm text-gray-950">
                  ₹{amountRupees.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-900">
                <td className="pt-3 font-bold text-gray-950 text-xs uppercase">
                  Total Amount Paid:
                </td>
                <td className="pt-3 text-right font-black text-base text-red-600">
                  ₹{amountRupees.toLocaleString('en-IN')}
                </td>
              </tr>
              {outstandingRupees > 0 && (
                <tr className="text-xs text-amber-700">
                  <td className="pt-1 font-semibold">Remaining Outstanding Balance:</td>
                  <td className="pt-1 text-right font-bold">₹{outstandingRupees.toLocaleString('en-IN')}</td>
                </tr>
              )}
            </tfoot>
          </table>

          {/* Footer & Signature */}
          <div className="pt-6 border-t border-gray-200 flex items-end justify-between text-[11px] text-gray-500">
            <div>
              <p className="font-semibold text-gray-700">Terms & Conditions:</p>
              <p>• Membership fees once paid are non-refundable.</p>
              <p>• Please preserve this receipt for admission verification.</p>
            </div>

            <div className="text-center w-36">
              <div className="border-b border-gray-400 h-10 mb-1" />
              <p className="text-[10px] uppercase font-bold text-gray-600">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
