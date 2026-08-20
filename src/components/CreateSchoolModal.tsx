import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Shield, 
  Award, 
  School, 
  Crown, 
  Landmark, 
  Compass, 
  Feather,
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { SchoolInfo, SchoolStarterPreset } from '../types';

interface CreateSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSchool: (school: Omit<SchoolInfo, 'id'>, preset: SchoolStarterPreset) => void;
}

const EMBLEMS = [
  { id: 'graduation-cap', label: 'Graduation Cap', icon: GraduationCap },
  { id: 'school', label: 'School House', icon: School },
  { id: 'book-open', label: 'Open Book', icon: BookOpen },
  { id: 'shield', label: 'Heraldic Shield', icon: Shield },
  { id: 'award', label: 'Excellence Medal', icon: Award },
  { id: 'crown', label: 'Royal Crown', icon: Crown },
  { id: 'landmark', label: 'University Pillar', icon: Landmark },
  { id: 'compass', label: 'Explorer Compass', icon: Compass },
  { id: 'feather', label: 'Academic Quill', icon: Feather }
];

const THEME_COLORS = [
  { id: 'indigo', label: 'Royal Indigo', bg: 'bg-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-500', from: 'from-indigo-600 to-blue-600' },
  { id: 'blue', label: 'Ocean Sapphire', bg: 'bg-blue-600', text: 'text-blue-600', ring: 'ring-blue-500', from: 'from-blue-600 to-cyan-600' },
  { id: 'emerald', label: 'Forest Emerald', bg: 'bg-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-500', from: 'from-emerald-600 to-teal-600' },
  { id: 'rose', label: 'Crimson Ruby', bg: 'bg-rose-600', text: 'text-rose-600', ring: 'ring-rose-500', from: 'from-rose-600 to-pink-600' },
  { id: 'amber', label: 'Imperial Gold', bg: 'bg-amber-600', text: 'text-amber-600', ring: 'ring-amber-500', from: 'from-amber-600 to-yellow-500' },
  { id: 'purple', label: 'Noble Purple', bg: 'bg-purple-600', text: 'text-purple-600', ring: 'ring-purple-500', from: 'from-purple-600 to-indigo-600' },
  { id: 'teal', label: 'Nordic Teal', bg: 'bg-teal-600', text: 'text-teal-600', ring: 'ring-teal-500', from: 'from-teal-600 to-emerald-600' }
];

const SCHOOL_TYPES = [
  'Secondary / High School',
  'Primary & Elementary School',
  'K-12 Comprehensive Academy',
  'International College',
  'STEM & Science Academy',
  'Vocational & Technical Institute'
];

const PRESETS: { id: SchoolStarterPreset; title: string; desc: string; icon: any; tags: string[] }[] = [
  {
    id: 'standard-secondary',
    title: 'Standard Secondary / High School',
    desc: 'Pre-configures 3 Senior classes (Grade 10-12) and 5 Core Subjects (Maths, English, Physics, Chem, CSC) with CA1 (10m) configured.',
    icon: GraduationCap,
    tags: ['3 Classes', '5 Core Subjects', '2 Sample Students']
  },
  {
    id: 'primary',
    title: 'Primary / Elementary School',
    desc: 'Pre-configures Primary 3-5 classes with foundational subjects (Numeracy, Literacy, Basic Science, Social Studies).',
    icon: School,
    tags: ['3 Classes', '4 Primary Subjects']
  },
  {
    id: 'science-academy',
    title: 'STEM & Science College',
    desc: 'Specialized STEM curriculum with advanced Mathematics, Applied Physics, Chemistry, and Computer Programming.',
    icon: Sparkles,
    tags: ['2 STEM Classes', '4 Advanced Subjects']
  },
  {
    id: 'blank',
    title: 'Clean Blank Slate (Fresh Setup)',
    desc: 'Start with an empty directory. Zero classes, subjects, or students. You will create your own custom academic structure from scratch.',
    icon: Layers,
    tags: ['0 Classes', '0 Subjects', 'Full Customization']
  }
];

