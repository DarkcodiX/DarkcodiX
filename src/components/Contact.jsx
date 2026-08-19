import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-content > *',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.social-link',
        { scale: 0, rotation: 180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.social-links',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/DarkcodiX' },
    { name: 'LinkedIn', url: '#' },
    { name: 'Email', url: 'mailto:jayeshbutiya2008@gmail.com' },
    { name: 'Phone', url: 'tel:+918446233170' },
  ];

  return (
    <section ref={sectionRef} className="contact-section scroll-section">
      <div className="contact-container">
        <div className="contact-content">
          <h2 className="contact-title">Let's Create Something Amazing</h2>
          <p className="contact-subtitle">
            Based in Virar, Mumbai. Available for freelance projects, AI/ML collaborations, 
            and full-stack development opportunities.
          </p>

          <a href="mailto:jayeshbutiya2008@gmail.com" className="contact-email hoverable">
            jayeshbutiya2008@gmail.com
          </a>

          <div className="social-links">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="social-link hoverable"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="availability">
            <div className="status-indicator"></div>
            <span>Available for freelance work · 100% on-time delivery</span>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2026 Jayesh Butiya. Crafted with passion and code.</p>
      </footer>
    </section>
  );
};

export default Contact;
