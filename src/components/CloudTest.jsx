import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './CloudTest.css';

const CloudTest = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 10, 25);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Load cloud texture
    const textureLoader = new THREE.TextureLoader();
    
    // Create cloud texture using canvas (procedural)
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Create very bright, light cloud texture for daytime
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
    
    // Add soft blur layers for natural softness
    ctx.filter = 'blur(10px)';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, 256, 256);
    
    ctx.filter = 'blur(5px)';
    ctx.globalAlpha = 0.45;
    
    const gradient2 = ctx.createRadialGradient(128, 128, 40, 128, 128, 110);
    gradient2.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    gradient2.addColorStop(0.6, 'rgba(252, 252, 255, 0.4)');
    gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, 256, 256);

    const cloudTexture = new THREE.CanvasTexture(canvas);

    // Create cloud group
    const cloudGroup = new THREE.Group();

    // Create cloud material - very bright and light
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      color: 0xffffff,
      emissive: 0x000000,
      emissiveIntensity: 0,
    });

    // Create wider cloud with balanced height - more horizontal spread
    const cloudPositions = [
      // Dense center core - main body (balanced)
      { x: 0, y: 0, z: 0, scale: 1.5 },
      { x: 0.15, y: 0.08, z: 0.1, scale: 1.4 },
      { x: -0.15, y: -0.06, z: -0.1, scale: 1.35 },
      { x: 0.08, y: -0.09, z: 0.15, scale: 1.3 },
      
      // Extended left side - wider spread
      { x: -0.9, y: 0.12, z: 0.05, scale: 1.3 },
      { x: -1.5, y: 0.15, z: 0.15, scale: 1.2 },
      { x: -2.1, y: 0.13, z: -0.08, scale: 1.05 },
      { x: -2.7, y: 0.09, z: 0.1, scale: 0.9 },
      { x: -3.2, y: 0.06, z: -0.05, scale: 0.75 },
      
      // Extended right side - wider spread
      { x: 0.95, y: 0.13, z: -0.08, scale: 1.25 },
      { x: 1.6, y: 0.16, z: 0.12, scale: 1.15 },
      { x: 2.2, y: 0.14, z: -0.1, scale: 1.0 },
      { x: 2.8, y: 0.11, z: 0.05, scale: 0.85 },
      { x: 3.3, y: 0.08, z: 0.08, scale: 0.7 },
      
      // Top puffs - moderate height
      { x: -0.35, y: 0.68, z: 0.08, scale: 1.15 },
      { x: 0.4, y: 0.75, z: -0.1, scale: 1.05 },
      { x: 0.05, y: 0.95, z: 0.05, scale: 0.95 },
      { x: -0.75, y: 0.82, z: 0.12, scale: 0.85 },
      { x: 0.8, y: 0.85, z: -0.08, scale: 0.8 },
      { x: 0.15, y: 0.45, z: 0.18, scale: 1.1 },
      { x: -0.5, y: 1.1, z: 0, scale: 0.75 },
      { x: 0.6, y: 1.05, z: 0.1, scale: 0.7 },
      
      // Bottom base - grounded and full
      { x: -0.55, y: -0.42, z: -0.15, scale: 1.25 },
      { x: 0.6, y: -0.38, z: 0.2, scale: 1.15 },
      { x: 0.05, y: -0.48, z: 0.08, scale: 1.1 },
      { x: -1.1, y: -0.32, z: 0.1, scale: 1.0 },
      { x: 1.15, y: -0.3, z: -0.12, scale: 0.95 },
      { x: -0.25, y: -0.28, z: -0.25, scale: 1.05 },
      { x: 0.3, y: -0.25, z: 0.28, scale: 1.0 },
      { x: -1.8, y: -0.28, z: 0.05, scale: 0.9 },
      { x: 1.9, y: -0.26, z: -0.08, scale: 0.88 },
      
      // Middle volume - depth and fullness
      { x: -0.5, y: 0.22, z: 0.35, scale: 1.05 },
      { x: 0.55, y: 0.18, z: -0.38, scale: 0.98 },
      { x: -0.85, y: 0.35, z: 0.25, scale: 0.9 },
      { x: 0.9, y: 0.38, z: -0.28, scale: 0.88 },
      { x: 0.25, y: 0.28, z: 0.45, scale: 0.85 },
      { x: -0.3, y: 0.3, z: -0.42, scale: 0.82 },
      
      // Additional wide extensions
      { x: -2.4, y: 0.25, z: 0.2, scale: 0.75 },
      { x: 2.5, y: 0.28, z: -0.18, scale: 0.73 },
      { x: -3.5, y: 0.12, z: 0.1, scale: 0.65 },
      { x: 3.6, y: 0.15, z: -0.12, scale: 0.63 },
    ];

    cloudPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.scale, 32, 32);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      cloudGroup.add(mesh);
    });

    scene.add(cloudGroup);

    // Very bright daytime lighting - maximum illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Strong bright sunlight from above
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.7);
    sunLight.position.set(8, 10, 6);
    scene.add(sunLight);

    // Bright fill light 
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-6, -4, -5);
    scene.add(fillLight);
    
    // Additional top light for extra brightness
    const topLight = new THREE.DirectionalLight(0xffffff, 0.4);
    topLight.position.set(0, 15, 0);
    scene.add(topLight);

    // Mouse interaction - removed
    // No mouse events needed for static cloud

    // Animation
    const animate = () => {
      // Static render - no movement
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // TEST ANIMATION - Move cloud after 2 seconds
    setTimeout(() => {
      console.log('🚀 Starting cloud animation!');
      console.log('Initial position:', cloudGroup.position.x);
      
      gsap.to(cloudGroup.position, {
        x: 10,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          console.log('Moving:', cloudGroup.position.x);
        },
        onComplete: () => {
          console.log('✅ Animation complete! Final:', cloudGroup.position.x);
        }
      });
    }, 2000);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cloudGroup.children.forEach(mesh => {
        mesh.geometry.dispose();
      });
      cloudMaterial.dispose();
      cloudTexture.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="cloud-test">
      <div ref={containerRef} className="cloud-container"></div>
      <div className="cloud-info">
        <h1>Realistic Cloud</h1>
        <p>A static, volumetric cloud</p>
      </div>
    </div>
  );
};

export default CloudTest;
