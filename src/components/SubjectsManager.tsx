import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  Search, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Subject, ClassRoom } from '../types';

interface SubjectsManagerProps {
  subjects: Subject[];
  classes: ClassRoom[];
  onAddSubject: (sub: Omit<Subject, 'id'>) => void;
  onUpdateSubject: (sub: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

export const SubjectsManager: React.FC<SubjectsManagerProps> = ({
  subjects,
  classes,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [ca1MaxMarks, setCa1MaxMarks] = useState(10);
  const [ca2MaxMarks, setCa2MaxMarks] = useState(10);
  const [assignmentMaxMarks, setAssignmentMaxMarks] = useState(10);
  const [examMaxMarks, setExamMaxMarks] = useState(70);

  const openAddModal = () => {
    setName('');
    setCode('');
    setSelectedClassIds(classes.map(c => c.id)); // Default select all
    setCa1MaxMarks(10);
    setCa2MaxMarks(10);
    setAssignmentMaxMarks(10);
    setExamMaxMarks(70);
    setEditingSubject(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setSelectedClassIds(sub.classIds || []);
    setCa1MaxMarks(sub.ca1MaxMarks || 10);
    setCa2MaxMarks(sub.ca2MaxMarks || 10);
    setAssignmentMaxMarks(sub.assignmentMaxMarks || 10);
    setExamMaxMarks(sub.examMaxMarks || 70);
    setIsAddModalOpen(true);
  };

  const toggleClassSelection = (classId: string) => {
    if (selectedClassIds.includes(classId)) {
      setSelectedClassIds(selectedClassIds.filter(id => id !== classId));
    } else {
      setSelectedClassIds([...selectedClassIds, classId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      onUpdateSubject({
        ...editingSubject,
        name,
        code: code || name.substring(0, 3).toUpperCase() + '-101',
        classIds: selectedClassIds,
        ca1MaxMarks: Number(ca1MaxMarks) || 10,
        ca2MaxMarks: Number(ca2MaxMarks) || 10,
        assignmentMaxMarks: Number(assignmentMaxMarks) || 10,
        examMaxMarks: Number(examMaxMarks) || 70
      });
    } else {
      onAddSubject({
        name,
        code: code || name.substring(0, 3).toUpperCase() + '-101',
        classIds: selectedClassIds,
        ca1MaxMarks: Number(ca1MaxMarks) || 10,
        ca2MaxMarks: Number(ca2MaxMarks) || 10,
        assignmentMaxMarks: Number(assignmentMaxMarks) || 10,
        examMaxMarks: Number(examMaxMarks) || 70
      });
    }

    setIsAddModalOpen(false);
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Subject Management & Assessment Weighting</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure subjects, continuous assessment 1 (CA1 max 10 marks), and assign classes
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subject or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            id="add-subject-btn"
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((sub) => {
          const offeringClasses = classes.filter(c => sub.classIds?.includes(c.id));

          return (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md">
                    {sub.code}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {sub.name}
                  </h3>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Subject"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete subject "${sub.name}"?`)) {
                        onDeleteSubject(sub.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Assessment Breakdown */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Max Score Weighting Breakdown</span>
                </span>

                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <div className="bg-indigo-50 dark:bg-indigo-950/50 p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-300 block">CA1</span>
                    <span className="font-black text-indigo-700 dark:text-indigo-200">{sub.ca1MaxMarks || 10}m</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg">
                    <span className="text-[9px] font-medium text-slate-500 block">CA2</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{sub.ca2MaxMarks || 10}m</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg">
                    <span className="text-[9px] font-medium text-slate-500 block">Assgn</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{sub.assignmentMaxMarks || 10}m</span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block">Exam</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-300">{sub.examMaxMarks || 70}m</span>
                  </div>
                </div>
              </div>

              {/* Offering Classes */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block mb-1.5 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>Offered in ({offeringClasses.length} Classes):</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {offeringClasses.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">No classes assigned</span>
                  ) : (
                    offeringClasses.map(c => (
                      <span key={c.id} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                        {c.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Subject Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingSubject ? 'Edit Subject Details' : 'Add New Subject'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics or Chemistry"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MTH-101"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Assessment Weighting Breakdown */}
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                <label className="block font-bold text-indigo-900 dark:text-indigo-200">
                  Continuous Assessment & Exam Max Marks Breakdown:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="block font-extrabold text-indigo-700 dark:text-indigo-300 text-[10px] mb-0.5">CA1 (Max Marks)</span>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={ca1MaxMarks}
                      onChange={(e) => setCa1MaxMarks(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-center font-bold bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-600 dark:text-slate-400 text-[10px] mb-0.5">CA2 Max</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={ca2MaxMarks}
                      onChange={(e) => setCa2MaxMarks(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-600 dark:text-slate-400 text-[10px] mb-0.5">Assignment</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={assignmentMaxMarks}
                      onChange={(e) => setAssignmentMaxMarks(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="block font-bold text-emerald-700 dark:text-emerald-400 text-[10px] mb-0.5">Exam Max</span>
                    <input
                      type="number"
                      min="30"
                      max="100"
                      value={examMaxMarks}
                      onChange={(e) => setExamMaxMarks(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-center font-bold bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-300 font-medium pt-1">
                  Standard Total = {Number(ca1MaxMarks) + Number(ca2MaxMarks) + Number(assignmentMaxMarks) + Number(examMaxMarks)} Marks
                </p>
              </div>

              {/* Assign Classes Checkboxes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Assign Subject to Classes:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  {classes.map((cls) => {
                    const isSelected = selectedClassIds.includes(cls.id);
                    return (
                      <label
                        key={cls.id}
                        className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200 font-semibold' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleClassSelection(cls.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs">{cls.name}</span>
                      </label>
                    );
                  })}
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
                  <span>{editingSubject ? 'Update Subject' : 'Save Subject'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
