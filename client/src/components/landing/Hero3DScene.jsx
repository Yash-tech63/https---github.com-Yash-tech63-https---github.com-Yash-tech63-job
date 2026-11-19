import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Hero3DScene = () => {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL init failed, falling back:', err);
      setHasWebGL(false);
      return;
    }

    // LIGHTING (Warm White, Charcoal & Subtle Gold Specular)
    const ambientLight = new THREE.AmbientLight(0xFAF9F6, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 2.4);
    dirLight1.position.set(8, 12, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xC6A15B, 1.2);
    dirLight2.position.set(-8, -6, -5);
    scene.add(dirLight2);

    // ROOT GROUP
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. CENTRAL GEOMETRIC OBJECT (Charcoal faceted core + restrained gold wireframe)
    const icoGeo = new THREE.IcosahedronGeometry(2.4, 0);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x202124,
      roughness: 0.25,
      metalness: 0.85,
      flatShading: true,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);

    const icoWireMat = new THREE.MeshBasicMaterial({
      color: 0xC6A15B,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const icoWireMesh = new THREE.Mesh(icoGeo, icoWireMat);
    icoWireMesh.scale.set(1.025, 1.025, 1.025);

    const centerGroup = new THREE.Group();
    centerGroup.add(icoMesh);
    centerGroup.add(icoWireMesh);
    rootGroup.add(centerGroup);

    // 2. ORBITAL CONCENTRIC RINGS (Charcoal and Muted Gold)
    const ring1Geo = new THREE.TorusGeometry(4.2, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(5.4, 0.02, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xC6A15B,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    rootGroup.add(ring2);

    // 3. FLOATING OPPORTUNITY CARDS / CUBES (Charcoal with Gold Edges)
    const cards = [];
    const cardGeo = new THREE.BoxGeometry(0.85, 0.55, 0.08);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x202124,
      roughness: 0.3,
      metalness: 0.7,
    });
    const cardEdgeMat = new THREE.LineBasicMaterial({
      color: 0xC6A15B,
      transparent: true,
      opacity: 0.85,
    });

    const cardPositions = [
      { x: -3.5, y: 2.2, z: 1.5, rx: 0.2, ry: 0.4 },
      { x: 3.8, y: 1.8, z: -1.2, rx: -0.3, ry: -0.2 },
      { x: -2.8, y: -2.4, z: 1.8, rx: 0.4, ry: -0.5 },
      { x: 3.2, y: -2.0, z: -1.0, rx: -0.2, ry: 0.3 },
      { x: 0.2, y: 3.8, z: -2.0, rx: 0.5, ry: 0.1 },
    ];

    cardPositions.forEach((pos, idx) => {
      const cardGroup = new THREE.Group();
      const card = new THREE.Mesh(cardGeo, cardMat);
      cardGroup.add(card);

      const edges = new THREE.EdgesGeometry(cardGeo);
      const line = new THREE.LineSegments(edges, cardEdgeMat);
      cardGroup.add(line);

      cardGroup.position.set(pos.x, pos.y, pos.z);
      cardGroup.rotation.set(pos.rx, pos.ry, 0);

      cardGroup.userData = {
        baseX: pos.x,
        baseY: pos.y,
        baseZ: pos.z,
        speed: 0.008 + idx * 0.004,
        offset: idx * 1.5,
      };

      rootGroup.add(cardGroup);
      cards.push(cardGroup);
    });

    // 4. CONSTELLATION NODES & CONNECTED NETWORK
    const nodeCount = 32;
    const nodePositions = [];
    const nodeGroup = new THREE.Group();

    for (let i = 0; i < nodeCount; i++) {
      const radius = 3.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      nodePositions.push(new THREE.Vector3(x, y, z));
    }

    // Node spheres: alternating between warm white and subtle gold
    const nodeGeo = new THREE.SphereGeometry(0.065, 8, 8);
    const nodeMatWhite = new THREE.MeshBasicMaterial({ color: 0xFAF9F6 });
    const nodeMatGold = new THREE.MeshBasicMaterial({ color: 0xC6A15B });

    nodePositions.forEach((pos, idx) => {
      const node = new THREE.Mesh(nodeGeo, idx % 4 === 0 ? nodeMatGold : nodeMatWhite);
      node.position.copy(pos);
      nodeGroup.add(node);
    });

    // Connecting lines between close nodes
    const lineIndices = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 2.4) {
          lineIndices.push(nodePositions[i], nodePositions[j]);
        }
      }
    }

    const linePoints = [];
    lineIndices.forEach((pt) => {
      linePoints.push(pt.x, pt.y, pt.z);
    });
    const constellationLinesGeo = new THREE.BufferGeometry();
    constellationLinesGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePoints, 3)
    );
    const constellationLinesMat = new THREE.LineBasicMaterial({
      color: 0xE9E6DF,
      transparent: true,
      opacity: 0.35,
    });
    const constellationLines = new THREE.LineSegments(
      constellationLinesGeo,
      constellationLinesMat
    );
    nodeGroup.add(constellationLines);
    rootGroup.add(nodeGroup);

    // 5. AMBIENT WARM WHITE / GOLD PARTICLES
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 15;
    }

    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xE9E6DF,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // MOUSE PARALLAX TRACKING
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / height) * 2 - 1);
      targetMouseX = x * 0.6;
      targetMouseY = y * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // SCROLL LISTENER
    let scrollRotation = 0;
    const handleScroll = () => {
      scrollRotation = window.scrollY * 0.001;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // RENDER LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Rotate central core
      centerGroup.rotation.x = elapsedTime * 0.15 + currentMouseY * 0.8;
      centerGroup.rotation.y = elapsedTime * 0.22 + currentMouseX * 0.8 + scrollRotation;

      // Orbit rings
      ring1.rotation.z = elapsedTime * 0.08;
      ring2.rotation.y = elapsedTime * -0.06;

      // Animate node constellation
      nodeGroup.rotation.y = elapsedTime * 0.05 + currentMouseX * 0.3;
      nodeGroup.rotation.x = currentMouseY * 0.3;

      // Float cards
      cards.forEach((card) => {
        const u = card.userData;
        card.position.y = u.baseY + Math.sin(elapsedTime * 1.5 + u.offset) * 0.2;
        card.rotation.x += 0.003;
        card.rotation.y += 0.004;
      });

      // Drift particles
      particles.rotation.y = elapsedTime * 0.02;

      // Subtle scene tilt
      rootGroup.rotation.y = currentMouseX * 0.4;
      rootGroup.rotation.x = -currentMouseY * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);

      icoGeo.dispose();
      icoMat.dispose();
      icoWireMat.dispose();
      ring1Geo.dispose();
      ringMat1.dispose();
      ring2Geo.dispose();
      ringMat2.dispose();
      cardGeo.dispose();
      cardMat.dispose();
      cardEdgeMat.dispose();
      nodeGeo.dispose();
      nodeMatWhite.dispose();
      nodeMatGold.dispose();
      constellationLinesGeo.dispose();
      constellationLinesMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  if (!hasWebGL) {
    // High-fidelity fallback SVG constellation in Charcoal, Warm White & Gold
    return (
      <div className="w-full h-full min-h-[420px] flex items-center justify-center relative p-8">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-w-[420px]"
          fill="none"
        >
          <circle cx="250" cy="250" r="160" stroke="#E9E6DF" strokeDasharray="4 4" strokeWidth="1" />
          <circle cx="250" cy="250" r="110" stroke="#C6A15B" strokeWidth="1" strokeOpacity="0.6" />
          <polygon
            points="250,130 350,200 310,330 190,330 150,200"
            fill="#202124"
            stroke="#C6A15B"
            strokeWidth="1.5"
          />
          <circle cx="250" cy="130" r="4" fill="#C6A15B" />
          <circle cx="350" cy="200" r="4" fill="#FAF9F6" />
          <circle cx="310" cy="330" r="4" fill="#C6A15B" />
          <circle cx="190" cy="330" r="4" fill="#FAF9F6" />
          <circle cx="150" cy="200" r="4" fill="#C6A15B" />
          <circle cx="250" cy="250" r="6" fill="#C6A15B" />
          <line x1="250" y1="250" x2="250" y2="130" stroke="#E9E6DF" strokeWidth="1" />
          <line x1="250" y1="250" x2="350" y2="200" stroke="#E9E6DF" strokeWidth="1" />
          <line x1="250" y1="250" x2="310" y2="330" stroke="#E9E6DF" strokeWidth="1" />
          <line x1="250" y1="250" x2="190" y2="330" stroke="#E9E6DF" strokeWidth="1" />
          <line x1="250" y1="250" x2="150" y2="200" stroke="#E9E6DF" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[420px] lg:min-h-[540px] flex items-center justify-center relative select-none pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};
