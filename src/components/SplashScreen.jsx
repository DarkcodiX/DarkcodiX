import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import './SplashScreen.css';

gsap.registerPlugin(SplitText);

const SplashScreen = ({ onRevealStart, onComplete }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const sceneRef = useRef(null);
  const cloudGroupsRef = useRef([]);
  const cloudsCreatedRef = useRef(false); // Prevent double creation
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const textCharsRef = useRef([]);
  const revealStartedRef = useRef(false);

  // Sync text animation with progress + gooey effect
  useEffect(() => {
    const titleElement = document.querySelector('.splash-title');
    const textContainer = document.querySelector('.splash-text');
    const loaderContainer = document.querySelector('.splash-loader-container');
    
    if (!titleElement || textCharsRef.current.length > 0) return;

    // Fade in containers first (GSAP controlled)
    gsap.to([textContainer, loaderContainer], {
      opacity: 1,
      duration: 0.5,
      delay: 0.3,
      ease: 'power2.out'
    });

    // Split text into characters
    const split = new SplitText(titleElement, {
      type: "chars",
      charsClass: "splash-char"
    });

    textCharsRef.current = split.chars;

    // Set initial state - all blurred with gooey effect
    gsap.set(split.chars, {
      opacity: 0,
      filter: 'blur(10px)',
      scale: 0.7,
      y: 20
    });

    return () => {
      if (split) split.revert();
    };
  }, []);

  // Update character visibility based on progress with gooey reveal
  useEffect(() => {
    if (textCharsRef.current.length === 0) return;

    const totalChars = textCharsRef.current.length;
    // Ensure all characters show by 90% progress so they have time to complete animation
    const adjustedProgress = Math.min(progress / 90, 1);
    const charsToShow = Math.floor(adjustedProgress * totalChars);

    textCharsRef.current.forEach((char, index) => {
      if (index < charsToShow && !char.dataset.revealed) {
        // Mark as revealed
        char.dataset.revealed = 'true';
        
        // Gooey blur reveal animation - slightly faster
        gsap.to(char, {
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.025 // Faster stagger
        });
      }
    });
  }, [progress]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Prevent double creation in React Strict Mode
    if (cloudsCreatedRef.current) return;
    
    cloudsCreatedRef.current = true;

    // Scene setup - transparent with light fog
    const scene = new THREE.Scene();
    scene.background = null; // Transparent so landing page background shows through
    scene.fog = new THREE.FogExp2(0xffffff, 0.15);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true, // Transparent canvas
      powerPreference: 'low-power'
    });
    const maxPixelRatio = navigator.hardwareConcurrency <= 4 ? 1 : 1.15;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create cloud texture using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');

    const bodyShade = ctx.createRadialGradient(92, 104, 12, 96, 96, 96);
    bodyShade.addColorStop(0, 'rgba(184, 188, 198, 0.48)');
    bodyShade.addColorStop(0.45, 'rgba(170, 175, 188, 0.42)');
    bodyShade.addColorStop(0.78, 'rgba(150, 156, 170, 0.24)');
    bodyShade.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = bodyShade;
    ctx.fillRect(0, 0, 192, 192);

    const gradient = ctx.createRadialGradient(96, 88, 16, 96, 96, 96);
    gradient.addColorStop(0, 'rgba(238, 240, 245, 1)');
    gradient.addColorStop(0.2, 'rgba(226, 229, 237, 0.96)');
    gradient.addColorStop(0.35, 'rgba(214, 218, 228, 0.9)');
    gradient.addColorStop(0.5, 'rgba(198, 203, 216, 0.78)');
    gradient.addColorStop(0.65, 'rgba(180, 187, 202, 0.62)');
    gradient.addColorStop(0.8, 'rgba(158, 166, 184, 0.42)');
    gradient.addColorStop(0.92, 'rgba(138, 146, 164, 0.22)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 192, 192);
    
    ctx.filter = 'blur(8px)';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, 192, 192);
    
    ctx.filter = 'blur(4px)';
    ctx.globalAlpha = 0.48;
    const gradient2 = ctx.createRadialGradient(96, 88, 30, 96, 96, 82);
    gradient2.addColorStop(0, 'rgba(232, 235, 242, 0.84)');
    gradient2.addColorStop(0.45, 'rgba(208, 213, 224, 0.6)');
    gradient2.addColorStop(0.72, 'rgba(166, 174, 190, 0.38)');
    gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, 192, 192);

    const cloudTexture = new THREE.CanvasTexture(canvas);

    // Sprite clouds preserve the same flow with far less GPU cost than hundreds of lit spheres.
    const cloudMaterial = new THREE.SpriteMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.97, // Semi-transparent
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: 0xe4e6ec, // Slightly darker tint so the cloud volume reads stronger.
    });

    // Create large cloud structure (same as /test but bigger)
    const cloudPositions = [
      { x: 0, y: 0, z: 0, scale: 1.5 },
      { x: 0.15, y: 0.08, z: 0.1, scale: 1.4 },
      { x: -0.15, y: -0.06, z: -0.1, scale: 1.35 },
      { x: 0.08, y: -0.09, z: 0.15, scale: 1.3 },
      { x: -0.9, y: 0.12, z: 0.05, scale: 1.3 },
      { x: -1.5, y: 0.15, z: 0.15, scale: 1.2 },
      { x: -2.1, y: 0.13, z: -0.08, scale: 1.05 },
      { x: -2.7, y: 0.09, z: 0.1, scale: 0.9 },
      { x: -3.2, y: 0.06, z: -0.05, scale: 0.75 },
      { x: 0.95, y: 0.13, z: -0.08, scale: 1.25 },
      { x: 1.6, y: 0.16, z: 0.12, scale: 1.15 },
      { x: 2.2, y: 0.14, z: -0.1, scale: 1.0 },
      { x: 2.8, y: 0.11, z: 0.05, scale: 0.85 },
      { x: 3.3, y: 0.08, z: 0.08, scale: 0.7 },
      { x: -0.35, y: 0.68, z: 0.08, scale: 1.15 },
      { x: 0.4, y: 0.75, z: -0.1, scale: 1.05 },
      { x: 0.05, y: 0.95, z: 0.05, scale: 0.95 },
      { x: -0.75, y: 0.82, z: 0.12, scale: 0.85 },
      { x: 0.8, y: 0.85, z: -0.08, scale: 0.8 },
      { x: 0.15, y: 0.45, z: 0.18, scale: 1.1 },
      { x: -0.5, y: 1.1, z: 0, scale: 0.75 },
      { x: 0.6, y: 1.05, z: 0.1, scale: 0.7 },
      { x: -0.55, y: -0.42, z: -0.15, scale: 1.25 },
      { x: 0.6, y: -0.38, z: 0.2, scale: 1.15 },
      { x: 0.05, y: -0.48, z: 0.08, scale: 1.1 },
      { x: -1.1, y: -0.32, z: 0.1, scale: 1.0 },
      { x: 1.15, y: -0.3, z: -0.12, scale: 0.95 },
      { x: -0.25, y: -0.28, z: -0.25, scale: 1.05 },
      { x: 0.3, y: -0.25, z: 0.28, scale: 1.0 },
      { x: -1.8, y: -0.28, z: 0.05, scale: 0.9 },
      { x: 1.9, y: -0.26, z: -0.08, scale: 0.88 },
      { x: -0.5, y: 0.22, z: 0.35, scale: 1.05 },
      { x: 0.55, y: 0.18, z: -0.38, scale: 0.98 },
      { x: -0.85, y: 0.35, z: 0.25, scale: 0.9 },
      { x: 0.9, y: 0.38, z: -0.28, scale: 0.88 },
      { x: 0.25, y: 0.28, z: 0.45, scale: 0.85 },
      { x: -0.3, y: 0.3, z: -0.42, scale: 0.82 },
      { x: -2.4, y: 0.25, z: 0.2, scale: 0.75 },
      { x: 2.5, y: 0.28, z: -0.18, scale: 0.73 },
      { x: -3.5, y: 0.12, z: 0.1, scale: 0.65 },
      { x: 3.6, y: 0.15, z: -0.12, scale: 0.63 },
    ];

    // Create TOP ROW - 2 clouds overlapping
    const topLeft = new THREE.Group();
    cloudPositions.forEach(pos => {
      const mesh = new THREE.Sprite(cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.setScalar(pos.scale * 2);
      topLeft.add(mesh);
    });
    topLeft.position.set(-3, 3.5, 0);
    topLeft.scale.set(1.3, 1.3, 1.3);
    scene.add(topLeft);
    cloudGroupsRef.current.push(topLeft);

    const topRight = new THREE.Group();
    cloudPositions.forEach(pos => {
      const mesh = new THREE.Sprite(cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.setScalar(pos.scale * 2);
      topRight.add(mesh);
    });
    topRight.position.set(3, 3.5, 0);
    topRight.scale.set(1.3, 1.3, 1.3);
    scene.add(topRight);
    cloudGroupsRef.current.push(topRight);

    // Create MIDDLE ROW - 2 clouds overlapping (slightly forward)
    const middleLeft = new THREE.Group();
    cloudPositions.forEach(pos => {
      const mesh = new THREE.Sprite(cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.setScalar(pos.scale * 2);
      middleLeft.add(mesh);
    });
    middleLeft.position.set(-3, 0, 0.5);
    middleLeft.scale.set(1.4, 1.4, 1.4);
    scene.add(middleLeft);
    cloudGroupsRef.current.push(middleLeft);

    const middleRight = new THREE.Group();
    cloudPositions.forEach(pos => {
      const mesh = new THREE.Sprite(cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.setScalar(pos.scale * 2);
      middleRight.add(mesh);
    });
    middleRight.position.set(3, 0, 0.5);
    middleRight.scale.set(1.4, 1.4, 1.4);
    scene.add(middleRight);
    cloudGroupsRef.current.push(middleRight);

    // Create BOTTOM ROW - 2 clouds overlapping
    const bottomLeft = new THREE.Group();
    cloudPositions.forEach(pos => {
      const mesh = new THREE.Sprite(cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.setScalar(pos.scale * 2);
      bottomLeft.add(mesh);
    });
    bottomLeft.position.set(-3, -3.5, 0);
    bottomLeft.scale.set(1.3, 1.3, 1.3);
    scene.add(bottomLeft);
    cloudGroupsRef.current.push(bottomLeft);

    const bottomRight = new THREE.Group();
    cloudPositions.forEach(pos => {
      const mesh = new THREE.Sprite(cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.setScalar(pos.scale * 2);
      bottomRight.add(mesh);
    });
    bottomRight.position.set(3, -3.5, 0);
    bottomRight.scale.set(1.3, 1.3, 1.3);
    scene.add(bottomRight);
    cloudGroupsRef.current.push(bottomRight);
    
    // CENTER CLOUD - 7th cloud in perfect middle!
    const centerCloud = new THREE.Group();
    cloudPositions.forEach(pos => {
      const mesh = new THREE.Sprite(cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.setScalar(pos.scale * 2);
      centerCloud.add(mesh);
    });
    centerCloud.position.set(0, 0, 1); // Perfect center, slightly forward
    centerCloud.scale.set(1.5, 1.5, 1.5); // Bigger center cloud!
    scene.add(centerCloud);
    cloudGroupsRef.current.push(centerCloud);
    
    // Animation with exit handling
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Render scene using REFS - this ensures we always render the current scene!
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Smooth loading progress - update React only when the visible number changes.
    let startTime = Date.now();
    const duration = 3500;
    let rafId;
    let lastProgress = -1;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      const nextProgress = Math.floor(newProgress);
      
      if (nextProgress !== lastProgress) {
        lastProgress = nextProgress;
        setProgress(nextProgress);
      }
      
      if (newProgress < 100) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    rafId = requestAnimationFrame(updateProgress);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup - only when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      cancelAnimationFrame(animationFrameId);
      cloudMaterial.dispose();
      cloudTexture.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      cloudsCreatedRef.current = false; // Reset for next mount
    };
  }, []);

  // Handle completion - Proper animation with visible clouds
  useEffect(() => {
    if (progress >= 100 && cloudGroupsRef.current.length >= 7 && !isExiting) {
      setIsExiting(true);
      // Use all 7 clouds
      const clouds = cloudGroupsRef.current;
      
      setTimeout(() => {
        // Text + Loader fade
        gsap.to(['.splash-text', '.splash-loader-container'], {
          opacity: 0,
          duration: 0.6
        });
        
        // ALL 6 CLOUDS + ZOOM - TOGETHER!
        setTimeout(() => {
          gsap.delayedCall(2.1, () => {
            if (!revealStartedRef.current) {
              revealStartedRef.current = true;
              onRevealStart?.();
            }
          });

          // TOP LEFT
          gsap.to(clouds[0].position, {
            x: -20,
            y: 12,
            duration: 3.0,
            ease: 'power2.inOut'
          });
          
          // TOP RIGHT
          gsap.to(clouds[1].position, {
            x: 20,
            y: 12,
            duration: 3.0,
            ease: 'power2.inOut'
          });
          
          // MIDDLE LEFT
          gsap.to(clouds[2].position, {
            x: -25,
            duration: 3.0,
            ease: 'power2.inOut'
          });
          
          // MIDDLE RIGHT
          gsap.to(clouds[3].position, {
            x: 25,
            duration: 3.0,
            ease: 'power2.inOut'
          });
          
          // BOTTOM LEFT
          gsap.to(clouds[4].position, {
            x: -20,
            y: -12,
            duration: 3.0,
            ease: 'power2.inOut'
          });
          
          // BOTTOM RIGHT
          gsap.to(clouds[5].position, {
            x: 20,
            y: -12,
            duration: 3.0,
            ease: 'power2.inOut'
          });
          
          // CENTER CLOUD - 7th cloud moves left!
          gsap.to(clouds[6].position, {
            x: -30,
            duration: 3.0,
            ease: 'power2.inOut'
          });
          
          // CAMERA ZOOM - SAME TIME!
          gsap.to(cameraRef.current.position, {
            z: -10,
            duration: 3.0,
            ease: 'power2.inOut',
            onComplete: () => {
              // Fade out splash screen overlay smoothly, then signal landing page reveal!
              gsap.to('.splash-screen', {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                  if (!revealStartedRef.current) {
                    revealStartedRef.current = true;
                    onRevealStart?.();
                  }

                  if (onComplete) {
                    onComplete(); // Signal App.jsx to start content reveal
                  }
                }
              });
            }
          });
        }, 600);
      }, 1000);
    }
  }, [progress, isExiting, onRevealStart, onComplete]);

  return (
    <div className="splash-screen">
      <div ref={containerRef} className="splash-canvas-container"></div>
      
      <div className="splash-content">
        <div className="splash-text">
          <h1 className="splash-title">
            <span className="gooey-filter">Welcome To My World</span>
          </h1>
        </div>

        <div className="splash-loader-container">
          <div className="cloudy-loader">
            <div className="loader-line-bg">
              <div className="loader-line-fill" style={{ width: `${progress}%` }}></div>
              <div className="loader-cloud-overlay"></div>
            </div>
            <div className="loader-percentage">{progress}%</div>
          </div>
        </div>
      </div>
      
      {/* SVG Filter for Gooey Effect */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <defs>
          <filter id="gooey-text-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default SplashScreen;
