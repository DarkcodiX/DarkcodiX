import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './CloudTest.css';

const CloudTest = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 5, 15);

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

    // Create fluffy cloud texture with better blending
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(250, 250, 250, 0.95)');
    gradient.addColorStop(0.4, 'rgba(240, 240, 240, 0.7)');
    gradient.addColorStop(0.6, 'rgba(230, 230, 230, 0.4)');
    gradient.addColorStop(0.8, 'rgba(220, 220, 220, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const cloudTexture = new THREE.CanvasTexture(canvas);

    // Create cloud group
    const cloudGroup = new THREE.Group();

    // Create multiple cloud spheres for realistic look with better blending
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      color: 0xffffff,
    });

    // Create main cloud structure - tighter overlapping for seamless look
    const cloudPositions = [
      // Main body - center (largest, core)
      { x: 0, y: 0, z: 0, scale: 2.2 },
      
      // Inner core layer - complete overlap
      { x: 0, y: 0, z: 0, scale: 2.0 },
      { x: 0.1, y: 0.1, z: 0, scale: 1.9 },
      { x: -0.1, y: -0.1, z: 0, scale: 1.9 },
      
      // Left side - seamless connection
      { x: -1.0, y: 0.15, z: 0, scale: 1.7 },
      { x: -1.5, y: 0, z: 0.1, scale: 1.5 },
      { x: -2.0, y: 0.1, z: -0.1, scale: 1.3 },
      { x: -2.3, y: 0.05, z: 0, scale: 1.0 },
      
      // Right side - seamless connection
      { x: 1.0, y: 0.2, z: -0.05, scale: 1.8 },
      { x: 1.6, y: 0.1, z: 0.15, scale: 1.6 },
      { x: 2.1, y: 0.15, z: 0, scale: 1.4 },
      { x: 2.5, y: 0.1, z: -0.1, scale: 1.1 },
      
      // Top puffs - overlapping with center
      { x: -0.3, y: 0.9, z: 0, scale: 1.5 },
      { x: 0.4, y: 1.0, z: 0.1, scale: 1.4 },
      { x: 0, y: 1.3, z: -0.05, scale: 1.2 },
      { x: -0.8, y: 1.1, z: 0.05, scale: 1.1 },
      { x: 0.9, y: 1.15, z: -0.1, scale: 1.0 },
      { x: 0.15, y: 0.65, z: 0, scale: 1.3 },
      
      // Bottom base - complete coverage
      { x: -0.6, y: -0.6, z: -0.2, scale: 1.6 },
      { x: 0.7, y: -0.5, z: 0.3, scale: 1.5 },
      { x: 0, y: -0.7, z: 0.1, scale: 1.4 },
      { x: -1.2, y: -0.4, z: 0, scale: 1.3 },
      { x: 1.3, y: -0.45, z: -0.1, scale: 1.3 },
      
      // Middle fill - complete overlap
      { x: -0.5, y: 0.3, z: 0.4, scale: 1.4 },
      { x: 0.6, y: 0.2, z: -0.4, scale: 1.3 },
      { x: -1.0, y: 0.5, z: 0.25, scale: 1.2 },
      { x: 1.1, y: 0.55, z: -0.25, scale: 1.2 },
      { x: 0.2, y: 0.4, z: 0.5, scale: 1.1 },
      { x: -0.3, y: 0.35, z: -0.5, scale: 1.1 },
      
      // Additional volume for seamless blend
      { x: -0.7, y: -0.2, z: 0.5, scale: 1.2 },
      { x: 0.8, y: -0.15, z: -0.5, scale: 1.2 },
      { x: 0, y: 0.2, z: 0.6, scale: 1.0 },
      { x: 0, y: 0.15, z: -0.6, scale: 1.0 },
    ];

    cloudPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.scale, 32, 32);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      cloudGroup.add(mesh);
    });

    scene.add(cloudGroup);

    // Add soft lighting for realistic cloud appearance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xe8e8ff, 0.4);
    directionalLight2.position.set(-5, -3, -5);
    scene.add(directionalLight2);

    // Add rim light for depth
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);

    // Mouse interaction - removed
    // No mouse events needed for static cloud

    // Animation
    const animate = () => {
      // Static render - no movement
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

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
