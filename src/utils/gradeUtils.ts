import { GradeRecord } from '../types';

export const CA1_MAX_MARKS = 10;
export const CA2_MAX_MARKS = 10;
export const ASSIGNMENT_MAX_MARKS = 10;
export const EXAM_MAX_MARKS = 70;

export function calculateTotalScore(
  ca1: number = 0,
  ca2: number = 0,
  assignment: number = 0,
  exam: number = 0
): number {
  const c1 = Math.min(Math.max(0, Number(ca1) || 0), CA1_MAX_MARKS);
  const c2 = Math.min(Math.max(0, Number(ca2) || 0), CA2_MAX_MARKS);
  const ass = Math.min(Math.max(0, Number(assignment) || 0), ASSIGNMENT_MAX_MARKS);
  const ex = Math.min(Math.max(0, Number(exam) || 0), EXAM_MAX_MARKS);
  return Number((c1 + c2 + ass + ex).toFixed(1));
}

export function getGradeDetails(totalScore: number): {
  letter: GradeRecord['gradeLetter'];
  remark: string;
  colorClass: string;
  badgeBg: string;
} {
  if (totalScore >= 80) {
    return {
      letter: 'A',
      remark: 'Excellent performance',
      colorClass: 'text-emerald-700 dark:text-emerald-400 font-bold',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
  } else if (totalScore >= 70) {
    return {
      letter: 'B',
      remark: 'Very good effort',
      colorClass: 'text-blue-700 dark:text-blue-400 font-bold',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
    };
  } else if (totalScore >= 60) {
    return {
      letter: 'C',
      remark: 'Good progress',
      colorClass: 'text-indigo-700 dark:text-indigo-400 font-medium',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
  } else if (totalScore >= 50) {
    return {
      letter: 'D',
      remark: 'Satisfactory / Pass',
      colorClass: 'text-amber-700 dark:text-amber-400 font-medium',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
    };
  } else if (totalScore >= 40) {
    return {
      letter: 'E',
      remark: 'Fair attempt, needs improvement',
      colorClass: 'text-orange-700 dark:text-orange-400 font-medium',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-200'
    };
  } else {
    return {
      letter: 'F',
      remark: 'Unsatisfactory, requires urgent attention',
      colorClass: 'text-rose-700 dark:text-rose-400 font-bold',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200'
    };
  }
}

export function getGradeRemark(letter: string): string {
  switch (letter) {
    case 'A': return 'Outstanding work throughout the term.';
    case 'B': return 'Commendable performance, keep it up.';
    case 'C': return 'Satisfactory effort with good understanding.';
    case 'D': return 'Fair result, more practice needed.';
    case 'E': return 'Marginal pass, requires extra tutorial help.';
    case 'F': return 'Failed assessment. Remedial lessons recommended.';
    default: return 'Evaluated score.';
  }
}
