// src/components/NavigationTabs.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';

const NavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs
        value={location.pathname}
        onChange={handleChange}
        centered
      >
        <Tab label="Notas del Alumno" value="/alumno" />
        <Tab label="Estadísticas Globales" value="/estadisticas" />
      </Tabs>
    </Box>
  );
};

export default NavigationTabs;
