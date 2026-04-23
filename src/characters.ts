import * as THREE from 'three';

export type CharacterKind = 'hero' | 'skulk' | 'brute' | 'wisp';
type AnimationState = 'idle' | 'walk' | 'attack' | 'hit';

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

type ClipSpec = {
  frames: number[];
  fps: number;
  loop: boolean;
};

const atlasTexture = new THREE.TextureLoader().load('./assets/sprites/gpt-character-atlas-v2.png');
atlasTexture.colorSpace = THREE.SRGBColorSpace;
atlasTexture.minFilter = THREE.LinearMipmapLinearFilter;
atlasTexture.magFilter = THREE.LinearFilter;
atlasTexture.generateMipmaps = true;

const heroStateSheet = new THREE.TextureLoader().load('./assets/sprites/hero-mira/mira-state-sheet.webp');
heroStateSheet.colorSpace = THREE.SRGBColorSpace;
heroStateSheet.minFilter = THREE.LinearMipmapLinearFilter;
heroStateSheet.magFilter = THREE.LinearFilter;
heroStateSheet.generateMipmaps = true;

const heroClips: Record<AnimationState, ClipSpec> = {
  idle: { frames: [0, 1, 2, 1], fps: 2.05, loop: true },
  walk: { frames: [4, 5, 6, 7], fps: 10.8, loop: true },
  attack: { frames: [8, 8, 9, 9, 10], fps: 18, loop: false },
  hit: { frames: [11], fps: 8, loop: false },
};

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

function sheetFrameTexture(source: THREE.Texture, frame: number, columns: number, rows: number) {
  const texture = source.clone();
  const col = frame % columns;
  const row = Math.floor(frame / columns);
  texture.needsUpdate = true;
  texture.repeat.set(1 / columns, 1 / rows);
  texture.offset.set(col / columns, (rows - 1 - row) / rows);
  return texture;
}

function makeShadowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(5,8,10,.36)';
  ctx.beginPath();
  ctx.ellipse(64, 74, 48, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function partTexture(spec: PartSpec) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, size, size);

  if (spec.shape === 'shadow') {
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.ellipse(64, 76, 46, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (spec.shape === 'glow') {
    const grad = ctx.createRadialGradient(64, 64, 3, 64, 64, 56);
    grad.addColorStop(0, spec.color);
    grad.addColorStop(0.34, spec.color);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  } else {
    const grad = ctx.createLinearGradient(42, 18, 84, 112);
    grad.addColorStop(0, '#fff3c6');
    grad.addColorStop(0.18, spec.color);
    grad.addColorStop(0.76, spec.color);
    grad.addColorStop(1, '#11181c');
    ctx.strokeStyle = '#10171b';
    ctx.lineWidth = spec.shape === 'weapon' ? 12 : 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (spec.shape === 'weapon') {
      ctx.beginPath();
      ctx.moveTo(63, 18);
      ctx.lineTo(67, 106);
      ctx.stroke();
      ctx.strokeStyle = '#f7d98c';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(63, 18);
      ctx.lineTo(67, 106);
      ctx.stroke();
      ctx.fillStyle = spec.color;
      ctx.beginPath();
      ctx.arc(64, 25, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10171b';
      ctx.lineWidth = 4;
      ctx.stroke();
    } else {
      const isLeg = spec.shape === 'leg';
      const top = isLeg ? 22 : 16;
      const bottom = isLeg ? 112 : 108;
      const shoulder = isLeg ? 18 : 20;
      const ankle = isLeg ? 15 : 13;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(64 - shoulder, top + 8);
      ctx.quadraticCurveTo(49, top, 58, top + 28);
      ctx.lineTo(64 - ankle, bottom - 18);
      ctx.quadraticCurveTo(64, bottom, 64 + ankle + (isLeg ? 8 : 2), bottom - 9);
      ctx.lineTo(64 + shoulder, top + 14);
      ctx.quadraticCurveTo(78, top - 2, 64 - shoulder, top + 8);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = isLeg ? 'rgba(15, 22, 28, .28)' : 'rgba(255, 255, 255, .18)';
      ctx.beginPath();
      ctx.ellipse(56, top + 22, 6, 18, 0.55, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 236, 171, .46)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(72, top + 16);
      ctx.quadraticCurveTo(76, 58, 70, bottom - 22);
      ctx.stroke();
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
  private readonly heroFrames?: THREE.Texture[];
  private readonly shadow?: THREE.Sprite;
  private readonly parts = new Map<string, THREE.Sprite>();
  private readonly baseScale = new Map<string, THREE.Vector3>();
  private state: AnimationState = 'idle';
  private stateTime = 0;
  private lastFrame = -1;
  private walkClock = 0;
  private hurtClock = 0;

  constructor(readonly kind: CharacterKind) {
    this.spec = specs[kind];
    this.heroFrames = kind === 'hero'
      ? Array.from({ length: 12 }, (_, frame) => sheetFrameTexture(heroStateSheet, frame, 4, 3))
      : undefined;
    const body = new THREE.Sprite(makeMaterial(this.heroFrames?.[0] ?? atlasCellTexture(this.spec.atlasCell)));
    body.scale.set(this.spec.width, this.spec.height, 1);
    body.position.y = this.spec.y;
    body.renderOrder = 5;
    this.body = body;
    this.group.add(body);

    if (this.heroFrames) {
      body.scale.set(2, 2, 1);
      body.position.y = 0.96;
      const shadow = new THREE.Sprite(makeMaterial(makeShadowTexture(), 0.86));
      shadow.scale.set(1.15, 0.24, 1);
      shadow.position.y = 0.05;
      shadow.renderOrder = 0;
      this.shadow = shadow;
      this.group.add(shadow);
      this.group.scale.setScalar(0.86);
      return;
    }

    for (const part of this.spec.parts) {
      const sprite = new THREE.Sprite(makeMaterial(partTexture(part), part.shape === 'glow' ? 0.72 : 1));
      sprite.name = part.name;
      sprite.scale.set(part.width, part.height, 1);
      sprite.position.set(part.x, part.y, part.z ?? 0);
      sprite.renderOrder = part.order;
      this.parts.set(part.name, sprite);
      this.baseScale.set(part.name, sprite.scale.clone());
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
    const nextState = resolveState(pose);
    if (nextState !== this.state) {
      this.state = nextState;
      this.stateTime = 0;
      this.lastFrame = -1;
    } else {
      this.stateTime += dt;
    }

    if (this.heroFrames) {
      this.updateHeroSheet(dt, pose);
      return;
    }

    const moveRate = this.kind === 'brute' ? 6.6 : this.kind === 'wisp' ? 5.4 : 9.4;
    this.walkClock += dt * (pose.moving ? moveRate : 2.4);
    this.hurtClock = Math.max(0, pose.hitFlash);

    const step = Math.sin(this.walkClock);
    const counterStep = Math.sin(this.walkClock + Math.PI);
    const lift = Math.max(0, Math.sin(this.walkClock));
    const counterLift = Math.max(0, Math.sin(this.walkClock + Math.PI));
    const stride = pose.moving ? step : step * 0.08;
    const bob = pose.moving
      ? Math.abs(step) * (this.kind === 'brute' ? 0.045 : 0.075)
      : Math.sin(this.walkClock * 0.85) * (this.kind === 'wisp' ? 0.055 : 0.022);
    const side = pose.facingX < -0.08 ? -1 : 1;
    const attack = THREE.MathUtils.clamp(pose.attack, 0, 1);
    const windup = attack < 0.28 ? attack / 0.28 : 0;
    const strike = attack >= 0.28 && attack < 0.58 ? (attack - 0.28) / 0.3 : 0;
    const recover = attack >= 0.58 ? (attack - 0.58) / 0.42 : 0;
    const anticipation = windup ? easeOut(windup) : 0;
    const slash = strike ? easeOutBack(strike) : 0;
    const settle = recover ? 1 - easeOut(recover) : 0;
    const attackPower = Math.max(slash, settle * 0.55);
    const recoil = anticipation * (this.kind === 'brute' ? -0.13 : -0.18);
    const lean = (pose.moving ? THREE.MathUtils.clamp(pose.facingZ, -1, 1) * -0.08 : 0) + attackPower * 0.09;
    const squash = pose.moving ? Math.abs(step) * 0.025 : Math.sin(this.walkClock) * 0.008;

    this.group.scale.set(this.spec.scale * side * (1 + squash * 0.35), this.spec.scale * (1 - squash), this.spec.scale);
    this.body.position.x = recoil + attackPower * 0.08;
    this.body.position.y = this.spec.y + bob + anticipation * 0.025;
    this.body.rotation.z = lean;
    this.body.material.color.setHex(this.hurtClock > 0 ? 0xfff1de : 0xffffff);

    this.setPart('frontLeg', 0.18 * stride, 0.055 * lift - 0.035 * Math.abs(step), 0.46 * stride, 1, 1 - lift * 0.08);
    this.setPart('backLeg', 0.18 * counterStep, 0.052 * counterLift - 0.028 * Math.abs(step), 0.42 * counterStep, 1, 1 - counterLift * 0.07);
    this.setPart('backArm', -0.12 * stride - anticipation * 0.08, 0.02 * Math.abs(step), 0.34 * stride + anticipation * 0.38);
    this.setPart(
      'frontArm',
      0.12 * counterStep + anticipation * -0.14 + attackPower * 0.34,
      0.025 * Math.abs(step) + anticipation * 0.12 - attackPower * 0.04,
      -0.36 * counterStep + anticipation * 0.95 - attackPower * 1.32,
      1 + attackPower * 0.08,
      1,
    );
    this.setPart(
      'weapon',
      anticipation * -0.16 + attackPower * 0.42,
      anticipation * 0.16 + attackPower * 0.04,
      anticipation * 0.82 - attackPower * 1.12,
      1,
      1 + attackPower * 0.12,
    );
    this.setPart('shadow', 0, 0, 0, 1 + bob * 1.9, 1 + bob * 0.35);

    const glow = this.parts.get('glow');
    if (glow) {
      const base = this.baseScale.get('glow') ?? new THREE.Vector3(1, 1, 1);
      const pulse = 1 + Math.sin(this.walkClock * 1.7) * 0.05;
      glow.scale.set(base.x * (pulse + attackPower * 0.9), base.y * (pulse + attackPower * 0.9), 1);
      glow.position.x = (this.spec.parts.find((p) => p.name === 'glow')?.x ?? 0) + attackPower * 0.28 - anticipation * 0.08;
      glow.position.y = (this.spec.parts.find((p) => p.name === 'glow')?.y ?? 0) + attackPower * 0.08 + bob;
      glow.material.opacity = this.kind === 'hero' ? 0.5 + attackPower * 0.42 : 0.32 + Math.sin(this.walkClock) * 0.08;
    }

    if (this.hurtClock > 0) {
      const shake = Math.sin(this.hurtClock * 90) * 0.035;
      this.body.position.x += shake;
      for (const part of this.parts.values()) {
        part.material.color.setHex(0xfff0dd);
      }
    } else {
      for (const part of this.parts.values()) {
        part.material.color.setHex(0xffffff);
      }
    }
  }

  private setPart(name: string, dx: number, dy: number, rotation: number, sx = 1, sy = 1) {
    const part = this.parts.get(name);
    const spec = this.spec.parts.find((p) => p.name === name);
    if (!part || !spec) return;
    const base = this.baseScale.get(name);
    part.position.x = spec.x + dx;
    part.position.y = spec.y + dy;
    part.rotation.z = rotation;
    if (base) part.scale.set(base.x * sx, base.y * sy, 1);
  }

  private updateHeroSheet(dt: number, pose: RigPose) {
    const side = pose.facingX < -0.08 ? -1 : 1;
    const clip = heroClips[this.state];
    const rawFrame = Math.floor(this.stateTime * clip.fps);
    const frameIndex = clip.loop ? rawFrame % clip.frames.length : Math.min(rawFrame, clip.frames.length - 1);
    const frame = clip.frames[frameIndex];
    if (frame !== this.lastFrame) {
      this.body.material.map = this.heroFrames?.[frame] ?? this.body.material.map;
      this.body.material.needsUpdate = true;
      this.lastFrame = frame;
    }

    const rate = this.state === 'walk' ? 10.8 : this.state === 'attack' ? 5.2 : 2.05;
    this.walkClock += dt * rate;
    const step = Math.sin(this.walkClock);
    const attackT = this.state === 'attack' ? THREE.MathUtils.clamp(this.stateTime / 0.34, 0, 1) : 0;
    const anticipation = attackT > 0 && attackT < 0.34 ? 1 - attackT / 0.34 : 0;
    const strike = attackT >= 0.34 && attackT < 0.66 ? (attackT - 0.34) / 0.32 : 0;
    const recovery = attackT >= 0.66 ? (attackT - 0.66) / 0.34 : 0;
    const attackLean = this.state === 'attack'
      ? anticipation * -0.55 + easeOutBack(strike) * 0.9 + (1 - easeOut(recovery)) * 0.22
      : 0;
    const hurtLean = this.state === 'hit' ? Math.sin(this.stateTime * 36) * 0.08 : 0;
    const bob = this.state === 'walk'
      ? Math.abs(step) * 0.065
      : this.state === 'idle'
        ? Math.sin(this.walkClock * 0.7) * 0.018
        : -anticipation * 0.035 + strike * 0.045;
    const squash = this.state === 'walk' ? Math.abs(step) * 0.025 : strike * 0.018;

    this.group.scale.set(0.86 * side * (1 + squash * 0.24), 0.86 * (1 - squash), 0.86);
    this.body.position.x = attackLean * 0.08 - hurtLean * 0.5;
    this.body.position.y = 0.96 + bob;
    this.body.rotation.z = attackLean * -0.055 + hurtLean;
    this.body.material.color.setHex(pose.hitFlash > 0 ? 0xfff1de : 0xffffff);

    if (this.shadow) {
      const shadowPulse = this.state === 'walk' ? 1 + Math.abs(step) * 0.1 : 1;
      this.shadow.scale.set(1.15 * shadowPulse, 0.24 * (1 + bob * 0.4), 1);
      this.shadow.material.opacity = 0.72;
    }
  }
}

function resolveState(pose: RigPose): AnimationState {
  if (pose.hitFlash > 0.18) return 'hit';
  if (pose.attack > 0) return 'attack';
  if (pose.moving) return 'walk';
  return 'idle';
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);
}

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const x = THREE.MathUtils.clamp(t, 0, 1) - 1;
  return 1 + c3 * x * x * x + c1 * x * x;
}
