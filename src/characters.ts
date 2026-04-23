import * as THREE from 'three';

export type CharacterKind = 'hero' | 'skulk' | 'brute' | 'wisp';

export type RigPose = {
  moving: boolean;
  attack: number;
  hitFlash: number;
  facingX: number;
  facingZ: number;
};

type PartSpec = {
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  z?: number;
  pivotY?: number;
  color: string;
  order: number;
  shape: 'torso' | 'head' | 'arm' | 'leg' | 'weapon' | 'glow' | 'shadow';
};

type CharacterSpec = {
  atlasCell: [number, number];
  width: number;
  height: number;
  y: number;
  scale: number;
  parts: PartSpec[];
};

const atlasTexture = new THREE.TextureLoader().load('./assets/sprites/gpt-character-atlas.png');
atlasTexture.colorSpace = THREE.SRGBColorSpace;
atlasTexture.minFilter = THREE.LinearMipmapLinearFilter;
atlasTexture.magFilter = THREE.LinearFilter;
atlasTexture.generateMipmaps = true;

const specs: Record<CharacterKind, CharacterSpec> = {
  hero: {
    atlasCell: [0, 0],
    width: 1.42,
    height: 1.75,
    y: 0.9,
    scale: 1,
    parts: [
      { name: 'shadow', width: 1.05, height: 0.18, x: 0, y: 0.05, z: -0.03, color: 'rgba(5,8,10,.38)', order: 0, shape: 'shadow' },
      { name: 'backLeg', width: 0.22, height: 0.58, x: -0.16, y: 0.38, z: -0.01, color: '#25395a', order: 1, shape: 'leg' },
      { name: 'frontLeg', width: 0.24, height: 0.62, x: 0.16, y: 0.39, z: 0.01, color: '#314d78', order: 7, shape: 'leg' },
      { name: 'backArm', width: 0.2, height: 0.58, x: -0.42, y: 0.88, z: -0.01, color: '#2f5f9d', order: 2, shape: 'arm' },
      { name: 'frontArm', width: 0.22, height: 0.62, x: 0.43, y: 0.9, z: 0.02, color: '#c88947', order: 9, shape: 'arm' },
      { name: 'weapon', width: 0.1, height: 0.82, x: 0.62, y: 1.0, z: 0.03, color: '#f1c66a', order: 10, shape: 'weapon' },
      { name: 'glow', width: 0.5, height: 0.5, x: 0.63, y: 0.83, z: 0.04, color: 'rgba(255,202,86,.55)', order: 11, shape: 'glow' },
    ],
  },
  skulk: {
    atlasCell: [1, 0],
    width: 1.16,
    height: 1.18,
    y: 0.64,
    scale: 1,
    parts: [
      { name: 'shadow', width: 0.92, height: 0.15, x: 0, y: 0.04, color: 'rgba(5,8,10,.35)', order: 0, shape: 'shadow' },
      { name: 'backLeg', width: 0.2, height: 0.42, x: -0.2, y: 0.28, color: '#5f293f', order: 1, shape: 'leg' },
      { name: 'frontLeg', width: 0.2, height: 0.42, x: 0.22, y: 0.29, color: '#8a3f51', order: 6, shape: 'leg' },
      { name: 'backArm', width: 0.18, height: 0.46, x: -0.38, y: 0.58, color: '#7a334b', order: 2, shape: 'arm' },
      { name: 'frontArm', width: 0.18, height: 0.5, x: 0.38, y: 0.58, color: '#c65f65', order: 8, shape: 'arm' },
    ],
  },
  brute: {
    atlasCell: [0, 1],
    width: 1.5,
    height: 1.48,
    y: 0.76,
    scale: 1.05,
    parts: [
      { name: 'shadow', width: 1.12, height: 0.18, x: 0, y: 0.05, color: 'rgba(5,8,10,.38)', order: 0, shape: 'shadow' },
      { name: 'backLeg', width: 0.3, height: 0.52, x: -0.22, y: 0.32, color: '#575663', order: 1, shape: 'leg' },
      { name: 'frontLeg', width: 0.32, height: 0.55, x: 0.24, y: 0.33, color: '#777482', order: 7, shape: 'leg' },
      { name: 'backArm', width: 0.27, height: 0.62, x: -0.54, y: 0.72, color: '#65626e', order: 2, shape: 'arm' },
      { name: 'frontArm', width: 0.3, height: 0.68, x: 0.56, y: 0.73, color: '#9a96a6', order: 9, shape: 'arm' },
      { name: 'weapon', width: 0.12, height: 0.76, x: 0.7, y: 0.8, color: '#d9c993', order: 10, shape: 'weapon' },
    ],
  },
  wisp: {
    atlasCell: [1, 1],
    width: 1.18,
    height: 1.3,
    y: 0.74,
    scale: 1,
    parts: [
      { name: 'shadow', width: 0.68, height: 0.12, x: 0, y: 0.04, color: 'rgba(5,8,10,.25)', order: 0, shape: 'shadow' },
      { name: 'glow', width: 1.0, height: 1.0, x: 0, y: 0.7, color: 'rgba(98,229,212,.32)', order: 1, shape: 'glow' },
      { name: 'backArm', width: 0.16, height: 0.52, x: -0.35, y: 0.62, color: '#42adac', order: 2, shape: 'arm' },
      { name: 'frontArm', width: 0.16, height: 0.56, x: 0.36, y: 0.63, color: '#5ad9c4', order: 9, shape: 'arm' },
    ],
  },
};

