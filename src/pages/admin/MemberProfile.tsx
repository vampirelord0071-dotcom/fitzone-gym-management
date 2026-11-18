import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  MessageSquare, 
  CreditCard, 
  RefreshCw, 
  Printer, 
  Archive, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Dumbbell
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { MemberWithMembership, Membership, Payment } from '../../types/database';
import { GymService } from '../../services/gymService';
import { CollectPaymentModal } from '../../components/payments/CollectPaymentModal';
import { RenewMembershipModal } from '../../components/members/RenewMembershipModal';
import { PrintReceiptModal } from '../../components/payments/PrintReceiptModal';

export const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshData, showToast } = useGym();

  const [memberData, setMemberData] = useState<{
    member: MemberWithMembership;
    memberships: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editEmergency, setEditEmergency] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const loadMember = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await GymService.getMemberById(id);
      if (data) {
        setMemberData(data as any);
        setEditName(data.member.full_name);
        setEditPhone(data.member.phone);
        setEditEmail(data.member.email || '');
        setEditEmergency(data.member.emergency_contact || '');
        setEditNotes(data.member.notes || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMember();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-8 bg-dark-card rounded-xl w-48" />
        <div className="h-64 bg-dark-card rounded-2xl" />
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <p className="text-gray-400">Member not found or ID is invalid.</p>
        <Link
          to="/admin/members"
          className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-bold px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Directory</span>
        </Link>
      </div>
    );
  }

  const { member, memberships } = memberData;
  const currentMembership = member.currentMembership;
  const outstandingRupees = Math.round((currentMembership?.outstanding_balance_paise || 0) / 100);
  const totalPaidRupees = Math.round((currentMembership?.amount_paid_paise || 0) / 100);
  const totalDueRupees = Math.round((currentMembership?.total_due_paise || 0) / 100);

  const cleanPhone = member.phone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;
  const waUrl = `https://wa.me/${waPhone}?text=Hello%20${encodeURIComponent(member.full_name)},%20this%20is%20FitZone%20Gym.`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await GymService.updateMember(member.id, {
        full_name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim() || undefined,
        emergency_contact: editEmergency.trim() || undefined,
        notes: editNotes.trim() || undefined,
      });
      await refreshData();
      await loadMember();
      setIsEditing(false);
      showToast('Member profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleArchiveToggle = async () => {
    const isCurrentlyArchived = Boolean(member.archived_at);
    const confirmMsg = isCurrentlyArchived
      ? `Restore ${member.full_name} back to active members?`
      : `Deactivate ${member.full_name}? Financial records and past payments will remain completely preserved.`;

    if (window.confirm(confirmMsg)) {
      try {
        await GymService.archiveMember(member.id, !isCurrentlyArchived);
        await refreshData();
        await loadMember();
        showToast(isCurrentlyArchived ? 'Member restored' : 'Member deactivated', 'info');
      } catch (err: any) {
        showToast(err.message || 'Action failed', 'error');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 font-sans">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/members"
            className="p-2 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {member.full_name}
              </h1>
              <span className="font-mono text-xs font-bold text-gray-400 bg-dark-card border border-dark-border px-2 py-0.5 rounded">
                {member.member_code}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Member enrolled on {member.joined_at}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {outstandingRupees > 0 && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Collect Fee (₹{outstandingRupees.toLocaleString('en-IN')})</span>
            </button>
          )}

          <button
            onClick={() => setIsRenewModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-brand-red/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Renew Plan</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white"
            title="Print Member Dossier"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleArchiveToggle}
            className="p-2 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-red-400"
            title={member.archived_at ? 'Restore Member' : 'Deactivate Member'}
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border">
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-brand-red">
              Edit Member Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Emergency Contact</label>
                <input
                  type="tel"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-sm text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Member Notes</label>
              <textarea
                rows={2}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-sm text-white"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-dark-surface rounded-lg text-xs font-bold text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-red rounded-lg text-xs font-bold text-white shadow"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Member Card & Contacts */}
            <div className="space-y-4 md:border-r md:border-dark-border md:pr-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center font-black text-lg text-brand-red">
                  {member.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{member.full_name}</h2>
                  <p className="text-xs text-gray-400 font-mono">{member.member_code}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-500">Phone:</span>
                  <a href={`tel:${member.phone}`} className="font-semibold text-white hover:underline">
                    +91 {member.phone}
                  </a>
                </div>
                {member.email && (
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-500">Email:</span>
                    <a href={`mailto:${member.email}`} className="text-gray-200 hover:underline truncate max-w-[150px]">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.emergency_contact && (
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-500">Emergency:</span>
                    <span className="text-gray-200 font-semibold">{member.emergency_contact}</span>
                  </div>
                )}
              </div>

              {/* Quick Communication Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`tel:${member.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-dark-surface border border-dark-border text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-red" />
                  <span>Call</span>
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Column 2: Current Membership Status */}
            <div className="space-y-3 md:border-r md:border-dark-border md:pr-6">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Current Active Subscription
              </span>

              {currentMembership ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">
                    {currentMembership.plan_name}
                  </h3>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Validity Start:</span>
                      <span className="text-white font-medium">{currentMembership.start_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Validity End:</span>
                      <span className="text-white font-bold">{currentMembership.end_date}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-400">Days Remaining:</span>
                      <span className={`font-bold ${
                        (currentMembership.days_left ?? 0) <= 0
                          ? 'text-red-400'
                          : (currentMembership.days_left ?? 0) <= 7
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {currentMembership.days_left ?? 0} Days
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {member.archived_at ? (
                      <span className="inline-block px-2.5 py-1 rounded-md bg-gray-800 text-gray-400 text-xs font-bold border border-gray-700">
                        Deactivated Member
                      </span>
                    ) : (currentMembership.days_left ?? 0) <= 0 ? (
                      <span className="inline-block px-2.5 py-1 rounded-md bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-bold">
                        Expired — Requires Renewal
                      </span>
                    ) : (currentMembership.days_left ?? 0) <= 7 ? (
                      <span className="inline-block px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold">
                        Expiring Soon ({currentMembership.days_left}d)
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        Active & In Good Standing
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 py-4">
                  No active membership record found.
                </div>
              )}
            </div>

            {/* Column 3: Financial Balances */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Financial Health
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-dark-surface border border-dark-border">
                  <span className="text-[10px] uppercase text-gray-500 font-bold block">Total Billed</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    ₹{totalDueRupees.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-dark-surface border border-dark-border">
                  <span className="text-[10px] uppercase text-emerald-500 font-bold block">Paid Amount</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                    ₹{totalPaidRupees.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                outstandingRupees > 0
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              }`}>
                <div>
                  <span className="text-[10px] uppercase font-bold block">Outstanding Balance</span>
                  <span className="text-lg font-black">
                    ₹{outstandingRupees.toLocaleString('en-IN')}
                  </span>
                </div>
                {outstandingRupees > 0 && (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold shadow"
                  >
                    Clear Due
                  </button>
                )}
              </div>

              {member.notes && (
                <div className="p-3 rounded-xl bg-dark-surface border border-dark-border text-xs text-gray-400">
                  <span className="font-bold text-gray-300 block mb-0.5">Notes:</span>
                  {member.notes}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Payment History Ledger */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Payments History & Receipts</span>
          </h3>
          <span className="text-xs text-gray-400">
            Total Payments: {currentMembership?.payments?.length || 0}
          </span>
        </div>

        {(!currentMembership?.payments || currentMembership.payments.length === 0) ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No payments recorded yet for this membership.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dark-border bg-dark-surface text-gray-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Amount (INR)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Recorded By</th>
                  <th className="py-2.5 px-3 text-center">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {currentMembership.payments.map((p: Payment) => (
                  <tr key={p.id} className="hover:bg-dark-surface/50">
                    <td className="py-3 px-3 font-mono font-bold text-white">{p.receipt_number}</td>
                    <td className="py-3 px-3 text-gray-300">
                      {new Date(p.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-surface border border-dark-border text-gray-300">
                        {p.method}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      ₹{Math.round(p.amount_paise / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Captured</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400">{p.recorded_by}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          setReceiptPayment(p);
                          setIsReceiptModalOpen(true);
                        }}
                        className="text-[11px] text-brand-red hover:underline font-bold"
                      >
                        Print Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Complete Subscription & Renewal History */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-red" />
          <span>Membership & Renewal History</span>
        </h3>

        <div className="space-y-3">
          {memberships.map((ms: Membership, idx: number) => (
            <div
              key={ms.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                idx === 0
                  ? 'bg-dark-surface border-brand-red/30'
                  : 'bg-dark-surface/40 border-dark-border'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {ms.plan_name || 'Standard Package'}
                  </span>
                  {idx === 0 && (
                    <span className="bg-brand-red/20 text-brand-red border border-brand-red/40 text-[10px] font-bold px-2 py-0.5 rounded">
                      Latest Subscription
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Validity Period: <span className="text-gray-200">{ms.start_date}</span> to <span className="text-gray-200">{ms.end_date}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Plan Price</span>
                  <span className="font-bold text-white">
                    ₹{Math.round(ms.plan_price_paise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                {ms.discount_paise > 0 && (
                  <div>
                    <span className="text-emerald-500 block text-[10px] uppercase font-bold">Discount</span>
                    <span className="font-bold text-emerald-400">
                      -₹{Math.round(ms.discount_paise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Net Total Due</span>
                  <span className="font-bold text-brand-red">
                    ₹{Math.round(ms.total_due_paise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CollectPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        member={member}
        onPaymentSuccess={async (p) => {
          await loadMember();
          setReceiptPayment(p);
          setIsReceiptModalOpen(true);
        }}
      />

      <RenewMembershipModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        member={member}
        onRenewSuccess={async (p) => {
          await loadMember();
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
        planName={currentMembership?.plan_name || 'FitZone Membership'}
        outstandingBalancePaise={currentMembership?.outstanding_balance_paise}
      />
    </div>
  );
};
