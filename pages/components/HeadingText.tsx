import { Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
type propType = {
  x: number;
  y: number;
};
const HeadingText = ({ x, y }: propType) => {
  const { viewport } = useThree();
  const textRef = useRef<Text>(null!);

  return (
    <Suspense fallback="none">
      <Text
        ref={textRef}
        color={"white"}
        font={"http://fonts.gstatic.com/s/modak/v5/EJRYQgs1XtIEskMA-hI.woff"}
        position={[0, 7, 32]}
        rotation-x={x}
        rotation-y={y}
        receiveShadow
        castShadow
        anchorX="center"
        anchorY="middle"
        fontSize={3.9}
      >
        FEEL THE FURNITURE
      </Text>
    </Suspense>
  );
};

export default HeadingText;
