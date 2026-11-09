import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

// CC BY 4.0 model by Dave Love (Tyler_Dave):
// https://sketchfab.com/3d-models/2026-redbull-rb22-0a3d24a58e0549d591a5a48c22eec383
// Re-exported locally (weld + simplify + WebP textures); the licence requires the credit shown in SiteFooter.
export const CAR_URL = "/models/red-bull-rb22.glb";

const AXES = ["x", "y", "z"] as const;

// The rims read as a 36-spoke pattern, so their visual repeat is 10 degrees. One frame that
// advances a tyre further than half that repeat makes the spokes stand still or run backwards,
// which looks like a wobbling wheel — so the step is capped per frame as well as per second.
const MAX_SPIN_RATE = 3;
const MAX_SPIN_STEP = 0.05;
const MAX_FRAME_DELTA = 1 / 20;

type Wheel = { pivot: THREE.Group; axis: (typeof AXES)[number]; radius: number };

export function RaceCar({ speed = 0 }: { speed?: number }) {
  const { scene } = useGLTF(CAR_URL);

  // Model space: nose along -X, 5.4 m long, already resting on y = 0.
  // Flipping by PI puts the nose along +X, the direction the track scrolls from.
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

  // Each wheel's vertices are baked in model space with the node left at the origin, so spinning
  // a node would swing the whole tyre around the car. Re-pivot every wheel on its own hub instead:
  // the hub keeps the offset and the pivot keeps the position, so nothing visually moves.
  const wheels = useMemo(() => {
    car.updateMatrixWorld(true);

    const named: THREE.Object3D[] = [];
    car.traverse((object) => {
      if (object.name.includes("Wheel")) named.push(object);
    });

    const found: Wheel[] = [];
    const box = new THREE.Box3();
    const piece = new THREE.Box3();
    const inverse = new THREE.Matrix4();
    const local = new THREE.Matrix4();

    for (const wheelNode of named) {
      const host = wheelNode.parent;
      if (!host || host.userData.wheelPivot) continue;
      let nested = false;
      for (let parent: THREE.Object3D | null = host; parent && parent !== car; parent = parent.parent) {
        // GLTFLoader names both the wheel group and its primitives, so only rig the outermost.
        if (named.includes(parent)) {
          nested = true;
          break;
        }
      }
      if (nested) continue;

      box.makeEmpty();
      inverse.copy(wheelNode.matrixWorld).invert();
      wheelNode.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.computeBoundingBox();
        piece.copy(child.geometry.boundingBox!);
        local.multiplyMatrices(inverse, child.matrixWorld);
        piece.applyMatrix4(local);
        box.union(piece);
      });
      if (box.isEmpty()) continue;

      const size = box.getSize(new THREE.Vector3());
      const hub = box.getCenter(new THREE.Vector3());
      const axis = AXES[size.x < size.y && size.x < size.z ? 0 : size.y < size.z ? 1 : 2];
      const radius = size.y / 2;
      if (radius < 0.05) continue;

      // The wheel node carries no rotation, so its frame is the host frame the hub is measured in.
      const pivot = new THREE.Group();
      pivot.position.copy(hub);
      pivot.userData.wheelPivot = true;
      wheelNode.position.sub(hub);
      host.add(pivot);
      pivot.add(wheelNode);

      found.push({ pivot, axis, radius });
    }

    return found;
  }, [car]);

  useFrame((_, delta) => {
    if (!speed) return;
    const dt = Math.min(delta, MAX_FRAME_DELTA);
    for (const wheel of wheels) {
      const rate = Math.min(speed / wheel.radius, MAX_SPIN_RATE);
      // Nose points along -X in model space, so +Z drives the tread toward the car's front.
      wheel.pivot.rotation[wheel.axis] += Math.min(rate * dt, MAX_SPIN_STEP);
    }
  });

  return <primitive object={car} />;
}

useGLTF.preload(CAR_URL);
