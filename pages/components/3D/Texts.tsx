import React, { useEffect, useRef } from "react";
import font from "../../../public/font/Font.json";
import createGeometry from "../../Text/Text";
import {
  Color,
  DoubleSide,
  ShaderMaterial,
  TextureLoader,
  Vector2,
} from "three";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextMaterial } from "../../shaders/TextShader";
import { MsdfMaterial } from "../../shaders/MsdfShader";
extend({ TextMaterial });
extend({ MsdfMaterial });

const HeadingText = () => {
  const [colorMap, gradient] = useLoader(TextureLoader, [
    "/font/atlas.png",
    "/font/gradient.png",
  ]);
  const materialRef = useRef<ShaderMaterial>(null!!);
  const materialRef2 = useRef<ShaderMaterial>(null!!);
  const viewport = useThree();
  useEffect(() => {
    materialRef.current.uniforms.viewport.value = new Vector2(
      window.innerWidth,
      window.innerHeight
    );
    materialRef2.current.uniforms.viewport.value = new Vector2(
      window.innerWidth,
      window.innerHeight
    );
  }, [viewport]);
  useFrame(({ clock, mouse }) => {
    materialRef.current.uniforms.time.value = clock.elapsedTime;
    materialRef.current.uniforms.uMouse.value = mouse;

    materialRef2.current.uniforms.time.value = clock.elapsedTime;
    materialRef2.current.uniforms.uMouse.value = mouse;
  });

  const geometry = createGeometry({
    align: "center",
    font: font,
    text: "EXPERIENCE THE",
    lineHeight: 72,
  });
  const geometry2 = createGeometry({
    align: "center",
    font: font,
    text: "FURNITURE",
    lineHeight: 72,
  });
  const geometry3 = createGeometry({
    align: "center",
    font: font,
    text: "scroll to begin experience",
    lineHeight: 72,
  });

  return (
    <group>
      <mesh
        scale={0.003}
        geometry={geometry}
        rotation={[0, Math.PI, Math.PI]}
        position={[-1, 1.45, 5]}
      >
        <textMaterial
          ref={materialRef}
          side={DoubleSide}
          map={colorMap}
          gradient={gradient}
          color={new Color("white")}
          opacity={1.0}
          transparent={true}
        />
      </mesh>
      <mesh
        scale={0.003}
        geometry={geometry2}
        rotation={[0, Math.PI, Math.PI]}
        position={[-0.7, 1.2, 5]}
      >
        <textMaterial
          ref={materialRef2}
          side={DoubleSide}
          map={colorMap}
          gradient={gradient}
          color={new Color("white")}
          opacity={1.0}
          transparent={true}
        />
      </mesh>
      <mesh
        geometry={geometry3}
        scale={0.0005}
        rotation={[0, Math.PI, Math.PI]}
        position={[-0.35, 1, 5]}
      >
        <msdfMaterial
          side={DoubleSide}
          map={colorMap}
          color={new Color("white")}
          opacity={1.0}
          transparent={true}
        />
      </mesh>
    </group>
  );
};

export default HeadingText;
