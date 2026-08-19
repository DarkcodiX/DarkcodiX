import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-card',
        { 
          opacity: 0, 
          y: 100,
          rotateX: -15
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [
    {
      title: 'NeoInfra AI',
      description: 'Advanced AI platform that interprets text prompts to automatically generate comprehensive 3D models and designs',
      tags: ['AI', 'Python', '3D Generation'],
      color: 'rgba(99, 102, 241, 0.2)'
    },
    {
      title: 'Ostra AI (IDE)',
      description: 'Intelligent Integrated Development Environment accessible via web and desktop with AI-powered code generation',
      tags: ['React', 'Electron', 'AI Tools'],
      color: 'rgba(168, 85, 247, 0.2)'
    },
    {
      title: 'Aurora Robotics',
      description: 'Software brain and hardware layout for Aurora robot using Raspberry Pi 4 with localized voice assistant',
      tags: ['Raspberry Pi', 'Python', 'Speech AI'],
      color: 'rgba(59, 130, 246, 0.2)'
    },
    {
      title: 'MetaZik',
      description: 'Modern full-stack music streaming and discovery ecosystem with seamless cross-platform media playback',
      tags: ['React Native', 'Node.js', 'MongoDB'],
      color: 'rgba(236, 72, 153, 0.2)'
    },
    {
      title: 'Glamecore & Ratnashaila',
      description: 'Elegant, high-performance e-commerce storefronts for premium jewelry retail with secure transactions',
      tags: ['Next.js', 'Tailwind', 'E-Commerce'],
      color: 'rgba(34, 197, 94, 0.2)'
    },
    {
      title: 'Second-Hand Laptop Platform',
      description: 'Custom digital e-commerce storefront optimized for inventory showcasing and seamless checkout',
      tags: ['React', 'Express.js', 'MongoDB'],
      color: 'rgba(249, 115, 22, 0.2)'
    },
  ];

  return (
    <section ref={sectionRef} className="projects-section scroll-section">
      <div className="projects-container">
        <h2 className="projects-title">Featured Projects</h2>
        <p className="projects-subtitle">
          A collection of my recent work and experiments
        </p>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card hoverable"
              style={{ '--card-color': project.color }}
            >
              <div className="project-number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="project-tag">{tag}</span>
                ))}
              </div>
              <div className="project-link">
                View Project →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
