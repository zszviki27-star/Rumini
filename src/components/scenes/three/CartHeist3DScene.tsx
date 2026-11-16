import {useEffect, useRef, useState} from 'react';
import {Camera, ChevronDown, ChevronUp, RotateCcw} from 'lucide-react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {
  createCartAndMice,
  createStreetAndTavern,
  createTridentSign,
} from './buildSceneModels';
import {
  createCobbleTexture,
  createTimberTexture,
  disposeObjectTree,
} from './proceduralMaterials';

export type CameraPreset = 'follow' | 'sign' | 'street';

interface CartHeist3DSceneProps {
  cartProgress: number; // 0..100
  completedSteps: number; // 0..3
  crashed: boolean;
}

// Pre-allocated math helpers outside the render loop (zero GC)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function CartHeist3DScene({
  cartProgress,
  completedSteps,
  crashed,
}: CartHeist3DSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [preset, setPreset] = useState<CameraPreset>('follow');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Mutable state refs synced to the animation loop without tearing down WebGL
  const stateRef = useRef({
    cartProgress,
    completedSteps,
    crashed,
    preset: 'follow' as CameraPreset,
    transitionActive: false,
  });

  useEffect(() => {
    stateRef.current.cartProgress = cartProgress;
    stateRef.current.completedSteps = completedSteps;
    stateRef.current.crashed = crashed;
    if (stateRef.current.preset === 'follow' || crashed) {
      stateRef.current.transitionActive = true;
    }
  }, [cartProgress, completedSteps, crashed]);

  const handleSelectPreset = (nextPreset: CameraPreset) => {
    setPreset(nextPreset);
    stateRef.current.preset = nextPreset;
    stateRef.current.transitionActive = true;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 720;
    const height = container.clientHeight || 480;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1320);
    scene.fog = new THREE.FogExp2(0x0b1320, 0.032);

    // Studio environment reflection for metallic gilded brass & iron rims
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(-5.8, 4.2, 8.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4;
    controls.maxDistance = 19;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.target.set(-1.5, 1.3, -0.3);
    controls.update();

    controls.addEventListener('start', () => {
      stateRef.current.transitionActive = false;
    });

    // Warm/Cool 3-point lighting rig (max 1 shadow caster)
    const hemiLight = new THREE.HemisphereLight(0x7aa2d6, 0x261a12, 0.65);
    scene.add(hemiLight);

    const keyMoonLight = new THREE.DirectionalLight(0xcbe0ff, 1.4);
    keyMoonLight.position.set(-6, 12, 9);
    keyMoonLight.castShadow = !isSoftwareGl;
    keyMoonLight.shadow.mapSize.width = 1024;
    keyMoonLight.shadow.mapSize.height = 1024;
    keyMoonLight.shadow.camera.near = 1;
    keyMoonLight.shadow.camera.far = 35;
    keyMoonLight.shadow.camera.left = -12;
    keyMoonLight.shadow.camera.right = 12;
    keyMoonLight.shadow.camera.top = 10;
    keyMoonLight.shadow.camera.bottom = -10;
    keyMoonLight.shadow.bias = -0.0005;
    keyMoonLight.shadow.normalBias = 0.02;
    scene.add(keyMoonLight);

    // Warm tavern lantern point light illuminating the drop zone and gilded sign
    const tavernLantern = new THREE.PointLight(0xffa94d, 4.5, 16, 1.6);
    tavernLantern.position.set(3.8, 3.6, 0.6);
    scene.add(tavernLantern);

    const rimLight = new THREE.DirectionalLight(0xfbbf24, 0.55);
    rimLight.position.set(8, 5, -7);
    scene.add(rimLight);

    // Procedural Textures & Composite Models
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const cobbleTex = createCobbleTexture(maxAniso);
    const timberTex = createTimberTexture(maxAniso);

    const streetRig = createStreetAndTavern(cobbleTex, timberTex, !isSoftwareGl);
    scene.add(streetRig.group);

    const signRig = createTridentSign(!isSoftwareGl);
    scene.add(signRig.group);

    const cartRig = createCartAndMice(timberTex, !isSoftwareGl);
    cartRig.group.position.set(-6.5, 0, 0.2);
    scene.add(cartRig.group);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // ResizeObserver for responsive container
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(200, Math.floor(entry.contentRect.width));
      const h = Math.max(200, Math.floor(entry.contentRect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation State
    const clock = new THREE.Clock();
    let currentCartX = -6.5;
    let wheelAngle = 0;
    let walkPhase = 0;
    let signFallY = -0.66;
    let signFallVel = 0;
    let signLanded = false;
    let signFallRotZ = 0;
    let cameraShake = 0;
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const syncState = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (syncState === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // 1. Cart X travel: 0% -> x = -6.5, 76% -> x = +1.3 (short of drop zone x = 3.8!)
      const targetCartX = -6.5 + (st.cartProgress / 100) * 10.3;
      const prevCartX = currentCartX;
      currentCartX = THREE.MathUtils.damp(currentCartX, targetCartX, 4.5, delta);
      const speedX = Math.abs(currentCartX - prevCartX);
      cartRig.group.position.x = currentCartX;

      // Rotate spoked wheels proportionally to forward distance (radius = 0.32)
      wheelAngle -= (currentCartX - prevCartX) / 0.32;
      cartRig.wheels.forEach((w) => {
        w.rotation.z = wheelAngle;
      });

      // Animate Rumini & Puva walking legs when cart is rolling
      if (speedX > 0.002) {
        walkPhase += delta * 14;
        const swing = Math.sin(walkPhase) * 0.45;
        cartRig.ruminiLegL.rotation.z = swing;
        cartRig.ruminiLegR.rotation.z = -swing;
        cartRig.puvaLegL.rotation.z = -swing;
        cartRig.puvaLegR.rotation.z = swing;
      } else {
        cartRig.ruminiLegL.rotation.z = THREE.MathUtils.damp(cartRig.ruminiLegL.rotation.z, 0, 8, delta);
        cartRig.ruminiLegR.rotation.z = THREE.MathUtils.damp(cartRig.ruminiLegR.rotation.z, 0, 8, delta);
        cartRig.puvaLegL.rotation.z = THREE.MathUtils.damp(cartRig.puvaLegL.rotation.z, 0, 8, delta);
        cartRig.puvaLegR.rotation.z = THREE.MathUtils.damp(cartRig.puvaLegR.rotation.z, 0, 8, delta);
      }

      // 2. Overhead Trident Sign & Chains
      signRig.chainLeft.visible = st.completedSteps < 2 && !st.crashed;
      signRig.chainRight.visible = !st.crashed;

      if (!st.crashed) {
        const swayAmp = 0.04 + st.completedSteps * 0.08;
        signRig.signPivot.rotation.z = Math.sin(elapsed * (2.2 + st.completedSteps * 1.4)) * swayAmp;
      } else {
        // Drop onto cobblestones!
        if (!signLanded) {
          signFallVel += 16.5 * delta;
          signFallY -= signFallVel * delta;
          signFallRotZ = THREE.MathUtils.damp(signFallRotZ, 0.35, 6, delta);
          // Ground level relative to signRig.group (y = 4.45) and sign height (~1.2) -> y = -3.8
          if (signFallY <= -3.72) {
            signFallY = -3.72;
            signLanded = true;
            cameraShake = 0.24;
          }
          signRig.signPivot.position.y = signFallY;
          signRig.signPivot.rotation.z = signFallRotZ;
          signRig.signPivot.rotation.x = THREE.MathUtils.damp(signRig.signPivot.rotation.x, 1.32, 7, delta);
        }
        // Gang scrambles upward out of sight on the roof
        streetRig.gangGroup.position.x = THREE.MathUtils.damp(streetRig.gangGroup.position.x, -4.5, 2.5, delta);
      }

      // Subtle pulse-free highlight ring opacity change on crash
      const ringMat = streetRig.targetRing.material as THREE.MeshBasicMaterial;
      ringMat.color.setHex(st.crashed ? 0xef4444 : 0xf59e0b);

      // 3. Camera Preset Smooth Damping (only when preset active, cleared on user drag)
      if (st.transitionActive) {
        if (st.preset === 'follow') {
          _targetCamPos.set(currentCartX - 1.2, 4.0, 8.6);
          _targetLookAt.set(currentCartX + 2.2, 1.4, -0.2);
        } else if (st.preset === 'sign') {
          _targetCamPos.set(1.2, 3.6, 6.2);
          _targetLookAt.set(3.8, 2.4, 0.2);
        } else {
          _targetCamPos.set(-1.5, 6.2, 12.2);
          _targetLookAt.set(-0.6, 1.4, -0.5);
        }

        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 4.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 4.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 4.5, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLookAt.x, 4.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLookAt.y, 4.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLookAt.z, 4.5, delta);

        if (camera.position.distanceTo(_targetCamPos) < 0.05) {
          st.transitionActive = false;
        }
      }

      if (cameraShake > 0.005) {
        camera.position.y += Math.sin(elapsed * 48) * cameraShake;
        cameraShake = THREE.MathUtils.damp(cameraShake, 0, 8, delta);
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    // Start animation loop
    stateRef.current.transitionActive = true;
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      disposeObjectTree(scene);
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[470px] rounded-xl overflow-hidden border border-slate-800 bg-[#0B1320]">
      {/* Dedicated WebGL Mount Container */}
      <div ref={mountRef} className="w-full h-full" />

      {contextLost && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1320] p-6 text-center space-y-2 z-20">
          <p className="font-display text-lg text-[#F4EFE6]">
            A 3D nézet jelenleg nem elérhető
          </p>
          <p className="text-sm text-slate-400">
            A történet folytatásához használd alább a kocsi tolása gombot.
          </p>
        </div>
      )}

      {/* Minimal Top-Left Scene Label (no backdrop-filter, no pulsing dots) */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-[#0B1320]/85 border border-slate-700/80 text-xs text-slate-200">
        Egérváros · 3D jelenet (húzással forgatható)
      </div>

      {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center max-w-[94%]">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="px-3 py-1 rounded-t-lg bg-[#0E1828]/95 border border-b-0 border-slate-700 text-[11px] font-medium text-slate-300 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Kamera nézetek</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Elrejtés</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E1828]/95 border border-slate-700 shadow-lg">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mr-1">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Nézet:</span>
            </span>
            <button
              type="button"
              onClick={() => handleSelectPreset('follow')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                preset === 'follow'
                  ? 'bg-amber-600 text-[#0B1320] font-semibold'
                  : 'bg-[#192841] text-slate-200 hover:bg-[#233757]'
              }`}
            >
              Kis kocsi követése
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('sign')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                preset === 'sign'
                  ? 'bg-amber-600 text-[#0B1320] font-semibold'
                  : 'bg-[#192841] text-slate-200 hover:bg-[#233757]'
              }`}
            >
              Cégér közelről
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('street')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                preset === 'street'
                  ? 'bg-amber-600 text-[#0B1320] font-semibold'
                  : 'bg-[#192841] text-slate-200 hover:bg-[#233757]'
              }`}
            >
              <RotateCcw className="w-3 h-3 inline mr-1" />
              Teljes utca
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
