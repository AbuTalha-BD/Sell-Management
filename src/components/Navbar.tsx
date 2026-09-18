import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Table,
  Bell,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Shield,
  ShoppingBag,
  Database,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    notifications,
    setIsNotificationModalOpen,
    setIsGoogleSheetModalOpen,
    setIsMongoModalOpen,
    mongoStatus,
    settings,
    activeTab,
    setActiveTab,
    setIsSellModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead && (n.targetRole === 'ALL' || n.targetRole === currentUser?.role)).length;

  const isAdmin = currentUser?.role === 'ADMIN';

  const navItems = isAdmin
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'agents', label: 'Agents', icon: Users, badge: notifications.filter((n) => n.title.includes('Agent')).length || undefined },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'stock', label: 'Stock Management', icon: Boxes },
        { id: 'sales', label: 'All Sales & Invoices', icon: ShoppingCart },
        { id: 'due', label: 'Due & Payments', icon: DollarSign },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products', label: 'Available Products', icon: Package },
        { id: 'sales', label: 'My Sales & Memos', icon: ShoppingCart },
        { id: 'due', label: 'My Due & Payments', icon: DollarSign },
        { id: 'settings', label: 'Profile & Settings', icon: Settings },
      ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-purple-100/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand + Badge */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 -ml-1 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform shrink-0">
                  DB
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base">DESHI BITE</span>
                    <span
                      className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${
                        isAdmin
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {isAdmin ? 'ADMIN' : 'AGENT'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium hidden md:block">
                    Sales, Stock & Agent Management System
                  </p>
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* MongoDB Cloud Driver Status Button - Admin Only (Desktop & Tablet only, hidden on mobile) */}
              {isAdmin && (
                <button
                  onClick={() => setIsMongoModalOpen(true)}
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all shadow-2xs cursor-pointer ${
                    mongoStatus?.connected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                  }`}
                  title={mongoStatus?.connected ? 'MongoDB Atlas Cloud Synced' : 'Connect MongoDB Atlas'}
                >
                  <Database className={`w-3.5 h-3.5 ${mongoStatus?.connected ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>MongoDB</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      mongoStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </button>
              )}

              {/* Connect Google Sheet Button - Admin Only (Desktop & Tablet only, hidden on mobile) */}
              {isAdmin && (
                <button
                  onClick={() => setIsGoogleSheetModalOpen(true)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 rounded-full border border-slate-200 hover:border-purple-300 transition-all shadow-2xs cursor-pointer"
                  title="Google Sheets Database Connection"
                >
                  <Table className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sheets</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      settings.googleAppsScriptUrl ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </button>
              )}

              {/* Sell Product Button for Agent in Header (Optional quick trigger) */}
              {!isAdmin && (
                <button
                  onClick={() => setIsSellModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full shadow-sm hover:shadow-purple-500/20 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Sell Product</span>
                </button>
              )}

              {/* Notifications */}
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="relative p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white text-[8px] sm:text-[9px] font-extrabold rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Profile Pill */}
              {currentUser && (
                <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
                  <div
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-85 transition-opacity group"
                    title="Account Settings & Security"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs group-hover:scale-105 transition-transform shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-purple-700 transition-colors">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-600">{currentUser.phone}</div>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-1 sm:p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Matches 2nd image exactly) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-72 sm:w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-purple-600/30">
                  DB
                </div>
                <span className="font-extrabold text-slate-900 text-base tracking-tight">DESHI BITE</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 py-3 space-y-1">
              {!isAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSellModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold text-xs mb-3 shadow-md shadow-purple-500/20 active:scale-98 transition-transform cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>SELL PRODUCT</span>
                </button>
              )}

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-50 text-purple-800 font-bold'
                        : 'text-slate-700 font-medium hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Database Connections Section (Admin Only, matches Screenshot 2) */}
            {isAdmin && (
              <div className="pt-3 pb-3 border-t border-slate-100 shrink-0">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
                  DATABASE CONNECTIONS
                </div>

                <div className="space-y-2">
                  {/* MongoDB Atlas Item */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsMongoModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Database className={`w-4 h-4 shrink-0 ${mongoStatus?.connected ? 'text-emerald-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-semibold text-slate-800 truncate">MongoDB Atlas</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          mongoStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <span className={mongoStatus?.connected ? 'text-emerald-700 font-semibold' : 'text-slate-600 font-medium'}>
                        {mongoStatus?.connected ? 'Synced' : 'Connect'}
                      </span>
                    </div>
                  </button>

                  {/* Google Sheets Item */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsGoogleSheetModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Table className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 truncate">Google Sheets</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          settings.googleAppsScriptUrl ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <span className={settings.googleAppsScriptUrl ? 'text-emerald-700 font-semibold' : 'text-slate-600 font-medium'}>
                        {settings.googleAppsScriptUrl ? 'Synced' : 'Connect'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* User Profile & Sign Out Bottom Section */}
            <div className="pt-3 pb-1 border-t border-slate-100 text-xs shrink-0">
              <div className="px-1 mb-2.5">
                <p className="font-bold text-slate-900 leading-snug">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{currentUser?.phone}</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 px-3 text-center text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-2xl border border-rose-200 hover:border-rose-300 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Click Outside to Close Drawer */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
