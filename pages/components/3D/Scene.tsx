import {
  Environment,
  OrbitControls,
  Scroll,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import { useFrame, Canvas } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { PointLight, Vector3 } from "three";
import Model from "./Model";
import Particles from "./Particles";
import HeadingText from "./Texts";

const MyLight = () => {
  const lightRef = useRef<PointLight>(null!);
  useFrame(({ mouse }) => {
    const x = mouse.x * 1.7;
    const y = mouse.y * 0.7 + 1.3;
    lightRef.current.position.set(x, y, 5);
  });
  0x229794;
  const color = "white";
  const intensity = 2;
  return (
    <pointLight
      ref={lightRef}
      color={color}
      intensity={intensity}
      position={[0, 1.3, 5.5]}
    />
  );
};
const Plane = () => {
  return (
    <mesh position={[-0.13, 1.2, 4.5]}>
      <planeBufferGeometry args={[5, 2.5]} />
      <meshPhongMaterial color={"black"} opacity={0.9} transparent />
    </mesh>
  );
};

const Animation = () => {
  const scroll = useScroll();
  useFrame(({ camera }) => {
    const a = scroll.range(0, 1 / 5, 0.05);
    if (a > 0.5) {
      camera.position.lerp(new Vector3(-0.6, 2.3, 3.1), 0.01);
    } else if (a < 0.5) {
      camera.position.lerp(new Vector3(-6, 2.3, -3.2), 0.01);
    }
  });
  return (
    <group rotation={[0, Math.PI * 1.35, 0]} position={[0, 1, 0]}>
      <HeadingText />
      <Model />
      <Plane />
      {/* <Clouds /> */}
      <MyLight />
      <Particles />
    </group>
  );
};
const Scene = () => {
  return (
    <Canvas
      camera={{
        fov: 51,
        far: 100,
        // position: [-0.6, 2.3, 3.1],
        position: [-6, 2.3, -3.2],
        rotation: [0, Math.PI * 1.35, 0],
      }}
    >
      <ScrollControls pages={1}>
        <Animation />
      </ScrollControls>

      {/* <EffectComposer>
            <DepthOfField
              focusDistance={0.12}
              focalLength={0.3}
              bokehScale={10}
            />
          </EffectComposer> */}

      {/* <OrbitControls /> */}

      <Environment background={true} files={"enviroment.hdr"} path={"/"} />
      <ambientLight intensity={1} />
    </Canvas>
  );
};

export default Scene;
