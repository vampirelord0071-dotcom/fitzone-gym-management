import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  MessageSquare, 
  CreditCard, 
  Search, 
  Clock, 
  Phone, 
  ExternalLink, 
  RefreshCw,
  CheckCircle2,
  Calendar,
  IndianRupee,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { MemberWithMembership, Payment } from '../../types/database';
import { CollectPaymentModal } from '../../components/payments/CollectPaymentModal';
import { PrintReceiptModal } from '../../components/payments/PrintReceiptModal';

export const Dues: React.FC = () => {
  const { settings, members, refreshData, showToast } = useGym();

  const [filterType, setFilterType] = useState<'all_pending' | 'due_today' | 'overdue' | 'expiring_7d' | 'expired'>('all_pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState<MemberWithMembership | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Custom editable WhatsApp reminder message preview
  const [customNote, setCustomNote] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const duesList = useMemo(() => {
    return members.filter((m) => {
      if (m.archived_at) return false;
      const ms = m.currentMembership;
      if (!ms) return false;

      const outstanding = ms.outstanding_balance_paise || 0;
      const daysLeft = ms.days_left ?? 0;

      if (filterType === 'all_pending') {
        return outstanding > 0;
      }
      if (filterType === 'due_today') {
        return outstanding > 0 && ms.start_date === todayStr;
      }
      if (filterType === 'overdue') {
        return outstanding > 0 && ms.start_date < todayStr;
      }
      if (filterType === 'expiring_7d') {
        return daysLeft >= 0 && daysLeft <= 7;
      }
      if (filterType === 'expired') {
        return daysLeft < 0;
      }
      return true;
    }).filter((m) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.member_code.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q)
      );
    });
  }, [members, filterType, searchTerm, todayStr]);

  // Aggregate stats
  const totalPendingPaise = members.reduce((sum, m) => {
    if (m.archived_at) return sum;
    return sum + (m.currentMembership?.outstanding_balance_paise || 0);
  }, 0);

  const expiringCount = members.filter(m => !m.archived_at && m.currentMembership?.status === 'expiring').length;
  const expiredCount = members.filter(m => !m.archived_at && m.currentMembership?.status === 'expired').length;

  const openWhatsAppReminder = (m: MemberWithMembership) => {
    const ms = m.currentMembership;
    const outstandingRupees = Math.round((ms?.outstanding_balance_paise || 0) / 100);
    const planName = ms?.plan_name || 'FitZone Membership';
    const expiry = ms?.end_date || 'your renewal date';

    let messageText = '';
    if (outstandingRupees > 0) {
      messageText = `Dear ${m.full_name}, this is a gentle reminder from ${settings.gym_name}. Your membership fee balance of ₹${outstandingRupees.toLocaleString('en-IN')} for ${planName} is due. Please settle via desk or UPI (${settings.upi_id || 'fitzone@okhdfcbank'}). Thank you!`;
    } else {
      messageText = `Dear ${m.full_name}, your ${planName} at ${settings.gym_name} expires on ${expiry}. Renew your membership today to continue uninterrupted gym floor and locker privileges!`;
    }

    if (customNote.trim()) {
      messageText += ` Note: ${customNote.trim()}`;
    }

    const cleanPhone = m.phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(messageText)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <span>Dues, Reminders & Expiry Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Track member payment balances, expiring cards, and generate direct 1-click WhatsApp reminders
          </p>
        </div>

        <button
          onClick={() => refreshData()}
          className="p-2.5 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white self-start sm:self-auto"
          title="Refresh Dues"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Pending Dues</span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            ₹{Math.round(totalPendingPaise / 100).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500">From all active enrolled members</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Expiring within 7 Days</span>
          <p className="text-2xl font-black text-red-400 mt-1">
            {expiringCount} Members
          </p>
          <span className="text-[10px] text-gray-500">Need renewal prompt</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Already Expired</span>
          <p className="text-2xl font-black text-gray-400 mt-1">
            {expiredCount} Members
          </p>
          <span className="text-[10px] text-gray-500">Requires fresh renewal or follow up</span>
        </div>
      </div>

      {/* 3. WhatsApp Disclosure Notice */}
      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-3">
        <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">WhatsApp Reminder Link Generator:</span>
          <p className="mt-0.5 text-emerald-300/90 leading-relaxed">
            Clicking the WhatsApp button opens WhatsApp Web or the WhatsApp Mobile App with a pre-filled, personalized reminder containing the member's exact outstanding amount, plan, and UPI details. 
            <em> (Note: Per Indian anti-spam laws, direct link generation does not fire automated bulk SMS in the background; for automated headless scheduling, an official WhatsApp Cloud API BSP webhook must be configured).</em>
          </p>
        </div>
      </div>

      {/* 4. Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          {[
            { id: 'all_pending', label: 'All Outstanding Dues' },
            { id: 'due_today', label: 'Due Today' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'expiring_7d', label: 'Expiring in 7 Days' },
            { id: 'expired', label: 'Expired' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                filterType === tab.id
                  ? 'bg-brand-red text-white'
                  : 'bg-dark-surface text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search dues by member name, code, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-input border border-dark-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red"
          />
        </div>
      </div>

      {/* 5. Dues Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
        {duesList.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">
            No records found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dark-border bg-dark-surface/60 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Member Name & ID</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Membership Plan</th>
                  <th className="py-3 px-4 text-right">Total Due</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Outstanding</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {duesList.map((m) => {
                  const ms = m.currentMembership;
                  const totalDueRupees = Math.round((ms?.total_due_paise || 0) / 100);
                  const paidRupees = Math.round((ms?.amount_paid_paise || 0) / 100);
                  const outstandingRupees = Math.round((ms?.outstanding_balance_paise || 0) / 100);
                  const daysLeft = ms?.days_left ?? 0;

                  return (
                    <tr key={m.id} className="hover:bg-dark-surface/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/admin/members/${m.id}`}
                          className="font-bold text-white hover:text-brand-red block"
                        >
                          {m.full_name}
                        </Link>
                        <span className="font-mono text-[10px] text-gray-400">
                          {m.member_code}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-300">
                        <a href={`tel:${m.phone}`} className="hover:underline">
                          +91 {m.phone}
                        </a>
                      </td>

                      <td className="py-3.5 px-4 text-white font-medium">
                        {ms?.plan_name}
                      </td>

                      <td className="py-3.5 px-4 text-right text-gray-300">
                        ₹{totalDueRupees.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right text-emerald-400 font-semibold">
                        ₹{paidRupees.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-amber-400">
                        ₹{outstandingRupees.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-gray-300 font-medium block">{ms?.end_date}</span>
                        <span className={`text-[10px] font-bold ${
                          daysLeft <= 0 ? 'text-red-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {daysLeft <= 0 ? 'Expired' : `${daysLeft} days remaining`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openWhatsAppReminder(m)}
                            className="flex items-center gap-1 bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                            title="Open pre-composed WhatsApp reminder"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Remind</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedMemberForPayment(m);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-dark-surface hover:bg-brand-red text-gray-200 hover:text-white border border-dark-border text-[11px] font-bold transition-colors"
                          >
                            Collect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CollectPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        member={selectedMemberForPayment}
        onPaymentSuccess={(p) => {
          setReceiptPayment(p);
          setIsReceiptModalOpen(true);
        }}
      />

      <PrintReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={receiptPayment}
        planName={selectedMemberForPayment?.currentMembership?.plan_name || 'FitZone Membership'}
      />
    </div>
  );
};
