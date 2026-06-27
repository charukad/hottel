import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import './theme-dark.css';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#2d5a3d',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
