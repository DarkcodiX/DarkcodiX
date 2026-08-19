import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './WebGLBackground.css';

const WebGLBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Light grayscale gradient with small random ripples
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        varying vec2 vUv;

        // Hash function for random positions
        float hash(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.13);
          p3 += dot(p3, p3.yzx + 3.333);
          return fract((p3.x + p3.y) * p3.z);
        }

        // Smooth noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // Water ripple with multiple concentric waves (like dropping a rock)
        float createWaterRipple(vec2 p, vec2 center, float time, float startTime, float speed) {
          float elapsed = time - startTime;
          if (elapsed < 0.0 || elapsed > 6.0) return 0.0;
          
          float dist = length(p - center);
          float rippleEffect = 0.0;
          
          // Create multiple concentric waves
          for(float i = 0.0; i < 6.0; i++) {
            float waveOffset = i * 0.25; // Space between waves
            float waveTime = elapsed - waveOffset;
            
            if (waveTime > 0.0) {
              float waveRadius = waveTime * speed;
              float waveDist = abs(dist - waveRadius);
              
              // Create thin wave
              float wave = smoothstep(0.1, 0.0, waveDist);
              
              // Fade out over time
              float timeFade = 1.0 - (waveTime / 6.0);
              timeFade = max(0.0, timeFade);
              timeFade = timeFade * timeFade;
              
              // Each subsequent wave is weaker
              float amplitude = 1.0 - (i * 0.12);
              amplitude = max(0.0, amplitude);
              
              rippleEffect += wave * timeFade * amplitude;
            }
          }
          
          return rippleEffect;
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
          
          // Color definitions
          vec3 color1 = vec3(0.529); // rgb(135,135,135) - Darkest
          vec3 color2 = vec3(0.647); // rgb(165,165,165) - Top-right corner target
          vec3 color3 = vec3(0.820); // rgb(209,209,209) - Medium
          vec3 color4 = vec3(0.922); // rgb(235,235,235) - Lightest (top-left)
          
          // Smooth diagonal gradient from top-left (light) to bottom-right (dark)
          float diagonalX = uv.x;
          float diagonalY = 1.0 - uv.y;
          
          // Top-left to bottom-right gradient
          float diagonal = (diagonalX + (1.0 - diagonalY)) * 0.5;
          
          // Create smooth base gradient
          vec3 baseColor = color4; // Start with lightest
          
          // Blend from top-left (color4) through center (color3) to bottom (color1)
          baseColor = mix(color4, color3, smoothstep(0.2, 0.5, diagonal));
          baseColor = mix(baseColor, color1, smoothstep(0.5, 0.9, diagonal));
          
          // Add gradient layer for top-right corner (135 to 165)
          // Top-right corner should transition from 135 to 165
          float topRightCorner = (uv.x * (1.0 - uv.y)); // Peaks at top-right
          float cornerGradient = smoothstep(0.5, 1.0, topRightCorner);
          
          // Mix in the corner gradient (darker in corner, lighter as it spreads)
          baseColor = mix(baseColor, color2, cornerGradient * 0.3);
          
          // Add subtle organic movement with noise
          float noise1 = snoise(p * 1.5 + u_time * 0.03) * 0.015;
          float noise2 = snoise(p * 2.5 - u_time * 0.02) * 0.01;
          baseColor += vec3(noise1 + noise2);
          
          float rippleEffect = 0.0;
          
          // Create 3 water ripples with multiple concentric waves
          
          // Ripple 1 - Top-right area
          vec2 pos1 = vec2(
            hash(vec2(1.0, 2.0)) * 1.4 - 0.3,
            hash(vec2(3.0, 4.0)) * 1.4 - 0.2
          ) * vec2(u_resolution.x / u_resolution.y, 1.0);
          float ripple1 = createWaterRipple(p, pos1, u_time, floor(u_time / 7.0) * 7.0, 0.4);
          rippleEffect += ripple1 * 0.5;
          
          // Ripple 2 - Center-left area
          vec2 pos2 = vec2(
            hash(vec2(5.0, 6.0)) * 1.6 - 0.7,
            hash(vec2(7.0, 8.0)) * 1.6 - 0.1
          ) * vec2(u_resolution.x / u_resolution.y, 1.0);
          float ripple2 = createWaterRipple(p, pos2, u_time, floor(u_time / 9.0) * 9.0 + 2.0, 0.35);
          rippleEffect += ripple2 * 0.55;
          
          // Ripple 3 - Bottom area
          vec2 pos3 = vec2(
            hash(vec2(9.0, 10.0)) * 1.5 - 0.1,
            hash(vec2(11.0, 12.0)) * 1.5 - 0.8
          ) * vec2(u_resolution.x / u_resolution.y, 1.0);
          float ripple3 = createWaterRipple(p, pos3, u_time, floor(u_time / 8.0) * 8.0 + 4.5, 0.38);
          rippleEffect += ripple3 * 0.48;
          
          // Mouse interactive ripple
          vec2 mousePos = (u_mouse * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
          float mouseRipple = createWaterRipple(p, mousePos, u_time, floor(u_time * 0.8) / 0.8, 0.5);
          rippleEffect += mouseRipple * 0.35;
          
          // Apply ripple effect (subtle)
          vec3 finalColor = baseColor + vec3(rippleEffect * 0.05);
          
          // Keep within color range
          finalColor = clamp(finalColor, color1, color4);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true,
    });

    // Create plane mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (event) => {
      mouseX = event.clientX / window.innerWidth;
      mouseY = 1.0 - (event.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Update uniforms
      material.uniforms.u_time.value = elapsedTime;
      material.uniforms.u_mouse.value.x += (mouseX - material.uniforms.u_mouse.value.x) * 0.05;
      material.uniforms.u_mouse.value.y += (mouseY - material.uniforms.u_mouse.value.y) * 0.05;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.u_resolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div id="canvas-wrapper" className="webgl-background">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WebGLBackground;
