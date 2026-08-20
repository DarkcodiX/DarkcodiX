import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import './SplashScreen.css';

gsap.registerPlugin(SplitText);

const SplashScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const sceneRef = useRef(null);
  const cloudGroupsRef = useRef([]);
  const cloudsCreatedRef = useRef(false); // Prevent double creation
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const textCharsRef = useRef([]);

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
      filter: 'blur(20px)',
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
          delay: index * 0.03 // Faster stagger
        });
      }
    });
  }, [progress]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Prevent double creation in React Strict Mode
    if (cloudsCreatedRef.current) {
      console.log('Clouds already created, skipping...');
      return;
    }
    
    cloudsCreatedRef.current = true;
    console.log('Creating clouds - ONCE ONLY');

    // Scene setup - transparent with light fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White bg for splash
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
      antialias: true,
      alpha: false // No transparency needed!
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create cloud texture using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.35, 'rgba(252, 252, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(250, 250, 254, 0.65)');
    gradient.addColorStop(0.65, 'rgba(248, 248, 252, 0.5)');
    gradient.addColorStop(0.8, 'rgba(245, 245, 250, 0.3)');
    gradient.addColorStop(0.92, 'rgba(243, 243, 248, 0.12)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    ctx.filter = 'blur(10px)';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, 256, 256);

    const cloudTexture = new THREE.CanvasTexture(canvas);

    // Create cloud material - semi-transparent so landing shows!
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.85, // Semi-transparent
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      color: 0xf5f5f5, // Very light gray
      emissive: 0xffffff,
      emissiveIntensity: 0.05,
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
      const geometry = new THREE.SphereGeometry(pos.scale, 24, 24); // Better quality
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      topLeft.add(mesh);
    });
    topLeft.position.set(-3, 3.5, 0);
    topLeft.scale.set(1.3, 1.3, 1.3);
    scene.add(topLeft);
    cloudGroupsRef.current.push(topLeft);

    const topRight = new THREE.Group();
    cloudPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.scale, 32, 32);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      topRight.add(mesh);
    });
    topRight.position.set(3, 3.5, 0);
    topRight.scale.set(1.3, 1.3, 1.3);
    scene.add(topRight);
    cloudGroupsRef.current.push(topRight);

    // Create MIDDLE ROW - 2 clouds overlapping (slightly forward)
    const middleLeft = new THREE.Group();
    cloudPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.scale, 32, 32);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      middleLeft.add(mesh);
    });
    middleLeft.position.set(-3, 0, 0.5);
    middleLeft.scale.set(1.4, 1.4, 1.4);
    scene.add(middleLeft);
    cloudGroupsRef.current.push(middleLeft);

    const middleRight = new THREE.Group();
    cloudPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.scale, 32, 32);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      middleRight.add(mesh);
    });
    middleRight.position.set(3, 0, 0.5);
    middleRight.scale.set(1.4, 1.4, 1.4);
    scene.add(middleRight);
    cloudGroupsRef.current.push(middleRight);

    // Create BOTTOM ROW - 2 clouds overlapping
    const bottomLeft = new THREE.Group();
    cloudPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.scale, 32, 32);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      bottomLeft.add(mesh);
    });
    bottomLeft.position.set(-3, -3.5, 0);
    bottomLeft.scale.set(1.3, 1.3, 1.3);
    scene.add(bottomLeft);
    cloudGroupsRef.current.push(bottomLeft);

    const bottomRight = new THREE.Group();
    cloudPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.scale, 32, 32);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      bottomRight.add(mesh);
    });
    bottomRight.position.set(3, -3.5, 0);
    bottomRight.scale.set(1.3, 1.3, 1.3);
    scene.add(bottomRight);
    cloudGroupsRef.current.push(bottomRight);
    
    // CENTER CLOUD - 7th cloud in perfect middle!
    const centerCloud = new THREE.Group();
    cloudPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.scale, 32, 32);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      centerCloud.add(mesh);
    });
    centerCloud.position.set(0, 0, 1); // Perfect center, slightly forward
    centerCloud.scale.set(1.5, 1.5, 1.5); // Bigger center cloud!
    scene.add(centerCloud);
    cloudGroupsRef.current.push(centerCloud);
    
    console.log('✅ Created exactly 7 clouds:', cloudGroupsRef.current.length);

    // Lighting - brighter for more visible clouds with fog
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(8, 10, 6);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-6, -4, -5);
    scene.add(fillLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.7);
    topLight.position.set(0, 15, 0);
    scene.add(topLight);

    // Add atmospheric lights for fog effect
    const fogLight1 = new THREE.PointLight(0xaaaaaa, 1.5, 20);
    fogLight1.position.set(-5, 0, 3);
    scene.add(fogLight1);

    const fogLight2 = new THREE.PointLight(0xaaaaaa, 1.5, 20);
    fogLight2.position.set(5, 0, 3);
    scene.add(fogLight2);

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

    // Smooth loading progress - single RAF loop for smoothness
    let progressValue = 0;
    let startTime = Date.now();
    const duration = 5000; // 5 seconds
    let rafId;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(Math.floor(newProgress));
      
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
    };

    window.addEventListener('resize', handleResize);

    // Cleanup - only when component unmounts
    return () => {
      console.log('Cleaning up THREE.js scene');
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      cancelAnimationFrame(animationFrameId);
      cloudGroupsRef.current.forEach(cloud => {
        cloud.children.forEach(mesh => {
          mesh.geometry.dispose();
        });
      });
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
      console.log('🚀 EXIT ANIMATION STARTING!');
      console.log('Total clouds available:', cloudGroupsRef.current.length);
      
      // Use all 7 clouds
      const clouds = cloudGroupsRef.current;
      console.log('Animating clouds:', clouds.length);
      const targetPos = [
        { x: -15, y: 10, z: 2 },    // top left - VISIBLE range
        { x: 15, y: 10, z: 2 },     // top right
        { x: -18, y: 0, z: 1 },     // middle left
        { x: 18, y: 0, z: 1 },      // middle right
        { x: -15, y: -10, z: 2 },   // bottom left
        { x: 15, y: -10, z: 2 }     // bottom right
      ];
      
      setTimeout(() => {
        console.log('🎬 Starting exit animation...');
        
        // Text + Loader fade
        gsap.to(['.splash-text', '.splash-loader-container'], {
          opacity: 0,
          duration: 0.6
        });
        
        // ALL 6 CLOUDS + ZOOM - TOGETHER!
        setTimeout(() => {
          console.log('💨 Moving ALL 6 clouds + ZOOM together!');
          
          // TOP LEFT
          gsap.to(clouds[0].position, {
            x: -20,
            y: 12,
            duration: 3.0,
            ease: 'power2.inOut',
            onUpdate: () => {
              clouds[0].updateMatrixWorld(true);
            }
          });
          
          // TOP RIGHT
          gsap.to(clouds[1].position, {
            x: 20,
            y: 12,
            duration: 3.0,
            ease: 'power2.inOut',
            onUpdate: () => {
              clouds[1].updateMatrixWorld(true);
            }
          });
          
          // MIDDLE LEFT
          gsap.to(clouds[2].position, {
            x: -25,
            duration: 3.0,
            ease: 'power2.inOut',
            onUpdate: () => {
              clouds[2].updateMatrixWorld(true);
            }
          });
          
          // MIDDLE RIGHT
          gsap.to(clouds[3].position, {
            x: 25,
            duration: 3.0,
            ease: 'power2.inOut',
            onUpdate: () => {
              clouds[3].updateMatrixWorld(true);
            }
          });
          
          // BOTTOM LEFT
          gsap.to(clouds[4].position, {
            x: -20,
            y: -12,
            duration: 3.0,
            ease: 'power2.inOut',
            onUpdate: () => {
              clouds[4].updateMatrixWorld(true);
            }
          });
          
          // BOTTOM RIGHT
          gsap.to(clouds[5].position, {
            x: 20,
            y: -12,
            duration: 3.0,
            ease: 'power2.inOut',
            onUpdate: () => {
              clouds[5].updateMatrixWorld(true);
            }
          });
          
          // CENTER CLOUD - 7th cloud moves left!
          gsap.to(clouds[6].position, {
            x: -30,
            duration: 3.0,
            ease: 'power2.inOut',
            onUpdate: () => {
              clouds[6].updateMatrixWorld(true);
            }
          });
          
          // CAMERA ZOOM - SAME TIME!
          gsap.to(cameraRef.current.position, {
            z: -10,
            duration: 3.0,
            ease: 'power2.inOut',
            onUpdate: () => {
              cameraRef.current.updateMatrixWorld(true);
            },
            onComplete: () => {
              console.log('✅ ALL clouds moved + ZOOM done!');
              
              // TRIGGER LANDING CONTENT REVEAL - RIGHT WHEN CLOUDS FINISH!
              if (onComplete) {
                onComplete(); // Signal App.jsx to start content reveal
              }
            }
          });
          
          // Start splash fade at same time as content reveal
          setTimeout(() => {
            console.log('🎬 Starting final fade (ultra fast)...');
            gsap.to('.splash-screen', {
              opacity: 0,
              duration: 0.25,
              ease: 'power2.out'
            });
          }, 2500);
        }, 600);
      }, 1000);
    }
  }, [progress, onComplete]);

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
