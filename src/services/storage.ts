import { SchoolInfo, ClassRoom, Subject, Student, GradeRecord, SchoolStarterPreset } from '../types';
import { initialSchoolInfo, initialClasses, initialSubjects, initialStudents, initialGrades } from '../data/initialData';

const STORAGE_KEYS = {
  SCHOOLS: 'exam_portal_schools_list',
  ACTIVE_SCHOOL_ID: 'exam_portal_active_school_id',
  SCHOOL: 'exam_portal_school',
  CLASSES: 'exam_portal_classes',
  SUBJECTS: 'exam_portal_subjects',
  STUDENTS: 'exam_portal_students',
  GRADES: 'exam_portal_grades'
};

const getScopedKey = (baseKey: string, schoolId: string) => {
  return `${baseKey}_${schoolId}`;
};

export const storage = {
  // Init storage with default school and data if empty
  init: () => {
    // Initialize Schools list
    const schoolsJson = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    if (!schoolsJson) {
      const defaultSchool: SchoolInfo = {
        ...initialSchoolInfo,
        id: initialSchoolInfo.id || 'school-default-1'
      };
      localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify([defaultSchool]));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SCHOOL_ID, defaultSchool.id!);
      
      // Also write legacy keys for default school
      if (!localStorage.getItem(STORAGE_KEYS.SCHOOL)) {
        localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(defaultSchool));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
        localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(initialClasses));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
        localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialSubjects));
      }
      if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
      }
      if (!localStorage.getItem(STORAGE_KEYS.GRADES)) {
        localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(initialGrades));
      }
    }
  },

  // Reset current school or all schools to default
  resetAllData: () => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1' || !activeId) {
      localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(initialSchoolInfo));
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(initialClasses));
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialSubjects));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(initialGrades));
    } else {
      localStorage.removeItem(getScopedKey(STORAGE_KEYS.CLASSES, activeId));
      localStorage.removeItem(getScopedKey(STORAGE_KEYS.SUBJECTS, activeId));
      localStorage.removeItem(getScopedKey(STORAGE_KEYS.STUDENTS, activeId));
      localStorage.removeItem(getScopedKey(STORAGE_KEYS.GRADES, activeId));
    }
  },

  // Multiple Schools Management
  getSchools: (): SchoolInfo[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [initialSchoolInfo];
      }
    }
    return [initialSchoolInfo];
  },

  saveSchoolsList: (schools: SchoolInfo[]) => {
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
  },

  getActiveSchoolId: (): string => {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_SCHOOL_ID);
    if (id) return id;
    const schools = storage.getSchools();
    const fallbackId = schools[0]?.id || 'school-default-1';
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SCHOOL_ID, fallbackId);
    return fallbackId;
  },

  setActiveSchoolId: (schoolId: string) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SCHOOL_ID, schoolId);
  },

  getSchoolInfo: (): SchoolInfo => {
    const activeId = storage.getActiveSchoolId();
    const schools = storage.getSchools();
    const found = schools.find(s => s.id === activeId);
    if (found) return found;

    // Fallback to legacy single school
    const legacy = localStorage.getItem(STORAGE_KEYS.SCHOOL);
    return legacy ? JSON.parse(legacy) : initialSchoolInfo;
  },

  saveSchoolInfo: (info: SchoolInfo) => {
    const activeId = storage.getActiveSchoolId();
    const targetId = info.id || activeId;
    const updatedInfo = { ...info, id: targetId };

    const schools = storage.getSchools();
    const exists = schools.some(s => s.id === targetId);
    let updatedList: SchoolInfo[];

    if (exists) {
      updatedList = schools.map(s => s.id === targetId ? updatedInfo : s);
    } else {
      updatedList = [...schools, updatedInfo];
    }

    storage.saveSchoolsList(updatedList);
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(updatedInfo));
  },

  // Create a brand new School
  createNewSchool: (newSchoolData: Omit<SchoolInfo, 'id'>, preset: SchoolStarterPreset = 'standard-secondary'): SchoolInfo => {
    const newId = 'school-' + Date.now();
    const newSchool: SchoolInfo = {
      ...newSchoolData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Save to schools list
    const schools = storage.getSchools();
    const updatedSchools = [...schools, newSchool];
    storage.saveSchoolsList(updatedSchools);
    storage.setActiveSchoolId(newId);

    // Provision Starter Templates
    let starterClasses: ClassRoom[] = [];
    let starterSubjects: Subject[] = [];
    let starterStudents: Student[] = [];

    if (preset === 'standard-secondary') {
      starterClasses = [
        {
          id: `class-${newId}-1`,
          name: 'Grade 10 Alpha',
          code: 'G10-A',
          category: 'Senior High',
          teacherName: 'Mrs. S. Adeyemi',
          capacity: 35
        },
        {
          id: `class-${newId}-2`,
          name: 'Grade 11 Science',
          code: 'G11-SCI',
          category: 'Senior High',
          teacherName: 'Mr. J. Okafor',
          capacity: 30
        },
        {
          id: `class-${newId}-3`,
          name: 'Grade 12 Honors',
          code: 'G12-HON',
          category: 'Senior High',
          teacherName: 'Dr. C. Nwosu',
          capacity: 30
        }
      ];

      const classIds = starterClasses.map(c => c.id);

      starterSubjects = [
        {
          id: `sub-${newId}-1`,
          name: 'Mathematics',
          code: 'MTH-101',
          classIds: classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-2`,
          name: 'English Language',
          code: 'ENG-101',
          classIds: classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-3`,
          name: 'Physics',
          code: 'PHY-101',
          classIds: [starterClasses[0].id, starterClasses[1].id],
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-4`,
          name: 'Chemistry',
          code: 'CHM-101',
          classIds: [starterClasses[0].id, starterClasses[1].id],
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-5`,
          name: 'Computer Studies',
          code: 'CSC-101',
          classIds: classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        }
      ];

      starterStudents = [
        {
          id: `std-${newId}-1`,
          studentId: 'STD-001',
          fullName: 'Daniel K. Lawson',
          gender: 'Male',
          classId: starterClasses[0].id,
          guardianName: 'Chief Robert Lawson',
          guardianPhone: '+234 802 000 1122',
          daysPresent: 58,
          totalSchoolDays: 60
        },
        {
          id: `std-${newId}-2`,
          studentId: 'STD-002',
          fullName: 'Chidinma Grace Eze',
          gender: 'Female',
          classId: starterClasses[0].id,
          guardianName: 'Mrs. Patience Eze',
          guardianPhone: '+234 803 111 2233',
          daysPresent: 60,
          totalSchoolDays: 60
        }
      ];
    } else if (preset === 'primary') {
      starterClasses = [
        {
          id: `class-${newId}-1`,
          name: 'Primary 3 Gold',
          code: 'PRI-3',
          category: 'Primary',
          teacherName: 'Miss R. Benson',
          capacity: 25
        },
        {
          id: `class-${newId}-2`,
          name: 'Primary 4 Diamond',
          code: 'PRI-4',
          category: 'Primary',
          teacherName: 'Mr. E. Mensah',
          capacity: 25
        },
        {
          id: `class-${newId}-3`,
          name: 'Primary 5 Sapphire',
          code: 'PRI-5',
          category: 'Primary',
          teacherName: 'Mrs. A. Balogun',
          capacity: 25
        }
      ];

      const classIds = starterClasses.map(c => c.id);

      starterSubjects = [
        {
          id: `sub-${newId}-1`,
          name: 'Mathematics & Numeracy',
          code: 'NUM-100',
          classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-2`,
          name: 'English & Literacy',
          code: 'LIT-100',
          classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-3`,
          name: 'Basic Science & Technology',
          code: 'SCI-100',
          classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-4`,
          name: 'Social Studies & Civic Habits',
          code: 'SOC-100',
          classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        }
      ];
    } else if (preset === 'science-academy') {
      starterClasses = [
        {
          id: `class-${newId}-1`,
          name: 'STEM Year 1 Einstein',
          code: 'STEM-Y1',
          category: 'Senior High',
          teacherName: 'Prof. K. Alabi',
          capacity: 24
        },
        {
          id: `class-${newId}-2`,
          name: 'STEM Year 2 Turing',
          code: 'STEM-Y2',
          category: 'Senior High',
          teacherName: 'Dr. F. Usman',
          capacity: 24
        }
      ];

      const classIds = starterClasses.map(c => c.id);

      starterSubjects = [
        {
          id: `sub-${newId}-1`,
          name: 'Advanced Mathematics & Calculus',
          code: 'MTH-201',
          classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-2`,
          name: 'Applied Physics & Mechanics',
          code: 'PHY-201',
          classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-3`,
          name: 'Organic Chemistry & Labs',
          code: 'CHM-201',
          classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        },
        {
          id: `sub-${newId}-4`,
          name: 'Computer Programming & Algorithms',
          code: 'CS-201',
          classIds,
          ca1MaxMarks: 10,
          ca2MaxMarks: 10,
          assignmentMaxMarks: 10,
          examMaxMarks: 70
        }
      ];
    }

    // Save newly provisioned data
    storage.saveClasses(starterClasses);
    storage.saveSubjects(starterSubjects);
    storage.saveStudents(starterStudents);
    storage.saveGrades([]);

    return newSchool;
  },

  deleteSchool: (schoolId: string): SchoolInfo | null => {
    const schools = storage.getSchools();
    if (schools.length <= 1) {
      return null; // Cannot delete the only school
    }

    const filteredSchools = schools.filter(s => s.id !== schoolId);
    storage.saveSchoolsList(filteredSchools);

    // Remove school-specific data
    localStorage.removeItem(getScopedKey(STORAGE_KEYS.CLASSES, schoolId));
    localStorage.removeItem(getScopedKey(STORAGE_KEYS.SUBJECTS, schoolId));
    localStorage.removeItem(getScopedKey(STORAGE_KEYS.STUDENTS, schoolId));
    localStorage.removeItem(getScopedKey(STORAGE_KEYS.GRADES, schoolId));

    // Switch to first available
    const nextSchool = filteredSchools[0];
    storage.setActiveSchoolId(nextSchool.id!);
    return nextSchool;
  },

  // Classes
  getClasses: (): ClassRoom[] => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1') {
      const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return data ? JSON.parse(data) : initialClasses;
    }
    const scoped = localStorage.getItem(getScopedKey(STORAGE_KEYS.CLASSES, activeId));
    return scoped ? JSON.parse(scoped) : [];
  },

  saveClasses: (classes: ClassRoom[]) => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1') {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    }
    localStorage.setItem(getScopedKey(STORAGE_KEYS.CLASSES, activeId), JSON.stringify(classes));
  },

  addClass: (cls: Omit<ClassRoom, 'id'>): ClassRoom => {
    const classes = storage.getClasses();
    const newClass: ClassRoom = {
      ...cls,
      id: 'class-' + Date.now()
    };
    classes.push(newClass);
    storage.saveClasses(classes);
    return newClass;
  },

  updateClass: (updated: ClassRoom) => {
    const classes = storage.getClasses().map(c => c.id === updated.id ? updated : c);
    storage.saveClasses(classes);
  },

  deleteClass: (id: string) => {
    const classes = storage.getClasses().filter(c => c.id !== id);
    storage.saveClasses(classes);
  },

  // Subjects
  getSubjects: (): Subject[] => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1') {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : initialSubjects;
    }
    const scoped = localStorage.getItem(getScopedKey(STORAGE_KEYS.SUBJECTS, activeId));
    return scoped ? JSON.parse(scoped) : [];
  },

  saveSubjects: (subjects: Subject[]) => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1') {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    }
    localStorage.setItem(getScopedKey(STORAGE_KEYS.SUBJECTS, activeId), JSON.stringify(subjects));
  },

  addSubject: (sub: Omit<Subject, 'id'>): Subject => {
    const subjects = storage.getSubjects();
    const newSubject: Subject = {
      ...sub,
      id: 'sub-' + Date.now(),
      ca1MaxMarks: sub.ca1MaxMarks || 10,
      ca2MaxMarks: sub.ca2MaxMarks || 10,
      assignmentMaxMarks: sub.assignmentMaxMarks || 10,
      examMaxMarks: sub.examMaxMarks || 70
    };
    subjects.push(newSubject);
    storage.saveSubjects(subjects);
    return newSubject;
  },

  updateSubject: (updated: Subject) => {
    const subjects = storage.getSubjects().map(s => s.id === updated.id ? updated : s);
    storage.saveSubjects(subjects);
  },

  deleteSubject: (id: string) => {
    const subjects = storage.getSubjects().filter(s => s.id !== id);
    storage.saveSubjects(subjects);
  },

  // Students
  getStudents: (): Student[] => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1') {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : initialStudents;
    }
    const scoped = localStorage.getItem(getScopedKey(STORAGE_KEYS.STUDENTS, activeId));
    return scoped ? JSON.parse(scoped) : [];
  },

  saveStudents: (students: Student[]) => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
    localStorage.setItem(getScopedKey(STORAGE_KEYS.STUDENTS, activeId), JSON.stringify(students));
  },

  addStudent: (std: Omit<Student, 'id'>): Student => {
    const students = storage.getStudents();
    const newStudent: Student = {
      ...std,
      id: 'std-' + Date.now()
    };
    students.push(newStudent);
    storage.saveStudents(students);
    return newStudent;
  },

  updateStudent: (updated: Student) => {
    const students = storage.getStudents().map(s => s.id === updated.id ? updated : s);
    storage.saveStudents(students);
  },

  deleteStudent: (id: string) => {
    const students = storage.getStudents().filter(s => s.id !== id);
    storage.saveStudents(students);
  },

  // Grades
  getGrades: (): GradeRecord[] => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1') {
      const data = localStorage.getItem(STORAGE_KEYS.GRADES);
      return data ? JSON.parse(data) : initialGrades;
    }
    const scoped = localStorage.getItem(getScopedKey(STORAGE_KEYS.GRADES, activeId));
    return scoped ? JSON.parse(scoped) : [];
  },

  saveGrades: (grades: GradeRecord[]) => {
    const activeId = storage.getActiveSchoolId();
    if (activeId === 'school-default-1') {
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    }
    localStorage.setItem(getScopedKey(STORAGE_KEYS.GRADES, activeId), JSON.stringify(grades));
  },

  saveBatchGrades: (newGrades: GradeRecord[]) => {
    let existing = storage.getGrades();
    newGrades.forEach(grade => {
      const idx = existing.findIndex(
        g => g.studentId === grade.studentId && g.subjectId === grade.subjectId && g.classId === grade.classId
      );
      if (idx >= 0) {
        existing[idx] = grade;
      } else {
        existing.push(grade);
      }
    });
    storage.saveGrades(existing);
  }
};
