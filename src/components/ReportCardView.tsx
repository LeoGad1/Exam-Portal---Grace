import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  FileText,
  UserCheck,
  School,
  BookOpen,
  Shield,
  Crown,
  Landmark,
  Compass,
  Feather
} from 'lucide-react';
import { ClassRoom, Subject, Student, GradeRecord, SchoolInfo } from '../types';
import { getGradeDetails, getGradeRemark } from '../utils/gradeUtils';

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

interface ReportCardViewProps {
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  grades: GradeRecord[];
  schoolInfo: SchoolInfo;
  selectedStudentIdFromParent?: string;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  classes,
  subjects,
  students,
  grades,
  schoolInfo,
  selectedStudentIdFromParent
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [teacherComment, setTeacherComment] = useState<string>('');
  const [principalComment, setPrincipalComment] = useState<string>('');

  // Class filtered students
  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Sync selection if passed from Parent
  useEffect(() => {
    if (selectedStudentIdFromParent) {
      const parentStd = students.find(s => s.id === selectedStudentIdFromParent);
      if (parentStd) {
        setSelectedClassId(parentStd.classId);
        setSelectedStudentId(parentStd.id);
      }
    }
  }, [selectedStudentIdFromParent, students]);

  // Set default student when class changes
  useEffect(() => {
    if (classStudents.length > 0) {
      if (!selectedStudentId || !classStudents.some(s => s.id === selectedStudentId)) {
        setSelectedStudentId(classStudents[0].id);
      }
    } else {
      setSelectedStudentId('');
    }
  }, [selectedClassId, classStudents]);

  const currentStudent = students.find(s => s.id === selectedStudentId);
  const currentClass = classes.find(c => c.id === selectedClassId);

  // Calculate Student Grades & Class Rankings
  const studentGrades = grades.filter(g => g.studentId === selectedStudentId);

  // Compute Overall Class Averages for Ranking
  const classStudentAverages = classStudents.map(std => {
    const sGrades = grades.filter(g => g.studentId === std.id);
    if (sGrades.length === 0) return { studentId: std.id, avg: 0, total: 0 };
    const sum = sGrades.reduce((acc, g) => acc + g.totalScore, 0);
    return { studentId: std.id, avg: sum / sGrades.length, total: sum };
  }).sort((a, b) => b.avg - a.avg);

  const studentRankIndex = classStudentAverages.findIndex(item => item.studentId === selectedStudentId);
  const classPosition = studentRankIndex >= 0 ? studentRankIndex + 1 : '-';

  // Total Score & Overall Avg
  const totalScoreSum = studentGrades.reduce((sum, g) => sum + g.totalScore, 0);
  const totalMaxPossible = studentGrades.length * 100;
  const overallAverage = studentGrades.length > 0 ? (totalScoreSum / studentGrades.length) : 0;
  const overallGradeInfo = getGradeDetails(overallAverage);

  // Auto-fill Comments when student changes
  useEffect(() => {
    if (currentStudent && studentGrades.length > 0) {
      if (overallAverage >= 80) {
        setTeacherComment(`${currentStudent.fullName} is an exceptional scholar with outstanding academic dedication. Outstanding overall performance!`);
        setPrincipalComment(`An exemplary result. Recommended for Academic Honor Roll.`);
      } else if (overallAverage >= 70) {
        setTeacherComment(`${currentStudent.fullName} shows brilliant progress and consistent effort across all subjects.`);
        setPrincipalComment(`Promising achievement. Keep striving for the highest peak.`);
      } else if (overallAverage >= 50) {
        setTeacherComment(`${currentStudent.fullName} passed the term assessments satisfactorily with room for higher scores in core subjects.`);
        setPrincipalComment(`Satisfactory result. Encouraged to dedicate more study time next term.`);
      } else {
        setTeacherComment(`${currentStudent.fullName} requires closer supervision and remedial study guidance to improve core assessment scores.`);
        setPrincipalComment(`Academic intervention meeting recommended with parents.`);
      }
    }
  }, [selectedStudentId, overallAverage]);

