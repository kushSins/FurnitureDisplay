import { Canvas, useThree } from "@react-three/fiber";
import React, { Suspense } from "react";
import styles from "../../styles/Home.module.css";
import { Center, Environment, Html, OrbitControls } from "@react-three/drei";
import Scene from "./Scene";
import { flexbox } from "@mui/system";

const HtmlContent = () => {
  const { size } = useThree();
  return (
    <Html
      style={{
        position: "absolute",
        top: -size.height,
        left: -size.width / 2,
        width: size.width,
        height: size.height,
        textAlign: "center",
        fontSize: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "whiteSmoke",
      }}
    >
      <h1 className="">Feel The Furniture</h1>
    </Html>
  );
};

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <Suspense fallback={"none"}>
        <Canvas
          camera={{
            fov: 46,
            position: [-6, 2.3, -3.2],
            rotation: [0, Math.PI * 1.35, 0],
          }}
        >
          {/* <HtmlContent /> */}
          <Scene rotation={[0, Math.PI * 1.35, 0]} position={[0, 1, 0]} />
          <Environment background={true} files={"enviroment.hdr"} path={"/"} />
          <ambientLight intensity={1} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default LandingPage;

// const MyLight = () => {
//   const lightRef = useRef<PointLight>(null!);
//   const { viewport } = useThree();
//   // 0x229794
//   const color = 0x229794;
//   const intensity = 2;

//   useFrame(({ mouse }) => {
//     const x = (mouse.x * viewport.width) / 2;
//     const y = (mouse.y * viewport.height) / 2;
//     lightRef.current.position.set(x, y, 0.5);
//     lightRef.current.rotation.set(-y, x, 0.5);
//   });
//   return (
//     <pointLight
//       ref={lightRef}
//       color={color}
//       intensity={intensity}
//       decay={2.5}
//       distance={20}
//       position={[0, 0, 0.5]}
//       scale={[10, 10, 10]}
//     />
//   );
// };

// const onMouseMove = (e: THREE.Event) => {
//     setX(((e.clientX / e.target.offsetWidth - 0.5) * -Math.PI) / 8);
//     setY(((e.clientY / e.target.offsetHeight - 0.5) * -Math.PI) / 8);
//   };

// const [x, setX] = useState(0);
// const [y, setY] = useState(0);
