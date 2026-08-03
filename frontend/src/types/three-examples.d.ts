// Type declarations for three/examples/jsm subpath imports.
// three@0.171.0 exports these via its "exports" field, but
// @types/three lacks the typesVersions mapping, so TypeScript
// can't resolve them automatically. These declarations bridge that gap.

declare module "three/examples/jsm/controls/OrbitControls" {
  import { Camera, Controls, MOUSE, TOUCH, Vector3 } from "three";

  export interface OrbitControlsEventMap {
    change: {};
    start: {};
    end: {};
  }

  declare class OrbitControls extends Controls<OrbitControlsEventMap> {
    target: Vector3;
    cursor: Vector3;
    minDistance: number;
    maxDistance: number;
    minZoom: number;
    maxZoom: number;
    minTargetRadius: number;
    maxTargetRadius: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    zoomSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    reverseOrbit: boolean;
    reverseHorizontalOrbit: boolean;
    reverseVerticalOrbit: boolean;
    enableKeys: boolean;
    keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };
    mouseButtons: {
      LEFT: MOUSE;
      MIDDLE: MOUSE;
      RIGHT: MOUSE;
    };
    touches: { ONE: TOUCH; TWO: TOUCH };
    constructor(object: Camera, domElement?: HTMLElement);
    update(): boolean;
    saveState(): void;
    reset(): void;
    dispose(): void;
    getAzimuthalAngle(): number;
    getPolarAngle(): number;
    getSpherical(): unknown;
    getDistance(): number;
    listenToKeyEvents(domElement: HTMLElement | Window): void;
    stopListenToKeyEvents(): void;
  }

  export { OrbitControls };
}

declare module "three/examples/jsm/renderers/CSS2DRenderer" {
  import { Camera, Object3D, Scene, Vector2 } from "three";

  export class CSS2DObject extends Object3D {
    constructor(element: HTMLElement);
    element: HTMLElement;
    center: Vector2;
    onBeforeRender: (renderer: unknown, scene: Scene, camera: Camera) => void;
    onAfterRender: (renderer: unknown, scene: Scene, camera: Camera) => void;
  }

  export type CSS2DParameters = {
    element?: HTMLElement;
  };

  export class CSS2DRenderer {
    constructor(parameters?: CSS2DParameters);
    domElement: HTMLElement;
    getSize(): { width: number; height: number };
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: Camera): void;
  }
}
