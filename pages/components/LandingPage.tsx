import React, { Suspense } from "react";
import styles from "../../styles/Home.module.css";
import Scene from "./3D/Scene";

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <Suspense fallback={"none"}>
        <Scene />
      </Suspense>
    </div>
  );
};

export default LandingPage;
