import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
import router from './routes/Router';
import useAuthStore from '@/store/authStore';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
