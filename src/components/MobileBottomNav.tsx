import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  ShoppingBag,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, setIsSellModalOpen } = useApp();
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-purple-100 px-3 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
          activeTab === 'dashboard' ? 'text-purple-700 font-extrabold' : 'text-slate-600'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px]">Dashboard</span>
      </button>

      <button
        onClick={() => setActiveTab('products')}
        className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
          activeTab === 'products' ? 'text-purple-700 font-extrabold' : 'text-slate-600'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-[10px]">Products</span>
      </button>

      {/* Center button: Sell for Agent or Stock for Admin */}
      {!isAdmin ? (
        <button
          onClick={() => setIsSellModalOpen(true)}
          className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 active:scale-95 transition-transform cursor-pointer"
          aria-label="Sell Product"
        >
          <ShoppingBag className="w-6 h-6" />
        </button>
      ) : (
        <button
          onClick={() => setActiveTab('agents')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
            activeTab === 'agents' ? 'text-purple-700 font-extrabold' : 'text-slate-600'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Agents</span>
        </button>
      )}

      <button
        onClick={() => setActiveTab('sales')}
        className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
          activeTab === 'sales' ? 'text-purple-700 font-extrabold' : 'text-slate-600'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-[10px]">Sales</span>
      </button>

      <button
        onClick={() => setActiveTab('due')}
        className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
          activeTab === 'due' ? 'text-purple-700 font-extrabold' : 'text-slate-600'
        }`}
      >
        <DollarSign className="w-5 h-5" />
        <span className="text-[10px]">Due & Pay</span>
      </button>
    </nav>
  );
};
