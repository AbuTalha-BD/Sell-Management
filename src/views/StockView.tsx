import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StockTransactionType } from '../types';
import { Boxes, Plus, Search, Filter, AlertTriangle, ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';

export const StockView: React.FC = () => {
  const { stockTransactions, products, setIsStockModalOpen, currentUser } = useApp();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Overview metrics
  const totalStockKg = products.reduce((acc, p) => acc + p.stockKg, 0);
  const totalStockPcs = products.reduce((acc, p) => acc + p.stockPcs, 0);
  const lowStockCount = products.filter(
    (p) =>
      (p.retailPriceKg || p.wholesalePriceKg ? p.stockKg <= p.lowStockThresholdKg : false) ||
      (p.retailPricePcs || p.wholesalePricePcs ? p.stockPcs <= p.lowStockThresholdPcs : false)
  ).length;

  const filteredTransactions = useMemo(() => {
    return stockTransactions.filter((tx) => {
      const matchSearch =
        tx.productName.toLowerCase().includes(search.toLowerCase().trim()) ||
        (tx.referenceNote && tx.referenceNote.toLowerCase().includes(search.toLowerCase().trim()));
      if (!matchSearch) return false;

      if (selectedType !== 'ALL' && tx.type !== selectedType) return false;
      return true;
    });
  }, [stockTransactions, search, selectedType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Stock Management & Ledger</h2>
          <p className="text-xs text-slate-600 font-medium">
            Real-time warehouse inventory audits, factory arrivals, and sales deductions
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsStockModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Stock Change</span>
          </button>
        )}
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-purple-100/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 uppercase">Total Warehouse Stock (KG)</span>
          <div className="text-2xl font-extrabold text-purple-900 mt-1">{totalStockKg.toLocaleString()} KG</div>
          <p className="text-[11px] text-slate-600 mt-0.5">Across {products.length} catalog items</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 uppercase">Total Warehouse Stock (PCS)</span>
          <div className="text-2xl font-extrabold text-indigo-900 mt-1">{totalStockPcs.toLocaleString()} PCS</div>
          <p className="text-[11px] text-slate-600 mt-0.5">Individually packaged pieces</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100/80 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Critical Low Stock Items</span>
          <div
            className={`text-2xl font-extrabold mt-1 ${
              lowStockCount > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'
            }`}
          >
            {lowStockCount} Products
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5">Below reorder alert limit</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-purple-100/80 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or reference..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'STOCK_IN', 'SALE', 'STOCK_OUT', 'ADJUSTMENT', 'RETURN'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === t
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Transactions Audit Table */}
      <div className="bg-white rounded-3xl border border-purple-100/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-center">Stock Flow</th>
                <th className="py-3 px-4">Recorded By</th>
                <th className="py-3 px-4">Reference Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isPositive = tx.type === 'STOCK_IN' || tx.type === 'RETURN';
                return (
                  <tr key={tx.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{tx.createdAtDate}</div>
                      <div className="text-[10px] text-slate-600">{tx.createdAtTime}</div>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-slate-900">{tx.productName}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.type === 'STOCK_IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.type === 'SALE'
                            ? 'bg-purple-100 text-purple-800'
                            : tx.type === 'STOCK_OUT'
                            ? 'bg-rose-100 text-rose-800'
                            : tx.type === 'RETURN'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowDownRight className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        <span>{tx.type}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-mono">
                      {isPositive ? '+' : '-'}
                      {tx.quantity} {tx.unit}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-slate-600">
                      <span>{tx.stockBefore}</span>
                      <span className="mx-1 text-slate-600">&rarr;</span>
                      <span className="font-bold text-slate-900">{tx.stockAfter}</span> {tx.unit}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">{tx.recordedBy}</td>

                    <td className="py-3 px-4 text-slate-600 italic max-w-xs truncate">
                      {tx.referenceNote || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
