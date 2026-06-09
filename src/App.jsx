import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinAsPartner from './Components/JoinAsPartner';
import AdminPanel from './Components/AdminPanel';
import AdminLogin from './Components/AdminLogin';
import AdminSignup from './Components/AdminSignup';
import ThankYou from './Components/ThankYou';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinAsPartner />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* <Route path="/admin-signup" element={<AdminSignup />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
