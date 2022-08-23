import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import { Vector2 } from "three";

type paricleMaterialImpl = {
  transparent: boolean;
  depthWrite: boolean;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      particleMaterial: paricleMaterialImpl;
    }
  }
}

export const ParticleMaterial = shaderMaterial(
  {
    time: null,
    viewport: new Vector2(500, 500),
    uMouse: new Vector2(0, 0),
  },
  glsl`
        void main() {
          gl_PointSize = 6.0;
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
          float dista = length(gl_PointCoord - vec2(0.5));
          float disc = smoothstep(0.5,0.45,dista);
          gl_FragColor = vec4(disc*circle);
          // gl_FragColor = vec4(disc);
          if(disc<0.001) discard;

        }`
);
