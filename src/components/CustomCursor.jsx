import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const isHoveringRef = useRef(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const prefersNativeCursor =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      navigator.maxTouchPoints > 0;

    if (prefersNativeCursor) return;

    document.body.classList.add('custom-cursor');

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.28, ease: 'power3.out' });
    const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.28, ease: 'power3.out' });
    const dotX = gsap.quickTo(cursorDot, 'x', { duration: 0.08, ease: 'none' });
    const dotY = gsap.quickTo(cursorDot, 'y', { duration: 0.08, ease: 'none' });

    const moveCursor = (e) => {
      cursorX(e.clientX);
      cursorY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
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
        scale: isHoveringRef.current ? 1.5 : 1,
        duration: 0.2,
      });
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Handle hover states
    const handleMouseEnter = () => {
      isHoveringRef.current = true;
      gsap.to(cursor, {
        scale: 1.5,
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        border: '2px solid rgba(99, 102, 241, 0.8)',
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      isHoveringRef.current = false;
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        duration: 0.3,
      });
    };

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, .hoverable, .character-container'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });

      document.body.classList.remove('custom-cursor');
    };
  }, []);

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