function makeMaterial(map: THREE.Texture, opacity = 1) {
  return new THREE.SpriteMaterial({
    map,
    transparent: true,
    alphaTest: 0.04,
    opacity,
  });
}

function atlasCellTexture(cell: [number, number]) {
  const texture = atlasTexture.clone();
  texture.needsUpdate = true;
  texture.repeat.set(0.5, 0.5);
  texture.offset.set(cell[0] * 0.5, (1 - cell[1]) * 0.5);
  return texture;
}

function partTexture(spec: PartSpec) {
  const size = 96;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, size, size);

  if (spec.shape === 'shadow') {
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.ellipse(48, 58, 36, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (spec.shape === 'glow') {
    const grad = ctx.createRadialGradient(48, 48, 3, 48, 48, 42);
    grad.addColorStop(0, spec.color);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  } else {
    const grad = ctx.createLinearGradient(28, 18, 68, 82);
    grad.addColorStop(0, '#fff1bc');
    grad.addColorStop(0.16, spec.color);
    grad.addColorStop(1, '#172026');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#12191d';
    ctx.lineWidth = spec.shape === 'weapon' ? 10 : 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (spec.shape === 'weapon') {
      ctx.moveTo(48, 16);
      ctx.lineTo(48, 80);
      ctx.stroke();
      ctx.strokeStyle = spec.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(48, 16);
      ctx.lineTo(48, 80);
      ctx.stroke();
    } else {
      ctx.roundRect(32, 14, 32, 68, 18);
      ctx.stroke();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.22)';
      ctx.beginPath();
      ctx.ellipse(43, 28, 6, 12, 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

export class CharacterRig {
  readonly group = new THREE.Group();
  private readonly spec: CharacterSpec;
  private readonly body: THREE.Sprite;
  private readonly parts = new Map<string, THREE.Sprite>();
  private walkClock = 0;

  constructor(readonly kind: CharacterKind) {
    this.spec = specs[kind];
    const body = new THREE.Sprite(makeMaterial(atlasCellTexture(this.spec.atlasCell)));
    body.scale.set(this.spec.width, this.spec.height, 1);
    body.position.y = this.spec.y;
    body.renderOrder = 5;
    this.body = body;
    this.group.add(body);

    for (const part of this.spec.parts) {
      const sprite = new THREE.Sprite(makeMaterial(partTexture(part), part.shape === 'glow' ? 0.72 : 1));
      sprite.name = part.name;
      sprite.scale.set(part.width, part.height, 1);
      sprite.position.set(part.x, part.y, part.z ?? 0);
      sprite.renderOrder = part.order;
      this.parts.set(part.name, sprite);
      this.group.add(sprite);
    }
    this.group.scale.setScalar(this.spec.scale);
  }

  setPosition(position: THREE.Vector3) {
    this.group.position.copy(position);
  }

  get position() {
    return this.group.position;
  }

  update(dt: number, pose: RigPose) {
    if (pose.moving) this.walkClock += dt * (this.kind === 'brute' ? 7.5 : this.kind === 'wisp' ? 5.8 : 10);
    else this.walkClock += dt * 2.8;

    const stride = pose.moving ? Math.sin(this.walkClock) : Math.sin(this.walkClock) * 0.15;
    const bob = pose.moving ? Math.abs(Math.sin(this.walkClock)) * 0.08 : Math.sin(this.walkClock * 0.8) * 0.025;
    const side = pose.facingX < -0.08 ? -1 : 1;
    this.group.scale.x = this.spec.scale * side;
    this.body.position.y = this.spec.y + bob;
    this.body.material.color.setHex(pose.hitFlash > 0 ? 0xffffff : 0xffffff);

    const attack = THREE.MathUtils.clamp(pose.attack, 0, 1);
    const swing = attack > 0 ? Math.sin(attack * Math.PI) : 0;
    this.setPart('frontLeg', 0.16 * stride, -0.08 * Math.abs(stride), 0.38 * stride);
    this.setPart('backLeg', -0.16 * stride, -0.05 * Math.abs(stride), -0.36 * stride);
    this.setPart('backArm', -0.1 * stride, 0.03 * Math.abs(stride), 0.28 * stride);
    this.setPart('frontArm', 0.1 * stride + swing * 0.28, swing * 0.08, -0.35 * stride - swing * 1.0);
    this.setPart('weapon', swing * 0.32, swing * 0.14, -0.55 * swing);

    const glow = this.parts.get('glow');
    if (glow) {
      glow.scale.setScalar(0.9 + swing * 0.65 + Math.sin(this.walkClock * 1.7) * 0.04);
      glow.material.opacity = this.kind === 'hero' ? 0.55 + swing * 0.35 : 0.36 + Math.sin(this.walkClock) * 0.08;
    }
  }

  private setPart(name: string, dx: number, dy: number, rotation: number) {
    const part = this.parts.get(name);
    const spec = this.spec.parts.find((p) => p.name === name);
    if (!part || !spec) return;
    part.position.x = spec.x + dx;
    part.position.y = spec.y + dy;
    part.rotation.z = rotation;
  }
}
