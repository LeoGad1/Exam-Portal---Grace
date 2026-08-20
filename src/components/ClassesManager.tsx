import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  BookOpen, 
  X, 
  Check, 
  Search,
  UserCheck
} from 'lucide-react';
import { ClassRoom, Student, Subject } from '../types';

interface ClassesManagerProps {
  classes: ClassRoom[];
  students: Student[];
  subjects: Subject[];
  onAddClass: (cls: Omit<ClassRoom, 'id'>) => void;
  onUpdateClass: (cls: ClassRoom) => void;
  onDeleteClass: (id: string) => void;
}

export const ClassesManager: React.FC<ClassesManagerProps> = ({
  classes,
  students,
  subjects,
  onAddClass,
  onUpdateClass,
  onDeleteClass
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<ClassRoom['category']>('Senior High');
  const [teacherName, setTeacherName] = useState('');
  const [capacity, setCapacity] = useState(30);

  const openAddModal = () => {
    setName('');
    setCode('');
    setCategory('Senior High');
    setTeacherName('');
    setCapacity(30);
    setEditingClass(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (cls: ClassRoom) => {
    setEditingClass(cls);
    setName(cls.name);
    setCode(cls.code);
    setCategory(cls.category);
    setTeacherName(cls.teacherName);
    setCapacity(cls.capacity || 30);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingClass) {
      onUpdateClass({
        ...editingClass,
        name,
        code: code || name.substring(0, 4).toUpperCase(),
        category,
        teacherName,
        capacity: Number(capacity) || 30
      });
    } else {
      onAddClass({
        name,
        code: code || name.substring(0, 4).toUpperCase(),
        category,
        teacherName,
        capacity: Number(capacity) || 30
      });
    }

    setIsAddModalOpen(false);
  };

  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Classroom Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize grade levels, assign class teachers, and set class capacities
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search classes or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            id="add-class-btn"
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const classStudents = students.filter(s => s.classId === cls.id);
          const classSubjects = subjects.filter(s => s.classIds.includes(cls.id));

          return (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-800">
                    {cls.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">
                    {cls.name}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    Code: {cls.code}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(cls)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Class"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete class "${cls.name}"?`)) {
                        onDeleteClass(cls.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Class Teacher Info */}
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Class Teacher</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {cls.teacherName || 'Not Assigned'}
                  </span>
                </div>
              </div>

              {/* Student & Subject Counters */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{classStudents.length}</span>
                    <span className="text-slate-400 text-[11px] block">Students ({cls.capacity} max)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{classSubjects.length}</span>
                    <span className="text-slate-400 text-[11px] block">Offered Subjects</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingClass ? 'Edit Classroom Details' : 'Add New Classroom'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 10 Alpha or JSS 1 Gold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. G10-A"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Junior High">Junior High</option>
                    <option value="Senior High">Senior High</option>
                    <option value="Tertiary">Tertiary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Class Teacher
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mrs. Sarah Jenkins"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Capacity Limit
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  <span>{editingClass ? 'Update Class' : 'Save Class'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