  // Handle Next / Previous Student Navigation
  const currentStudentIndex = classStudents.findIndex(s => s.id === selectedStudentId);
  
  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      setSelectedStudentId(classStudents[currentStudentIndex - 1].id);
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIndex < classStudents.length - 1) {
      setSelectedStudentId(classStudents[currentStudentIndex + 1].id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Bar (Hidden when printing) */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Student Terminal Report Sheet Generator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select class and student to preview or print official terminal academic report cards
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStudent}
              disabled={currentStudentIndex <= 0}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-bold text-slate-500 px-2">
              {currentStudentIndex + 1} of {classStudents.length}
            </span>

            <button
              onClick={handleNextStudent}
              disabled={currentStudentIndex >= classStudents.length - 1}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              id="print-report-btn"
              onClick={handlePrint}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all ml-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report Card</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Class:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Student:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500"
            >
              {classStudents.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.studentId})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Official Report Card Printable Document Canvas */}
      {!currentStudent ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Please select a student to view report card.</p>
        </div>
      ) : (
        <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-200 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:max-w-none text-xs space-y-6">
          
          {/* Header Block */}
          <div className="text-center border-b-2 border-indigo-900 pb-5 space-y-2">
            <div className="flex items-center justify-center space-x-3 mb-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-900 text-amber-400 flex items-center justify-center font-black text-xl shadow-md">
                {React.createElement(getEmblemIcon(schoolInfo.emblemIcon), { className: "w-7 h-7" })}
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">
                  {schoolInfo.name}
                </h1>
                <p className="text-[11px] text-slate-600 font-medium italic">
                  "{schoolInfo.motto}" • {schoolInfo.address}
                </p>
              </div>
            </div>

            <div className="inline-block bg-indigo-900 text-white px-6 py-1 rounded-full font-black text-xs uppercase tracking-wider shadow-sm">
              STUDENT TERMINAL ACADEMIC REPORT CARD • {schoolInfo.academicTerm.toUpperCase()} ({schoolInfo.academicYear})
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Student Name</span>
              <span className="font-black text-sm text-indigo-950 block">{currentStudent.fullName}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Student ID Number</span>
              <span className="font-mono font-bold text-sm text-slate-800 block">{currentStudent.studentId}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Class & Teacher</span>
              <span className="font-bold text-slate-800 block">{currentClass?.name}</span>
              <span className="text-[10px] text-slate-500 block">{currentClass?.teacherName}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Attendance Record</span>
              <span className="font-bold text-slate-800 block">
                {currentStudent.daysPresent || 58} / {currentStudent.totalSchoolDays || 60} Days
              </span>
            </div>
          </div>

          {/* Academic Overview Highlights */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">Class Position</span>
              <span className="text-xl font-black text-indigo-950">{classPosition}</span>
              <span className="text-[10px] text-indigo-600 font-semibold block">out of {classStudents.length} students</span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Overall Average</span>
              <span className="text-xl font-black text-blue-950">{overallAverage.toFixed(1)}%</span>
              <span className="text-[10px] text-blue-600 font-semibold block">Total: {totalScoreSum}/{totalMaxPossible}</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Overall Grade</span>
              <span className="text-xl font-black text-emerald-950">{overallGradeInfo.letter}</span>
              <span className="text-[10px] text-emerald-700 font-bold block">{overallGradeInfo.remark}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Subjects Assessed</span>
              <span className="text-xl font-black text-slate-900">{studentGrades.length}</span>
              <span className="text-[10px] text-slate-500 font-medium block">Complete Assessment</span>
            </div>
          </div>

          {/* Subject Assessment Breakdown Table */}
          <div className="space-y-2">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-700" />
              <span>Subject Academic Performance Breakdown</span>
            </h3>

            <table className="w-full text-left border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-slate-800 text-white font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3 border border-slate-700">Subject Name</th>
                  <th className="py-2.5 px-2 text-center border border-slate-700 bg-indigo-900">
                    CA1 (10)
                  </th>
                  <th className="py-2.5 px-2 text-center border border-slate-700">CA2 (10)</th>
                  <th className="py-2.5 px-2 text-center border border-slate-700">Assgn (10)</th>
                  <th className="py-2.5 px-2 text-center border border-slate-700">Exam (70)</th>
                  <th className="py-2.5 px-2 text-center border border-slate-700">Total (100)</th>
                  <th className="py-2.5 px-2 text-center border border-slate-700">Grade</th>
                  <th className="py-2.5 px-3 border border-slate-700">Subject Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {studentGrades.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-500 italic">
                      No grades logged for this student yet. Go to Grade Entry tab.
                    </td>
                  </tr>
                ) : (
                  studentGrades.map((grd) => {
                    const subject = subjects.find(s => s.id === grd.subjectId);
                    const gradeInfo = getGradeDetails(grd.totalScore);

                    return (
                      <tr key={grd.id} className="odd:bg-white even:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900 border border-slate-200">
                          {subject?.name || 'Subject'}
                          <span className="text-[10px] text-slate-400 block font-mono font-normal">
                            {subject?.code}
                          </span>
                        </td>

                        {/* CA1 (Highlighted out of 10) */}
                        <td className="py-2.5 px-2 text-center font-black text-indigo-900 bg-indigo-50/60 border border-slate-200">
                          {grd.ca1} / 10
                        </td>

                        <td className="py-2.5 px-2 text-center text-slate-700 border border-slate-200">
                          {grd.ca2}
                        </td>

                        <td className="py-2.5 px-2 text-center text-slate-700 border border-slate-200">
                          {grd.assignment}
                        </td>

                        <td className="py-2.5 px-2 text-center text-slate-700 border border-slate-200 font-semibold">
                          {grd.exam}
                        </td>

                        <td className="py-2.5 px-2 text-center font-black text-sm text-slate-950 border border-slate-200">
                          {grd.totalScore}%
                        </td>

                        <td className="py-2.5 px-2 text-center border border-slate-200">
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${gradeInfo.badgeBg}`}>
                            {gradeInfo.letter}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-[11px] text-slate-700 border border-slate-200">
                          {grd.teacherRemark || getGradeRemark(gradeInfo.letter)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Grading Legend Key */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Grading Scale System Key:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[10px] text-center font-semibold">
              <span className="p-1 bg-emerald-100 text-emerald-900 rounded">A: 80-100% (Distinction)</span>
              <span className="p-1 bg-blue-100 text-blue-900 rounded">B: 70-79% (Very Good)</span>
              <span className="p-1 bg-indigo-100 text-indigo-900 rounded">C: 60-69% (Good)</span>
              <span className="p-1 bg-amber-100 text-amber-900 rounded">D: 50-59% (Pass)</span>
              <span className="p-1 bg-orange-100 text-orange-900 rounded">E: 40-49% (Fair)</span>
              <span className="p-1 bg-rose-100 text-rose-900 rounded">F: 0-39% (Fail)</span>
            </div>
          </div>

          {/* Remarks & Digital Signatures Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            {/* Class Teacher Observation */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block uppercase flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Class Teacher's Observation:</span>
              </span>
              <textarea
                rows={2}
                value={teacherComment}
                onChange={(e) => setTeacherComment(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none print:border-none print:bg-transparent print:p-0 print:resize-none"
              />
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-800">{currentClass?.teacherName || "Class Teacher"}</span>
                <span className="text-slate-400 font-mono italic">Signed • Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Principal Remark & Seal */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block uppercase flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Principal's General Assessment:</span>
              </span>
              <textarea
                rows={2}
                value={principalComment}
                onChange={(e) => setPrincipalComment(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none print:border-none print:bg-transparent print:p-0 print:resize-none"
              />
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-800">{schoolInfo.principalName || "Dr. Elizabeth Vance (Principal)"}</span>
                <span className="text-slate-400 font-mono italic">[ Official School Seal Attached ]</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
