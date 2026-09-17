import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Boxes, DollarSign, ShoppingBag, ArrowRight } from 'lucide-react';

export const Banner: React.FC = () => {
  const {
    currentUser,
    setIsSellModalOpen,
    setIsProductModalOpen,
    setIsStockModalOpen,
    setActiveTab,
  } = useApp();

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-600 p-6 sm:p-8 text-white shadow-lg shadow-purple-950/10 border border-purple-400/20">
      {/* Decorative background glow & shapes */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-purple-100 tracking-wide mb-3 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{isAdmin ? 'Master Controller' : 'Authorized Sales Agent'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {isAdmin ? 'Welcome, Administrator' : `Hello, ${currentUser?.name || 'Agent'}!`}
          </h1>

          <p className="text-sm sm:text-base text-purple-100/90 max-w-xl font-normal leading-relaxed">
            {isAdmin
              ? 'Real-time business performance, inventory audit, and agent balance reconciliation.'
              : 'Welcome to your sales portal. Track your daily performance, record customer sales instantly, and manage digital cash memos.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin ? (
            <>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-900 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-purple-400/40 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-purple-300" />
                <span>+ Add Product</span>
              </button>

              <button
                onClick={() => setIsStockModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Boxes className="w-4 h-4 text-purple-200" />
                <span>Add Stock</span>
              </button>

              <button
                onClick={() => setActiveTab('due')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-emerald-300" />
                <span>Manage Due</span>
              </button>
            </>
          ) : (
            // Agent gets the prominent SELL PRODUCT button! (Admin strictly does NOT get Sell button per requirement #12)
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 font-extrabold text-sm sm:text-base shadow-xl shadow-purple-950/20 hover:shadow-2xl transition-all hover:scale-103 active:scale-98 cursor-pointer group"
            >
              <ShoppingBag className="w-5 h-5 text-purple-700 group-hover:scale-110 transition-transform" />
              <span>SELL PRODUCT</span>
              <ArrowRight className="w-4 h-4 text-purple-700 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
