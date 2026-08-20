import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // Master ScrollTrigger timeline pinned during About section scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          anticipatePin: 1,
          onEnter: () => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          },
        },
      });

      // 1. Initial entrance (0.0 to 0.15): Title appears cleanly, video remains 100% constant and visible
      tl.fromTo(
        '.about-title',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        0
      );

      // 2. Paragraph 1 reveal (0.20 to 0.40)
      tl.fromTo(
        '.about-text.p1',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        0.2
      );

      // 3. Paragraph 2 reveal (0.45 to 0.65)
      tl.fromTo(
        '.about-text.p2',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        0.45
      );

      // 4. Paragraph 3 reveal (0.70 to 0.88)
      tl.fromTo(
        '.about-text.p3',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' },
        0.7
      );

      // 5. Skills section reveal (0.85 to 0.95)
      tl.fromTo(
        '.skills-section',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
        0.85
      );

      // 6. Skill items stagger (0.88 to 0.98)
      tl.fromTo(
        '.skill-item',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, stagger: 0.01, duration: 0.1, ease: 'back.out(1.5)' },
        0.88
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
        <div className="about-hero-grid">
          {/* Left Column: Heading + Paragraphs */}
          <div className="about-left-col">
            <h2 className="about-title">About Me</h2>
            <div className="about-text-wrapper">
              <p className="about-text p1">
                An innovative and results-driven Full Stack, Mobile App, and AI Systems Developer 
                with a proven track record of delivering rapid prototypes and production-ready applications.
              </p>
              <p className="about-text p2">
                Experienced in architecting complex AI pipelines, web platforms, and mobile applications. 
                Currently pursuing an internship at Pravaron Technology & Agentic, focused on developing 
                advanced AI solutions and intelligent agents.
              </p>
              <p className="about-text p3">
                As a freelance developer since Feb 2023, I've delivered scalable, high-performance solutions 
                for diverse clients including e-commerce platforms, media applications, and interactive dashboards, 
                maintaining a 100% on-time delivery rate.
              </p>
            </div>
          </div>

          {/* Right Column: Character Coding Video Animation */}
          <div className="about-right-col">
            <div className="about-video-wrapper">
              <video
                ref={videoRef}
                src="/About_aniamtion2.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{ backgroundColor: '#f8f9fb' }}
                aria-label="Character typing and coding animation"
                className="about-coding-video"
              />
              {/* Atmospheric Fog Effect Overlays (Heavy at Corners, Subtle at Center) */}
              <div className="video-fog-left" />
              <div className="video-fog-top-left" />
              <div className="video-fog-bottom-left" />
              <div className="video-fog-top" />
              <div className="video-fog-bottom" />
            </div>
          </div>
        </div>

        {/* Skills Section */}
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
