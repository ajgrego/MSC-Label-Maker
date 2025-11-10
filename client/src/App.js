import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Context
import { PrintQueueProvider } from './context/PrintQueueContext';

// Components
import Navbar from './components/Navbar';
import LabelHome from './pages/LabelHome';
import ShelfLabel from './pages/ShelfLabel';
import GenericBinLabel from './pages/GenericBinLabel';
import ShoeBinLabel from './pages/ShoeBinLabel';
import FullPageNotice from './pages/FullPageNotice';
import PrintQueue from './pages/PrintQueue';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#F052A1',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PrintQueueProvider>
        <Router>
          <Navbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<LabelHome />} />
              <Route path="/shelf" element={<ShelfLabel />} />
              <Route path="/bin" element={<GenericBinLabel />} />
              <Route path="/shoe" element={<ShoeBinLabel />} />
              <Route path="/notice" element={<FullPageNotice />} />
              <Route path="/print-queue" element={<PrintQueue />} />
            </Routes>
          </Container>
        </Router>
      </PrintQueueProvider>
    </ThemeProvider>
  );
}

export default App; 