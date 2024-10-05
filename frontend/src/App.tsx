import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { RouterProvider } from 'react-router-dom';

import './App.css';
import router from './router';

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
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
