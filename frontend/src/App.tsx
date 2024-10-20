import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import AuthProvider from './hooks/AuthProvider';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import FilterSelection from './pages/FilterSelection';

const theme = createTheme({
  primaryColor: 'indigo',
  primaryShade: 6,
  colors: {
    slate: [
      '#F7FAFC',
      '#EDF2F7',
      '#E2E8F0',
      '#CBD5E0',
      '#A0AEC0',
      '#718096',
      '#4A5568',
      '#2D3748',
      '#1A202C',
      '#171923',
    ],
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/select" element={<FilterSelection />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
