import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, Table, RefreshCw, UserCheck, Shield, Database, Cloud, CheckCircle2, AlertCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, users, currentUser, showToast, mongoStatus, setIsMongoModalOpen, checkMongoStatus, syncMongo } = useApp();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [invoiceFooter, setInvoiceFooter] = useState(settings.invoiceFooter);
  const [googleAppsScriptUrl, setGoogleAppsScriptUrl] = useState(settings.googleAppsScriptUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings({
      businessName,
      subtitle,
      phone,
      address,
      invoiceFooter,
      googleAppsScriptUrl: googleAppsScriptUrl.trim(),
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System Settings & Branding</h2>
        <p className="text-xs text-slate-600 font-medium">
          Configure business details, invoice printing memo templates, and cloud database connections
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-5">
        {/* Business Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              BUSINESS NAME
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              BUSINESS TAGLINE / SUBTITLE
            </label>
            <input
              type="text"
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              HOTLINE / PHONE
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              FACTORY / OFFICE ADDRESS
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
            />
          </div>
        </div>

        {/* Invoice Footer */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            INVOICE FOOTER NOTICE
          </label>
          <input
            type="text"
            required
            value={invoiceFooter}
            onChange={(e) => setInvoiceFooter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
          />
        </div>

        {/* Google Apps Script Web App URL */}
        <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-900">
            GOOGLE APPS SCRIPT WEB APP URL (OPTIONAL)
          </label>
          <input
            type="url"
            value={googleAppsScriptUrl}
            onChange={(e) => setGoogleAppsScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:border-purple-500 bg-white"
          />
          <p className="text-[11px] text-slate-600">
            Enables two-way synchronization between this system and your Google Sheet. Leave empty to use local database.
          </p>
        </div>

        {/* MongoDB Cloud Database Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-teal-50/40 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-700" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  MONGODB ATLAS CLOUD PERSISTENCE
                </h4>
                <p className="text-[11px] text-emerald-800/80">
                  Live cloud database engine powered by official MongoDB driver
                </p>
              </div>
            </div>

            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              mongoStatus?.connected
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${mongoStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {mongoStatus?.connected ? 'Cloud Connected' : 'Local Storage Mode'}
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
            {mongoStatus?.connected ? (
              <p>
                Connected to database: <strong>{mongoStatus.database || 'deshi_bite'}</strong>. All product catalogs, stock transactions, sales memos, and agent dues automatically sync to MongoDB Atlas in real time.
              </p>
            ) : (
              <p>
                MongoDB URI is not yet connected. All transactions are currently safely preserved in local memory and file storage. You can connect your MongoDB Atlas cluster in 1 click.
              </p>
            )}
            {mongoStatus?.maskedUri && (
              <p className="font-mono text-[11px] text-slate-500 truncate bg-white/70 p-1.5 rounded-lg border border-slate-200">
                URI: {mongoStatus.maskedUri}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsMongoModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{mongoStatus?.connected ? 'Manage MongoDB Atlas' : 'Connect MongoDB Atlas'}</span>
            </button>

            {mongoStatus?.connected && (
              <button
                type="button"
                onClick={async () => {
                  setIsSyncing(true);
                  await syncMongo('push');
                  setIsSyncing(false);
                }}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Force Cloud Sync</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
