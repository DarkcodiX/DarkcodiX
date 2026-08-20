import { useEffect, useRef, useState } from 'react';
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
import SplashScreen from './components/SplashScreen';
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
  const [showSplash, setShowSplash] = useState(true);
  const [startContentAnimation, setStartContentAnimation] = useState(false);

  const handleSplashComplete = () => {
    console.log('🎯 Splash complete! Starting content animation...');
    setShowSplash(false);
    setStartContentAnimation(true); // Trigger character animation!

    setTimeout(() => {
      smootherRef.current = ScrollSmoother.create({
        smooth: 1.5,
        effects: true,
        smoothTouch: 0.1,
        normalizeScroll: true,
        ignoreMobileResize: true,
      });
      ScrollTrigger.refresh();
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="app">
      {/* Landing page - loaded in background from start */}
      <div className={`landing-content ${startContentAnimation ? 'visible' : 'behind-splash'}`}>
        <CustomCursor />
        <Navigation startAnimation={startContentAnimation} />

        <div id="smooth-wrapper">
          <div id="smooth-content">
            <CharacterReveal startAnimation={startContentAnimation} />
            <About />
            <Projects />
            <Contact />
          </div>
        </div>
      </div>

      {/* Splash overlay on TOP */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
    </div>
  );
}

export default App;
