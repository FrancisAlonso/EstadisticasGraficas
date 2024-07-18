// src/utils/calculateStatistics.js

export const calculateGradeRanges = (grades) => {
    const ranges = { '1-1.9': 0, '2-2.9': 0, '3-3.9': 0, '4-4.9': 0, '5-5.9': 0, '6-7': 0 };
    grades.forEach(average => {
      if (average >= 1 && average < 2) {
        ranges['1-1.9'] += 1;
      } else if (average >= 2 && average < 3) {
        ranges['2-2.9'] += 1;
      } else if (average >= 3 && average < 4) {
        ranges['3-3.9'] += 1;
      } else if (average >= 4 && average < 5) {
        ranges['4-4.9'] += 1;
      } else if (average >= 5 && average < 6) {
        ranges['5-5.9'] += 1;
      } else if (average >= 6 && average <= 7) {
        ranges['6-7'] += 1;
      }
    });
    return ranges;
  };
  
  export const calculatePassFail = (grades) => {
    let pass = 0, fail = 0;
    grades.forEach(average => {
      if (average > 3.9) {
        pass += 1;
      } else {
        fail += 1;
      }
    });
    return { pass, fail };
  };
  
  export const calculateOverallStatistics = (students, subjects) => {
    const allGrades = students.flatMap(student => Object.values(student.grades).flat());
    const average = (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2);
  
    const passedStudents = students.filter(student => {
      const averages = subjects.map(subject => {
        const grades = student.grades[subject];
        return grades.reduce((a, b) => a + b, 0) / grades.length;
      });
      return averages.every(avg => avg > 3.9);
    }).length;
  
    const failedStudents = students.length - passedStudents;
  
    const studentAverages = students.map(student => {
      const totalGrades = subjects.flatMap(subject => student.grades[subject]);
      const avg = totalGrades.reduce((a, b) => a + b, 0) / totalGrades.length;
      return { name: student.name, average: avg.toFixed(2), gender: student.gender };
    });
  
    return { average, passedStudents, failedStudents, studentAverages };
  };
  