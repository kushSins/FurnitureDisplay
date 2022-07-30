import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { AttachType } from "@react-three/fiber/dist/declarations/src/core/renderer";
import glsl from "babel-plugin-glsl/macro";
import React, { useEffect, useRef } from "react";
import { BufferAttribute, Color, DoubleSide, Mesh, Side } from "three";
import vert from "./Vert.glsl";

type MyMaterialType = {
  key: String;
  side: Side;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      myShaderMaterial: MyMaterialType;
    }
  }
}

const MyShaderMaterial = shaderMaterial(
  {},
  vert,
  //   glsl`
  //         attribute float aRandom;
  //         varying float vRandom;
  //         void main() {
  //             vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  //             // modelPosition.z +=sin(modelPosition.x * 6.0) * 0.1;
  //             modelPosition.z+=aRandom*0.2;
  //             vec4 viewPosition = viewMatrix * modelPosition;
  //             vec4 projectedPosition = projectionMatrix * viewPosition;
  //             gl_Position = projectedPosition;
  //             vRandom = aRandom;

  //         }
  //     `
  glsl`
        varying float vRandom;
        void main() {
            gl_FragColor = vec4(1.0,vRandom,0.0,1.0);
        }
    `
);

extend({ MyShaderMaterial });

const Shader = () => {
  const ref = useRef<Mesh>(null!);
  useEffect(() => {
    if (ref.current) {
      console.log(ref.current);

      const count = ref.current.geometry.attributes.position.count;
      const randoms = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        randoms[i] = Math.random();
      }

      ref.current.geometry.setAttribute(
        `aRandom`,
        new BufferAttribute(randoms, 1)
      );
    }
  }, [ref]);

  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[2.5, 3, 32, 32]} />
      <myShaderMaterial side={DoubleSide} key={MyShaderMaterial.key} />
    </mesh>
  );
};

export default Shader;
