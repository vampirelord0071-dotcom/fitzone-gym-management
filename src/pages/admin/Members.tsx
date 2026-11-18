import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  RefreshCw, 
  MoreVertical, 
  Phone, 
  CreditCard, 
  Calendar, 
  ChevronRight,
  AlertTriangle,
  Archive,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { MemberWithMembership, Payment } from '../../types/database';
import { CollectPaymentModal } from '../../components/payments/CollectPaymentModal';
import { RenewMembershipModal } from '../../components/members/RenewMembershipModal';
import { PrintReceiptModal } from '../../components/payments/PrintReceiptModal';
import { GymService } from '../../services/gymService';

export const Members: React.FC = () => {
  const navigate = useNavigate();
  const { members, refreshData, showToast } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'expiring' | 'expired' | 'pending' | 'archived'>('all');
  const [sortField, setSortField] = useState<'name' | 'expiry' | 'joined'>('expiry');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState<MemberWithMembership | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [selectedMemberForRenew, setSelectedMemberForRenew] = useState<MemberWithMembership | null>(null);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Filter and search logic
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Archive filter
      if (filterTab === 'archived') {
        if (!m.archived_at) return false;
      } else {
        if (m.archived_at) return false;
        if (filterTab !== 'all') {
          if (filterTab === 'pending') {
            const outPaise = m.currentMembership?.outstanding_balance_paise || 0;
            if (outPaise <= 0) return false;
          } else {
            if (m.currentMembership?.status !== filterTab) return false;
          }
        }
      }

      // Search term (name, code, phone)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = m.full_name.toLowerCase().includes(q);
        const matchCode = m.member_code.toLowerCase().includes(q);
        const matchPhone = m.phone.toLowerCase().includes(q);
        return matchName || matchCode || matchPhone;
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'name') {
        const diff = a.full_name.localeCompare(b.full_name);
        return sortOrder === 'asc' ? diff : -diff;
      } else if (sortField === 'joined') {
        const diff = new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
        return sortOrder === 'asc' ? diff : -diff;
      } else {
        const dateA = a.currentMembership?.end_date ? new Date(a.currentMembership.end_date).getTime() : 0;
        const dateB = b.currentMembership?.end_date ? new Date(b.currentMembership.end_date).getTime() : 0;
        const diff = dateA - dateB;
        return sortOrder === 'asc' ? diff : -diff;
      }
    });
  }, [members, filterTab, searchTerm, sortField, sortOrder]);

  const handleArchiveToggle = async (m: MemberWithMembership) => {
    const isCurrentlyArchived = Boolean(m.archived_at);
    const confirmMsg = isCurrentlyArchived
      ? `Restore ${m.full_name} back to active members?`
      : `Deactivate ${m.full_name}? Financial records and past payments will remain completely preserved.`;

    if (window.confirm(confirmMsg)) {
      try {
        await GymService.archiveMember(m.id, !isCurrentlyArchived);
        await refreshData();
        showToast(
          isCurrentlyArchived ? 'Member restored successfully' : 'Member deactivated (financial history preserved)',
          'info'
        );
      } catch (err: any) {
        showToast(err.message || 'Action failed', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-red" />
            <span>Members Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage memberships, status expirations, contact details, and payment histories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/members/new"
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-red/30 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Member</span>
          </Link>
          <button
            onClick={() => refreshData()}
            className="p-2.5 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white"
            title="Refresh Members"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Members (${members.filter(m => !m.archived_at).length})` },
            { id: 'active', label: `Active (${members.filter(m => !m.archived_at && m.currentMembership?.status === 'active').length})` },
            { id: 'expiring', label: `Expiring Soon (${members.filter(m => !m.archived_at && m.currentMembership?.status === 'expiring').length})` },
            { id: 'expired', label: `Expired (${members.filter(m => !m.archived_at && m.currentMembership?.status === 'expired').length})` },
            { id: 'pending', label: `Pending Dues (${members.filter(m => !m.archived_at && (m.currentMembership?.outstanding_balance_paise || 0) > 0).length})` },
            { id: 'archived', label: `Deactivated (${members.filter(m => Boolean(m.archived_at)).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                filterTab === tab.id
                  ? 'bg-brand-red text-white'
                  : 'bg-dark-surface text-gray-400 hover:text-white hover:bg-dark-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input & Sort toggles */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, member code (FZ-1001), or 10-digit mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-input border border-dark-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="px-3 py-2 bg-dark-input border border-dark-border rounded-xl text-xs text-gray-300 focus:outline-none focus:border-brand-red"
            >
              <option value="expiry">Sort: Expiry Date</option>
              <option value="name">Sort: Full Name</option>
              <option value="joined">Sort: Joining Date</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-xl bg-dark-input border border-dark-border text-gray-400 hover:text-white"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Members Table / List */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
        {filteredMembers.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            No members found matching your search and filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dark-border bg-dark-surface/50 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Plan & Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Fee Dues (INR)</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {filteredMembers.map((m) => {
                  const membership = m.currentMembership;
                  const outstandingRupees = Math.round((membership?.outstanding_balance_paise || 0) / 100);
                  const isArchived = Boolean(m.archived_at);

                  return (
                    <tr key={m.id} className="hover:bg-dark-surface/40 transition-colors">
                      {/* Member Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                            {m.full_name.charAt(0)}
                          </div>
                          <div>
                            <Link
                              to={`/admin/members/${m.id}`}
                              className="font-bold text-white hover:text-brand-red text-sm transition-colors flex items-center gap-1.5"
                            >
                              <span>{m.full_name}</span>
                              <span className="font-mono text-[10px] text-gray-400 bg-dark-surface px-1.5 py-0.5 rounded border border-dark-border">
                                {m.member_code}
                              </span>
                            </Link>
                            <p className="text-gray-400 text-[11px] mt-0.5 flex items-center gap-2">
                              <span>+91 {m.phone}</span>
                              {m.email && <span>• {m.email}</span>}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan & Validity */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-white">
                          {membership?.plan_name || 'No active plan'}
                        </p>
                        {membership && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Valid: {membership.start_date} to <span className="text-gray-200 font-medium">{membership.end_date}</span>
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isArchived ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-400 border border-gray-700">
                            Deactivated
                          </span>
                        ) : membership?.status === 'active' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                            Active ({membership.days_left}d left)
                          </span>
                        ) : membership?.status === 'expiring' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 border border-red-500/30 text-red-400">
                            Expiring in {membership.days_left}d
                          </span>
                        ) : membership?.status === 'expired' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-dark-surface border border-dark-border text-gray-400">
                            Expired
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 border border-amber-500/30 text-amber-400">
                            Payment Pending
                          </span>
                        )}
                      </td>

                      {/* Outstanding Balance */}
                      <td className="py-3.5 px-4 text-right">
                        {outstandingRupees > 0 ? (
                          <div>
                            <span className="text-xs font-black text-amber-400">
                              ₹{outstandingRupees.toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[10px] text-gray-400">due</span>
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-semibold text-[11px]">
                            Fully Paid
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            to={`/admin/members/${m.id}`}
                            className="p-1.5 rounded-lg bg-dark-surface hover:bg-dark-border border border-dark-border text-gray-300 hover:text-white transition-colors"
                            title="View member profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {outstandingRupees > 0 && !isArchived && (
                            <button
                              onClick={() => {
                                setSelectedMemberForPayment(m);
                                setIsPaymentModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-bold transition-colors"
                              title="Collect payment"
                            >
                              Collect
                            </button>
                          )}

                          {!isArchived && (
                            <button
                              onClick={() => {
                                setSelectedMemberForRenew(m);
                                setIsRenewModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-brand-red hover:bg-brand-red-hover text-white text-[11px] font-bold shadow transition-colors"
                              title="Renew membership"
                            >
                              Renew
                            </button>
                          )}

                          <button
                            onClick={() => handleArchiveToggle(m)}
                            className="p-1.5 rounded-lg bg-dark-surface hover:bg-dark-border text-gray-500 hover:text-gray-300"
                            title={isArchived ? 'Restore member' : 'Deactivate member'}
                          >
                            <Archive className="w-3.5 h-3.5" />
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

      <RenewMembershipModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        member={selectedMemberForRenew}
        onRenewSuccess={(p) => {
          if (p) {
            setReceiptPayment(p);
            setIsReceiptModalOpen(true);
          }
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
