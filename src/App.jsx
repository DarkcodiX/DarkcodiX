import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import CharacterReveal from './components/CharacterReveal';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import CloudTest from './components/CloudTest';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<CloudTest />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const smootherRef = useRef(null);

  useEffect(() => {
    // Loading animation
    gsap.to('.loading-screen', {
      opacity: 0,
      duration: 1,
      delay: 0.5,
      onComplete: () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
      },
    });

    // Initialize ScrollSmoother after loading
    setTimeout(() => {
      smootherRef.current = ScrollSmoother.create({
        smooth: 1.5,              // Smoothness (higher = smoother but more lag)
        effects: true,            // Enable data-speed effects
        smoothTouch: 0.1,         // Smooth on mobile (0.1 = subtle)
        normalizeScroll: true,    // Prevent address bar hide/show issues
        ignoreMobileResize: true, // Better mobile performance
      });

      // Refresh ScrollTrigger after smoother is ready
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="app">
      <div className="loading-screen">
        <div className="loader">
          <div className="loader-ring"></div>
          <div className="loader-text">Loading...</div>
        </div>
      </div>

      <CustomCursor />
      <Navigation />

      {/* ScrollSmoother wrapper - REQUIRED */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <CharacterReveal />
          <About />
          <Projects />
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default App;
