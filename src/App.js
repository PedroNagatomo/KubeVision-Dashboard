import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { KubeProvider } from './context/KubeContext';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#326CE5',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <KubeProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </KubeProvider>
    </ThemeProvider>
  );
}

export default App;