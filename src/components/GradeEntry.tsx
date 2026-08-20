import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Save, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Wand2
} from 'lucide-react';
import { ClassRoom, Subject, Student, GradeRecord, SchoolInfo } from '../types';
import { calculateTotalScore, getGradeDetails, CA1_MAX_MARKS, CA2_MAX_MARKS, ASSIGNMENT_MAX_MARKS, EXAM_MAX_MARKS } from '../utils/gradeUtils';

interface GradeEntryProps {
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  grades: GradeRecord[];
  schoolInfo: SchoolInfo;
  onSaveBatchGrades: (grades: GradeRecord[]) => void;
}

interface EditableGradeRow {
  studentId: string;
  studentName: string;
  studentCode: string;
  ca1: number | string;
  ca2: number | string;
  assignment: number | string;
  exam: number | string;
  teacherRemark: string;
}

export const GradeEntry: React.FC<GradeEntryProps> = ({
  classes,
  subjects,
  students,
  grades,
  schoolInfo,
  onSaveBatchGrades
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [rows, setRows] = useState<EditableGradeRow[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Update selected subject when class changes
  useEffect(() => {
    if (selectedClassId) {
      const availableSubjects = subjects.filter(s => s.classIds?.includes(selectedClassId));
      if (availableSubjects.length > 0 && (!selectedSubjectId || !availableSubjects.some(s => s.id === selectedSubjectId))) {
        setSelectedSubjectId(availableSubjects[0].id);
      }
    }
  }, [selectedClassId, subjects]);

  // Load existing grade records into editable rows whenever Class or Subject selection changes
  useEffect(() => {
    if (!selectedClassId || !selectedSubjectId) {
      setRows([]);
      return;
    }

    const classStudents = students.filter(s => s.classId === selectedClassId);

    const initialRows: EditableGradeRow[] = classStudents.map(std => {
      const existingGrade = grades.find(
        g => g.studentId === std.id && g.subjectId === selectedSubjectId && g.classId === selectedClassId
      );

      if (existingGrade) {
        return {
          studentId: std.id,
          studentName: std.fullName,
          studentCode: std.studentId,
          ca1: existingGrade.ca1,
          ca2: existingGrade.ca2,
          assignment: existingGrade.assignment,
          exam: existingGrade.exam,
          teacherRemark: existingGrade.teacherRemark || ''
        };
      }

      return {
        studentId: std.id,
        studentName: std.fullName,
        studentCode: std.studentId,
        ca1: '',
        ca2: '',
        assignment: '',
        exam: '',
        teacherRemark: ''
      };
    });

    setRows(initialRows);
  }, [selectedClassId, selectedSubjectId, students, grades]);

  const handleScoreChange = (
    studentId: string, 
    field: 'ca1' | 'ca2' | 'assignment' | 'exam' | 'teacherRemark', 
    value: string
  ) => {
    setRows(prev => prev.map(row => {
      if (row.studentId !== studentId) return row;

      if (field === 'teacherRemark') {
        return { ...row, teacherRemark: value };
      }

      // Handle numbers with max limits
      const numVal = value === '' ? '' : Math.max(0, Number(value) || 0);

      if (field === 'ca1') {
        const clamped = numVal === '' ? '' : Math.min(CA1_MAX_MARKS, numVal as number);
        return { ...row, ca1: clamped };
      }
      if (field === 'ca2') {
        const clamped = numVal === '' ? '' : Math.min(CA2_MAX_MARKS, numVal as number);
        return { ...row, ca2: clamped };
      }
      if (field === 'assignment') {
        const clamped = numVal === '' ? '' : Math.min(ASSIGNMENT_MAX_MARKS, numVal as number);
        return { ...row, assignment: clamped };
      }
      if (field === 'exam') {
        const clamped = numVal === '' ? '' : Math.min(EXAM_MAX_MARKS, numVal as number);
        return { ...row, exam: clamped };
      }

      return row;
    }));
  };

  const handleAutoFillSampleScores = () => {
    setRows(prev => prev.map((row, idx) => {
      // Seed realistic scores
      const ca1 = Math.min(10, Math.floor(Math.random() * 4) + 7); // 7 to 10
      const ca2 = Math.min(10, Math.floor(Math.random() * 4) + 6); // 6 to 9
      const assignment = Math.min(10, Math.floor(Math.random() * 3) + 7); // 7 to 9
      const exam = Math.min(70, Math.floor(Math.random() * 25) + 45); // 45 to 69

      const total = ca1 + ca2 + assignment + exam;
      const details = getGradeDetails(total);

      return {
        ...row,
        ca1,
        ca2,
        assignment,
        exam,
        teacherRemark: details.remark
      };
    }));
  };

  const handleSave = () => {
    if (!selectedClassId || !selectedSubjectId) return;

    const newGradeRecords: GradeRecord[] = rows.map(row => {
      const ca1 = Number(row.ca1) || 0;
      const ca2 = Number(row.ca2) || 0;
      const assignment = Number(row.assignment) || 0;
      const exam = Number(row.exam) || 0;

      const totalScore = calculateTotalScore(ca1, ca2, assignment, exam);
      const gradeDetails = getGradeDetails(totalScore);

      return {
        id: `grd-${row.studentId}-${selectedSubjectId}`,
        studentId: row.studentId,
        subjectId: selectedSubjectId,
        classId: selectedClassId,
        academicTerm: schoolInfo.academicTerm,
        academicYear: schoolInfo.academicYear,
        ca1,
        ca2,
        assignment,
        exam,
        totalScore,
        gradeLetter: gradeDetails.letter,
        teacherRemark: row.teacherRemark || gradeDetails.remark,
        updatedAt: new Date().toISOString()
      };
    });

    onSaveBatchGrades(newGradeRecords);
    setSaveSuccessMsg('Grades saved successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const currentClass = classes.find(c => c.id === selectedClassId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const availableSubjects = subjects.filter(s => s.classIds?.includes(selectedClassId));

  return (
    <div className="space-y-6">
      {/* Header & Selector Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <span>Assessment & Grade Entry Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select class and subject to record CA1 (10 marks max), CA2, assignment, and exam marks
            </p>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFillSampleScores}
              className="px-3 py-2 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              title="Auto-populate sample test marks"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Fill Sample Scores</span>
            </button>

            <button
              id="save-grades-btn"
              onClick={handleSave}
              disabled={rows.length === 0}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save All Grades</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Dropdowns Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Classroom:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Subject:
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500"
            >
              {availableSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-indigo-700 dark:text-indigo-300 block">
                Primary Continuous Assessment
              </span>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                CA1 Weighting = 10 Marks
              </span>
            </div>
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Grade Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {rows.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No students registered in this class</p>
            <p className="text-xs text-slate-400 mt-1">Add students to {currentClass?.name || 'class'} first to record grades.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold uppercase border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[180px]">Student Details</th>
                  <th className="py-3 px-3 text-center bg-indigo-100/80 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 min-w-[100px]">
                    <div className="flex items-center justify-center gap-1">
                      <span>CA1</span>
                      <span className="text-[10px] bg-amber-500 text-white font-black px-1 rounded">10m</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center min-w-[90px]">
                    CA2 (10m)
                  </th>
                  <th className="py-3 px-3 text-center min-w-[90px]">
                    CA3/Assgn (10m)
                  </th>
                  <th className="py-3 px-3 text-center min-w-[100px]">
                    Exam (70m)
                  </th>
                  <th className="py-3 px-3 text-center min-w-[90px]">
                    Total (100)
                  </th>
                  <th className="py-3 px-3 text-center min-w-[80px]">
                    Grade
                  </th>
                  <th className="py-3 px-4 min-w-[200px]">
                    Teacher's Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((row, idx) => {
                  const ca1Val = row.ca1 === '' ? 0 : Number(row.ca1);
                  const ca2Val = row.ca2 === '' ? 0 : Number(row.ca2);
                  const assVal = row.assignment === '' ? 0 : Number(row.assignment);
                  const examVal = row.exam === '' ? 0 : Number(row.exam);

                  const total = calculateTotalScore(ca1Val, ca2Val, assVal, examVal);
                  const gradeInfo = getGradeDetails(total);

                  const isCa1Exceeded = Number(row.ca1) > CA1_MAX_MARKS;

                  return (
                    <tr key={row.studentId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {row.studentName}
                        <span className="block text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                          {row.studentCode}
                        </span>
                      </td>

                      {/* CA1 Input (Max 10 Marks) */}
                      <td className="py-2 px-3 text-center bg-indigo-50/40 dark:bg-indigo-950/20">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={CA1_MAX_MARKS}
                            step="0.5"
                            placeholder="0-10"
                            value={row.ca1}
                            onChange={(e) => handleScoreChange(row.studentId, 'ca1', e.target.value)}
                            className={`w-20 text-center font-black py-1.5 px-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                              isCa1Exceeded 
                                ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500' 
                                : 'bg-white dark:bg-slate-800 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100 focus:ring-indigo-500'
                            }`}
                          />
                          {isCa1Exceeded && (
                            <span className="text-[9px] font-bold text-rose-600 block mt-0.5">Max 10!</span>
                          )}
                        </div>
                      </td>

                      {/* CA2 Input */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max={CA2_MAX_MARKS}
                          step="0.5"
                          placeholder="0-10"
                          value={row.ca2}
                          onChange={(e) => handleScoreChange(row.studentId, 'ca2', e.target.value)}
                          className="w-16 text-center font-semibold py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Assignment Input */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max={ASSIGNMENT_MAX_MARKS}
                          step="0.5"
                          placeholder="0-10"
                          value={row.assignment}
                          onChange={(e) => handleScoreChange(row.studentId, 'assignment', e.target.value)}
                          className="w-16 text-center font-semibold py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Exam Input */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max={EXAM_MAX_MARKS}
                          step="0.5"
                          placeholder="0-70"
                          value={row.exam}
                          onChange={(e) => handleScoreChange(row.studentId, 'exam', e.target.value)}
                          className="w-20 text-center font-extrabold py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Live Total Calculation */}
                      <td className="py-3 px-3 text-center font-black text-sm text-slate-900 dark:text-white">
                        {total}%
                      </td>

                      {/* Live Grade Badge */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 text-xs font-black rounded-md border ${gradeInfo.badgeBg}`}>
                          {gradeInfo.letter}
                        </span>
                      </td>

                      {/* Teacher Remark Input */}
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          placeholder="Optional remark..."
                          value={row.teacherRemark}
                          onChange={(e) => handleScoreChange(row.studentId, 'teacherRemark', e.target.value)}
                          className="w-full py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
