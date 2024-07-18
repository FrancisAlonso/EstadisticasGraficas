const fs = require('fs');

const studentNames = [
  { name: "Juan", gender: "M" }, { name: "María", gender: "F" },
  { name: "Pedro", gender: "M" }, { name: "Ana", gender: "F" },
  { name: "Luis", gender: "M" }, { name: "Lucía", gender: "F" },
  { name: "Carlos", gender: "M" }, { name: "Marta", gender: "F" },
  { name: "Jorge", gender: "M" }, { name: "Sofía", gender: "F" },
  { name: "Raúl", gender: "M" }, { name: "Laura", gender: "F" },
  { name: "Fernando", gender: "M" }, { name: "Elena", gender: "F" },
  { name: "Andrés", gender: "M" }, { name: "Carmen", gender: "F" },
  { name: "Pablo", gender: "M" }, { name: "Sara", gender: "F" },
  { name: "Miguel", gender: "M" }, { name: "Isabel", gender: "F" }
];

function getRandomGrade(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function generateStudentData() {
  const students = [];

  studentNames.forEach((student, index) => {
    const grades = {
      Matemáticas: [],
      Lenguaje: [],
      Inglés: []
    };

    for (let i = 0; i < 5; i++) {
      if (student.gender === "F") {
        grades.Matemáticas.push(getRandomGrade(2, 6));
        grades.Lenguaje.push(getRandomGrade(5, 7));
        grades.Inglés.push(getRandomGrade(1, 7));
      } else {
        grades.Matemáticas.push(getRandomGrade(1, 5));
        grades.Lenguaje.push(getRandomGrade(4, 7));
        grades.Inglés.push(getRandomGrade(1, 7));
      }
    }

    students.push({
      id: index + 1,
      name: student.name,
      gender: student.gender,
      grades: grades
    });
  });

  return students;
}

const students = generateStudentData();
fs.writeFileSync('students.json', JSON.stringify(students, null, 2));
console.log('Student data generated and saved to students.json');
