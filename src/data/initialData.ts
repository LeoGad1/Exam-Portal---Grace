import { SchoolInfo, ClassRoom, Subject, Student, GradeRecord } from '../types';

export const initialSchoolInfo: SchoolInfo = {
  id: "school-default-1",
  name: "Apex Crest International Academy",
  motto: "Inspiring Greatness, Fostering Excellence",
  schoolType: "International Academy",
  address: "45 Academic Boulevard, Victoria Island, Lagos",
  phone: "+234 801 234 5678",
  email: "info@apexcrest.edu.ng",
  principalName: "Dr. Elizabeth Vance, Ph.D.",
  examOfficerName: "Mr. Marcus Sterling",
  academicTerm: "First Term",
  academicYear: "2025/2026 Session",
  themeColor: "indigo",
  emblemIcon: "graduation-cap",
  logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80",
  createdAt: "2025-09-01"
};

export const initialClasses: ClassRoom[] = [
  {
    id: "class-1",
    name: "Grade 10 Alpha",
    code: "G10-A",
    category: "Senior High",
    teacherName: "Mrs. Sarah Jenkins",
    capacity: 30
  },
  {
    id: "class-2",
    name: "Grade 11 Science",
    code: "G11-SCI",
    category: "Senior High",
    teacherName: "Mr. David Thorne",
    capacity: 28
  },
  {
    id: "class-3",
    name: "Grade 12 Honors",
    code: "G12-HON",
    category: "Senior High",
    teacherName: "Dr. Amanda Vance",
    capacity: 25
  }
];

export const initialSubjects: Subject[] = [
  {
    id: "sub-1",
    name: "Mathematics",
    code: "MTH-101",
    classIds: ["class-1", "class-2", "class-3"],
    ca1MaxMarks: 10,
    ca2MaxMarks: 10,
    assignmentMaxMarks: 10,
    examMaxMarks: 70
  },
  {
    id: "sub-2",
    name: "English Language",
    code: "ENG-101",
    classIds: ["class-1", "class-2", "class-3"],
    ca1MaxMarks: 10,
    ca2MaxMarks: 10,
    assignmentMaxMarks: 10,
    examMaxMarks: 70
  },
  {
    id: "sub-3",
    name: "Physics",
    code: "PHY-101",
    classIds: ["class-1", "class-2"],
    ca1MaxMarks: 10,
    ca2MaxMarks: 10,
    assignmentMaxMarks: 10,
    examMaxMarks: 70
  },
  {
    id: "sub-4",
    name: "Chemistry",
    code: "CHM-101",
    classIds: ["class-1", "class-2"],
    ca1MaxMarks: 10,
    ca2MaxMarks: 10,
    assignmentMaxMarks: 10,
    examMaxMarks: 70
  },
  {
    id: "sub-5",
    name: "Computer Science",
    code: "CSC-101",
    classIds: ["class-1", "class-2", "class-3"],
    ca1MaxMarks: 10,
    ca2MaxMarks: 10,
    assignmentMaxMarks: 10,
    examMaxMarks: 70
  }
];

export const initialStudents: Student[] = [
  {
    id: "std-1",
    studentId: "STD-2025-001",
    fullName: "Alexander Wright",
    gender: "Male",
    classId: "class-1",
    guardianName: "Robert Wright",
    guardianPhone: "+234 802 111 2233",
    daysPresent: 58,
    totalSchoolDays: 60
  },
  {
    id: "std-2",
    studentId: "STD-2025-002",
    fullName: "Sophia Martinez",
    gender: "Female",
    classId: "class-1",
    guardianName: "Elena Martinez",
    guardianPhone: "+234 803 444 5566",
    daysPresent: 60,
    totalSchoolDays: 60
  },
  {
    id: "std-3",
    studentId: "STD-2025-003",
    fullName: "Ethan Sterling",
    gender: "Male",
    classId: "class-1",
    guardianName: "Mark Sterling",
    guardianPhone: "+234 805 777 8899",
    daysPresent: 55,
    totalSchoolDays: 60
  },
  {
    id: "std-4",
    studentId: "STD-2025-004",
    fullName: "Olivia Chen",
    gender: "Female",
    classId: "class-1",
    guardianName: "Wei Chen",
    guardianPhone: "+234 809 123 9988",
    daysPresent: 59,
    totalSchoolDays: 60
  },
  {
    id: "std-5",
    studentId: "STD-2025-005",
    fullName: "Marcus Johnson",
    gender: "Male",
    classId: "class-2",
    guardianName: "Teresa Johnson",
    guardianPhone: "+234 808 333 4411",
    daysPresent: 56,
    totalSchoolDays: 60
  },
  {
    id: "std-6",
    studentId: "STD-2025-006",
    fullName: "Zoe Adeleke",
    gender: "Female",
    classId: "class-2",
    guardianName: "Babatunde Adeleke",
    guardianPhone: "+234 802 999 0011",
    daysPresent: 60,
    totalSchoolDays: 60
  }
];

