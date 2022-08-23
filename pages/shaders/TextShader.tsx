import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import { Color, Side, Texture, Vector2 } from "three";

type textMaterialImpl = {
  ref: any;
  map: Texture;
  gradient: Texture;
  opacity: number;
  color: Color;
  transparent: boolean;
  side: Side;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textMaterial: textMaterialImpl;
    }
  }
}

export const TextMaterial = shaderMaterial(
  {
    map: null,
    gradient: null,
    opacity: null,
    color: null,
    time: null,
    viewport: new Vector2(500, 500),
    uMouse: new Vector2(0, 0),
  },
  glsl`

        varying vec2 vUv;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          vUv = uv;
        }`,
  glsl`

        uniform sampler2D map;
        uniform sampler2D gradient;
        uniform float opacity;
        uniform float time;
        uniform vec2 uMouse;
        uniform vec2 viewport;
        uniform vec3 color;
        varying vec2 vUv;

        float median(float r, float g, float b)
        {
          return max(min(r, g), min(max(r, g), b));
        }

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

          float circle = createCircle();
          float width = 0.2 ;
          float lineProgress = 0.3;
          vec3 mySample = texture2D(map, vUv).rgb;
          float gr = texture2D(gradient, vUv).r;
          float sigDist = median(mySample.r, mySample.g, mySample.b) - 0.5;
          float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

          //stroke
          float border = fwidth(sigDist);
          float outline = smoothstep(-0.4,border,sigDist);
          outline *= 1.0 - smoothstep(width-border,width,sigDist);

          // gradient

          float grgr = fract(2.*gr + time/5.);
          float start = smoothstep(0.,0.1,grgr);
          float end = smoothstep(lineProgress,lineProgress - 0.1,grgr);
          float mask = start*end;
          mask = max(0.2, mask);


          float finalAlpha = outline*mask + alpha*circle;
          gl_FragColor = vec4(color.xyz, finalAlpha * opacity);
          if (gl_FragColor.a < 0.001) discard;
        }`
);
