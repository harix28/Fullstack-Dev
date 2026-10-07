import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmoothScrollProvider from './components/animations/SmoothScrollProvider';
import Navbar from './components/navigation/Navbar';
import Hero from './components/sections/Hero';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
    </div>
  );
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Router>
    </SmoothScrollProvider>
  );
}
