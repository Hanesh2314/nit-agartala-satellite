import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type { Department } from '@/types';

interface Satellite3DProps {
  departments: Department[];
  onPartClick?: (departmentId: number) => void;
}

export default function Satellite3D({ departments, onPartClick }: Satellite3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || departments.length === 0) return;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0F1C);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create basic satellite body
    const satelliteBody = new THREE.Group();
    scene.add(satelliteBody);

    // Main body - a box
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 0.8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      specular: 0x111111,
      shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    satelliteBody.add(body);

    // Solar panels
    const panelGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.7);
    const panelMaterial = new THREE.MeshPhongMaterial({
      color: 0x0055ff,
      specular: 0x222222,
      shininess: 50
    });
    
    // Left panel
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-1.2, 0, 0);
    satelliteBody.add(leftPanel);
    
    // Right panel
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.set(1.2, 0, 0);
    satelliteBody.add(rightPanel);

    // Add interactive parts based on departments
    const interactiveParts: { mesh: THREE.Mesh, departmentId: number }[] = [];
    
    departments.forEach((dept, index) => {
      // Convert hex color string to number
      const colorHex = dept.color.replace('#', '0x');
      const color = parseInt(colorHex, 16);
      
      // Create a sphere for each department
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.2,
        specular: 0xffffff,
        shininess: 100
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      
      // Position spheres at different locations
      switch (index % 3) {
        case 0: // Engineering
          sphere.position.set(0.8, 0.5, 0.5);
          break;
        case 1: // Communications
          sphere.position.set(-0.8, 0.5, 0.5);
          break;
        case 2: // Data Science
          sphere.position.set(0, -0.5, 0.5);
          break;
      }
      
      satelliteBody.add(sphere);
      interactiveParts.push({ mesh: sphere, departmentId: dept.id });
    });

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      
      // Slowly rotate the satellite
      satelliteBody.rotation.y += 0.002;
      
      controls.update();
      renderer.render(scene, camera);
    }
    
    animate();
    setLoaded(true);

    // Add raycaster for interactive parts
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function onMouseClick(event: MouseEvent) {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Check for intersections with interactive parts
      const intersects = raycaster.intersectObjects(
        interactiveParts.map(part => part.mesh)
      );
      
      if (intersects.length > 0) {
        // Find which part was clicked
        const clickedMesh = intersects[0].object;
        const clickedPart = interactiveParts.find(part => part.mesh === clickedMesh);
        
        if (clickedPart && onPartClick) {
          onPartClick(clickedPart.departmentId);
        }
      }
    }
    
    renderer.domElement.addEventListener('click', onMouseClick);

    // Handle window resize
    function handleResize() {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }
    
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.domElement.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      
      // Dispose geometries and materials
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      panelGeometry.dispose();
      panelMaterial.dispose();
      
      interactiveParts.forEach(part => {
        if (part.mesh.geometry) part.mesh.geometry.dispose();
        if (part.mesh.material) {
          const material = part.mesh.material as THREE.Material;
          material.dispose();
        }
      });
      
      // Clear scene
      while(scene.children.length > 0) { 
        const object = scene.children[0];
        scene.remove(object);
      }
    };
  }, [departments, onPartClick]);

  return (
    <div ref={containerRef} className="w-full h-[400px] rounded-lg">
      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
