declare module "babel-plugin-glsl/macro" {
  export { glsl as default } from "react-relay";
}

declare module "*.vtx" {
  const content: string;
  export default content;
}

declare module "*.frg" {
  const content: string;
  export default content;
}

declare module "*.glsl" {
  const content: string;
  export default content;
}
