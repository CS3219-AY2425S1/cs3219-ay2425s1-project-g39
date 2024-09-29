import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Loading from './pages/Loading';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  }
]);

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
      <Suspense fallback={<Loading/>}>
        <RouterProvider router={router} />
      </Suspense>
    </MantineProvider>
  );
}

export default App;
