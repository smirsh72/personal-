import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import About from './components/About';
import Experience from './components/Experience';
import Products from './components/Projects';
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
        <main>
          <About />
          <Experience />
          <Products />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
