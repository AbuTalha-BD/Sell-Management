import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Package,
  Plus,
  Search,
  Edit2,
  AlertTriangle,
  Boxes,
  ShoppingBag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const {
    products,
    currentUser,
    setIsProductModalOpen,
    setEditingProduct,
    setIsStockModalOpen,
    setIsSellModalOpen,
  } = useApp();

  const isAdmin = currentUser?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'LOW_STOCK' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase().trim());
      if (!matchesSearch) return false;

      // Filter
      if (filter === 'ACTIVE') return p.active;
      if (filter === 'INACTIVE') return !p.active;
      if (filter === 'LOW_STOCK') {
        const isKgLow = p.retailPriceKg || p.wholesalePriceKg ? p.stockKg <= p.lowStockThresholdKg : false;
        const isPcsLow = p.retailPricePcs || p.wholesalePricePcs ? p.stockPcs <= p.lowStockThresholdPcs : false;
        return isKgLow || isPcsLow;
      }
      return true;
    });
  }, [products, search, filter]);

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isAdmin ? 'Product Inventory & Pricing' : 'Available Products Catalog'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            {isAdmin
              ? 'Maintain rates, unit classifications, and stock replenishment limits'
              : 'Live inventory stock and official wholesale/retail rate card'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => setIsStockModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <Boxes className="w-4 h-4" />
                <span>Adjust Stock</span>
              </button>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Product</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>SELL PRODUCT</span>
            </button>
          )}
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
            placeholder="Search products (e.g. Nugget, Singara)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'LOW_STOCK', 'ACTIVE', 'INACTIVE'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === mode
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {mode === 'ALL'
                ? 'All Products'
                : mode === 'LOW_STOCK'
                ? 'Low Stock Alerts'
                : mode === 'ACTIVE'
                ? 'Active'
                : 'Inactive'}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Grid */}
      <div className="bg-white rounded-3xl border border-purple-100/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Retail Price (খুচরা)</th>
                <th className="py-3 px-4">Wholesale Price (পাইকারি)</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                {isAdmin && <th className="py-3 px-4 text-center">Threshold</th>}
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isKgLow = p.retailPriceKg || p.wholesalePriceKg ? p.stockKg <= p.lowStockThresholdKg : false;
                const isPcsLow = p.retailPricePcs || p.wholesalePricePcs ? p.stockPcs <= p.lowStockThresholdPcs : false;
                const isLow = isKgLow || isPcsLow;

                return (
                  <tr key={p.id} className="hover:bg-purple-50/20 transition-colors">
                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">{p.name}</div>
                      {isLow && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-bold mt-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Stock Alert</span>
                        </span>
                      )}
                    </td>

                    {/* Retail Pricing */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {p.retailPriceKg && (
                          <div className="font-bold text-purple-900">৳{p.retailPriceKg} / KG</div>
                        )}
                        {p.retailPricePcs && (
                          <div className="font-semibold text-slate-700">৳{p.retailPricePcs} / PCS</div>
                        )}
                        {!p.retailPriceKg && !p.retailPricePcs && (
                          <span className="text-slate-600 italic">None</span>
                        )}
                      </div>
                    </td>

                    {/* Wholesale Pricing */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {p.wholesalePriceKg && (
                          <div className="font-bold text-indigo-900">৳{p.wholesalePriceKg} / KG</div>
                        )}
                        {p.wholesalePricePcs && (
                          <div className="font-semibold text-slate-700">৳{p.wholesalePricePcs} / PCS</div>
                        )}
                        {!p.wholesalePriceKg && !p.wholesalePricePcs && (
                          <span className="text-slate-600 italic">None</span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`font-mono font-extrabold px-2 py-0.5 rounded-md ${
                            isLow ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {p.stockKg} KG &bull; {p.stockPcs} PCS
                        </span>
                      </div>
                    </td>

                    {/* Thresholds (Admin only) */}
                    {isAdmin && (
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        {p.lowStockThresholdKg} KG / {p.lowStockThresholdPcs} PCS
                      </td>
                    )}

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {p.active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      {isAdmin ? (
                        <button
                          onClick={() => handleEdit(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsSellModalOpen(true)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Sell</span>
                        </button>
                      )}
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
