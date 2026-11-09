import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  useProgress,
} from "@react-three/drei";
import { RaceCar } from "./RaceCar";

const STREAK_COLORS = ["#e10600", "#ffd100", "#7fa8ff", "#ffffff"];
const TRACK_SPEED = 9;
const SCENE_MOVES = true;

// A circuit corner, not a grey strip: the road is one arc of radius TRACK_R centred at world
// (0, -TRACK_R), so it runs tangentially along +X through the origin and stays aligned with the car.
// Everything is measured from that centre: r = distance from it (TRACK_R is the racing line),
// a = angle around it in radians, with a = 0 beside the car.
const TRACK_R = 34;
const TRACK_CZ = -TRACK_R;
const TRACK_HALF_WIDTH = 4.4;
const TRACK_A = 0.8;
const TRACK_ARC = TRACK_A * TRACK_R;
const OUTER = TRACK_R + TRACK_HALF_WIDTH;
const INNER = TRACK_R - TRACK_HALF_WIDTH;

// Trackside furniture is placed with the same maths as the road: a run of them at fixed radius
// follows the corner, and each one is turned so its local +X is the direction of travel.
function arcXZ(radius: number, a: number): [number, number] {
  return [radius * Math.sin(a), TRACK_CZ + radius * Math.cos(a)];
}

type BandProps = {
  rFrom: number;
  rTo: number;
  aFrom: number;
  aTo: number;
  y: number;
  segments: number;
  color: string;
  roughness?: number;
  metalness?: number;
  paint?: boolean;
};

// A curved stripe of the track: a sector of an annulus laid flat, from radius rFrom..rTo and
// angle aFrom..aTo. Ring angles start at local +X, which is one quarter turn from our a = 0.
function Band({ rFrom, rTo, aFrom, aTo, y, segments, color, roughness = 0.93, metalness = 0.06, paint = false }: BandProps) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, y, TRACK_CZ]}>
      <ringGeometry args={[rFrom, rTo, segments, 1, aFrom - Math.PI / 2, aTo - aFrom]} />
      {paint ? (
        <meshBasicMaterial color={color} toneMapped={false} />
      ) : (
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      )}
    </mesh>
  );
}

type BlocksProps = {
  count: number;
  spacing: number;
  radius: number;
  offset: number;
  y: number;
  length: number;
  height: number;
  width: number;
  colors: string[];
  speed?: number;
  opacity?: number;
};