export const initialGrades: GradeRecord[] = [
  // Student 1 (Alexander)
  {
    id: "grd-1",
    studentId: "std-1",
    subjectId: "sub-1", // Mathematics
    classId: "class-1",
    academicTerm: "First Term",
    academicYear: "2025/2026 Session",
    ca1: 9, // CA1 out of 10
    ca2: 8,
    assignment: 9,
    exam: 62,
    totalScore: 88,
    gradeLetter: "A",
    teacherRemark: "Outstanding analytical and problem solving skills.",
    updatedAt: new Date().toISOString()
  },
  {
    id: "grd-2",
    studentId: "std-1",
    subjectId: "sub-2", // English Language
    classId: "class-1",
    academicTerm: "First Term",
    academicYear: "2025/2026 Session",
    ca1: 8, // CA1 out of 10
    ca2: 9,
    assignment: 8,
    exam: 56,
    totalScore: 81,
    gradeLetter: "A",
    teacherRemark: "Very good comprehension and essay composition.",
    updatedAt: new Date().toISOString()
  },
  {
    id: "grd-3",
    studentId: "std-1",
    subjectId: "sub-3", // Physics
    classId: "class-1",
    academicTerm: "First Term",
    academicYear: "2025/2026 Session",
    ca1: 10, // CA1 out of 10 (Full marks!)
    ca2: 9,
    assignment: 8,
    exam: 60,
    totalScore: 87,
    gradeLetter: "A",
    teacherRemark: "Excellent practical lab work and theory comprehension.",
    updatedAt: new Date().toISOString()
  },
  {
    id: "grd-4",
    studentId: "std-1",
    subjectId: "sub-5", // Computer Science
    classId: "class-1",
    academicTerm: "First Term",
    academicYear: "2025/2026 Session",
    ca1: 9,
    ca2: 10,
    assignment: 10,
    exam: 64,
    totalScore: 93,
    gradeLetter: "A",
    teacherRemark: "Exceptional coding logic and project execution.",
    updatedAt: new Date().toISOString()
  },

  // Student 2 (Sophia)
  {
    id: "grd-5",
    studentId: "std-2",
    subjectId: "sub-1", // Mathematics
    classId: "class-1",
    academicTerm: "First Term",
    academicYear: "2025/2026 Session",
    ca1: 8,
    ca2: 7,
    assignment: 8,
    exam: 52,
    totalScore: 75,
    gradeLetter: "B",
    teacherRemark: "Good grasp of mathematical concepts.",
    updatedAt: new Date().toISOString()
  },
  {
    id: "grd-6",
    studentId: "std-2",
    subjectId: "sub-2", // English
    classId: "class-1",
    academicTerm: "First Term",
    academicYear: "2025/2026 Session",
    ca1: 9,
    ca2: 9,
    assignment: 9,
    exam: 61,
    totalScore: 88,
    gradeLetter: "A",
    teacherRemark: "Fluency in vocabulary and creative writing.",
    updatedAt: new Date().toISOString()
  },

  // Student 3 (Ethan)
  {
    id: "grd-7",
    studentId: "std-3",
    subjectId: "sub-1", // Mathematics
    classId: "class-1",
    academicTerm: "First Term",
    academicYear: "2025/2026 Session",
    ca1: 6,
    ca2: 6,
    assignment: 7,
    exam: 45,
    totalScore: 64,
    gradeLetter: "C",
    teacherRemark: "Steady effort, needs more practice with algebra.",
    updatedAt: new Date().toISOString()
  }
];
