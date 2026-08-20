import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Character3D = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa0c0ff, 0.7);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x6366f1, 3.0, 10);
    rimLight.position.set(2, 3, -1);
    scene.add(rimLight);

    // 3. Contact Shadow Texture (Procedural Canvas)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const gradient = sCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.4, 0.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.85, 0.2);
    scene.add(shadowMesh);

    // 4. Character 3D Mesh
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    const textureLoader = new THREE.TextureLoader();
    let characterMesh = null;

    textureLoader.load(
      '/character.jpeg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const imgWidth = texture.image.width || 1000;
        const imgHeight = texture.image.height || 1000;
        const aspect = imgWidth / imgHeight;

        const meshHeight = 3.6;
        const meshWidth = meshHeight * aspect;

        // Curved plane geometry for subtle 3D volumetric depth
        const geometry = new THREE.PlaneGeometry(meshWidth, meshHeight, 64, 64);
        const posAttr = geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const x = posAttr.getX(i);
          const y = posAttr.getY(i);
          // Curve edges backwards for depth effect
          const curveZ = -0.12 * Math.pow(x / (meshWidth / 2), 2) + Math.sin((y / meshHeight) * Math.PI) * 0.05;
          posAttr.setZ(i, curveZ);
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.35,
          metalness: 0.05,
          side: THREE.DoubleSide,
        });

        characterMesh = new THREE.Mesh(geometry, material);
        characterMesh.position.set(0, 0, 0);
        characterGroup.add(characterMesh);
      },
      undefined,
      (err) => {
        console.error('Failed to load character texture:', err);
      }
    );

    // 5. Mouse Interaction Tracking
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 6. Animation Loop (Lerp & Idle Breathing)
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth Spring-Lerp towards cursor
      const m = mouseRef.current;
      m.currentX += (m.targetX - m.currentX) * 0.06;
      m.currentY += (m.targetY - m.currentY) * 0.06;

      if (characterGroup) {
        // Natural Head/Body 3D Turn
        characterGroup.rotation.y = m.currentX * 0.28; // Yaw turn (-16 deg to +16 deg)
        characterGroup.rotation.x = -m.currentY * 0.18; // Pitch tilt (-10 deg to +10 deg)
        characterGroup.rotation.z = -m.currentX * 0.04; // Subtle roll

        // Parallax position shift
        characterGroup.position.x = m.currentX * 0.18;
        characterGroup.position.y = m.currentY * 0.12 + Math.sin(time * 1.5) * 0.03; // Gentle breathing

        // Rim light position tracking
        rimLight.position.x = 2 + m.currentX * 1.5;
        rimLight.position.y = 3 + m.currentY * 1.0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (characterMesh) {
        characterMesh.geometry.dispose();
        if (characterMesh.material.map) characterMesh.material.map.dispose();
        characterMesh.material.dispose();
      }

      shadowGeo.dispose();
      shadowMat.map.dispose();
      shadowMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="character-3d-canvas-wrapper" />;
};

export default Character3D;
