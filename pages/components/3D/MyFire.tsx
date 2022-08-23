import { useTexture } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { FireMaterial } from "../../shaders/FireShader";



extend({ FireMaterial });


const MyFire = ({ color, ...props }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const texture = useTexture("textures/fire.png");

  useFrame((state) => {
    const invModelMatrix: THREE.Matrix4 = (
      ref.current.material as THREE.ShaderMaterial
    ).uniforms.invModelMatrix.value;
    ref.current.updateMatrixWorld();
    invModelMatrix.copy(ref.current.matrixWorld).invert();

    (ref.current.material as THREE.ShaderMaterial).uniforms.time.value =
      state.clock.elapsedTime;
    (
      ref.current.material as THREE.ShaderMaterial
    ).uniforms.invModelMatrix.value = invModelMatrix;
    (ref.current.material as THREE.ShaderMaterial).uniforms.scale.value =
      ref.current.scale;
  });
  useLayoutEffect(() => {
    texture.magFilter = texture.minFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    (ref.current.material as THREE.ShaderMaterial).uniforms.fireTex.value =
      texture;
    (ref.current.material as THREE.ShaderMaterial).uniforms.color.value =
      color || new THREE.Color(0xeeeeee);
    (
      ref.current.material as THREE.ShaderMaterial
    ).uniforms.invModelMatrix.value = new THREE.Matrix4();
    (ref.current.material as THREE.ShaderMaterial).uniforms.scale.value =
      new THREE.Vector3(1, 1, 1);
    (ref.current.material as THREE.ShaderMaterial).uniforms.seed.value =
      Math.random() * 19.19;
  }, [texture, color]);
  return (
    <mesh ref={ref} castShadow receiveShadow {...props}>
      <boxBufferGeometry args={[0.75, 0.45, 0.05]} />
      <fireMaterial
        key={FireMaterial.key}
        transparent
        side={THREE.DoubleSide}
        depthWrite={true}
        depthTest={true}
      />
    </mesh>
  );
};

export default MyFire;

//, { BoxGeometry, BufferGeometry, ClampToEdgeWrapping, LinearFilter, Mesh }
