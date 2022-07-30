import type { NextPage } from "next";
import MyAppBar from "./components/MyAppBar";
import LandingPage from "./components/LandingPage";


const Home: NextPage = () => {
  return (
    <div>
      <MyAppBar />
      <LandingPage />
    </div>
  );
};

export default Home;
