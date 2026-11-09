import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
  useProgress,
} from "@react-three/drei";
import { RaceCar } from "./RaceCar";

const STREAK_COLORS = ["#e10600", "#ffd100", "#7fa8ff", "#ffffff"];
const TRACK_HALF_WIDTH = 4.4;
const TRACK_SPEED = 9;

type StripProps = {
  count: number;
  spacing: number;
  speed: number;
  z: number;
  y: number;
  size: [number, number, number];
  colors: string[];
};

function ScrollingStrip({ count, spacing, speed, z, y, size, colors }: StripProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const total = count * spacing;
  const xs = useMemo(
    () => Array.from({ length: count }, (_, index) => -total / 2 + index * spacing),
    [count, total],
  );

  useEffect(() => {
    if (!mesh.current) return;
    const color = new THREE.Color();
    xs.forEach((_, index) => {
      color.set(colors[index % colors.length]);
      mesh.current!.setColorAt(index, color);
    });
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [colors, xs]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    xs.forEach((_, index) => {
      xs[index] -= speed * delta;
      if (xs[index] < -total / 2) xs[index] += total;
      dummy.position.set(xs[index], y, z);
      dummy.scale.set(size[0], size[1], size[2]);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Track({ quality, moving }: { quality: "high" | "lite"; moving: boolean }) {
  const segments = quality === "high" ? 48 : 24;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.002, 0]}>
        <planeGeometry args={[64, TRACK_HALF_WIDTH * 2]} />
        <meshStandardMaterial color="#141922" roughness={0.92} metalness={0.08} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          rotation-x={-Math.PI / 2}
          position={[0, 0.002, side * (TRACK_HALF_WIDTH - 0.62)]}
        >
          <planeGeometry args={[64, 0.12]} />
          <meshBasicMaterial color="#e8eeff" toneMapped={false} />
        </mesh>
      ))}

      {moving ? (
        <>
          <ScrollingStrip
            count={segments}
            spacing={1.15}
            speed={TRACK_SPEED}
            z={TRACK_HALF_WIDTH - 0.3}
            y={0.002}
            size={[1.05, 0.02, 0.46]}
            colors={["#e10600", "#eef2ff"]}
          />
          <ScrollingStrip
            count={segments}
            spacing={1.15}
            speed={TRACK_SPEED}
            z={-(TRACK_HALF_WIDTH - 0.3)}
            y={0.002}
            size={[1.05, 0.02, 0.46]}
            colors={["#eef2ff", "#e10600"]}
          />
          <ScrollingStrip
            count={segments}
            spacing={2.6}
            speed={TRACK_SPEED * 1.25}
            z={0}
            y={0.002}
            size={[1.3, 0.02, 0.14]}
            colors={["#f4f7ff"]}
          />
          <ScrollingStrip
            count={segments}
            spacing={3.4}
            speed={TRACK_SPEED * 1.15}
            z={-2.2}
            y={0.002}
            size={[1.6, 0.02, 0.1]}
            colors={["#ffd100"]}
          />
        </>
      ) : null}
    </group>
  );
}

