import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import { Vector2 } from "three";

type linesMaterialImpl = {
  transparent: boolean;
  depthWrite: boolean;
  vertexColor: boolean;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      linesMaterial: linesMaterialImpl;
    }
  }
}

export const LinesMaterial = shaderMaterial(
  {
    time: null,
    viewport: new Vector2(500, 500),
    uMouse: new Vector2(0, 0),
  },
  glsl`
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vec3(position),1.0);
        }`,
  glsl`


        uniform float time;
        uniform vec2 uMouse;
        uniform vec2 viewport;



        float createCircle(){
          vec2 viewportUv = gl_FragCoord.xy / viewport;
          float viewportAspect = viewport.x / viewport.y;

          vec2 mousePoint = vec2((uMouse.x*0.5) + 0.5, (uMouse.y*0.5) + 0.5);
          float circleRadius = max(0.0, 120. / viewport.x);

          vec2 shapeUv = viewportUv - mousePoint;
          shapeUv /= vec2(1., viewportAspect);
          shapeUv += mousePoint;
          float dist = distance(shapeUv, mousePoint);
          dist = smoothstep(circleRadius, circleRadius + 0.001, dist);
          return dist;

        }

        void main() {
          float circle = 1. - createCircle();
          gl_FragColor = vec4(circle);
          // gl_FragColor = vec4(1.0);
          if (gl_FragColor.a < 0.001) discard;


        }`
);
