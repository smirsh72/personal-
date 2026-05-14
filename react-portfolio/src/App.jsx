import { useEffect } from 'react';
import About from './sections/About';
import Experience from './sections/Experience';
import Products from './sections/Products';
import './styles/main.css';

function App() {
  useEffect(() => {
    const enableSmooth = setTimeout(() => {
      document.documentElement.classList.add('smooth-scroll');
    }, 100);

    return () => clearTimeout(enableSmooth);
  }, []);

  return (
    <main>
      <About />
      <Experience />
      <Products />
    </main>
  );
}

export default App;
