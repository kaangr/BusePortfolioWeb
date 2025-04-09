import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Sphere, Cylinder, SpotLight, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Lamp({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const [isOn, setIsOn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lampRef = useRef<THREE.Group>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const initialY = position[1];
  const { camera, viewport } = useThree();

  // Enhanced spring physics
  const { springPos, springRot } = useSpring({
    springPos: isDragging ? [0, position[1] - 2, 0] : [0, position[1], 0],
    springRot: isDragging ? [0.3, 0, 0] : [0, 0, 0],
    config: {
      mass: 3,
      tension: 280,
      friction: 30,
      velocity: velocityRef.current.y,
      precision: 0.0001,
    },
  });

  useFrame((state) => {
    if (!isDragging && lampRef.current) {
      // Enhanced gravity and momentum with position clamping
      velocityRef.current.y = Math.max(velocityRef.current.y - 0.002, -0.1);
      const newY = Math.min(
        Math.max(
          lampRef.current.position.y + velocityRef.current.y,
          initialY - 3
        ),
        initialY
      );
      
      // Improved bounce at initial position with position reset safeguard
      if (Math.abs(newY - initialY) < 0.01) {
        lampRef.current.position.y = initialY;
        velocityRef.current.y = 0;
      } else {
        lampRef.current.position.y = newY;
      }

      // Enhanced natural swaying with damping and limits
      const time = state.clock.getElapsedTime();
      const swayAmount = Math.min(0.08 * Math.exp(-Math.abs(velocityRef.current.y)), 0.1);
      lampRef.current.rotation.x = Math.min(
        Math.max(
          Math.sin(time * 1.5) * swayAmount + (velocityRef.current.y * 2),
          -0.3
        ),
        0.3
      );
      lampRef.current.rotation.z = Math.min(
        Math.max(
          Math.cos(time * 0.75) * swayAmount * 0.5,
          -0.15
        ),
        0.15
      );
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    if (lampRef.current) {
      velocityRef.current = { x: 0, y: 0 };
    }
  };

  const handlePointerMove = (e: any) => {
    if (isDragging && lampRef.current) {
      const deltaY = (e.clientY - lastMouseRef.current.y) * 0.015;
      const newY = Math.min(initialY, lampRef.current.position.y - deltaY);
      lampRef.current.position.y = Math.max(newY, initialY - 3); // Limit drag distance
      velocityRef.current.y = -deltaY;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    setIsDragging(false);
    if (Math.abs(velocityRef.current.y) > 0.05) {
      setIsOn(!isOn);
      onClick();
    }
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <animated.group
      ref={lampRef}
      position={springPos}
      rotation={springRot}
      onPointerDown={handlePointerDown}
    >
      {/* Enhanced cord with better physics */}
      <Cylinder
        args={[0.03, 0.03, initialY - (lampRef.current?.position.y || position[1])]}
        position={[0, ((initialY - (lampRef.current?.position.y || position[1])) / 2), 0]}
      >
        <meshStandardMaterial 
          color="#444444"
          metalness={0.6}
          roughness={0.3}
        />
      </Cylinder>

      {/* Modern lamp body */}
      <group position={[0, -0.8, 0]}>
        <Cylinder 
          args={[0.4, 0.5, 0.6]} 
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#888888"
            metalness={0.9}
            roughness={0.1}
            emissive={isOn ? new THREE.Color(0x666666) : new THREE.Color(0x000000)}
          />
        </Cylinder>
      </group>

      {/* Enhanced light bulb */}
      <Sphere args={[0.15]} position={[0, -1.1, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive={isOn ? new THREE.Color(0xffffcc) : new THREE.Color(0x666666)}
          emissiveIntensity={isOn ? 3 : 0}
          transparent={true}
          opacity={0.9}
        />
      </Sphere>

      {/* Enhanced lighting effects */}
      {isOn && (
        <>
          <SpotLight
            position={[0, -1.1, 0]}
            angle={0.6}
            penumbra={0.8}
            intensity={3}
            color="#ffffcc"
            distance={15}
            castShadow
          />
          <pointLight
            position={[0, -1.1, 0]}
            intensity={1}
            color="#ffffcc"
            distance={3}
          />
        </>
      )}
    </animated.group>
  );
}

export function PendantLamp() {
  const [isLightOn, setIsLightOn] = useState(false);

  return (
    <div className="fixed top-0 left-20 w-80 h-screen pointer-events-auto z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.2} />
        <Lamp
          position={[0, 4, 0]}
          onClick={() => setIsLightOn(!isLightOn)}
        />
      </Canvas>
    </div>
  );
} 