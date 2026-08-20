import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLBackground from './WebGLBackground';
import Character3D from './Character3D';
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

  // Set initial hidden state on mount
  useEffect(() => {
    if (textRef.current) {
      const textElements = textRef.current.querySelectorAll('h1, p');
      gsap.set(textElements, { opacity: 0, y: 30 });
    }
    gsap.set('.bottom-right-element', { opacity: 0, y: 20 });
  }, []);

  // Staggered reveal when startAnimation signal is received
  useEffect(() => {
    if (startAnimation && sectionRef.current) {
      console.log('✨ CharacterReveal staged reveal starting');
      
      // 1. Text elements staggered reveal
      const textElements = sectionRef.current.querySelectorAll('.hero-title, .hero-subtitle, .hero-description');
      gsap.fromTo(
        textElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.1,
          stagger: 0.15,
        }
      );

      // 2. Tagline badge reveal
      gsap.fromTo(
        '.bottom-right-element',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.4,
        }
      );

      // 3. Custom cursor reveal
      gsap.fromTo(
        '.custom-cursor-ring, .custom-cursor-dot',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.3 }
      );
    }
  }, [startAnimation]);

  // Interactive 3D mouse tilt & parallax follow using gsap.quickTo & gsap.utils.interpolate
  useEffect(() => {
    const characterImage = imageRef.current;
    const container = sectionRef.current;
    if (!characterImage || !container) return;

    // Create lightweight quickTo animation setters
    const xTo = gsap.quickTo(characterImage, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(characterImage, 'y', { duration: 0.6, ease: 'power3.out' });
    const rotateXTo = gsap.quickTo(characterImage, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const rotateYTo = gsap.quickTo(characterImage, 'rotationY', { duration: 0.6, ease: 'power3.out' });

    // GSAP interpolation helpers mapping normalized cursor position (0 to 1) to tilt ranges
    const interpolateX = gsap.utils.interpolate(-20, 20);
    const interpolateY = gsap.utils.interpolate(-12, 12);
    const interpolateRotateX = gsap.utils.interpolate(8, -8);
    const interpolateRotateY = gsap.utils.interpolate(-10, 10);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      const targetX = interpolateX(normX);
      const targetY = interpolateY(normY);
      const targetRotX = interpolateRotateX(normY);
      const targetRotY = interpolateRotateY(normX);

      xTo(targetX);
      yTo(targetY);
      rotateXTo(targetRotX);
      rotateYTo(targetRotY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      rotateXTo(0);
      rotateYTo(0);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={sectionRef} className="character-reveal-section hero-panel">
      <WebGLBackground />
      
      {/* Hero Text Content */}
      <div className="hero-content">
        <div ref={textRef} className="hero-text-wrapper">
          <h1 className="hero-title">JAYESH BUTIYA</h1>
          <p className="hero-subtitle">Full Stack Developer & AI/ML Enthusiast</p>
          <p className="hero-description">
            Building intelligent digital solutions with modern web technologies and machine learning
          </p>
        </div>
      </div>
      
      <div className="character-container">
        {/* Interactive 3D WebGL Character Model */}
        <Character3D />
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
