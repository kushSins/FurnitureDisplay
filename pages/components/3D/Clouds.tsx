import { Instance, Instances } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { DoubleSide, MathUtils, TextureLoader } from "three";

const Cloud = ({ positionX, positionZ, rotationZ }) => {
  const ref = useRef<typeof Instance>(null!!);

  useEffect(
    () => {
      if (ref.current) {
        //@ts-ignore
        ref.current.position.set(positionX, 2, positionZ);
        //@ts-ignore
        ref.current.rotation.set(0, 0, rotationZ);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(() => {
    //@ts-ignore
    ref.current.rotation.z -= Math.sin(0.0015);
  });

  return <Instance ref={ref} />;
};

const Clouds = () => {
  const [smoke] = useLoader(TextureLoader, ["/textures/smoke.png"]);
  const particles = Array.from({ length: 50 }, () => ({
    positionX: MathUtils.randFloatSpread(1),
    positionZ: MathUtils.randFloatSpread(1),
    rotationZ: Math.random() * Math.PI * 2,
  }));

  return (
    <Instances position={[0, 1, 4.9]}>
      <planeBufferGeometry args={[10, 10]} />
      <meshPhongMaterial
        map={smoke}
        color={"black"}
        transparent={true}
        side={DoubleSide}
        opacity={1}
      />
      {particles.map((data, i) => (
        <Cloud key={i} {...data} />
      ))}
    </Instances>
  );
};

export default Clouds;
