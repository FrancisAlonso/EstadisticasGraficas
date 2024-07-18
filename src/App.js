import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentGradesChart from './components/StudentGradesChart';
import GlobalStatistics from './components/GlobalStatistics';
import NavigationTabs from './components/NavigationTabs';

function App() {
  return (
    <Router>
      <NavigationTabs />
      <Routes>
        <Route path="/" element={<StudentGradesChart />} />
        <Route path="/alumno" element={<StudentGradesChart />} />
        <Route path="/estadisticas" element={<GlobalStatistics />} />
      </Routes>
    </Router>
  );
}

export default App;
