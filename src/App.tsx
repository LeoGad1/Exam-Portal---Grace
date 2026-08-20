import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ClassesManager } from './components/ClassesManager';
import { SubjectsManager } from './components/SubjectsManager';
import { StudentsManager } from './components/StudentsManager';
import { GradeEntry } from './components/GradeEntry';
import { ReportCardView } from './components/ReportCardView';
import { AnalyticsView } from './components/AnalyticsView';
import { SchoolSettings } from './components/SchoolSettings';
import { CreateSchoolModal } from './components/CreateSchoolModal';

import { ActiveTab, SchoolInfo, ClassRoom, Subject, Student, GradeRecord, SchoolStarterPreset } from './types';
import { storage } from './services/storage';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Multi-school state
  const [schools, setSchools] = useState<SchoolInfo[]>([]);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(storage.getSchoolInfo());
  const [isCreateSchoolModalOpen, setIsCreateSchoolModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Data state
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string | undefined>(undefined);

  // Initialize LocalStorage Data on mount
  useEffect(() => {
    storage.init();
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setSchools(storage.getSchools());
    setSchoolInfo(storage.getSchoolInfo());
    setClasses(storage.getClasses());
    setSubjects(storage.getSubjects());
    setStudents(storage.getStudents());
    setGrades(storage.getGrades());
  };

  // School Switching & Creation
  const handleSwitchSchool = (schoolId: string) => {
    storage.setActiveSchoolId(schoolId);
    refreshAllData();
    const target = storage.getSchools().find(s => s.id === schoolId);
    if (target) {
      showToast(`Switched to "${target.name}"`);
    }
  };

  const handleCreateSchool = (newSchoolData: Omit<SchoolInfo, 'id'>, preset: SchoolStarterPreset) => {
    const created = storage.createNewSchool(newSchoolData, preset);
    setIsCreateSchoolModalOpen(false);
    refreshAllData();
    setActiveTab('dashboard');
    showToast(`🎉 "${created.name}" created and activated successfully!`);
  };

  const handleDeleteSchool = (schoolId: string) => {
    const nextSchool = storage.deleteSchool(schoolId);
    if (nextSchool) {
      refreshAllData();
      showToast(`School deleted. Switched to "${nextSchool.name}".`);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Class Handlers
  const handleAddClass = (cls: Omit<ClassRoom, 'id'>) => {
    storage.addClass(cls);
    refreshAllData();
  };

  const handleUpdateClass = (updated: ClassRoom) => {
    storage.updateClass(updated);
    refreshAllData();
  };

  const handleDeleteClass = (id: string) => {
    storage.deleteClass(id);
    refreshAllData();
  };

  // Subject Handlers
  const handleAddSubject = (sub: Omit<Subject, 'id'>) => {
    storage.addSubject(sub);
    refreshAllData();
  };

  const handleUpdateSubject = (updated: Subject) => {
    storage.updateSubject(updated);
    refreshAllData();
  };

  const handleDeleteSubject = (id: string) => {
    storage.deleteSubject(id);
    refreshAllData();
  };

  // Student Handlers
  const handleAddStudent = (std: Omit<Student, 'id'>) => {
    storage.addStudent(std);
    refreshAllData();
  };

  const handleUpdateStudent = (updated: Student) => {
    storage.updateStudent(updated);
    refreshAllData();
  };

  const handleDeleteStudent = (id: string) => {
    storage.deleteStudent(id);
    refreshAllData();
  };

  // Grade Batch Save Handler
  const handleSaveBatchGrades = (newGrades: GradeRecord[]) => {
    storage.saveBatchGrades(newGrades);
    refreshAllData();
  };

  // School Settings Handler
  const handleSaveSchoolInfo = (info: SchoolInfo) => {
    storage.saveSchoolInfo(info);
    refreshAllData();
  };

  const handleResetData = () => {
    storage.resetAllData();
    refreshAllData();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        schoolInfo={schoolInfo}
        schools={schools}
        onSwitchSchool={handleSwitchSchool}
        onOpenCreateSchool={() => setIsCreateSchoolModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            classes={classes}
            subjects={subjects}
            students={students}
            grades={grades}
            schoolInfo={schoolInfo}
            onOpenCreateSchool={() => setIsCreateSchoolModalOpen(true)}
          />
        )}

        {activeTab === 'classes' && (
          <ClassesManager
            classes={classes}
            students={students}
            subjects={subjects}
            onAddClass={handleAddClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectsManager
            subjects={subjects}
            classes={classes}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        )}

        {activeTab === 'students' && (
          <StudentsManager
            students={students}
            classes={classes}
            grades={grades}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            setActiveTab={setActiveTab}
            setSelectedStudentForReport={setSelectedStudentForReport}
          />
        )}

        {activeTab === 'grade-entry' && (
          <GradeEntry
            classes={classes}
            subjects={subjects}
            students={students}
            grades={grades}
            schoolInfo={schoolInfo}
            onSaveBatchGrades={handleSaveBatchGrades}
          />
        )}

        {activeTab === 'report-cards' && (
          <ReportCardView
            classes={classes}
            subjects={subjects}
            students={students}
            grades={grades}
            schoolInfo={schoolInfo}
            selectedStudentIdFromParent={selectedStudentForReport}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            classes={classes}
            subjects={subjects}
            students={students}
            grades={grades}
          />
        )}

        {activeTab === 'settings' && (
          <SchoolSettings
            schoolInfo={schoolInfo}
            schools={schools}
            onSaveSchoolInfo={handleSaveSchoolInfo}
            onSwitchSchool={handleSwitchSchool}
            onOpenCreateSchool={() => setIsCreateSchoolModalOpen(true)}
            onDeleteSchool={handleDeleteSchool}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Create School Modal Wizard */}
      <CreateSchoolModal
        isOpen={isCreateSchoolModalOpen}
        onClose={() => setIsCreateSchoolModalOpen(false)}
        onCreateSchool={handleCreateSchool}
      />
    </div>
  );
}
