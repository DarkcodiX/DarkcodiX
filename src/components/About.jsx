import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in from bottom as it comes into view
      gsap.fromTo(
        '.about-title',
        { 
          x: -100, 
          opacity: 0 
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: '.about-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.about-text',
        { 
          x: 100, 
          opacity: 0 
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.about-text',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.skill-item',
        { 
          scale: 0, 
          rotation: 180 
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const skills = [
    // Web & Mobile
    'React', 'Next.js', 'React Native', 'Expo Go',
    'Node.js', 'Express.js', 'Tailwind CSS',
    // Languages
    'TypeScript', 'JavaScript', 'Python', 'C/C++',
    // Databases & APIs
    'MongoDB', 'Firebase', 'SQL', 'REST APIs',
    // AI & ML
    'LLM Integration', 'Machine Learning', 'Speech AI',
    // Tools
    'Git', 'GitHub', 'Vercel', 'Figma'
  ];

  return (
    <section ref={sectionRef} className="about-section scroll-section">
      <div className="about-container">
        <div className="about-content">
          <h2 className="about-title">About Me</h2>
          <div className="about-text-wrapper">
            <p className="about-text">
              An innovative and results-driven Full Stack, Mobile App, and AI Systems Developer 
              with a proven track record of delivering rapid prototypes and production-ready applications.
            </p>
            <p className="about-text">
              Experienced in architecting complex AI pipelines, web platforms, and mobile applications. 
              Currently pursuing an internship at Pravaron Technology & Agentic, focused on developing 
              advanced AI solutions and intelligent agents.
            </p>
            <p className="about-text">
              As a freelance developer since Feb 2023, I've delivered scalable, high-performance solutions 
              for diverse clients including e-commerce platforms, media applications, and interactive dashboards, 
              maintaining a 100% on-time delivery rate.
            </p>
          </div>
        </div>

        <div className="skills-section">
          <h3 className="skills-title">Skills & Technologies</h3>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item hoverable">
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
