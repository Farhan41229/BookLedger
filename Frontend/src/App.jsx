import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { Button } from '@/components/ui/button';
function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
