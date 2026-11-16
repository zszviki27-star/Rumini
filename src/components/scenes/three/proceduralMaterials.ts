import * as THREE from 'three';

export function createCobbleTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#1b2434';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 12;
    const cols = 10;
    const cellW = 512 / cols;
    const cellH = 512 / rows;

    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (cellW * 0.5);
      for (let c = -1; c <= cols; c++) {
        const x = c * cellW + offset + 3;
        const y = r * cellH + 3;
        const w = cellW - 6;
        const h = cellH - 6;
        const shade = 34 + ((r * 13 + c * 29) % 18);
        ctx.fillStyle = `rgb(${shade}, ${shade + 8}, ${shade + 20})`;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 220, 160, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 5);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createTimberTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#4a3222';
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 16; i++) {
      const y = i * 16;
      ctx.fillStyle = i % 2 === 0 ? '#553a28' : '#3f291c';
      ctx.fillRect(0, y, 256, 14);
      ctx.fillStyle = '#25170f';
      ctx.fillRect(0, y + 14, 256, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function disposeObjectTree(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) geometries.add(obj.geometry);
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        if (!mat) return;
        materials.add(mat);
        Object.values(mat).forEach((val) => {
          if (val instanceof THREE.Texture) {
            textures.add(val);
          }
        });
      });
    }
  });

  textures.forEach((t) => t.dispose());
  materials.forEach((m) => m.dispose());
  geometries.forEach((g) => g.dispose());
}