// Repeated track furniture laid along the arc — kerbs, barriers, boards, rubber marks. Each block is
// turned to face along its own tangent, so a run of them follows the corner instead of cutting
// across it. speed = 0 parks them, which is what a real circuit does.
function ArcBlocks({
  count,
  spacing,
  radius,
  offset,
  y,
  length,
  height,
  width,
  colors,
  speed = 0,
  opacity = 1,
}: BlocksProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const total = count * spacing;
  const slots = useMemo(
    () => Array.from({ length: count }, (_, index) => index * spacing - total / 2),
    [count, spacing, total],
  );

  const layout = () => {
    const instanced = mesh.current;
    if (!instanced) return;
    for (let index = 0; index < count; index++) {
      const a = offset + slots[index] / radius;
      const [x, z] = arcXZ(radius, a);
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, a, 0);
      dummy.scale.set(length, height, width);
      dummy.updateMatrix();
      instanced.setMatrixAt(index, dummy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
  };

  const signature = `${count}|${spacing}|${radius}|${offset}|${y}|${length}|${height}|${width}|${colors.join(",")}`;
  useEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    const color = new THREE.Color();
    for (let index = 0; index < count; index++) {
      color.set(colors[index % colors.length]);
      instanced.setColorAt(index, color);
    }
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    layout();
    // signature covers every prop layout reads; the array props are recreated each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummy, signature]);

  useFrame((_, delta) => {
    if (!speed) return;
    for (let index = 0; index < count; index++) {
      slots[index] -= speed * delta;
      if (slots[index] < -total / 2) slots[index] += total;
    }
    layout();
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity >= 1}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Track({ quality, moving }: { quality: "high" | "lite"; moving: boolean }) {
  const seg = quality === "high" ? 96 : 44;
  const reach = quality === "high" ? TRACK_ARC : TRACK_ARC * 0.62;
  const run = (spacing: number) => Math.max(3, Math.floor((2 * reach) / spacing));
  const span = (rFrom: number, rTo: number, y: number) => ({
    rFrom,
    rTo,
    y,
    segments: seg,
    aFrom: -TRACK_A,
    aTo: TRACK_A,
  });

  return (
    <group>
      {/* Tarmac: dirty shoulders, a rubbered-in racing line down the middle, clean line either side. */}
      <Band {...span(INNER, OUTER, 0)} color="#1b212c" roughness={0.94} metalness={0.05} />
      <Band {...span(OUTER - 0.95, OUTER - 0.05, 0.001)} color="#2a3040" roughness={1} metalness={0.02} />
      <Band {...span(INNER + 0.05, INNER + 0.95, 0.001)} color="#2a3040" roughness={1} metalness={0.02} />
      <Band {...span(TRACK_R - 1.9, TRACK_R - 1.15, 0.0015)} color="#0d1119" roughness={0.38} metalness={0.24} />
      <Band {...span(TRACK_R + 1.15, TRACK_R + 1.9, 0.0015)} color="#0d1119" roughness={0.38} metalness={0.24} />

      {/* Run-off: painted red-then-blue escape areas either side of the road. */}
      <Band {...span(OUTER + 0.7, OUTER + 2.2, 0.0018)} color="#8c1220" roughness={0.95} metalness={0.02} />
      <Band {...span(OUTER + 2.2, OUTER + 4, 0.0018)} color="#152a63" roughness={0.95} metalness={0.02} />
      <Band {...span(INNER - 2.2, INNER - 0.7, 0.0018)} color="#8c1220" roughness={0.95} metalness={0.02} />
      <Band {...span(INNER - 4.4, INNER - 2.2, 0.0018)} color="#152a63" roughness={0.95} metalness={0.02} />

      {/* Track-limit lines. */}
      <Band {...span(OUTER - 0.2, OUTER - 0.06, 0.0024)} color="#eef3ff" paint />
      <Band {...span(INNER + 0.06, INNER + 0.2, 0.0024)} color="#eef3ff" paint />

      {/* Raised red-and-white kerbs over painted bases, so no asphalt shows through the gaps. */}
      <Band {...span(OUTER + 0.02, OUTER + 0.62, 0.0028)} color="#161b26" />
      <Band {...span(INNER - 0.62, INNER - 0.02, 0.0028)} color="#161b26" />
      <ArcBlocks
        count={run(1.15)}
        spacing={1.15}
        radius={OUTER + 0.32}
        offset={0}
        y={0.03}
        length={1.06}
        height={0.07}
        width={0.55}
        colors={["#e10600", "#f4f7ff"]}
      />
      <ArcBlocks
        count={run(1.15)}
        spacing={1.15}
        radius={INNER - 0.32}
        offset={0}
        y={0.03}
        length={1.06}
        height={0.07}
        width={0.55}
        colors={["#f4f7ff", "#e10600"]}
      />

      {/* Pit-lane belt: alternating red and green boards mean "stay out of here". */}
      <ArcBlocks
        count={run(0.58)}
        spacing={0.58}
        radius={INNER - 1.5}
        offset={0}
        y={0.028}
        length={0.52}
        height={0.05}
        width={0.6}
        colors={["#e10600", "#17c964"]}
      />

      {/* Brake-reference boards and the barrier wall on the far side of the corner, where they
          frame the car instead of standing between it and the camera. */}
      <ArcBlocks
        count={3}
        spacing={2.1}
        radius={INNER - 3.2}
        offset={-0.2}
        y={0.31}
        length={0.54}
        height={0.62}
        width={0.18}
        colors={["#ffd100", "#eef2ff", "#e10600"]}
      />
      <ArcBlocks
        count={run(1.12)}
        spacing={1.12}
        radius={INNER - 5.1}
        offset={0}
        y={0.36}
        length={1.06}
        height={0.72}
        width={0.3}
        colors={["#eef2ff", "#e10600"]}
      />

      {/* Start/finish line just behind the car, with the grid boxes queued up behind it. */}
      <Band rFrom={INNER + 0.2} rTo={OUTER - 0.2} aFrom={-0.065} aTo={-0.035} y={0.0026} segments={6} color="#f4f7ff" paint />
      {[-0.13, -0.2, -0.27, -0.34].map((a) =>
        [-1, 1].map((side) => {
          const innerEdge = TRACK_R + side * 0.5;
          const outerEdge = TRACK_R + side * 3.2;
          return (
            <Band
              key={`${a}-${side}`}
              rFrom={Math.min(innerEdge, outerEdge)}
              rTo={Math.max(innerEdge, outerEdge)}
              aFrom={side > 0 ? a : a - 0.014}
              aTo={side > 0 ? a + 0.014 : a}
              y={0.0026}
              segments={5}
              color="#dfe7f6"
              paint
            />
          );
        }),
      )}

      {/* Rubber laid down by fast laps. These are the only markings that ever move. */}
      {[TRACK_R - 1.55, TRACK_R + 1.55].map((radius) => (
        <ArcBlocks
          key={radius}
          count={12}
          spacing={4.6}
          radius={radius}
          offset={0}
          y={0.002}
          length={3.4}
          height={0.012}
          width={0.6}
          colors={["#05070c"]}
          opacity={0.75}
          speed={moving ? TRACK_SPEED : 0}
        />
      ))}
    </group>
  );
}

// The full "lights out and away we go" sequence, replayed on a loop over the start line.
// Lamps come on one by one and stay on, all five hold red together, then everything goes dark.
const LAMP_OFFSETS = [-3.4, -1.7, 0, 1.7, 3.4];
const LIGHT_CYCLE = 6.4;
const LIGHT_FIRST = 1.1;
const LIGHT_STEP = 0.62;
const LIGHTS_OUT = LIGHT_FIRST + (LAMP_OFFSETS.length - 1) * LIGHT_STEP + 1.3;

function lampLevel(index: number, elapsed: number) {
  const t = elapsed % LIGHT_CYCLE;
  return t >= LIGHT_FIRST + index * LIGHT_STEP && t < LIGHTS_OUT ? 1 : 0;
}

function Lamp({ index, offset, animate }: { index: number; offset: number; animate: boolean }) {
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    // Held red when the scene is parked, so the gantry still reads as start lights.
    const lit = animate ? lampLevel(index, clock.elapsedTime) : 1;
    if (core.current) core.current.color.setRGB(0.13 + 0.87 * lit, 0.04 + 0.16 * lit, 0.04 + 0.04 * lit);
    if (halo.current) halo.current.opacity = 0.62 * lit;
  });

  return (
    <group position={[0, 2.36, offset]}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.09, 0.7, 0.09]} />
        <meshStandardMaterial color="#0b1018" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Spheres rather than housings, so the lamps glow from every viewing angle. */}
      <mesh>
        <sphereGeometry args={[0.2, 18, 14]} />
        <meshBasicMaterial ref={core} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.36, 14, 12]} />
        <meshBasicMaterial
          ref={halo}
          color="#ff3a1e"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function StartLights({ a, animate }: { a: number; animate: boolean }) {
  const [x, z] = arcXZ(TRACK_R, a);
  const spill = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!spill.current) return;
    if (!animate) {
      spill.current.intensity = 6 + LAMP_OFFSETS.length * 26;
      return;
    }
    const t = clock.elapsedTime;
    const lit = LAMP_OFFSETS.reduce((sum, _, index) => sum + lampLevel(index, t), 0);
    spill.current.intensity = 6 + lit * 26;
  });

  return (
    <group position={[x, 0, z]} rotation-y={a}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 1.45, side * (TRACK_HALF_WIDTH + 1.2)]}>
          <boxGeometry args={[0.3, 2.9, 0.3]} />
          <meshStandardMaterial color="#0a0e17" roughness={0.55} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 2.92, 0]}>
        <boxGeometry args={[0.34, 0.3, (TRACK_HALF_WIDTH + 1.2) * 2]} />
        <meshStandardMaterial color="#0a0e17" roughness={0.55} metalness={0.6} />
      </mesh>
      {LAMP_OFFSETS.map((offset, index) => (
        <Lamp key={offset} index={index} offset={offset} animate={animate} />
      ))}
      <pointLight ref={spill} position={[0, 2.2, 0]} color="#ff2a12" distance={16} decay={2} />
    </group>
  );
}