function SpeedStreaks({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const streaks = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: THREE.MathUtils.randFloat(-20, 20),
        y: THREE.MathUtils.randFloat(0.15, 4.6),
        z: THREE.MathUtils.randFloat(3.4, 12) * (Math.random() > 0.5 ? 1 : -1),
        length: THREE.MathUtils.randFloat(1.4, 5.2),
        speed: THREE.MathUtils.randFloat(2.5, 7),
      })),
    [count],
  );

  useEffect(() => {
    if (!mesh.current) return;
    const color = new THREE.Color();
    streaks.forEach((_, index) => {
      color.set(STREAK_COLORS[index % STREAK_COLORS.length]);
      mesh.current!.setColorAt(index, color);
    });
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [streaks]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    streaks.forEach((streak, index) => {
      streak.x -= streak.speed * delta;
      if (streak.x < -22) streak.x = 22;
      dummy.position.set(streak.x, streak.y, streak.z);
      dummy.scale.set(streak.length, 0.016, 0.016);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Rig({ reducedMotion, quality }: { reducedMotion: boolean; quality: "high" | "lite" }) {
  const moving = !reducedMotion;
  return (
    <>
      <hemisphereLight args={["#cfe0ff", "#0a1024", 0.6]} />
      <ambientLight intensity={0.7} color="#9fb6ff" />
      <directionalLight position={[6, 9, 5]} intensity={3.2} color="#ffffff" />
      <directionalLight position={[7.5, 3.4, 9]} intensity={1.8} color="#eaf0ff" />
      <spotLight position={[0, 8, 1.5]} angle={0.62} penumbra={0.9} intensity={300} color="#ffffff" distance={24} />
      <spotLight position={[-8, 5, 4]} angle={0.6} penumbra={1} intensity={230} color="#e10600" distance={26} />
      <spotLight position={[8, 4, -6]} angle={0.7} penumbra={1} intensity={200} color="#2f6bff" distance={26} />
      <pointLight position={[0, 1.4, -4]} intensity={55} color="#ffd100" distance={14} />

      {/* Local light rig the car can reflect, so metallic paint stops reading as black. */}
      <Environment resolution={256} frames={1}>
        <mesh scale={60}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshBasicMaterial color="#0b1226" side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, 22, 0]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[34, 8]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[18, 6, 20]} rotation-y={-Math.PI / 3}>
          <planeGeometry args={[16, 12]} />
          <meshBasicMaterial color="#c9d8ff" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-20, 5, 0]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[14, 10]} />
          <meshBasicMaterial color="#e10600" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[10, 4, -22]} rotation-y={Math.PI}>
          <planeGeometry args={[14, 10]} />
          <meshBasicMaterial color="#ffd100" side={THREE.DoubleSide} />
        </mesh>
      </Environment>

      <group position={[0, 0.02, 0]}>
        <RaceCar speed={moving ? TRACK_SPEED : 0} />
        <Track quality={quality} moving={moving} />
      </group>

      {quality === "high" ? (
        <>
          <ContactShadows position={[0, 0.002, 0]} opacity={0.72} scale={16} blur={2.6} far={4} resolution={512} color="#01030a" />
          <mesh rotation-x={-Math.PI / 2} position={[0, -0.06, 0]}>
            <planeGeometry args={[70, 70]} />
            <MeshReflectorMaterial
              resolution={512}
              mixBlur={8}
              mixStrength={26}
              blur={[420, 120]}
              mirror={0.55}
              depthScale={1.1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.3}
              color="#03060f"
              metalness={0.65}
              roughness={0.85}
            />
          </mesh>
        </>
      ) : (
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.06, 0]}>
          <planeGeometry args={[70, 70]} />
          <meshStandardMaterial color="#03060f" roughness={0.7} metalness={0.4} />
        </mesh>
      )}

      {!reducedMotion && <SpeedStreaks count={quality === "high" ? 64 : 24} />}
    </>
  );
}

export function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  const [active, setActive] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const quality = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth > 900 ? "high" : "lite"),
    [],
  );
  const webgl = useMemo(() => {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const node = container.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!webgl) {
    return (
      <div className="absolute inset-0" aria-hidden>
        <img src="/assets/og-cover.jpg" alt="" className="size-full object-cover opacity-70" />
      </div>
    );
  }

  return (
    <div ref={container} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, quality === "high" ? 1.8 : 1.4]}
        camera={{ position: [8.6, 2.9, 8.4], fov: 30, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.3;
        }}
        frameloop={active ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#03060f", 16, 46]} />
          <Rig reducedMotion={reducedMotion} quality={quality} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            rotateSpeed={0.45}
            minPolarAngle={0.72}
            maxPolarAngle={1.46}
            target={[0, 0.62, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
