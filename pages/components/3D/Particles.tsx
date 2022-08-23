//@ts-nocheck
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  LineSegments,
  Points,
  Vector2,
  Vector3,
  DynamicDrawUsage,
  AdditiveBlending,
} from "three";
import { ParticleMaterial } from "../../shaders/ParticleShader";
import { LinesMaterial } from "../../shaders/LineShader";
extend({ ParticleMaterial });
extend({ LinesMaterial });

const Particles = () => {
  const ref = useRef<Points>(null!!);
  const refL = useRef<LineSegments>(null!!);

  const count = 250;
  const segments = count * count;

  const minDistance = 0.12;

  const [xBound, yBound, zBound] = [1.75, 0.75, 0.75];
  const viewport = useThree();

  const [positions, positionsL, particlesData, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const positionsL = new Float32Array(segments * 3);
    const colors = new Float32Array(segments * 3);
    const particlesData: { velocity: Vector3; numConnections: number }[] = [];
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * xBound;
      positions[i * 3 + 1] = (Math.random() - 0.5) * yBound;
      positions[i * 3 + 2] = (Math.random() - 0.5) * zBound;

      particlesData.push({
        velocity: new Vector3(
          (Math.random() - 0.5) / 1000,
          (Math.random() - 0.5) / 1000,
          (Math.random() - 0.5) / 1000
        ),
        numConnections: 0,
      });
    }

    return [positions, positionsL, particlesData, colors];
  }, [segments, xBound, yBound, zBound]);

  useEffect(() => {
    (ref.current.material as THREE.ShaderMaterial).uniforms.viewport.value =
      new Vector2(window.innerWidth, window.innerHeight);
    (refL.current.material as THREE.ShaderMaterial).uniforms.viewport.value =
      new Vector2(window.innerWidth, window.innerHeight);

    refL.current.geometry.attributes.position.setUsage(DynamicDrawUsage);
  }, [viewport]);
  useFrame(({ clock, mouse }) => {
    (ref.current.material as THREE.ShaderMaterial).uniforms.time.value =
      clock.elapsedTime;
    (ref.current.material as THREE.ShaderMaterial).uniforms.uMouse.value =
      mouse;
    (refL.current.material as THREE.ShaderMaterial).uniforms.time.value =
      clock.elapsedTime;
    (refL.current.material as THREE.ShaderMaterial).uniforms.uMouse.value =
      mouse;

    // const position = ref.current.geometry.attributes.position.array;
    // const positionL = refL.current.geometry.attributes.position.array;

    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    for (let i = 0; i < count; i++) {
      particlesData[i].numConnections = 0;
    }

    for (let i = 0; i < count; i++) {
      // The current particle
      const particleData = particlesData[i];

      if (particleData) {
        if (positions[i * 3] > xBound / 2 || positions[i * 3] < -xBound / 2) {
          particleData.velocity.x = -particleData.velocity.x;
        }
        if (
          positions[i * 3 + 1] > yBound / 2 ||
          positions[i * 3 + 1] < -yBound / 2
        ) {
          particleData.velocity.y = -particleData.velocity.y;
        }
        if (
          positions[i * 3 + 2] > zBound / 2 ||
          positions[i * 3 + 2] < -zBound / 2
        ) {
          particleData.velocity.z = -particleData.velocity.z;
        }
        positions[i * 3] += particleData.velocity.x;
        positions[i * 3 + 1] += particleData.velocity.y;
        positions[i * 3 + 2] += particleData.velocity.z;
      }

      for (let j = i + 1; j < count; j++) {
        const particleDataL = particlesData[j];
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < minDistance) {
          particleData.numConnections++;
          particleDataL.numConnections++;

          const alpha = 1.0 - dist / minDistance;

          positionsL[vertexpos++] = positions[i * 3];
          positionsL[vertexpos++] = positions[i * 3 + 1];
          positionsL[vertexpos++] = positions[i * 3 + 2];

          positionsL[vertexpos++] = positions[j * 3];
          positionsL[vertexpos++] = positions[j * 3 + 1];
          positionsL[vertexpos++] = positions[j * 3 + 2];

          colors[colorpos++] = alpha;
          colors[colorpos++] = alpha;
          colors[colorpos++] = alpha;

          colors[colorpos++] = alpha;
          colors[colorpos++] = alpha;
          colors[colorpos++] = alpha;

          numConnected++;
        }
      }
    }
    refL.current.geometry.setDrawRange(0, numConnected * 2);
    ref.current.geometry.attributes.position.needsUpdate = true;
    refL.current.geometry.attributes.position.needsUpdate = true;
    refL.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <group position={[-0.1, 1.3, 5]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach={"attributes-position"}
            count={count}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <particleMaterial transparent depthWrite={false} />
      </points>
      <lineSegments ref={refL}>
        <bufferGeometry>
          <bufferAttribute
            attach={"attributes-position"}
            count={segments}
            itemSize={3}
            array={positionsL}
          />
          <bufferAttribute
            attach={"attributes-color"}
            count={segments}
            itemSize={3}
            array={colors}
          />
        </bufferGeometry>
        <linesMaterial transparent vertexColors={true} depthWrite={false} />
      </lineSegments>
    </group>
  );
};

export default Particles;
