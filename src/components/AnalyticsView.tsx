import React from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Building2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { ClassRoom, Subject, Student, GradeRecord } from '../types';
import { getGradeDetails } from '../utils/gradeUtils';

interface AnalyticsViewProps {
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  grades: GradeRecord[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  classes,
  subjects,
  students,
  grades
}) => {
  // 1. Subject Average Data
  const subjectChartData = subjects.map(sub => {
    const subGrades = grades.filter(g => g.subjectId === sub.id);
    if (subGrades.length === 0) return { name: sub.code || sub.name, avg: 0, count: 0 };
    const avg = subGrades.reduce((sum, g) => sum + g.totalScore, 0) / subGrades.length;
    return {
      name: sub.code || sub.name,
      fullName: sub.name,
      avg: Number(avg.toFixed(1)),
      count: subGrades.length
    };
  });

  // 2. Grade Distribution Data (A, B, C, D, E, F)
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  grades.forEach(g => {
    const letter = g.gradeLetter || getGradeDetails(g.totalScore).letter;
    if (gradeCounts[letter] !== undefined) {
      gradeCounts[letter]++;
    }
  });

  const pieData = [
    { name: 'Grade A (80-100%)', value: gradeCounts.A, color: '#10b981' },
    { name: 'Grade B (70-79%)', value: gradeCounts.B, color: '#3b82f6' },
    { name: 'Grade C (60-69%)', value: gradeCounts.C, color: '#6366f1' },
    { name: 'Grade D (50-59%)', value: gradeCounts.D, color: '#f59e0b' },
    { name: 'Grade E (40-49%)', value: gradeCounts.E, color: '#f97316' },
    { name: 'Grade F (0-39%)', value: gradeCounts.F, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // 3. Class Averages
  const classChartData = classes.map(cls => {
    const classGrades = grades.filter(g => g.classId === cls.id);
    if (classGrades.length === 0) return { name: cls.code || cls.name, avg: 0 };
    const avg = classGrades.reduce((sum, g) => sum + g.totalScore, 0) / classGrades.length;
    return {
      name: cls.name,
      avg: Number(avg.toFixed(1))
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <span>Academic Performance & Grade Distribution Analytics</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Visual insights on subject score averages, letter grade distribution, and class comparisons
        </p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Score Averages Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Average Score by Subject (%)</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{grades.length} Total Assessment Records</span>
          </div>

          <div className="h-64 w-full pt-2">
            {subjectChartData.length === 0 ? (
              <p className="text-center py-20 text-slate-400 text-xs">No grades recorded to build charts.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`${value}%`, 'Average Score']}
                  />
                  <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                    {subjectChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Grade Letter Distribution Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <span>Overall Grade Letter Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Standard A - F System</span>
          </div>

          <div className="h-64 w-full pt-2">
            {pieData.length === 0 ? (
              <p className="text-center py-20 text-slate-400 text-xs">No grades recorded to build charts.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Class Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-500" />
          <span>Classroom Performance Comparison</span>
        </h3>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(value: any) => [`${value}%`, 'Class Average']}
              />
              <Bar dataKey="avg" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
