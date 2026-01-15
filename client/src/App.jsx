import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // See below for Footer code
import BrowseStays from './pages/BrowseStays';
import HowItWorks from './pages/HowItWorks';
import ListProperty from './pages/ListProperty';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ManageListings from './components/ManageListings';
import ManageUsers from './components/ManageUsers';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ProtectedUserRoute from './components/ProtectedUserRoute';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { UserAuthProvider } from './contexts/UserAuthContext';

export default function App() {
  return (
    <AdminAuthProvider>
      <UserAuthProvider>
        <Router>
          <div className="min-h-screen bg-white flex flex-col">
            {/* Navigation is persistent across all pages */}
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<BrowseStays />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/list-property" element={<ProtectedUserRoute><ListProperty /></ProtectedUserRoute>} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/profile" element={<ProtectedUserRoute><Profile /></ProtectedUserRoute>} />
                <Route path="/dashboard" element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>}>
                  <Route path="listings" element={<ManageListings />} />
                  <Route path="users" element={<ManageUsers />} />
                </Route>
              </Routes>
            </main>

            {/* Footer is persistent across all pages */}
            <Footer />
          </div>
        </Router>
      </UserAuthProvider>
    </AdminAuthProvider>
  );
}