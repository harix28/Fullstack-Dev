import React, { useState } from 'react';
import { Shield, Bell, Trash2, Globe, Sun, CheckCircle2 } from 'lucide-react';
import { Button, Card, Modal } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
export default function SettingsPage() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const { showToast } = useToast();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [preferences, setPreferences] = useState({
        emailNotifs: true,
        smsNotifs: true,
        pushNotifs: true,
        dataVisibility: true
    });
    const Toggle = ({ checked, onChange }) => (<button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#59463B]' : 'bg-[#E3D5CA]'}`}>
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}/>
    </button>);
    const handleClearSaved = (type) => {
        if (type === 'schemes') {
            localStorage.removeItem('govconnect_saved_schemes');
            showToast({ title: 'Saved Schemes Cleared', description: 'Your saved schemes list has been emptied.', variant: 'info' });
        }
        else {
            localStorage.removeItem('govconnect_saved_jobs');
            showToast({ title: 'Bookmarked Jobs Cleared', description: 'Your bookmarked jobs list has been emptied.', variant: 'info' });
        }
    };
    return (<div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#2D231E] mb-1">
          Settings & Preferences
        </h1>
        <p className="text-[#6B5E55] text-sm">
          Customize platform appearance, security parameters, and notification alerts.
        </p>
      </div>

      {/* ── APPEARANCE & THEME ── */}
      <section>
        <h2 className="text-lg font-bold text-[#2D231E] mb-3 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500"/> Platform Visual Theme
        </h2>
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#2D231E]">Clean Civic Light UI</h3>
              <p className="text-xs text-[#7D6E63] mt-0.5">
                High-contrast, accessible typography optimized for all screen types and e-governance standards.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#59463B]"/> Active & Enforced
            </span>
          </div>
        </Card>
      </section>

      {/* ── LANGUAGE & LOCALIZATION (Prompt Section 32) ── */}
      <section>
        <h2 className="text-lg font-bold text-[#2D231E] mb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#59463B]"/> Language & Localization
        </h2>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#2D231E]">Application Language</h3>
              <p className="text-xs text-[#7D6E63]">Multilingual citizen support architecture.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={() => setLanguage('en')} className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${language === 'en'
            ? 'border-[#59463B] bg-[#FAF7F2] text-[#59463B]'
            : 'border-[#D6CCC2] text-[#6B5E55] hover:bg-[#FAF7F2]'}`}>
              <span>English (Default)</span>
              {language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#59463B]"/>}
            </button>

            <button onClick={() => setLanguage('hi')} className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${language === 'hi'
            ? 'border-[#59463B] bg-[#FAF7F2] text-[#59463B]'
            : 'border-[#D6CCC2] text-[#6B5E55] hover:bg-[#FAF7F2]'}`}>
              <span>हिंदी (Hindi)</span>
              {language === 'hi' && <CheckCircle2 className="w-4 h-4 text-[#59463B]"/>}
            </button>

            <div className="p-3 rounded-xl border border-dashed border-[#D6CCC2] text-[#8C7D73] text-xs font-medium flex items-center justify-between">
              <span>Hinglish (AI Ready)</span>
              <span className="text-[10px] bg-[#EDEDE9] px-1.5 py-0.5 rounded">Prompt Mode</span>
            </div>
          </div>
        </Card>
      </section>

      {/* ── NOTIFICATIONS ── */}
      <section>
        <h2 className="text-lg font-bold text-[#2D231E] mb-3 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#59463B]"/> Notification Alerts
        </h2>
        <Card className="divide-y divide-slate-100">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#2D231E]">Scheme & Job Deadline Alerts</p>
              <p className="text-xs text-[#7D6E63]">Receive alerts 7 days and 1 day prior to application last date.</p>
            </div>
            <Toggle checked={preferences.emailNotifs} onChange={() => setPreferences({ ...preferences, emailNotifs: !preferences.emailNotifs })}/>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#2D231E]">SMS Verification & Status Updates</p>
              <p className="text-xs text-[#7D6E63]">Critical updates regarding your grievance drafts and vault credentials.</p>
            </div>
            <Toggle checked={preferences.smsNotifs} onChange={() => setPreferences({ ...preferences, smsNotifs: !preferences.smsNotifs })}/>
          </div>
        </Card>
      </section>

      {/* ── PRIVACY & SAVED DATA (Prompt Section 51) ── */}
      <section>
        <h2 className="text-lg font-bold text-[#2D231E] mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#59463B]"/> Privacy & Local Data Storage
        </h2>
        <Card className="divide-y divide-slate-100">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#2D231E]">Manage Saved Collections</p>
              <p className="text-xs text-[#7D6E63]">Clear cached bookmarks from your browser session.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleClearSaved('schemes')} className="text-xs">
                Clear Saved Schemes
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleClearSaved('jobs')} className="text-xs">
                Clear Saved Jobs
              </Button>
            </div>
          </div>

          <div className="p-5 bg-red-50/40 rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-red-700">Delete Account & Profile Data</p>
              <p className="text-xs text-red-600 mt-0.5">Clears all citizen profile settings, document vault files, and grievances.</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setDeleteModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white text-xs">
              <Trash2 className="w-3.5 h-3.5 mr-1"/> Delete Account
            </Button>
          </div>
        </Card>
      </section>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Reset / Delete Account">
        <div className="space-y-4 text-xs">
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-800">
            This action will reset your GovConnect local browser storage, removing your document references and profile bookmarks.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
            localStorage.clear();
            window.location.href = '/';
        }}>
              Reset & Logout
            </Button>
          </div>
        </div>
      </Modal>

    </div>);
}
