import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLBackground from './WebGLBackground';
import './CharacterReveal.css';

gsap.registerPlugin(ScrollTrigger);

const CharacterReveal = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;

    // Initial fade-in animation
    gsap.fromTo(
      image,
      { opacity: 0, scale: 0.95 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1.5, 
        ease: 'power3.out',
        delay: 0.3
      }
    );

    // Pin the hero section - next section will overlap it
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=100%', // Amount of overscroll needed
      pin: true,
      pinSpacing: false, // FALSE = next section overlaps
      scrub: true,
      anticipatePin: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="character-reveal-section hero-panel">
      {/* WebGL Background Animation */}
      <WebGLBackground />
      
      {/* Hero Text Content */}
      <div className="hero-content">
        <div className="hero-text-wrapper">
          <h1 className="hero-title">JAYESH BUTIYA</h1>
          <p className="hero-subtitle">Full Stack Developer & AI/ML Enthusiast</p>
          <p className="hero-description">
            Building intelligent digital solutions with modern web technologies and machine learning
          </p>
        </div>
      </div>
      
      <div className="character-container">
        {/* Character image - stays fixed, no animation */}
        <img
          ref={imageRef}
          src="/character.jpeg"
          alt="Character"
          className="character-base-image"
          loading="eager"
        />
      </div>

      {/* Bottom Right Element */}
      <div className="bottom-right-element">
        <div className="tagline-badge">
          <span className="tagline-text">Based in India · Open to Work</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterReveal;
