import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

export default function App() {
  return (
    <div>
      <Navbar /> {/* Renders once globally */}
      
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
