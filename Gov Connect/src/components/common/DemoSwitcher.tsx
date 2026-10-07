import React, { useState } from 'react';
import { Sparkles, User, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

export const DemoSwitcher: React.FC = () => {
  const { user, switchPreset } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    {
      id: 'mca_student',
      name: 'Hari Sharma',
      role: 'Student (MCA) • Delhi',
      desc: 'Tech skills (Python/React), Eligible for Youth & Higher Ed schemes, SSC & Tech Jobs',
      skills: 'Python, SQL, React',
    },
    {
      id: 'rural_farmer',
      name: 'Ramesh Patel',
      role: 'Farmer • Varanasi, UP',
      desc: 'Rural, Agriculture, PM-Kisan & PMAY-Gramin eligible',
      skills: 'Agriculture, Drip Irrigation',
    },
    {
      id: 'woman_entrepreneur',
      name: 'Priya Verma',
      role: 'Micro-Entrepreneur • Pune, MH',
      desc: 'Woman Entrepreneur, Eligible for PMMY MUDRA & MSME Subsidies',
      skills: 'Digital Marketing, Handicrafts',
    },
  ];

  const handleSelect = (presetId: string, name: string) => {
    switchPreset(presetId);
    setIsOpen(false);
    showToast({
      title: `Switched Demo Citizen: ${name}`,
      description: 'Profile, scheme matches, and job recommendations updated!',
      variant: 'success',
    });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/10 to-teal-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100/30 transition-all shadow-sm"
        title="Switch demo persona profile"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span className="hidden sm:inline">Demo Persona:</span>
        <span className="font-bold text-[#1a2f8a] dark:text-teal-400">{user?.name || 'Citizen'}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in zoom-in-95">
            <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Demo Persona Switcher
              </p>
              <p className="text-[11px] text-slate-500">
                Switch profiles to test dynamic eligibility and job match calculations.
              </p>
            </div>

            <div className="p-2 space-y-1">
              {presets.map((p) => {
                const isCurrent = user?.name === p.name;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id, p.name)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-xs text-[#1a2f8a] dark:text-teal-400 font-medium">{p.role}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-center text-slate-400">
              Profile changes propagate instantly to all AI match calculations.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
