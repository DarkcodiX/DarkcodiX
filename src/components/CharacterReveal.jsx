import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import WebGLBackground from './WebGLBackground';
import './CharacterReveal.css';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

const CENTER_FRAME = 1;
const DIRECTIONAL_FRAMES = Array.from({ length: 300 }, (_, index) => index + 1);
const BLINK_FRAMES = Array.from({ length: 27 }, (_, index) => `ezgif-frame-${String(index + 14).padStart(3, '0')}.png`);
const IDLE_FRAME = BLINK_FRAMES[0];
const BLINK_FRAME_DURATION = 46;
const AVAILABLE_FRAMES = DIRECTIONAL_FRAMES;
const HOT_FRAMES = [55, 70, 100, 122, 145, 162, 180, 208, 242];
const LOOK_ANCHORS = [
  { angle: -Math.PI, frame: 242 },
  { angle: -Math.PI / 2, frame: 180 },
  { angle: 0, frame: 145 },
  { angle: Math.PI / 2, frame: 100 },
  { angle: Math.PI, frame: 55 },
];

const getCharacterFramePath = (frame) => (
  `/cursor-frames/ezgif-frame-${String(frame).padStart(3, '0')}.png?v=cursor-folder-9`
);

const getBlinkFramePath = (frameName) => (
  `/blink-frames/${frameName}?v=blink-folder-8`
);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getNearestAvailableFrame = (frame) => (
  AVAILABLE_FRAMES.reduce((nearest, candidate) => {
    const currentDistance = Math.abs(candidate - frame);
    const nearestDistance = Math.abs(nearest - frame);
    return currentDistance < nearestDistance ? candidate : nearest;
  }, AVAILABLE_FRAMES[0])
);

const getFrameFromAngle = (angle) => {
  for (let index = 0; index < LOOK_ANCHORS.length - 1; index += 1) {
    const start = LOOK_ANCHORS[index];
    const end = LOOK_ANCHORS[index + 1];

    if (angle >= start.angle && angle <= end.angle) {
      const progress = (angle - start.angle) / (end.angle - start.angle);
      return clamp(start.frame + (end.frame - start.frame) * progress, 55, 242);
    }
  }

  return 55;
};

