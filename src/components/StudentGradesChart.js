import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box, Typography, Container, List, ListItem, ListItemText, Grid, Paper, Select, MenuItem } from '@mui/material';

const StudentGradesChart = () => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Matemáticas');
  const [chartData, setChartData] = useState({});
  const [averageGrades, setAverageGrades] = useState({});
  const [overallAverage, setOverallAverage] = useState(0);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetch(`${process.env.PUBLIC_URL}/students.json`)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setStudents(data);
          if (data.length > 0) {
            setSelectedStudentId(data[0].id); // Selecciona el primer estudiante por defecto
          }
        }
      })
      .catch(error => console.error('Error fetching student data:', error));
    
    return () => {
      isMounted = false;
    };
  }, []);

  const calculateGrades = useCallback(() => {
    if (!students.length) return;

    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    const grades = student.grades[selectedSubject] || [];
    const average = grades.length ? (grades.reduce((acc, curr) => acc + curr, 0) / grades.length).toFixed(2) : 0;

    const allGrades = Object.values(student.grades).flat();
    const overallAvg = allGrades.length ? (allGrades.reduce((acc, curr) => acc + curr, 0) / allGrades.length).toFixed(2) : 0;

    const subjectAverages = Object.keys(student.grades).reduce((acc, subject) => {
      const subjectGrades = student.grades[subject] || [];
      const subjectAvg = subjectGrades.length ? (subjectGrades.reduce((acc, curr) => acc + curr, 0) / subjectGrades.length).toFixed(2) : 0;
      acc[subject] = subjectAvg;
      return acc;
    }, {});

    setChartData({
      labels: grades.map((_, index) => `Nota ${index + 1}`),
      datasets: [
        {
          label: `Notas de ${selectedSubject}`,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
          hoverBorderColor: 'rgba(75, 192, 192, 1)',
          data: grades,
        },
      ],
    });

    setAverageGrades(subjectAverages);
    setOverallAverage(overallAvg);
  }, [selectedStudentId, selectedSubject, students]);

  useEffect(() => {
    calculateGrades();
  }, [calculateGrades, students]);

  return (
    <Container maxWidth="md" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box my={4} width="100%">
        <Typography variant="h5" gutterBottom>
          Notas del Alumno
        </Typography>
        <Select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Selecciona un Alumno' }}
        >
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Selecciona una Asignatura' }}
          style={{ marginLeft: '10px' }}
        >
          {['Matemáticas', 'Lenguaje', 'Inglés'].map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Listado de Notas</Typography>
              <List>
                {chartData.labels ? (
                  chartData.labels.map((label, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${label}: ${chartData.datasets[0].data[index]}`} />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No hay notas disponibles</Typography>
                )}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Promedio General</Typography>
              <List>
                {Object.keys(averageGrades).map((subject, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${subject}: ${averageGrades[subject]}`} />
                  </ListItem>
                ))}
                <ListItem>
                  <ListItemText primary={`Promedio General: ${overallAverage}`} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <div style={{ height: '300px', width: '100%' }}>
                {chartData.labels ? (
                  <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                ) : (
                  <Typography>No hay datos disponibles</Typography>
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentGradesChart;