// Ordered near-to-far so the lite build's three flags are the ones actually in shot, and spaced for
// the dolly's wider, more head-on angle.
const FLAG_A = [-0.05, -0.14, -0.23, -0.32, -0.41, -0.5];

function MarshalFlags({ count, animate }: { count: number; animate: boolean }) {
  const cloths = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.elapsedTime;
    for (let index = 0; index < count; index++) {
      const cloth = cloths.current[index];
      if (!cloth) continue;
      cloth.rotation.y = Math.sin(t * 1.9 + index * 1.7) * 0.5;
      cloth.rotation.z = Math.sin(t * 3.1 + index * 0.9) * 0.16 - 0.1;
    }
  });

  const radius = INNER - 6.7;
  return (
    <>
      {FLAG_A.slice(0, count).map((a, index) => {
        const [x, z] = arcXZ(radius, a);
        return (
          <group key={a} position={[x, 0, z]} rotation-y={a}>
            <mesh position={[0, 1.05, 0]}>
              <cylinderGeometry args={[0.06, 0.07, 2.1, 8]} />
              <meshStandardMaterial color="#141a26" roughness={0.6} metalness={0.4} />
            </mesh>
            <group
              position={[0, 1.95, 0]}
              ref={(node) => {
                cloths.current[index] = node;
              }}
            >
              <mesh position={[0.46, 0, 0]}>
                <planeGeometry args={[0.9, 0.6]} />
                <meshStandardMaterial
                  color={index % 3 === 2 ? "#e10600" : "#ffd100"}
                  side={THREE.DoubleSide}
                  roughness={0.85}
                />
              </mesh>
            </group>
          </group>
        );
      })}
    </>
  );
}

