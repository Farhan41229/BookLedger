import React from 'react';
import { createBrowserRouter } from 'react-router';
import Landing from '@/pages/Landing';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
]);

export default router;
