import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  Search, 
  Phone, 
  FileText
} from 'lucide-react';
import { Student, ClassRoom, GradeRecord, ActiveTab } from '../types';

interface StudentsManagerProps {
  students: Student[];
  classes: ClassRoom[];
  grades: GradeRecord[];
  onAddStudent: (std: Omit<Student, 'id'>) => void;
  onUpdateStudent: (std: Student) => void;
  onDeleteStudent: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedStudentForReport?: (studentId: string) => void;
}

export const StudentsManager: React.FC<StudentsManagerProps> = ({
  students,
  classes,
  grades,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  setActiveTab,
  setSelectedStudentForReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Student['gender']>('Male');
  const [classId, setClassId] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [daysPresent, setDaysPresent] = useState(58);
  const [totalSchoolDays, setTotalSchoolDays] = useState(60);

  const openAddModal = () => {
    // Auto-generate next Student ID
    const nextNum = students.length + 1;
    const autoId = `STD-2025-${nextNum.toString().padStart(3, '0')}`;
    
    setStudentId(autoId);
    setFullName('');
    setGender('Male');
    setClassId(classes[0]?.id || '');
    setGuardianName('');
    setGuardianPhone('');
    setDaysPresent(58);
    setTotalSchoolDays(60);
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (std: Student) => {
    setEditingStudent(std);
    setStudentId(std.studentId);
    setFullName(std.fullName);
    setGender(std.gender);
    setClassId(std.classId);
    setGuardianName(std.guardianName || '');
    setGuardianPhone(std.guardianPhone || '');
    setDaysPresent(std.daysPresent || 58);
    setTotalSchoolDays(std.totalSchoolDays || 60);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !classId) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        studentId: studentId || editingStudent.studentId,
        fullName,
        gender,
        classId,
        guardianName,
        guardianPhone,
        daysPresent: Number(daysPresent) || 58,
        totalSchoolDays: Number(totalSchoolDays) || 60
      });
    } else {
      onAddStudent({
        studentId: studentId || `STD-2025-${(students.length + 1).toString().padStart(3, '0')}`,
        fullName,
        gender,
        classId,
        guardianName,
        guardianPhone,
        daysPresent: Number(daysPresent) || 58,
        totalSchoolDays: Number(totalSchoolDays) || 60
      });
    }

    setIsAddModalOpen(false);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Student Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register students, assign classes, and view individual academic records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Class Filter Dropdown */}
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
          >
            <option value="all">All Classes ({students.length})</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({students.filter(s => s.classId === c.id).length})
              </option>
            ))}
          </select>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            id="add-student-btn"
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No students found</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search filter or add a new student.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Class Level</th>
                  <th className="py-3 px-4">Guardian Contact</th>
                  <th className="py-3 px-4 text-center">Grades Logged</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((std) => {
                  const classRoom = classes.find(c => c.id === std.classId);
                  const studentGrades = grades.filter(g => g.studentId === std.id);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {std.studentId}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {std.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          std.gender === 'Female' ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        }`}>
                          {std.gender}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {classRoom?.name || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {std.guardianName ? (
                          <div className="flex items-center gap-1">
                            <span>{std.guardianName}</span>
                            {std.guardianPhone && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <Phone className="w-2.5 h-2.5" />
                                {std.guardianPhone}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          studentGrades.length > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {studentGrades.length} Subjects
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (setSelectedStudentForReport) {
                              setSelectedStudentForReport(std.id);
                            }
                            setActiveTab('report-cards');
                          }}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Generate Report Card"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Report Card</span>
                        </button>
                        <button
                          onClick={() => openEditModal(std)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block"
                          title="Edit Student"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete student record for "${std.fullName}"?`)) {
                              onDeleteStudent(std.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-block"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="STD-2025-001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Wright"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Class <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  <option value="">Select Class...</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Robert Wright"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+234 801 222 3344"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Days Attended
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={daysPresent}
                    onChange={(e) => setDaysPresent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Term Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={totalSchoolDays}
                    onChange={(e) => setTotalSchoolDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingStudent ? 'Update Student' : 'Register Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
