import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import './styles/main.css';

function App() {
  useEffect(() => {
    // Clear any hash and scroll to top on initial load
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);

    // Enable smooth scrolling after initial render
    const enableSmooth = setTimeout(() => {
      document.documentElement.classList.add('smooth-scroll');
    }, 100);

    return () => clearTimeout(enableSmooth);
  }, []);

  return (
    <ThemeProvider>
      <div className="app">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Certifications />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