export const CreateSchoolModal: React.FC<CreateSchoolModalProps> = ({
  isOpen,
  onClose,
  onCreateSchool
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('Knowledge, Discipline and Excellence');
  const [schoolType, setSchoolType] = useState(SCHOOL_TYPES[0]);
  const [themeColor, setThemeColor] = useState('indigo');
  const [emblemIcon, setEmblemIcon] = useState('graduation-cap');
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [examOfficerName, setExamOfficerName] = useState('');

  const [academicTerm, setAcademicTerm] = useState('First Term');
  const [academicYear, setAcademicYear] = useState('2025/2026 Session');

  const [selectedPreset, setSelectedPreset] = useState<SchoolStarterPreset>('standard-secondary');

  if (!isOpen) return null;

  const currentTheme = THEME_COLORS.find(t => t.id === themeColor) || THEME_COLORS[0];
  const CurrentEmblem = (EMBLEMS.find(e => e.id === emblemIcon) || EMBLEMS[0]).icon;

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      alert('Please enter your school or institution name.');
      return;
    }
    if (step < 4) {
      setStep((step + 1) as any);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a valid school name.');
      return;
    }

    onCreateSchool(
      {
        name: name.trim(),
        motto: motto.trim() || 'Inspiring Greatness, Fostering Excellence',
        schoolType,
        address: address.trim() || '1 Academic Avenue, Central Campus',
        phone: phone.trim() || '+234 800 000 0000',
        email: email.trim() || `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'school'}.edu`,
        principalName: principalName.trim() || 'Principal / Head of School',
        examOfficerName: examOfficerName.trim() || 'Dean of Examinations',
        academicTerm,
        academicYear,
        themeColor,
        emblemIcon
      },
      selectedPreset
    );
  };

  // Quick school name suggestions
  const nameSuggestions = [
    'St. Augustine College',
    'Greenwood Academy',
    'Prestige High School',
    'Beacon Model College',
    'Horizon Science Institute',
    'Imperial International School'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentTheme.from} flex items-center justify-center text-white shadow-md shadow-indigo-500/20`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Create Your Own School Portal</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                  New Institution Setup
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Setup your custom institution identity, curriculum structure, and grading guidelines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
          {[
            { num: 1, label: '1. Identity & Emblem' },
            { num: 2, label: '2. Campus & Leaders' },
            { num: 3, label: '3. Academic Session' },
            { num: 4, label: '4. Starter Structure' }
          ].map((s) => {
            const isCurrent = step === s.num;
            const isPassed = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (name.trim() || s.num === 1) setStep(s.num as any);
                }}
                className={`py-3 px-2 text-center flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                  isCurrent
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : isPassed
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                    isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {s.num}
                  </span>
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body & Realtime Live Preview */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Main Input Form */}
          <div className="lg:col-span-7 space-y-5">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    School / Institution Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Greenwood International College"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  
                  {/* Suggestions Chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-slate-400">Quick suggestions:</span>
                    {nameSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setName(sug)}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 text-slate-600 dark:text-slate-300 rounded-md transition-colors"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    School Motto / Slogan
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Inspiring Greatness, Fostering Excellence"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution Classification
                  </label>
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  >
                    {SCHOOL_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Choose Emblem Icon */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Official Emblem / Crest Icon
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {EMBLEMS.map((emb) => {
                      const IconComp = emb.icon;
                      const isSelected = emblemIcon === emb.id;
                      return (
                        <button
                          key={emb.id}
                          type="button"
                          onClick={() => setEmblemIcon(emb.id)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                          <span className="text-[10px] text-center leading-tight truncate w-full">{emb.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Choose Theme Color */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Institution Branding Color Theme
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Campus Address & Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. 12 Academy Way, Victoria Island, Lagos"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Official Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="+234 802 345 6789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Official Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        placeholder="admissions@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Academic Leadership (for Official Report Card Signatures)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Principal / Head of School
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Arthur Vance, Ph.D."
                        value={principalName}
                        onChange={(e) => setPrincipalName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Dean of Exams / Examination Officer
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mr. Emmanuel Thorne"
                        value={examOfficerName}
                        onChange={(e) => setExamOfficerName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Academic Term / Semester
                    </label>
                    <select
                      value={academicTerm}
                      onChange={(e) => setAcademicTerm(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="First Term">First Term</option>
                      <option value="Second Term">Second Term</option>
                      <option value="Third Term">Third Term</option>
                      <option value="Fall Semester">Fall Semester</option>
                      <option value="Spring Semester">Spring Semester</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Academic Year / Session
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2025/2026 Session"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Continuous Assessment Breakdown Notice */}
                <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200/80 dark:border-indigo-900 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Configured Assessment Standard</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Your school portal will be automatically calibrated to the standard 100-mark weighted terminal grading structure:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-center">
                      <span className="text-[10px] text-slate-500 block">CA 1 Test</span>
                      <strong className="text-xs text-indigo-600 dark:text-indigo-400">Max 10 Marks</strong>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-center">
                      <span className="text-[10px] text-slate-500 block">CA 2 Midterm</span>
                      <strong className="text-xs text-slate-800 dark:text-slate-200">Max 10 Marks</strong>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-center">
                      <span className="text-[10px] text-slate-500 block">Assignment</span>
                      <strong className="text-xs text-slate-800 dark:text-slate-200">Max 10 Marks</strong>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-center">
                      <span className="text-[10px] text-slate-500 block">Exam Score</span>
                      <strong className="text-xs text-emerald-600 dark:text-emerald-400">Max 70 Marks</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 animate-in fade-in">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Choose Initial Starter Package for {name || 'Your School'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Select whether to pre-populate starter classrooms & core subjects or start fresh from zero.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {PRESETS.map((pst) => {
                    const isSelected = selectedPreset === pst.id;
                    const IconComp = pst.icon;
                    return (
                      <div
                        key={pst.id}
                        onClick={() => setSelectedPreset(pst.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {pst.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                {pst.desc}
                              </p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {pst.tags.map(tag => (
                                  <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedPreset(pst.id)}
                            className="mt-1 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Real-time Live Letterhead / Badge Preview */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="sticky top-0 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Real-Time Letterhead Preview</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  Live
                </span>
              </div>

              {/* Mock Report Header Preview */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentTheme.from} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0`}>
                    <CurrentEmblem className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {name || 'Your School Name'}
                    </h3>
                    <p className="text-[10px] text-slate-500 italic truncate">
                      "{motto || 'Inspiring Greatness, Fostering Excellence'}"
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {address || '1 Academic Avenue, Campus'}
                    </p>
                  </div>
                </div>

                {/* Session & Signatures Sub-preview */}
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Academic Session:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{academicTerm} • {academicYear}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Principal:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{principalName || 'Principal / Head'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Grading Standard:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">CA1 (10m) + CA2 + Exam (70m)</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                This branding will automatically reflect across your portal dashboard, classroom management, grade entry sheets, and printable report cards.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch & Activate School</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
