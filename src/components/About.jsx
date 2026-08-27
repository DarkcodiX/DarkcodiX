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

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const shouldPin =
        !reduceMotion &&
        !window.matchMedia('(pointer: coarse)').matches &&
        navigator.hardwareConcurrency > 4;

      if (!shouldPin) {
        const revealItems = [
          '.about-kicker',
          '.about-title',
          '.about-intro',
          '.about-stats',
          '.about-text',
          '.skills-title',
          '.skill-item',
        ];

        gsap.fromTo(
          revealItems,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.025,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              once: true,
            },
          }
        );

        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=165%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          fastScrollEnd: true,
        },
      });

      tl.fromTo(
        '.about-kicker, .about-title',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.03, ease: 'none' },
        0
      )
        .fromTo(
          '.about-intro',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.2, ease: 'none' },
          0.14
        )
        .fromTo(
          '.about-stats',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.2, ease: 'none' },
          0.28
        )
        .fromTo(
          '.about-text',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.045, ease: 'none' },
          0.42
        )
        .fromTo(
          '.skills-section',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.2, ease: 'none' },
          0.72
        )
        .fromTo(
          '.skill-item',
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.012, ease: 'none' },
          0.8
        );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const playLoopingVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
  };

  const skills = [
    'React', 'Next.js', 'React Native', 'Node / Express',
    'TypeScript', 'Python', 'MongoDB', 'Firebase',
    'SQL', 'LLM Integration', 'Machine Learning', 'Figma'
  ];

  return (
    <section ref={sectionRef} className="about-section scroll-section">
      <div className="about-container">
        <div className="about-hero-grid">
          {/* Left Column: Heading + Paragraphs */}
          <div className="about-left-col">
            <div className="about-kicker">02 / profile</div>
            <h2 className="about-title">About me</h2>
            <p className="about-intro">
              I build fast product prototypes that connect polished interfaces, AI systems, and production-ready backends.
            </p>
            <div className="about-stats" aria-label="Professional highlights">
              <div className="about-stat">
                <span className="about-stat-value">2023</span>
                <span className="about-stat-label">freelance start</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">100%</span>
                <span className="about-stat-label">on-time delivery</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">AI</span>
                <span className="about-stat-label">systems focus</span>
              </div>
            </div>
            <div className="about-text-wrapper">
              <p className="about-text p1">
                Full Stack, Mobile App, and AI Systems Developer focused on rapid prototypes 
                that can mature into production-ready applications.
              </p>
              <p className="about-text p2">
                Experienced in AI pipelines, web platforms, and mobile apps. Currently pursuing 
                an internship at Pravaron Technology & Agentic, building advanced AI solutions and agents.
              </p>
              <p className="about-text p3">
                Since Feb 2023, I have delivered e-commerce storefronts, media apps, and interactive dashboards 
                for freelance clients while maintaining a 100% on-time delivery rate.
              </p>
            </div>

            <div className="skills-section">
              <h3 className="skills-title">Skills & technologies</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item hoverable">
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
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
                aria-label="Character typing and coding animation"
                className="about-coding-video"
                onLoadedData={playLoopingVideo}
                onCanPlay={playLoopingVideo}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
