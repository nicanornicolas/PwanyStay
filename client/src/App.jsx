import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // See below for Footer code
import BrowseStays from './pages/BrowseStays';
import HowItWorks from './pages/HowItWorks';
import ListProperty from './pages/ListProperty';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Navigation is persistent across all pages */}
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<BrowseStays />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/list-property" element={<ListProperty />} />
          </Routes>
        </main>

        {/* Footer is persistent across all pages */}
        <Footer />
      </div>
    </Router>
  );
}