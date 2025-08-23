import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import POSInterface from './components/POSInterface'; // Your main POS component
import POSSystem from './components/POSSystem';

function App() {
  const token = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/pos" 
          element={token ? <POSSystem /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={token ? "/pos" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;