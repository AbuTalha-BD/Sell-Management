import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  DollarSign,
  Users,
  ShoppingBag,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, setIsSellModalOpen } = useApp();
  const isAdmin = currentUser?.role === 'ADMIN';

  if (isAdmin) {
    const adminNavItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'stock', label: 'Stock', icon: Boxes },
      { id: 'sales', label: 'Sales', icon: ShoppingCart },
      { id: 'due', label: 'Due', icon: DollarSign },
      { id: 'agents', label: 'Agents', icon: Users },
    ];

    return (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-purple-100 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-100/80 text-purple-800 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-700' : 'text-slate-600'}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Agent Bottom Navigation
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-purple-100 px-3 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl cursor-pointer ${
          activeTab === 'dashboard' ? 'bg-purple-100/80 text-purple-800 font-extrabold' : 'text-slate-600 font-medium'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px]">Dashboard</span>
      </button>

      <button
        onClick={() => setActiveTab('products')}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl cursor-pointer ${
          activeTab === 'products' ? 'bg-purple-100/80 text-purple-800 font-extrabold' : 'text-slate-600 font-medium'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-[10px]">Products</span>
      </button>

      {/* Center button: Sell for Agent */}
      <button
        onClick={() => setIsSellModalOpen(true)}
        className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 active:scale-95 transition-transform cursor-pointer"
        aria-label="Sell Product"
      >
        <ShoppingBag className="w-6 h-6" />
      </button>

      <button
        onClick={() => setActiveTab('sales')}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl cursor-pointer ${
          activeTab === 'sales' ? 'bg-purple-100/80 text-purple-800 font-extrabold' : 'text-slate-600 font-medium'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-[10px]">Sales</span>
      </button>

      <button
        onClick={() => setActiveTab('due')}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl cursor-pointer ${
          activeTab === 'due' ? 'bg-purple-100/80 text-purple-800 font-extrabold' : 'text-slate-600 font-medium'
        }`}
      >
        <DollarSign className="w-5 h-5" />
        <span className="text-[10px]">Due</span>
      </button>
    </nav>
  );
};