// A floodlight that walks along the near edge of the straight, so the highlight keeps travelling
// across the paint instead of the car sitting under one fixed reflection.
function SweepingLight({ animate }: { animate: boolean }) {
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!light.current || !animate) return;
    const [x, z] = arcXZ(OUTER - 1.2, Math.sin(clock.elapsedTime * 0.21) * 0.24);
    light.current.position.set(x, 4.2, z);
  });

  const [x, z] = arcXZ(OUTER - 1.2, 0);
  return <pointLight ref={light} position={[x, 4.2, z]} intensity={150} color="#dce8ff" distance={20} decay={2} />;
}

// Camera rig: a trackside dolly instead of an orbit. The lens sits on a lane outside the road and
// travels the corner's arc, so the car stays put while the background slides past it. Look-at rests
// just behind the tail to push the car right, clear of the hero copy on the left; the phone build
// pulls back further because a 30° vertical fov is only ~17° across in portrait.
const DOLLY_LOOK: [number, number, number] = [-0.5, 0.55, 0];
// Phase that opens the shot on the front-side three-quarter view.
const DOLLY_PHASE = 0.62;

const DOLLY = {
  high: { radius: OUTER + 6, height: 2.5, swing: 0.17, rate: 0.26 },
  lite: { radius: OUTER + 11, height: 3.4, swing: 0.09, rate: 0.2 },
};

function dollyPose(elapsed: number, quality: keyof typeof DOLLY) {
  const { radius, height, swing, rate } = DOLLY[quality];
  const a = Math.sin(elapsed * rate + DOLLY_PHASE) * swing;
  // Two slower terms on top of the swing: the lane drifts in and out of the road and the lens
  // breathes vertically, so no single period gives the loop away.
  const [x, z] = arcXZ(radius + Math.sin(elapsed * 0.09) * 1.2, a);
  return new THREE.Vector3(x, height + Math.sin(elapsed * 0.13) * 0.6, z);
}

function TrackDolly({ animate, quality }: { animate: boolean; quality: keyof typeof DOLLY }) {
  const look = useMemo(() => new THREE.Vector3(...DOLLY_LOOK), []);

  useFrame(({ camera, clock }) => {
    if (!animate) return;
    camera.position.copy(dollyPose(clock.elapsedTime, quality));
    camera.lookAt(look);
  });

  return null;
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
  const moving = SCENE_MOVES && !reducedMotion;
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
        <RaceCar speed={moving ? TRACK_SPEED : 0} blurSamples={moving && quality === "high" ? 4 : 0} />
        <Track quality={quality} moving={moving} />
        <StartLights a={-0.05} animate={moving} />
        <MarshalFlags count={quality === "high" ? 6 : 3} animate={moving} />
        <SweepingLight animate={moving} />
      </group>

      {quality === "high" ? (
        <>
          {/* Sits just above the painted markings and reaches only 1.4 upward, so the shadow is the
              car itself rather than the gantry, flags and barrier standing over the road. */}
          <ContactShadows position={[0, 0.0236, 0]} opacity={0.72} scale={16} blur={2.6} far={1.4} resolution={512} color="#01030a" />
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
        camera={{ position: dollyPose(0, quality).toArray() as [number, number, number], fov: 30, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, camera }) => {
          gl.toneMappingExposure = 1.3;
          camera.lookAt(new THREE.Vector3(...DOLLY_LOOK));
        }}
        frameloop={active ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#03060f", 16, 46]} />
          <Rig reducedMotion={reducedMotion} quality={quality} />
          <TrackDolly animate={!reducedMotion} quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  );
}
