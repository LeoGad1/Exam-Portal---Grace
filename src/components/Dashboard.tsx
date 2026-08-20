import React from 'react';
import { 
  Building2, 
  BookOpen, 
  Users, 
  FileSpreadsheet, 
  PlusCircle, 
  Award, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { ActiveTab, ClassRoom, Subject, Student, GradeRecord, SchoolInfo } from '../types';
import { getGradeDetails } from '../utils/gradeUtils';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  grades: GradeRecord[];
  schoolInfo: SchoolInfo;
  onOpenCreateSchool?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  classes,
  subjects,
  students,
  grades,
  schoolInfo,
  onOpenCreateSchool
}) => {
  // Calculate stats
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalSubjects = subjects.length;
  const totalGradesRecorded = grades.length;

  const avgTotalScore = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.totalScore, 0) / grades.length).toFixed(1)
    : '0.0';

  const passCount = grades.filter(g => g.totalScore >= 50).length;
  const passRate = grades.length > 0
    ? Math.round((passCount / grades.length) * 100)
    : 0;

  // Student ranking calculation
  const studentPerformances = students.map(std => {
    const studentGrades = grades.filter(g => g.studentId === std.id);
    const classRoom = classes.find(c => c.id === std.classId);
    if (studentGrades.length === 0) {
      return { student: std, classRoom, avgScore: 0, gradeCount: 0 };
    }
    const sum = studentGrades.reduce((acc, g) => acc + g.totalScore, 0);
    const avg = sum / studentGrades.length;
    return { student: std, classRoom, avgScore: avg, gradeCount: studentGrades.length };
  }).filter(sp => sp.gradeCount > 0)
    .sort((a, b) => b.avgScore - a.avgScore);

  const topStudents = studentPerformances.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Assessment Structure Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Exam & CA Reporting Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {schoolInfo.name} Portal
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Manage school classes, subjects, student records, and calculate term grades. Generate official printable report cards formatted with CA1 (10 marks max), CA2, assignment, and terminal exam scores.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {onOpenCreateSchool && (
              <button
                id="dash-create-school-btn"
                onClick={onOpenCreateSchool}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create My Own School</span>
              </button>
            )}
            <button
              id="dash-quick-grade-btn"
              onClick={() => setActiveTab('grade-entry')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Enter CA1 & Exam Grades</span>
            </button>
            <button
              id="dash-quick-report-btn"
              onClick={() => setActiveTab('report-cards')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Generate Report Cards</span>
            </button>
          </div>
        </div>

        {/* Assessment Weighting Banner */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/30">
            <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">Assessment 1</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-amber-400">CA1</span>
              <span className="text-xs text-slate-300 font-semibold">(Max 10 Marks)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">First Continuous Assessment</p>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Assessment 2</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-slate-200">CA2</span>
              <span className="text-xs text-slate-300 font-semibold">(Max 10 Marks)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Second Continuous Assessment</p>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Classwork/Project</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-slate-200">CA3</span>
              <span className="text-xs text-slate-300 font-semibold">(Max 10 Marks)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Assignments & Practical</p>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Final Assessment</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-emerald-400">EXAM</span>
              <span className="text-xs text-slate-300 font-semibold">(Max 70 Marks)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Terminal Examination</p>
          </div>
        </div>
      </div>

      {/* Summary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalStudents}</span>
            <button 
              onClick={() => setActiveTab('students')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Classes</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalClasses}</span>
            <button 
              onClick={() => setActiveTab('classes')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Subjects</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalSubjects}</span>
            <button 
              onClick={() => setActiveTab('subjects')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{avgTotalScore}%</span>
              <span className="text-xs text-slate-500 ml-2">({passRate}% Pass Rate)</span>
            </div>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Grades & Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grade Entries */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Recorded Subject Grades</h3>
              <p className="text-xs text-slate-500">List of student continuous assessments & examination scores</p>
            </div>
            <button
              onClick={() => setActiveTab('grade-entry')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add / Edit Grades</span>
            </button>
          </div>

          {grades.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No grades recorded yet</p>
              <button
                onClick={() => setActiveTab('grade-entry')}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
              >
                Go to Grade Entry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold border-y border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-center bg-indigo-50/60 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                      CA1 (10)
                    </th>
                    <th className="py-2.5 px-3 text-center">CA2 (10)</th>
                    <th className="py-2.5 px-3 text-center">Exam (70)</th>
                    <th className="py-2.5 px-3 text-center">Total</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {grades.slice(0, 7).map((grd) => {
                    const student = students.find(s => s.id === grd.studentId);
                    const subject = subjects.find(s => s.id === grd.subjectId);
                    const gradeInfo = getGradeDetails(grd.totalScore);

                    return (
                      <tr key={grd.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {student ? student.fullName : 'Unknown Student'}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {student?.studentId}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">
                          {subject ? subject.name : 'Unknown Subject'}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10">
                          {grd.ca1} / 10
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">
                          {grd.ca2}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">
                          {grd.exam}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100">
                          {grd.totalScore}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-md border ${gradeInfo.badgeBg}`}>
                            {gradeInfo.letter}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Performing Students */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Top Academic Performers</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">{schoolInfo.academicTerm}</span>
          </div>

          {topStudents.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">Enter student grades to view ranking.</p>
          ) : (
            <div className="space-y-3">
              {topStudents.map((item, idx) => {
                const gradeInfo = getGradeDetails(item.avgScore);
                return (
                  <div 
                    key={item.student.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0 ? 'bg-amber-400 text-amber-950 shadow-sm' :
                        idx === 1 ? 'bg-slate-300 text-slate-900' :
                        idx === 2 ? 'bg-amber-700 text-amber-100' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.student.fullName}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {item.classRoom?.name || 'Class'} • {item.gradeCount} subjects
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {item.avgScore.toFixed(1)}%
                      </span>
                      <span className={`block text-[10px] font-bold ${gradeInfo.colorClass}`}>
                        Grade {gradeInfo.letter}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => setActiveTab('report-cards')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Class Rank & Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
