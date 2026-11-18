import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  CheckCircle2, 
  Trash2, 
  MessageSquare,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Client, MembershipStatus } from '../../types';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';

interface ClientsListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onMarkAsPaid: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  isMobileView?: boolean;
}

export const ClientsList: React.FC<ClientsListProps> = ({
  clients,
  onSelectClient,
  onAddClient,
  onEditClient,
  onMarkAsPaid,
  onDeleteClient,
  isMobileView = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | MembershipStatus>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter calculations
  const totalCount = 85;
  const activeCount = 48;
  const expiringCount = 7;
  const pendingCount = 12;

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return client.status === 'Active';
    if (activeFilter === 'Expiring') return client.status === 'Expiring';
    if (activeFilter === 'Pending') return client.status === 'Pending' || client.status === 'Expired';
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full">
      {/* Desktop Header: Hidden in mobile view */}
      <div className={`items-center justify-between gap-2 ${isMobileView ? 'hidden' : 'hidden md:flex'}`}>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Clients</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage all your gym members</p>
        </div>

        <button
          onClick={onAddClient}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-sm font-semibold shadow-lg shadow-red-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Client</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full bg-[#131924] border border-[#1E273A] rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/60"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips - strictly single-line horizontally scrollable */}
      <div className="w-full overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              activeFilter === 'All'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#141A26] text-gray-400 hover:text-white border border-[#1F283C]'
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => setActiveFilter('Active')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'Active'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-500/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Active ({activeCount})
          </button>

          <button
            onClick={() => setActiveFilter('Expiring')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'Expiring'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-amber-950/40 text-amber-400 hover:bg-amber-950/60 border border-amber-500/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Expiring ({expiringCount})
          </button>

          <button
            onClick={() => setActiveFilter('Pending')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'Pending'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-rose-950/40 text-rose-400 hover:bg-rose-950/60 border border-rose-500/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className={`bg-[#121722] border border-[#1E273A] rounded-2xl overflow-hidden shadow-xl w-full ${isMobileView ? 'hidden' : 'hidden md:block'}`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#10141E] text-gray-400 font-semibold border-b border-[#1A2335] text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Photo</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Start Date</th>
              <th className="py-3 px-3">Expiry Date</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#182030]/60">
            {filteredClients.map((client, index) => (
              <tr key={client.id} className="hover:bg-[#151C2A] transition-colors group">
                <td className="py-3 px-3 text-gray-400 font-medium">{index + 1}</td>
                <td className="py-3 px-3">
                  <Avatar src={client.avatar} name={client.name} size="sm" />
                </td>
                <td className="py-3 px-3">
                  <span 
                    onClick={() => onSelectClient(client)}
                    className="font-semibold text-white group-hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {client.name}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-300 font-medium tracking-wide">
                  {client.phone}
                </td>
                <td className="py-3 px-3 text-gray-400">
                  {client.startDate}
                </td>
                <td className="py-3 px-3 text-gray-300 font-medium">
                  {client.expiryDate}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={client.status} size="sm" />
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5 relative">
                    <button
                      onClick={() => onSelectClient(client)}
                      className="px-3 py-1 rounded-lg bg-[#182030] hover:bg-[#222C40] text-gray-200 hover:text-white border border-[#232F46] text-xs font-medium transition-all shadow-sm"
                    >
                      View
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2638]"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === client.id && (
                        <div 
                          className="absolute right-0 top-full mt-1 w-44 bg-[#141A26] border border-[#232C42] rounded-xl shadow-2xl py-1.5 z-30"
                          onMouseLeave={() => setOpenMenuId(null)}
                        >
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onEditClient(client);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Edit Client</span>
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onMarkAsPaid(client);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Paid</span>
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              alert(`Simulated sending WhatsApp reminder to ${client.name} (${client.phone})`);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-sky-400 hover:bg-sky-500/10 flex items-center gap-2"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Send Reminder</span>
                          </button>

                          <div className="my-1 border-t border-[#1F283C]" />

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onDeleteClient(client);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Member</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className={`space-y-2.5 w-full ${isMobileView ? 'block' : 'block md:hidden'}`}>
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client)}
            className="p-3 sm:p-3.5 bg-[#121722] border border-[#1E273A] rounded-xl flex flex-col gap-2.5 active:scale-[0.99] transition-all cursor-pointer w-full"
          >
            <div className="flex items-center gap-3">
              <Avatar src={client.avatar} name={client.name} size="md" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{client.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{client.phone}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Expires: <span className="text-gray-300 font-medium">{client.expiryDate}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-[#1C2538]/60">
              <StatusBadge status={client.status} size="sm" />
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>View</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="p-6 text-center bg-[#121722] border border-[#1E273A] rounded-xl text-gray-400">
            <Filter className="w-6 h-6 mx-auto text-gray-500 mb-2" />
            <p className="text-xs">No clients match your filter or search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
