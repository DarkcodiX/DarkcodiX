import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Navigation.css';

gsap.registerPlugin(ScrollTrigger);

const Navigation = ({ startAnimation = false }) => {
  const navRef = useRef(null);
  const navRightRef = useRef(null);

  // Set initial hidden state on mount
  useEffect(() => {
    if (navRef.current) {
      gsap.set(navRef.current, { y: -30, opacity: 0 });
    }
  }, []);

  // Animate down when startAnimation signal is received
  useEffect(() => {
    if (startAnimation && navRef.current) {
      console.log('✨ Navigation reveal starting');
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.1,
        }
      );
    }
  }, [startAnimation]);

  // Hide CTA button when About section scrolls into view
  useEffect(() => {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection || !navRightRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(navRightRef.current, {
        y: -40,
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="navigation-simple">
      <div className="nav-simple-container">
        {/* Left: Your Name/Logo */}
        <div className="nav-left">
          <span className="nav-logo-text">Darkcodix</span>
        </div>

        {/* Right: CTA */}
        <div ref={navRightRef} className="nav-right">
          <a href="#contact" className="nav-cta-link hoverable">
            <svg className="speaker-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Let's Talk
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

