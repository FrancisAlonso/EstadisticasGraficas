// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentGradesChart from './components/StudentGradesChart';
import GlobalStatistics from './components/GlobalStatistics';
import NavigationTabs from './components/NavigationTabs';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
        <NavigationTabs />
        <Routes>
          <Route path="/alumno" element={<StudentGradesChart />} />
          <Route path="/estadisticas" element={<GlobalStatistics />} />
          <Route path="/" element={<StudentGradesChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
