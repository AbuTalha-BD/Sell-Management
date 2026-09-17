import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { X, Package, DollarSign, Boxes, ShieldAlert } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { isProductModalOpen, setIsProductModalOpen, editingProduct, setEditingProduct, saveProduct, showToast } =
    useApp();

  const [name, setName] = useState('');
  const [retailPriceKg, setRetailPriceKg] = useState<string>('');
  const [retailPricePcs, setRetailPricePcs] = useState<string>('');
  const [wholesalePriceKg, setWholesalePriceKg] = useState<string>('');
  const [wholesalePricePcs, setWholesalePricePcs] = useState<string>('');
  const [stockKg, setStockKg] = useState<string>('0');
  const [stockPcs, setStockPcs] = useState<string>('0');
  const [lowStockThresholdKg, setLowStockThresholdKg] = useState<string>('5');
  const [lowStockThresholdPcs, setLowStockThresholdPcs] = useState<string>('20');
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setRetailPriceKg(editingProduct.retailPriceKg?.toString() || '');
      setRetailPricePcs(editingProduct.retailPricePcs?.toString() || '');
      setWholesalePriceKg(editingProduct.wholesalePriceKg?.toString() || '');
      setWholesalePricePcs(editingProduct.wholesalePricePcs?.toString() || '');
      setStockKg(editingProduct.stockKg?.toString() || '0');
      setStockPcs(editingProduct.stockPcs?.toString() || '0');
      setLowStockThresholdKg(editingProduct.lowStockThresholdKg?.toString() || '5');
      setLowStockThresholdPcs(editingProduct.lowStockThresholdPcs?.toString() || '20');
      setActive(editingProduct.active);
    } else {
      setName('');
      setRetailPriceKg('');
      setRetailPricePcs('');
      setWholesalePriceKg('');
      setWholesalePricePcs('');
      setStockKg('0');
      setStockPcs('0');
      setLowStockThresholdKg('5');
      setLowStockThresholdPcs('20');
      setActive(true);
    }
  }, [editingProduct, isProductModalOpen]);

  if (!isProductModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    const hasAnyPrice =
      parseFloat(retailPriceKg) > 0 ||
      parseFloat(retailPricePcs) > 0 ||
      parseFloat(wholesalePriceKg) > 0 ||
      parseFloat(wholesalePricePcs) > 0;

    if (!hasAnyPrice) {
      showToast('Please specify at least one price (KG or PCS)', 'error');
      return;
    }

    setIsSubmitting(true);
    const prodData: Partial<Product> = {
      id: editingProduct?.id,
      name: name.trim(),
      retailPriceKg: retailPriceKg ? parseFloat(retailPriceKg) : null,
      retailPricePcs: retailPricePcs ? parseFloat(retailPricePcs) : null,
      wholesalePriceKg: wholesalePriceKg ? parseFloat(wholesalePriceKg) : null,
      wholesalePricePcs: wholesalePricePcs ? parseFloat(wholesalePricePcs) : null,
      stockKg: parseFloat(stockKg) || 0,
      stockPcs: parseInt(stockPcs, 10) || 0,
      lowStockThresholdKg: parseFloat(lowStockThresholdKg) || 0,
      lowStockThresholdPcs: parseInt(lowStockThresholdPcs, 10) || 0,
      active,
    };

    const success = await saveProduct(prodData);
    setIsSubmitting(false);

    if (success) {
      setIsProductModalOpen(false);
      setEditingProduct(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-purple-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-purple-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-600 font-medium">Configure item rates, units, and inventory limits</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsProductModalOpen(false);
              setEditingProduct(null);
            }}
            className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-slate-800 max-h-[80vh] overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              PRODUCT NAME *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken Nugget, Shahi Samosa"
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-500 bg-white"
            />
          </div>

          {/* Pricing Sections */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span>PRICING SPECIFICATIONS (Leave empty if unit not applicable)</span>
            </span>

            {/* Retail */}
            <div className="p-4 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-2">
              <span className="text-xs font-bold text-slate-700">Retail Pricing (খুচরা)</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Retail KG Price (৳)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={retailPriceKg}
                    onChange={(e) => setRetailPriceKg(e.target.value)}
                    placeholder="e.g. 700"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Retail PCS Price (৳)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={retailPricePcs}
                    onChange={(e) => setRetailPricePcs(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Wholesale */}
            <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 space-y-2">
              <span className="text-xs font-bold text-slate-700">Wholesale Pricing (পাইকারি)</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Wholesale KG Price (৳)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={wholesalePriceKg}
                    onChange={(e) => setWholesalePriceKg(e.target.value)}
                    placeholder="e.g. 620"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Wholesale PCS Price (৳)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={wholesalePricePcs}
                    onChange={(e) => setWholesalePricePcs(e.target.value)}
                    placeholder="e.g. 12"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stock Levels & Alerts */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-slate-600" />
              <span>STOCK LEVELS & ALERT THRESHOLDS</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Stock (KG)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={stockKg}
                  onChange={(e) => setStockKg(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Stock (PCS)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={stockPcs}
                  onChange={(e) => setStockPcs(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-amber-700 mb-1">Low Alert (KG)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={lowStockThresholdKg}
                  onChange={(e) => setLowStockThresholdKg(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-amber-200 focus:border-amber-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-amber-700 mb-1">Low Alert (PCS)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={lowStockThresholdPcs}
                  onChange={(e) => setLowStockThresholdPcs(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-amber-200 focus:border-amber-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="product-active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded-md text-purple-600 focus:ring-purple-500 border-slate-300"
            />
            <label htmlFor="product-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Product is Active (available in sales catalog)
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsProductModalOpen(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
