import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Container, Box, Grid, Paper, Typography, Tabs, Tab, List, ListItem, ListItemText } from '@mui/material';
import { initializeData } from '../StudentGradesData';
import { getBarChartConfig, getPieChartConfig } from '../utils/chartConfigs';
import { calculateGradeRanges, calculatePassFail, calculateOverallStatistics } from '../utils/calculateStatistics';

const GlobalStatistics = () => {
  const [students, setStudents] = useState([]);
  const [globalCharts, setGlobalCharts] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [bestStudentsBySubject, setBestStudentsBySubject] = useState([]);
  const [genderStats, setGenderStats] = useState({ male: [], female: [] });
  const [tabIndex, setTabIndex] = useState(0);
  const [topLowestGrades, setTopLowestGrades] = useState({ math: [], language: [], english: [] });
  const [topHighestGrades, setTopHighestGrades] = useState({ math: [], language: [], english: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await initializeData();
        setStudents(data);
        calculateGlobalStatistics(data);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      }
    }
    fetchData();
  }, []);

  const calculateGlobalStatistics = (students) => {
    if (!students.length) return;

    const subjects = ['Matemáticas', 'Lenguaje', 'Inglés'];
    const { average, passedStudents, failedStudents, studentAverages } = calculateOverallStatistics(students, subjects);

    const topFiveStudents = studentAverages.sort((a, b) => b.average - a.average).slice(0, 5);
    setTopStudents(topFiveStudents);

    const bestStudents = subjects.map(subject => {
      let bestStudent = null;
      let bestAverage = 0;
      students.forEach(student => {
        const grades = student.grades[subject];
        const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
        if (avg > bestAverage) {
          bestAverage = avg;
          bestStudent = student.name;
        }
      });
      return { subject, name: bestStudent, average: bestAverage.toFixed(2) };
    });
    setBestStudentsBySubject(bestStudents);

    const maleGrades = subjects.map(subject => ({
      subject,
      average: (
        students
          .filter(student => student.gender === 'M')
          .flatMap(student => student.grades[subject])
          .reduce((a, b) => a + b, 0) /
        (students.filter(student => student.gender === 'M').length * 5)
      ).toFixed(2),
    }));

    const femaleGrades = subjects.map(subject => ({
      subject,
      average: (
        students
          .filter(student => student.gender === 'F')
          .flatMap(student => student.grades[subject])
          .reduce((a, b) => a + b, 0) /
        (students.filter(student => student.gender === 'F').length * 5)
      ).toFixed(2),
    }));

    setGenderStats({ male: maleGrades, female: femaleGrades });

    const maleOverallAverage = (
      students
        .filter(student => student.gender === 'M')
        .flatMap(student => Object.values(student.grades).flat())
        .reduce((a, b) => a + b, 0) /
      (students.filter(student => student.gender === 'M').length * subjects.length * 5)
    ).toFixed(2);

    const femaleOverallAverage = (
      students
        .filter(student => student.gender === 'F')
        .flatMap(student => Object.values(student.grades).flat())
        .reduce((a, b) => a + b, 0) /
      (students.filter(student => student.gender === 'F').length * subjects.length * 5)
    ).toFixed(2);

    const mathGrades = students.map(student => student.grades['Matemáticas'].reduce((a, b) => a + b, 0) / student.grades['Matemáticas'].length);
    const languageGrades = students.map(student => student.grades['Lenguaje'].reduce((a, b) => a + b, 0) / student.grades['Lenguaje'].length);
    const englishGrades = students.map(student => student.grades['Inglés'].reduce((a, b) => a + b, 0) / student.grades['Inglés'].length);

    const mathRanges = calculateGradeRanges(mathGrades);
    const languageRanges = calculateGradeRanges(languageGrades);
    const englishRanges = calculateGradeRanges(englishGrades);

    const mathPassFail = calculatePassFail(mathGrades);
    const languagePassFail = calculatePassFail(languageGrades);
    const englishPassFail = calculatePassFail(englishGrades);

    // Top 3 lowest and highest grades per subject
    const getTopGrades = (students, subject, topN, isHighest = true) => {
      const grades = students.flatMap(student => student.grades[subject]);
      const sortedGrades = grades.sort((a, b) => isHighest ? b - a : a - b);
      return sortedGrades.slice(0, topN);
    };

    setTopLowestGrades({
      math: getTopGrades(students, 'Matemáticas', 3, false),
      language: getTopGrades(students, 'Lenguaje', 3, false),
      english: getTopGrades(students, 'Inglés', 3, false)
    });

    setTopHighestGrades({
      math: getTopGrades(students, 'Matemáticas', 3, true),
      language: getTopGrades(students, 'Lenguaje', 3, true),
      english: getTopGrades(students, 'Inglés', 3, true)
    });

    setGlobalCharts([
      getBarChartConfig(['Promedio General'], [average], 'Promedio General de Todas las Notas'),
      getPieChartConfig(['Aprobados', 'Desaprobados'], [passedStudents, failedStudents], 'Distribución de Aprobados y Desaprobados'),
      getBarChartConfig(['Matemáticas', 'Lenguaje', 'Inglés'], maleGrades.map(g => g.average), 'Promedios por Asignatura y Género', 7),
      getBarChartConfig(['Hombres', 'Mujeres'], [maleOverallAverage, femaleOverallAverage], 'Promedio General por Género', 7),
      getPieChartConfig(['1-1.9', '2-2.9', '3-3.9', '4-4.9', '5-5.9', '6-7'], [mathRanges['1-1.9'], mathRanges['2-2.9'], mathRanges['3-3.9'], mathRanges['4-4.9'], mathRanges['5-5.9'], mathRanges['6-7']], 'Distribución de Notas de Matemáticas'),
      getPieChartConfig(['1-1.9', '2-2.9', '3-3.9', '4-4.9', '5-5.9', '6-7'], [languageRanges['1-1.9'], languageRanges['2-2.9'], languageRanges['3-3.9'], languageRanges['4-4.9'], languageRanges['5-5.9'], languageRanges['6-7']], 'Distribución de Notas de Lenguaje'),
      getPieChartConfig(['1-1.9', '2-2.9', '3-3.9', '4-4.9', '5-5.9', '6-7'], [englishRanges['1-1.9'], englishRanges['2-2.9'], englishRanges['3-3.9'], englishRanges['4-4.9'], englishRanges['5-5.9'], englishRanges['6-7']], 'Distribución de Notas de Inglés'),
      getPieChartConfig(['Aprobados', 'Desaprobados'], [mathPassFail.pass, mathPassFail.fail], 'Aprobados y Desaprobados en Matemáticas'),
      getPieChartConfig(['Aprobados', 'Desaprobados'], [languagePassFail.pass, languagePassFail.fail], 'Aprobados y Desaprobados en Lenguaje'),
      getPieChartConfig(['Aprobados', 'Desaprobados'], [englishPassFail.pass, englishPassFail.fail], 'Aprobados y Desaprobados en Inglés')
    ]);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const renderCharts = (category) => {
    return globalCharts
      .filter(chart => chart.options.plugins.title.text.includes(category))
      .map((chart, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <div style={{ height: '300px', width: '100%' }}>
              {chart.type === 'bar' && <Bar data={chart.data} options={chart.options} />}
              {chart.type === 'pie' && <Pie data={chart.data} options={{ ...chart.options, maintainAspectRatio: false }} />}
            </div>
          </Paper>
        </Grid>
      ));
  };

  return (
    <Container maxWidth="md" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box my={4} width="100%">
        <Typography variant="h5" gutterBottom>Estadísticas Globales</Typography>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
          <Tab label="Estadísticas Generales" />
          <Tab label="Estadísticas por Género" />
          <Tab label="Distribución Notas por Asignatura" />
          <Tab label="Distribución Aprobados por Asignatura" />
          <Tab label="Ranking" />
          <Tab label="Ranking Evaluaciones" />
        </Tabs>
        <Box mt={3}>
          <Grid container spacing={2}>
            {tabIndex === 0 && renderCharts('General')}
            {tabIndex === 1 && renderCharts('Género')}
            {tabIndex === 2 && renderCharts('Distribución de Notas')}
            {tabIndex === 3 && renderCharts('Aprobados y Desaprobados')}
            {tabIndex === 4 && (
              <>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Top 5 Alumnos por Promedio General</Typography>
                    <List>
                      {topStudents.map((student, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`${student.name}: ${student.average}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Mejores Alumnos por Asignatura</Typography>
                    <List>
                      {bestStudentsBySubject.map((student, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`${student.subject}: ${student.name} (${student.average})`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </>
            )}
            {tabIndex === 5 && (
              <>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Top 3 Peores Notas en Matemáticas</Typography>
                    <List>
                      {topLowestGrades.math.map((grade, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`Nota ${index + 1}: ${grade}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Top 3 Mejores Notas en Matemáticas</Typography>
                    <List>
                      {topHighestGrades.math.map((grade, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`Nota ${index + 1}: ${grade}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Top 3 Peores Notas en Lenguaje</Typography>
                    <List>
                      {topLowestGrades.language.map((grade, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`Nota ${index + 1}: ${grade}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Top 3 Mejores Notas en Lenguaje</Typography>
                    <List>
                      {topHighestGrades.language.map((grade, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`Nota ${index + 1}: ${grade}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Top 3 Peores Notas en Inglés</Typography>
                    <List>
                      {topLowestGrades.english.map((grade, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`Nota ${index + 1}: ${grade}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Top 3 Mejores Notas en Inglés</Typography>
                    <List>
                      {topHighestGrades.english.map((grade, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`Nota ${index + 1}: ${grade}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default GlobalStatistics;
