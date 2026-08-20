import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  Users, 
  FileSpreadsheet, 
  FileText, 
  BarChart3, 
  Settings,
  Sparkles,
  ChevronDown,
  PlusCircle,
  Check,
  School,
  Shield,
  Award,
  Crown,
  Landmark,
  Compass,
  Feather
} from 'lucide-react';
import { ActiveTab, SchoolInfo } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  schoolInfo: SchoolInfo;
  schools: SchoolInfo[];
  onSwitchSchool: (schoolId: string) => void;
  onOpenCreateSchool: () => void;
}

const getEmblemIcon = (emblem?: string) => {
  switch (emblem) {
    case 'school': return School;
    case 'book-open': return BookOpen;
    case 'shield': return Shield;
    case 'award': return Award;
    case 'crown': return Crown;
    case 'landmark': return Landmark;
    case 'compass': return Compass;
    case 'feather': return Feather;
    default: return GraduationCap;
  }
};

const getThemeGradient = (color?: string) => {
  switch (color) {
    case 'blue': return 'from-blue-600 via-cyan-600 to-blue-700';
    case 'emerald': return 'from-emerald-600 via-teal-600 to-emerald-700';
    case 'rose': return 'from-rose-600 via-pink-600 to-rose-700';
    case 'amber': return 'from-amber-600 via-yellow-600 to-amber-700';
    case 'purple': return 'from-purple-600 via-indigo-600 to-purple-700';
    case 'teal': return 'from-teal-600 via-emerald-600 to-teal-700';
    default: return 'from-indigo-600 via-blue-600 to-cyan-500';
  }
};

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  schoolInfo,
  schools,
  onSwitchSchool,
  onOpenCreateSchool
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'classes', label: 'Classes', icon: <Building2 className="w-4 h-4" /> },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'grade-entry', label: 'Grade Entry', icon: <FileSpreadsheet className="w-4 h-4" />, badge: 'CA1 (10m)' },
    { id: 'report-cards', label: 'Report Cards', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Schools', icon: <Settings className="w-4 h-4" /> }
  ];

  const EmblemComponent = getEmblemIcon(schoolInfo.emblemIcon);
  const themeGradient = getThemeGradient(schoolInfo.themeColor);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* School Selector & Branding Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 text-left p-1.5 -ml-1.5 rounded-xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700/80 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${themeGradient} flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0`}>
                <EmblemComponent className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 max-w-[200px] sm:max-w-xs md:max-w-md">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight text-slate-100 truncate group-hover:text-indigo-200">
                    {schoolInfo.name}
                  </h1>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </div>
                <p className="text-[11px] text-indigo-300 font-medium flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{schoolInfo.academicTerm} • {schoolInfo.academicYear}</span>
                </p>
              </div>
            </button>

            {/* School Switcher Dropdown */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Your Schools</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full font-bold text-indigo-300">
                    {schools.length} {schools.length === 1 ? 'School' : 'Schools'}
                  </span>
                </div>

                {/* List of Schools */}
                <div className="max-h-56 overflow-y-auto py-1.5 space-y-1">
                  {schools.map((sch) => {
                    const isSelected = sch.id === schoolInfo.id;
                    const SchEmblem = getEmblemIcon(sch.emblemIcon);
                    const schGrad = getThemeGradient(sch.themeColor);
                    return (
                      <button
                        key={sch.id}
                        onClick={() => {
                          if (sch.id) onSwitchSchool(sch.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl flex items-center justify-between gap-2.5 text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-950/80 border border-indigo-500/40 text-white'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${schGrad} flex items-center justify-center shrink-0`}>
                            <SchEmblem className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold block truncate text-xs text-slate-100">
                              {sch.name}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {sch.schoolType || 'Academic Institution'}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action button: Create New School */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenCreateSchool();
                    }}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all text-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create My Own School</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & CA1 Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenCreateSchool}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>New School</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Assessment: <strong className="text-indigo-300">CA1 (Max 10 Marks)</strong></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
