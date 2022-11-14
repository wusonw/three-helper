import { PerspectiveCamera } from "three";
import {
  Camera,
  Color,
  Object3D,
  OrbitControls,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "../plugins/three";

export default class ThreeHelper {
  objectMap: Map<string, Object3D>;
  raycasterObjects: Object3D[];
  camera: Camera;
  scene: Scene;
  renderer: WebGLRenderer;
  raycaster: Raycaster;
  controls: OrbitControls | null;
  raycasterTarget: Object3D | null;

  constructor() {
    this.objectMap = new Map();
    this.raycasterObjects = [];
    this.camera = new PerspectiveCamera();
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ antialias: true });
    this.raycaster = new Raycaster();
    this.controls = null;
    this.raycasterTarget = null;
  }

  init(width?: number, height?: number) {
    this.scene.add(this.camera);
    const cWith = width || 100;
    const cHeight = height || 100;
    const mouse = new Vector2();
    this.renderer.setSize(cWith, cHeight);
    this.renderer.setClearColor(new Color(0, 0, 0), 0);

    this.renderer.domElement.onpointermove = (event: PointerEvent) => {
      mouse.x = (event.offsetX / cWith) * 2 - 1;
      mouse.y = -(event.offsetY / cHeight) * 2 + 1;
      // console.log(this.camera);
      this.raycaster.setFromCamera(mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.raycasterObjects,
        true
      );
      if (intersects[0]) {
        const obj = intersects[0].object;
        this.raycasterTarget = this.objectMap.get(obj.uuid) || null;
      }
    };

    window.onresize = (e: Event) => {
      const width = this.renderer.domElement.clientWidth;
      const height = this.renderer.domElement.clientHeight;

      console.log(width, height);
      this.renderer.setSize(width, height);
      this.camera.updateMatrix();
      this.render();
    };

    return this.renderer.domElement;
  }

  render() {
    this?.renderer.render(this.scene, this.camera);
  }

  animate(cb?: Function) {
    requestAnimationFrame(this.render);
    this.controls?.update();
    cb && cb();
  }

  add(obj: Object3D, options?: { info?: any; ray?: boolean }) {
    const existed = this.objectMap.has(obj.uuid);
    if (!existed) {
      const info = options?.info;
      const ray = options?.ray ?? true;
      obj.userData = { info };
      this.objectMap.set(obj.uuid, obj);
      if (ray) {
        this.raycasterObjects.push(obj);
      }
      this.scene.add(obj);
      this.render();
    }
  }

  remove(obj: Object3D) {
    const existed = this.objectMap.has(obj.uuid);
    if (!existed) return;
    this.scene.remove(obj);
    this.objectMap.delete(obj.uuid);
    const index = this.raycasterObjects.findIndex((v) => v.uuid === obj.uuid);
    index >= 0 && this.raycasterObjects.splice(index, 1);
    this.render();
  }

  changeCamera(camera: Camera) {
    this.camera = camera;
    camera.updateMatrix();
    this.render();
  }

  useControl(enable?: boolean) {
    if (!enable) {
      this.controls = null;
      return;
    }
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 0.18;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.8;
  }
}
