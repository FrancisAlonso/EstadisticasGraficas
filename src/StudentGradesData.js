// src/StudentGradesData.js

export async function initializeData() {
  const response = await fetch('/students.json');
  if (!response.ok) {
    throw new Error('Failed to fetch student data');
  }
  const data = await response.json();
  return data;
}
