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
        speed: THREE.MathUtils.randFloat(9, 26),
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

function Turntable() {
  return (
    <group>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[3.5, 3.5, 0.08, 64]} />
        <meshStandardMaterial color="#060c1c" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation-x={-Math.PI / 2}>
        <torusGeometry args={[3.44, 0.03, 8, 96]} />
        <meshStandardMaterial
          color="#1a1a1a"
          emissive={new THREE.Color("#e10600")}
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation-x={-Math.PI / 2}>
        <torusGeometry args={[2.9, 0.015, 8, 96]} />
        <meshStandardMaterial
          color="#1a1a1a"
          emissive={new THREE.Color("#ffd100")}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Rig({ reducedMotion, quality }: { reducedMotion: boolean; quality: "high" | "lite" }) {
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
        <RaceCar reducedMotion={reducedMotion} />
        <Turntable />
      </group>

      {quality === "high" ? (
        <>
          <ContactShadows position={[0, 0.012, 0]} opacity={0.72} scale={16} blur={2.6} far={4} resolution={512} color="#01030a" />
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