const CharacterReveal = ({ startAnimation = false }) => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const curveOverlay = section.querySelector('.hero-curve-swipe');
      const curvePath = section.querySelector('.hero-curve-swipe-path');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!curveOverlay || !curvePath) return;

      const curveStartPath = 'M0 900 V260 C360 112 1150 112 1510 260 V900 Z';
      const curveMidPath = 'M0 900 V170 C380 0 1130 0 1510 170 V900 Z';
      const curveEndPath = 'M0 900 V0 H1510 V900 Z';

      if (reduceMotion) {
        gsap.set(curveOverlay, { autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });

        return;
      }

      gsap.set(curveOverlay, { yPercent: 100, autoAlpha: 1 });
      gsap.set(curvePath, { attr: { d: curveStartPath } });

      const heroTransition = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=60%',
          pin: true,
          pinSpacing: false,
          scrub: 0.18,
          anticipatePin: 1,
        },
      });

      heroTransition
        .to(
          curveOverlay,
          {
            yPercent: 0,
            ease: 'none',
            duration: 0.5,
          },
          0
        )
        .to(
          curvePath,
          {
            morphSVG: { shape: curveMidPath, type: 'linear' },
            ease: 'none',
            duration: 0.5,
          },
          0
        )
        .to(
          curvePath,
          {
            morphSVG: { shape: curveEndPath, type: 'linear' },
            ease: 'none',
            duration: 0.5,
          },
          0.5
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext('2d');
    if (!canvas || !canvasContext) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const frameCache = new Map();
    const blinkFrameCache = new Map();
    const requestedFrames = new Set();
    const requestedBlinkFrames = new Set();
    let currentFrame = CENTER_FRAME;
    let currentFrameKey = `blink:${IDLE_FRAME}`;
    let lastPointerAt = 0;
    let blinkStartedAt = 0;
    let nextBlinkAt = 650;
    let rafId = 0;
    let idleId = 0;

    const preloadFrame = (frame) => {
      if (requestedFrames.has(frame)) return;
      requestedFrames.add(frame);

      const preloadImage = new Image();
      preloadImage.decoding = 'async';
      preloadImage.src = getCharacterFramePath(frame);
      preloadImage.onload = () => {
        frameCache.set(frame, preloadImage);

        if (currentFrameKey === `look:${frame}`) {
          drawCharacterFrame(preloadImage);
        }
      };
    };

    const preloadBlinkFrame = (frameName) => {
      if (requestedBlinkFrames.has(frameName)) return;
      requestedBlinkFrames.add(frameName);

      const preloadImage = new Image();
      preloadImage.decoding = 'async';
      preloadImage.src = getBlinkFramePath(frameName);
      preloadImage.onload = () => {
        blinkFrameCache.set(frameName, preloadImage);

        if (currentFrameKey === `blink:${frameName}`) {
          drawCharacterFrame(preloadImage);
        }
      };
    };

    const drawCharacterFrame = (frameImage) => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    };

    const setFrame = (frame) => {
      const availableFrame = getNearestAvailableFrame(frame);

      if (availableFrame === currentFrame && currentFrameKey === `look:${availableFrame}`) return;
      const cachedImage = frameCache.get(availableFrame);

      if (!cachedImage) {
        preloadFrame(availableFrame);
        return;
      }

      currentFrame = availableFrame;
      currentFrameKey = `look:${availableFrame}`;
      drawCharacterFrame(cachedImage);
    };

    const setBlinkFrame = (frameName) => {
      if (currentFrameKey === `blink:${frameName}`) return;
      const cachedImage = blinkFrameCache.get(frameName);

      if (!cachedImage) {
        preloadBlinkFrame(frameName);
        return;
      }

      currentFrameKey = `blink:${frameName}`;
      drawCharacterFrame(cachedImage);
    };

    const getPointerVector = (event) => {
      const rect = canvas.getBoundingClientRect();
      const faceX = rect.left + rect.width * 0.5;
      const faceY = rect.top + rect.height * 0.34;

      return {
        x: clamp((event.clientX - faceX) / (window.innerWidth * 0.34), -1, 1),
        y: clamp((event.clientY - faceY) / (window.innerHeight * 0.36), -1, 1),
      };
    };

    const pickTargetFrame = (x, y) => {
      const angle = Math.atan2(y, x);
      return getFrameFromAngle(angle);
    };

    const getIdleBlinkFrame = (now, canBlink) => {
      if (!canBlink) {
        blinkStartedAt = 0;
        nextBlinkAt = now + 450;
        return IDLE_FRAME;
      }

      if (!blinkStartedAt && now >= nextBlinkAt) {
        blinkStartedAt = now;
      }

      if (!blinkStartedAt) {
        return IDLE_FRAME;
      }

      const blinkFrameIndex = Math.floor((now - blinkStartedAt) / BLINK_FRAME_DURATION);

      if (blinkFrameIndex >= BLINK_FRAMES.length) {
        blinkStartedAt = 0;
        nextBlinkAt = now + 1800 + Math.random() * 1600;
        return IDLE_FRAME;
      }

      return BLINK_FRAMES[blinkFrameIndex];
    };

    const handlePointerMove = (event) => {
      const vector = getPointerVector(event);
      target.x = vector.x;
      target.y = vector.y;
      lastPointerAt = performance.now();
    };

    const handlePointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    canvasContext.imageSmoothingEnabled = true;
    canvasContext.imageSmoothingQuality = 'high';

    currentFrame = CENTER_FRAME;
    BLINK_FRAMES.forEach(preloadBlinkFrame);
    HOT_FRAMES.forEach(preloadFrame);
    preloadFrame(CENTER_FRAME);

    const preloadAllFrames = () => {
      AVAILABLE_FRAMES.forEach(preloadFrame);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(preloadAllFrames, { timeout: 2500 });
    } else {
      idleId = window.setTimeout(preloadAllFrames, 1200);
    }

    const animate = (now) => {
      const idleReturn = now - lastPointerAt > 900;
      const ease = idleReturn ? 0.055 : 0.115;

      if (idleReturn) {
        target.x = 0;
        target.y = 0;
      }

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;

      if (!reduceMotion) {
        const targetMagnitude = Math.hypot(target.x, target.y);
        const currentMagnitude = Math.hypot(current.x, current.y);
        const isCenterIdle = targetMagnitude < 0.08 && currentMagnitude < 0.14;
        const canPlayBlink = targetMagnitude < 0.08 && currentMagnitude < 0.08;

        if (isCenterIdle) {
          const blinkFrame = getIdleBlinkFrame(now, canPlayBlink);
          setBlinkFrame(blinkFrame);
        } else {
          setFrame(Math.round(pickTargetFrame(current.x, current.y)));
        }
      }

      rafId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.cancelAnimationFrame(rafId);
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      frameCache.clear();
      blinkFrameCache.clear();
      requestedFrames.clear();
      requestedBlinkFrames.clear();
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
        <canvas
          ref={canvasRef}
          width="1280"
          height="720"
          role="img"
          aria-label="Character"
          className="character-base-image"
        />
      </div>

      {/* Bottom Right Element */}
      <div className="bottom-right-element">
        <div className="tagline-badge">
          <span className="tagline-text">Based in India · Open to Work</span>
        </div>
      </div>

      <svg
        className="hero-curve-swipe"
        viewBox="0 0 1510 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-about-curve-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8f9fb" />
            <stop offset="55%" stopColor="#f8f9fb" />
            <stop offset="100%" stopColor="#eceff5" />
          </linearGradient>
        </defs>
        <path
          className="hero-curve-swipe-path"
          d="M0 900 V260 C360 112 1150 112 1510 260 V900 Z"
        />
      </svg>
    </div>
  );
};

export default CharacterReveal;
