// src/StudentGradesData.js
export const initializeData = async () => {
  const response = await fetch(`${process.env.PUBLIC_URL}/students.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch student data');
  }
  return await response.json();
};
