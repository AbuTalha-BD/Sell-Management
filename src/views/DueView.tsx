import React from 'react';
import { useApp } from '../context/AppContext';
import { DollarSign, Plus, ArrowDownRight, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DueView: React.FC = () => {
  const {
    currentUser,
    users,
    payments,
    setIsPaymentModalOpen,
    setSelectedAgentForPayment,
  } = useApp();

  const isAdmin = currentUser?.role === 'ADMIN';

  // Calculations
  const agentUsers = users.filter((u) => u.role === 'AGENT');
  const totalSystemDue = agentUsers.reduce((acc, u) => acc + u.currentDue, 0);
  const totalClearedPayments = payments.reduce((acc, p) => acc + p.amount, 0);

  // Relevant payments
  const relevantPayments = isAdmin ? payments : payments.filter((p) => p.agentId === currentUser?.id);

  const handleOpenPaymentForAgent = (agent: any) => {
    setSelectedAgentForPayment(agent);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isAdmin ? 'Agent Due & Payment Reconciliation' : 'My Due & Payment Ledger'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            {isAdmin
              ? 'Track individual agent outstanding balances, due settlements, and official payment receipts'
              : 'View your outstanding payable balance to Admin and past payment receipts'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setSelectedAgentForPayment(null);
              setIsPaymentModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Payment</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              {isAdmin ? 'Total Outstanding Due' : 'My Current Due Balance'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
            ৳{(isAdmin ? totalSystemDue : currentUser?.currentDue || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {isAdmin ? `Payable across ${agentUsers.length} sales agents` : 'Payable to Admin for sold inventory'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Total Cleared Payments
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            ৳{totalClearedPayments.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Settled & deposited into business accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Payment Status</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {isAdmin ? 'Reconciliation Active' : 'Account Good Standing'}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Double-entry ledger accuracy</p>
        </div>
      </div>

      {/* Admin: Agent Ledgers Table */}
      {isAdmin && (
        <div className="bg-white rounded-3xl border border-purple-100/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">Agent Accounts & Due Balances</h3>
            <p className="text-xs text-slate-600 font-medium">
              Click "Clear / Record Payment" to log cash receipt from any agent
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Agent Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Outstanding Due</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agentUsers.map((agent) => (
                  <tr key={agent.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">{agent.name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{agent.phone}</td>
                    <td className="py-3 px-4 text-slate-600">{agent.address || 'Dhaka, Bangladesh'}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          agent.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : agent.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-rose-600 text-sm">
                      ৳{agent.currentDue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenPaymentForAgent(agent)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Clear / Record Payment</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History Audit Table */}
      <div className="bg-white rounded-3xl border border-purple-100/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900">Payment Collection History</h3>
          <p className="text-xs text-slate-600 font-medium">Audited records of received payments and due clearances</p>
        </div>

        {relevantPayments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600">No payment records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  {isAdmin && <th className="py-3 px-4">Agent Name</th>}
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Recorded By</th>
                  <th className="py-3 px-4">Reference Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relevantPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{p.createdAtDate}</div>
                      <div className="text-[10px] text-slate-600">{p.createdAtTime}</div>
                    </td>

                    {isAdmin && (
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{p.agentName}</td>
                    )}

                    <td className="py-3 px-4 text-right font-extrabold text-emerald-700 text-sm">
                      ৳{p.amount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        <CreditCard className="w-3 h-3" />
                        <span>{p.paymentMethod}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">{p.recordedBy}</td>

                    <td className="py-3 px-4 text-slate-600 italic max-w-xs truncate">
                      {p.referenceNote || 'Due payment'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
