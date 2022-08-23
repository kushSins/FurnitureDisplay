import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import { Matrix4, Side, Vector4 } from "three";

type FireMaterialImpl = {
  transparent: boolean;
  depthWrite: boolean;
  depthTest: boolean;
  side: Side;
  key: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fireMaterial: FireMaterialImpl;
    }
  }
}

export const FireMaterial = shaderMaterial(
  {
    fireTex: null,
    color: null,
    time: 0.0,
    seed: 0.0,
    invModelMatrix: new Matrix4(),
    scale: null,
    noiseScale: new Vector4(1, 2, 1, 0.3),
    magnitude: 2.5,
    lacunarity: 3.0,
    gain: 0.6,
  },
  glsl`varying vec3 vWorldPos;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        }`,
  glsl`
        #pragma glslify: snoise = require("glsl-noise/simplex/3d")

        uniform vec3 color;
        uniform float time;
        uniform float seed;
        uniform mat4 invModelMatrix;
        uniform vec3 scale;
        uniform vec4 noiseScale;
        uniform float magnitude;
        uniform float lacunarity;
        uniform float gain;
        uniform sampler2D fireTex;
        varying vec3 vWorldPos;


        float turbulence(vec3 p) {
          float sum = 0.0;
          float freq = 1.0;
          float amp = 0.9;

          for(int i = 0; i < 3; i++) {
            sum += abs(snoise(p * freq)) * amp;
            freq *= lacunarity;
            amp *= gain;
          }
          return sum;
        }

        vec4 samplerFire (vec3 p, vec4 scale) {
          vec2 st = vec2(sqrt(dot(p.xz, p.xz)), p.y);
          if(st.x <= 0.0 || st.x >= 1.0 || st.y <= 0.0 || st.y >= 1.0) return vec4(0.0);
          p.y -= (seed + time) * scale.w;
          p *= scale.xyz;
          st.y += sqrt(st.y) * magnitude * turbulence(p);
          if(st.y <= 0.0 || st.y >= 1.0) return vec4(0.0);
          return texture2D(fireTex, st);
        }

        vec3 localize(vec3 p) {
          return (invModelMatrix * vec4(p, 1.0)).xyz;
        }

        void main() {
          vec3 rayPos = vWorldPos;
          vec3 rayDir = normalize(rayPos - cameraPosition);
          float rayLen = 0.0288 * length(scale.xyz);
          vec4 col = vec4(0.0);
          for(int i = 0; i < 10; i++) {
            rayPos += rayDir * rayLen;
            vec3 lp = localize(rayPos);
            lp.y += 0.2;
            lp.xz *= 2.0;
            col += samplerFire(lp, noiseScale);
          }
          col.a = col.r;
          gl_FragColor = col;
        }`
);
