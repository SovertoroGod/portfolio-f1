import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

// CC BY 4.0 model by Dave Love (Tyler_Dave):
// https://sketchfab.com/3d-models/2026-redbull-rb22-0a3d24a58e0549d591a5a48c22eec383
// Re-exported locally (weld + simplify + WebP textures); the licence requires the credit shown in SiteFooter.
export const CAR_URL = "/models/red-bull-rb22.glb";

export function RaceCar({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { scene } = useGLTF(CAR_URL);
  const turntable = useRef<THREE.Group>(null);

  // Model space: nose along -X, 5.4 m long, already resting on y = 0.
  const car = useMemo(() => {
    const node = scene.clone(true);
    node.rotation.y = Math.PI;
    node.position.x = -0.24;
    node.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) material.envMapIntensity = 1.4;
      });
    });
    return node;
  }, [scene]);

  useFrame((_, delta) => {
    if (turntable.current && !reducedMotion) turntable.current.rotation.y += delta * 0.075;
  });

  return (
    <group ref={turntable}>
      <primitive object={car} />
    </group>
  );
}

useGLTF.preload(CAR_URL);
