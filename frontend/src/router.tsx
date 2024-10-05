import { createBrowserRouter } from 'react-router-dom';

import Admin from './pages/Admin';

// import Landing from './pages/Landing';

const router = createBrowserRouter([
  //   {
  //     path: '/',
  //     element: <Landing />,
  //   },
  //   {
  //     path: '/pages/',
  //     element: <Admin />,
  //   },
  {
    path: '/',
    element: <Admin />,
  },
]);

export default router;
