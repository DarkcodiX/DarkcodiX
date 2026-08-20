import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLBackground from './WebGLBackground';
import './CharacterReveal.css';

gsap.registerPlugin(ScrollTrigger);

const CharacterReveal = ({ startAnimation = false }) => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;

    // Pin the hero section
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
      scrub: true,
      anticipatePin: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Staggered reveal when animation starts
  useEffect(() => {
    if (startAnimation) {
      // Header fade from top
      gsap.fromTo('nav', 
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 }
      );

      // Text staggered reveal ONLY (character already visible!)
      if (textRef.current) {
        const textElements = textRef.current.querySelectorAll('h1, p, .hero-actions');
        gsap.fromTo(textElements, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3, stagger: 0.15 }
        );
      }

      // Cursor fade
      gsap.fromTo('.custom-cursor, .custom-cursor-follower', 
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.2 }
      );
    }
  }, [startAnimation]);

  return (
    <div ref={sectionRef} className="character-reveal-section hero-panel">
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
