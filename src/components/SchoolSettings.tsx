import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Building2, 
  Check, 
  AlertTriangle,
  Sparkles,
  PlusCircle,
  GraduationCap,
  BookOpen,
  Shield,
  Award,
  School,
  Crown,
  Landmark,
  Compass,
  Feather,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Trash2
} from 'lucide-react';
import { SchoolInfo } from '../types';

interface SchoolSettingsProps {
  schoolInfo: SchoolInfo;
  schools: SchoolInfo[];
  onSaveSchoolInfo: (info: SchoolInfo) => void;
  onSwitchSchool: (schoolId: string) => void;
  onOpenCreateSchool: () => void;
  onDeleteSchool: (schoolId: string) => void;
  onResetData: () => void;
}

const EMBLEMS = [
  { id: 'graduation-cap', label: 'Graduation Cap', icon: GraduationCap },
  { id: 'school', label: 'School House', icon: School },
  { id: 'book-open', label: 'Open Book', icon: BookOpen },
  { id: 'shield', label: 'Shield', icon: Shield },
  { id: 'award', label: 'Medal', icon: Award },
  { id: 'crown', label: 'Crown', icon: Crown },
  { id: 'landmark', label: 'University Pillar', icon: Landmark },
  { id: 'compass', label: 'Compass', icon: Compass },
  { id: 'feather', label: 'Quill', icon: Feather }
];

const THEME_COLORS = [
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-500' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-600', text: 'text-blue-600', ring: 'ring-blue-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-500' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-600', text: 'text-rose-600', ring: 'ring-rose-500' },
  { id: 'amber', label: 'Gold', bg: 'bg-amber-600', text: 'text-amber-600', ring: 'ring-amber-500' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-600', text: 'text-purple-600', ring: 'ring-purple-500' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-600', text: 'text-teal-600', ring: 'ring-teal-500' }
];

const SCHOOL_TYPES = [
  'Secondary / High School',
  'Primary & Elementary School',
  'K-12 Comprehensive Academy',
  'International College',
  'STEM & Science Academy',
  'Vocational & Technical Institute'
];

export const SchoolSettings: React.FC<SchoolSettingsProps> = ({
  schoolInfo,
  schools,
  onSaveSchoolInfo,
  onSwitchSchool,
  onOpenCreateSchool,
  onDeleteSchool,
  onResetData
}) => {
  const [name, setName] = useState(schoolInfo.name);
  const [motto, setMotto] = useState(schoolInfo.motto);
  const [schoolType, setSchoolType] = useState(schoolInfo.schoolType || SCHOOL_TYPES[0]);
  const [address, setAddress] = useState(schoolInfo.address);
  const [phone, setPhone] = useState(schoolInfo.phone);
  const [email, setEmail] = useState(schoolInfo.email);
  const [principalName, setPrincipalName] = useState(schoolInfo.principalName || '');
  const [examOfficerName, setExamOfficerName] = useState(schoolInfo.examOfficerName || '');
  const [academicTerm, setAcademicTerm] = useState(schoolInfo.academicTerm);
  const [academicYear, setAcademicYear] = useState(schoolInfo.academicYear);
  const [themeColor, setThemeColor] = useState(schoolInfo.themeColor || 'indigo');
  const [emblemIcon, setEmblemIcon] = useState(schoolInfo.emblemIcon || 'graduation-cap');
  const [savedMsg, setSavedMsg] = useState(false);

  // Sync state if schoolInfo changes
  useEffect(() => {
    setName(schoolInfo.name);
    setMotto(schoolInfo.motto);
    setSchoolType(schoolInfo.schoolType || SCHOOL_TYPES[0]);
    setAddress(schoolInfo.address);
    setPhone(schoolInfo.phone);
    setEmail(schoolInfo.email);
    setPrincipalName(schoolInfo.principalName || '');
    setExamOfficerName(schoolInfo.examOfficerName || '');
    setAcademicTerm(schoolInfo.academicTerm);
    setAcademicYear(schoolInfo.academicYear);
    setThemeColor(schoolInfo.themeColor || 'indigo');
    setEmblemIcon(schoolInfo.emblemIcon || 'graduation-cap');
  }, [schoolInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchoolInfo({
      ...schoolInfo,
      name: name.trim(),
      motto: motto.trim(),
      schoolType,
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      principalName: principalName.trim(),
      examOfficerName: examOfficerName.trim(),
      academicTerm,
      academicYear,
      themeColor,
      emblemIcon
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Multi-School Hub Switcher Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Institutions & Multi-School Hub</span>
            </h2>
            <p className="text-xs text-slate-500">
              Create, switch, or manage distinct school portals and campuses
            </p>
          </div>

          <button
            onClick={onOpenCreateSchool}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New School</span>
          </button>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {schools.map((sch) => {
            const isActive = sch.id === schoolInfo.id;
            return (
              <div
                key={sch.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {sch.name}
                    </span>
                    {isActive ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white shrink-0">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => sch.id && onSwitchSchool(sch.id)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 italic truncate">
                    "{sch.motto || 'Excellence in Education'}"
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {sch.schoolType || 'Academic Institution'} • {sch.academicTerm}
                  </p>
                </div>

                {schools.length > 1 && !isActive && (
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/60 flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${sch.name}" and all its records? This cannot be undone.`)) {
                          if (sch.id) onDeleteSchool(sch.id);
                        }
                      }}
                      className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active School Profile Settings Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <span>Edit Profile for: <span className="text-indigo-600 dark:text-indigo-400">{schoolInfo.name}</span></span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize institution profile, leadership signatures, academic term, and assessment headers
            </p>
          </div>

          {savedMsg && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* School Name */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institution / School Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Motto */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                School Motto / Slogan
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* School Type */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institution Classification
              </label>
              <select
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                {SCHOOL_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Emblem Icon */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Official Crest / Emblem Icon
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {EMBLEMS.map((emb) => {
                  const IconComp = emb.icon;
                  const isSelected = emblemIcon === emb.id;
                  return (
                    <button
                      key={emb.id}
                      type="button"
                      onClick={() => setEmblemIcon(emb.id)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span className="text-[9px] truncate w-full text-center">{emb.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Color */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Portal Color Accent Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {THEME_COLORS.map((col) => {
                  const isSelected = themeColor === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setThemeColor(col.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        isSelected
                          ? `border-slate-900 dark:border-white ring-2 ${col.ring} bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white`
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${col.bg}`}></span>
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Term and Year */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Academic Term
              </label>
              <select
                value={academicTerm}
                onChange={(e) => setAcademicTerm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
                <option value="Fall Semester">Fall Semester</option>
                <option value="Spring Semester">Spring Semester</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Session / Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                School Campus Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Contact Details */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Signatures */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Principal / Head of School Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Arthur Vance, Ph.D."
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dean of Exams / Examination Officer
              </label>
              <input
                type="text"
                placeholder="e.g. Mr. Emmanuel Thorne"
                value={examOfficerName}
                onChange={(e) => setExamOfficerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Portal Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reset Demo Data Danger Zone */}
      <div className="bg-rose-50/60 dark:bg-rose-950/20 p-5 rounded-2xl border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-rose-900 dark:text-rose-200 text-sm flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Reset Active School Portal Data</span>
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300">
            Reset classes, subjects, students, and grade records for "{schoolInfo.name}" to default sample state.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm(`Reset all portal records for "${schoolInfo.name}"? Custom entries will be cleared.`)) {
              onResetData();
            }
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Portal Data</span>
        </button>
      </div>
    </div>
  );
};
