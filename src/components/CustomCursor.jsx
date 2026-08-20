import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    document.body.classList.add('custom-cursor');

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    // Use gsap.quickTo for ultra-smooth performance without instance reallocation
    const xToRing = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
    const yToRing = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

    const xToDot = gsap.quickTo(cursorDot, 'x', { duration: 0.08, ease: 'power1.out' });
    const yToDot = gsap.quickTo(cursorDot, 'y', { duration: 0.08, ease: 'power1.out' });

    const moveCursor = (e) => {
      xToRing(e.clientX);
      yToRing(e.clientY);
      xToDot(e.clientX);
      yToDot(e.clientY);
    };

    const handleMouseDown = (e) => {
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.2,
      });

      // Create ripple effect
      const rippleId = Date.now();
      setRipples((prev) => [
        ...prev,
        { id: rippleId, x: e.clientX, y: e.clientY },
      ]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 1000);
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: isHovering ? 1.5 : 1,
        duration: 0.2,
      });
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Standard hover states
    const handleMouseEnter = () => {
      setIsHovering(true);
      gsap.to(cursor, {
        scale: 1.5,
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        border: '2px solid rgba(99, 102, 241, 0.8)',
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        duration: 0.3,
      });
    };

    // Character container hover effect - larger magnetic halo ring
    const handleCharMouseEnter = () => {
      setIsHovering(true);
      gsap.to(cursor, {
        scale: 2.2,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 0.9)',
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .hoverable');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    const charContainer = document.querySelector('.character-container');
    if (charContainer) {
      charContainer.addEventListener('mouseenter', handleCharMouseEnter);
      charContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });

      if (charContainer) {
        charContainer.removeEventListener('mouseenter', handleCharMouseEnter);
        charContainer.removeEventListener('mouseleave', handleMouseLeave);
      }

      document.body.classList.remove('custom-cursor');
    };
  }, [isHovering]);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor-ring" />
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="cursor-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
