'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

function FloatingOrb({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.2
    ref.current.rotation.x += 0.003
    ref.current.rotation.y += 0.004
  })

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.7} />
    </mesh>
  )
}

export function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-55">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={1.1} color="#d4af37" />
        <FloatingOrb position={[-1.8, 0.8, 0]} color="#6d7aff" />
        <FloatingOrb position={[1.5, -0.3, -1]} color="#d4af37" />
        <FloatingOrb position={[0, 1.4, -1.2]} color="#F1E9DB" />
      </Canvas>
    </div>
  )
}
