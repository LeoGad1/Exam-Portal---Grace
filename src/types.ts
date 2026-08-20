export interface SchoolInfo {
  id?: string;
  name: string;
  motto: string;
  schoolType?: string; // 'Secondary School' | 'Primary School' | 'K-12 Comprehensive' | 'International Academy' | 'Vocational / Technical'
  address: string;
  phone: string;
  email: string;
  principalName?: string;
  examOfficerName?: string;
  academicTerm: string;
  academicYear: string;
  themeColor?: string; // 'indigo' | 'blue' | 'emerald' | 'rose' | 'amber' | 'purple' | 'teal' | 'slate'
  emblemIcon?: string; // 'graduation-cap' | 'book-open' | 'shield' | 'award' | 'school' | 'sparkles' | 'crown' | 'landmark'
  logoUrl?: string;
  createdAt?: string;
}

export type SchoolStarterPreset = 'blank' | 'standard-secondary' | 'primary' | 'science-academy';

export interface ClassRoom {
  id: string;
  name: string; // e.g., "Grade 10 Alpha"
  code: string; // e.g., "G10-A"
  category: 'Primary' | 'Junior High' | 'Senior High' | 'Tertiary';
  teacherName: string;
  capacity?: number;
}

export interface Subject {
  id: string;
  name: string; // e.g., "Mathematics"
  code: string; // e.g., "MTH101"
  classIds: string[]; // Classes offering this subject
  ca1MaxMarks: number; // Defaults to 10
  ca2MaxMarks: number; // Defaults to 10
  assignmentMaxMarks: number; // Defaults to 10
  examMaxMarks: number; // Defaults to 70
}

export interface Student {
  id: string;
  studentId: string; // e.g. "STD-2025-001"
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  classId: string;
  guardianName?: string;
  guardianPhone?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  daysPresent?: number;
  totalSchoolDays?: number;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  academicTerm: string;
  academicYear: string;
  ca1: number; // Max 10 (Strict Continuous Assessment 1)
  ca2: number; // Max 10
  assignment: number; // Max 10
  exam: number; // Max 70
  totalScore: number; // Sum out of 100
  gradeLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  teacherRemark: string;
  updatedAt: string;
}

export interface ReportCardData {
  student: Student;
  classRoom: ClassRoom;
  grades: {
    subject: Subject;
    grade: GradeRecord;
    classAverage: number;
    highestScore: number;
    subjectPosition: number;
  }[];
  overallAverage: number;
  overallTotalScore: number;
  totalMaxPossible: number;
  overallGrade: string;
  classPosition: number;
  totalStudentsInClass: number;
  teacherGeneralRemark: string;
  principalGeneralRemark: string;
}

export type ActiveTab = 'dashboard' | 'classes' | 'subjects' | 'students' | 'grade-entry' | 'report-cards' | 'analytics' | 'settings';
