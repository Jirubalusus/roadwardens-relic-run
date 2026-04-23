import * as THREE from 'three';
import { createRuntimeArt } from './art';
import { CharacterRig } from './characters';
import './styles.css';

type Vec2 = { x: number; y: number };
type Stage = {
  name: string;
  route: string;
  duration: number;
  ground: number;
  fog: number;
  accent: number;
  enemyTint: number;
  speed: number;
  spawn: number;
};
type Upgrade = {
  title: string;
  body: string;
  apply: () => void;
};

const stages: Stage[] = [
  { name: 'Whisperbough Verge', route: 'I. The first road under singing trees', duration: 75, ground: 0x385b45, fog: 0x172119, accent: 0x8bd4a2, enemyTint: 0xd87768, speed: 1, spawn: 1 },
  { name: 'Moonfallen Causeway', route: 'II. Broken kings and watchful stones', duration: 80, ground: 0x4d5261, fog: 0x151820, accent: 0xb7c1d8, enemyTint: 0xbd8af0, speed: 1.12, spawn: 1.15 },
  { name: 'Mire of Lanterns', route: 'III. A silver road through hungry water', duration: 85, ground: 0x2d4f4d, fog: 0x101f22, accent: 0x59d9c1, enemyTint: 0xe3b85b, speed: 1.2, spawn: 1.28 },
  { name: 'Cinderpass Ascent', route: 'IV. The last climb before dawn', duration: 95, ground: 0x60463d, fog: 0x1f1613, accent: 0xff8b52, enemyTint: 0x8ee0ff, speed: 1.32, spawn: 1.42 },
];

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div class="hud">
    <div class="topbar">
      <div class="panel run-info">
        <div class="stage-name" id="stageName"></div>
        <div class="subline" id="routeName"></div>
        <div class="bars">
          <div class="bar hp"><i id="hpBar"></i></div>
          <div class="bar xp"><i id="xpBar"></i></div>
        </div>
      </div>
      <div class="panel stat-stack"><div id="timer">0:00</div><div id="level">LV 1</div><div id="coins">0 relics</div></div>
    </div>
    <div class="bottom-hud">
      <div class="weapon-row" id="weaponRow"></div>
    </div>
    <div class="joystick" id="joystick"><div class="stick" id="stick"></div></div>
    <div class="buttons"><button class="skill-button" id="burst">WARD</button></div>
  </div>
  <div class="overlay" id="overlay">
    <div class="panel menu">
      <h1 class="title" id="menuTitle">Roadwardens:<br>Relic Run</h1>
      <p class="copy" id="menuCopy">Guide Mira of the Roadsign through four perilous legs of an enchanted route. Survive each stage, choose relic boons, and keep the fellowship beacon alive.</p>
      <button class="primary" id="menuButton">Begin Run</button>
      <div class="upgrade-grid hidden" id="upgradeGrid"></div>
    </div>
  </div>`;

const stageName = document.querySelector<HTMLDivElement>('#stageName')!;
const routeName = document.querySelector<HTMLDivElement>('#routeName')!;
const hpBar = document.querySelector<HTMLElement>('#hpBar')!;
const xpBar = document.querySelector<HTMLElement>('#xpBar')!;
const timerEl = document.querySelector<HTMLDivElement>('#timer')!;
const levelEl = document.querySelector<HTMLDivElement>('#level')!;
const coinsEl = document.querySelector<HTMLDivElement>('#coins')!;
const weaponRow = document.querySelector<HTMLDivElement>('#weaponRow')!;
const overlay = document.querySelector<HTMLDivElement>('#overlay')!;
const menuTitle = document.querySelector<HTMLHeadingElement>('#menuTitle')!;
const menuCopy = document.querySelector<HTMLParagraphElement>('#menuCopy')!;
const menuButton = document.querySelector<HTMLButtonElement>('#menuButton')!;
const upgradeGrid = document.querySelector<HTMLDivElement>('#upgradeGrid')!;
const joystick = document.querySelector<HTMLDivElement>('#joystick')!;
const stick = document.querySelector<HTMLDivElement>('#stick')!;
const burstButton = document.querySelector<HTMLButtonElement>('#burst')!;

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = false;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-12, 12, 12, -12, 0.1, 120);
camera.position.set(12, 14, 12);
camera.lookAt(0, 0, 0);

const hemi = new THREE.HemisphereLight(0xf8ead2, 0x314044, 2.8);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffdf9a, 1.7);
sun.position.set(4, 8, 2);
scene.add(sun);

const root = new THREE.Group();
const propRoot = new THREE.Group();
const actorRoot = new THREE.Group();
scene.add(root, propRoot, actorRoot);

const art = createRuntimeArt();
const groundGeo = new THREE.PlaneGeometry(90, 90, 1, 1);
const groundMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: art.ground[0], roughness: 1 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
root.add(ground);

function makeSprite(map: THREE.Texture, width: number, height: number, y = height * 0.5) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, alphaTest: 0.05 }));
  sprite.scale.set(width, height, 1);
  sprite.position.y = y;
  return sprite;
}

const ringGeo = new THREE.TorusGeometry(1, 0.04, 8, 32);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xf1c566, transparent: true, opacity: 0.9 });
const aimRing = new THREE.Mesh(ringGeo, ringMat);
aimRing.rotation.x = Math.PI / 2;
actorRoot.add(aimRing);

const hero = {
  pos: new THREE.Vector3(),
  hp: 115,
  maxHp: 115,
  speed: 7.1,
  level: 1,
  xp: 0,
  nextXp: 14,
  relics: 0,
  damage: 1,
  fireRate: 1,
  magnet: 1,
  armor: 0,
  cooldown: 0,
  burstCooldown: 0,
  invuln: 0,
};

const heroRig = new CharacterRig('hero');
actorRoot.add(heroRig.group);

const props: THREE.Object3D[] = [];

type Enemy = { rig: CharacterRig; hp: number; maxHp: number; speed: number; touch: number; kind: 'skulk' | 'brute' | 'wisp'; hitFlash: number; attackTime: number };
type Shot = { mesh: THREE.Sprite; dir: Vec2; life: number; damage: number; pierce: number };
type Gem = { mesh: THREE.Sprite; value: number; pull: boolean };
const enemies: Enemy[] = [];
const shots: Shot[] = [];
const gems: Gem[] = [];
const particles: { mesh: THREE.Mesh | THREE.Sprite; vel: THREE.Vector3; life: number }[] = [];

let stageIndex = 0;
let stageTime = 0;
let spawnTimer = 0;
let runState: 'menu' | 'playing' | 'upgrade' | 'won' | 'lost' = 'menu';
let input: Vec2 = { x: 0, y: 0 };
let pointerId: number | null = null;
let last = performance.now();
let heroAttackTime = 0;
let heroMoving = false;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  const aspect = w / h;
  const mobileZoom = h > w ? 9.2 : 7.2;
  camera.left = -mobileZoom * aspect;
  camera.right = mobileZoom * aspect;
  camera.top = mobileZoom;
  camera.bottom = -mobileZoom;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function setStage(index: number) {
  stageIndex = index;
  const stage = stages[stageIndex];
  stageTime = 0;
  spawnTimer = 0.6;
  groundMat.map = art.ground[index];
  groundMat.needsUpdate = true;
  scene.fog = new THREE.Fog(stage.fog, 18, 46);
  renderer.setClearColor(stage.fog);
  stageName.textContent = stage.name;
  routeName.textContent = stage.route;
  buildProps(stage);
}

function buildProps(stage: Stage) {
  props.forEach((p) => propRoot.remove(p));
  props.length = 0;
  for (let i = 0; i < 46; i++) {
    const propMap =
      stageIndex === 2 && i % 4 === 0 ? art.sprites.lanternReed :
      stageIndex === 3 && i % 3 === 0 ? art.sprites.cairn :
      i % 4 === 0 ? art.sprites.waystone :
      art.sprites.tree;
    const tall = propMap === art.sprites.tree || propMap === art.sprites.lanternReed;
    const mesh = makeSprite(propMap, tall ? 1.35 : 0.95, tall ? 1.55 : 1.05, tall ? 0.78 : 0.54);
    (mesh.material as THREE.SpriteMaterial).color.setHex(stageIndex === 0 ? 0xffffff : stageIndex === 1 ? 0xd9ddf0 : stageIndex === 2 ? 0xd9fff2 : 0xffddc2);
    const angle = Math.random() * Math.PI * 2;
    const dist = 8 + Math.random() * 34;
    mesh.position.set(Math.cos(angle) * dist, mesh.position.y, Math.sin(angle) * dist);
    mesh.scale.multiplyScalar(0.8 + Math.random() * 0.55);
    propRoot.add(mesh);
    props.push(mesh);
  }
}

function startRun() {
  clearWorld();
  Object.assign(hero, { hp: 115, maxHp: 115, speed: 7.1, level: 1, xp: 0, nextXp: 14, relics: 0, damage: 1, fireRate: 1, magnet: 1, armor: 0, cooldown: 0, burstCooldown: 0, invuln: 0 });
  hero.pos.set(0, 0, 0);
  setStage(0);
  runState = 'playing';
  overlay.classList.add('hidden');
  upgradeGrid.classList.add('hidden');
  menuButton.classList.remove('hidden');
}

function clearWorld() {
  enemies.splice(0).forEach((enemy) => actorRoot.remove(enemy.rig.group));
  [...shots.splice(0), ...gems.splice(0), ...particles.splice(0)].forEach((entity: any) => actorRoot.remove(entity.mesh));
}

function spawnEnemy() {
  const stage = stages[stageIndex];
  const roll = Math.random();
  const kind: Enemy['kind'] = roll > 0.84 && stageIndex > 0 ? 'brute' : roll > 0.63 && stageIndex > 1 ? 'wisp' : 'skulk';
  const angle = Math.random() * Math.PI * 2;
  const dist = 12 + Math.random() * 3;
  const rig = new CharacterRig(kind);
  rig.group.position.set(hero.pos.x + Math.cos(angle) * dist, 0, hero.pos.z + Math.sin(angle) * dist);
  actorRoot.add(rig.group);
  const hp = (kind === 'brute' ? 10 : kind === 'wisp' ? 5 : 3) * (1 + stageIndex * 0.45);
  enemies.push({ rig, hp, maxHp: hp, speed: (kind === 'brute' ? 2.3 : kind === 'wisp' ? 4.1 : 3.1) * stage.speed, touch: kind === 'brute' ? 18 : 10, kind, hitFlash: 0, attackTime: 0 });
}

function fireAtNearest() {
  if (enemies.length === 0) return;
  let best = enemies[0];
  let bestD = Infinity;
  for (const e of enemies) {
    const d = e.rig.position.distanceToSquared(hero.pos);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  const dx = best.rig.position.x - hero.pos.x;
  const dz = best.rig.position.z - hero.pos.z;
  const len = Math.hypot(dx, dz) || 1;
  const mesh = makeSprite(art.sprites.shot, 0.42, 0.42, 0.62);
  mesh.position.set(hero.pos.x, 0.62, hero.pos.z);
  actorRoot.add(mesh);
  shots.push({ mesh, dir: { x: dx / len, y: dz / len }, life: 1.5, damage: 3.2 * hero.damage, pierce: hero.level >= 5 ? 1 : 0 });
  heroAttackTime = 0.28;
}

function burstWard() {
  if (hero.burstCooldown > 0 || runState !== 'playing') return;
  hero.burstCooldown = 14;
  const ward = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 8, 36), new THREE.MeshBasicMaterial({ color: 0xf1c566, transparent: true, opacity: 0.8 }));
  ward.rotation.x = Math.PI / 2;
  ward.position.copy(hero.pos);
  actorRoot.add(ward);
  particles.push({ mesh: ward, vel: new THREE.Vector3(0, 0, 0), life: 0.55 });
  for (const e of enemies) {
    const d = e.rig.position.distanceTo(hero.pos);
    if (d < 4.2) {
      e.hp -= 9 * hero.damage;
      const away = e.rig.position.clone().sub(hero.pos).normalize().multiplyScalar(1.8);
      e.rig.position.add(away);
      e.hitFlash = 0.12;
      e.attackTime = 0.25;
    }
  }
}

function dropGem(pos: THREE.Vector3, value: number) {
  const mesh = makeSprite(value > 1 ? art.sprites.coin : art.sprites.relic, value > 1 ? 0.5 : 0.42, value > 1 ? 0.5 : 0.42, 0.32);
  mesh.position.set(pos.x, 0.32, pos.z);
  actorRoot.add(mesh);
  gems.push({ mesh, value, pull: false });
}

function damageEnemy(enemy: Enemy, amount: number) {
  enemy.hp -= amount;
  enemy.hitFlash = 0.08;
  for (let i = 0; i < 2; i++) {
    const p = makeSprite(art.sprites.shot, 0.18, 0.18, 0.5);
    p.position.copy(enemy.rig.position);
    actorRoot.add(p);
    particles.push({ mesh: p, vel: new THREE.Vector3((Math.random() - 0.5) * 3, 2.2, (Math.random() - 0.5) * 3), life: 0.3 });
  }
}

function gainXp(value: number) {
  hero.xp += value;
  hero.relics += value;
  while (hero.xp >= hero.nextXp) {
    hero.xp -= hero.nextXp;
    hero.level += 1;
    hero.nextXp = Math.floor(hero.nextXp * 1.32 + 5);
    showUpgrade();
  }
}

function showUpgrade() {
  runState = 'upgrade';
  overlay.classList.remove('hidden');
  menuButton.classList.add('hidden');
  upgradeGrid.classList.remove('hidden');
  menuTitle.textContent = 'Choose a Road Boon';
  menuCopy.textContent = 'The route bends in your favor. Pick one power before the next wave closes in.';
  const pool: Upgrade[] = [
    { title: 'Milestone Sling', body: '+22% attack speed', apply: () => (hero.fireRate *= 1.22) },
    { title: 'Oath-Lit Thorn', body: '+28% projectile damage', apply: () => (hero.damage *= 1.28) },
    { title: 'Waybread Cache', body: '+24 max health and heal 24', apply: () => { hero.maxHp += 24; hero.hp = Math.min(hero.maxHp, hero.hp + 24); } },
    { title: 'Roadsign Boots', body: '+12% movement speed', apply: () => (hero.speed *= 1.12) },
    { title: 'Gathering Lantern', body: '+45% relic pickup range', apply: () => (hero.magnet *= 1.45) },
    { title: 'Fellowship Buckler', body: 'Reduce contact damage', apply: () => (hero.armor += 2.5) },
  ].sort(() => Math.random() - 0.5).slice(0, 3);
  upgradeGrid.innerHTML = '';
  for (const up of pool) {
    const btn = document.createElement('button');
    btn.className = 'upgrade';
    btn.innerHTML = `${up.title}<span>${up.body}</span>`;
    btn.onclick = () => {
      up.apply();
      overlay.classList.add('hidden');
      runState = 'playing';
    };
    upgradeGrid.appendChild(btn);
  }
}

function endRun(won: boolean) {
  runState = won ? 'won' : 'lost';
  overlay.classList.remove('hidden');
  upgradeGrid.classList.add('hidden');
  menuButton.classList.remove('hidden');
  menuTitle.textContent = won ? 'Dawn Reaches the Road' : 'The Beacon Falls';
  menuCopy.textContent = won
    ? `You carried ${hero.relics} relics across the full route. Try again for a faster, richer run.`
    : `Your route ended on ${stages[stageIndex].name} with ${hero.relics} relics recovered.`;
  menuButton.textContent = 'Run Again';
}

function update(dt: number) {
  if (runState !== 'playing') return;
  const stage = stages[stageIndex];
  stageTime += dt;
  hero.cooldown -= dt;
  heroAttackTime = Math.max(0, heroAttackTime - dt);
  hero.burstCooldown = Math.max(0, hero.burstCooldown - dt);
  hero.invuln = Math.max(0, hero.invuln - dt);
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnTimer = Math.max(0.18, (0.95 - stageTime * 0.004) / stage.spawn);
    spawnEnemy();
    if (stageTime > stage.duration * 0.72) spawnEnemy();
  }
  const moveLen = Math.hypot(input.x, input.y);
  heroMoving = moveLen > 0.05;
  if (moveLen > 0.05) {
    hero.pos.x += (input.x / moveLen) * hero.speed * dt;
    hero.pos.z += (input.y / moveLen) * hero.speed * dt;
  }
  hero.pos.x = THREE.MathUtils.clamp(hero.pos.x, -38, 38);
  hero.pos.z = THREE.MathUtils.clamp(hero.pos.z, -38, 38);
  heroRig.setPosition(hero.pos);
  heroRig.update(dt, {
    moving: heroMoving,
    attack: heroAttackTime > 0 ? 1 - heroAttackTime / 0.28 : 0,
    hitFlash: hero.invuln,
    facingX: input.x,
    facingZ: input.y,
  });
  aimRing.position.set(hero.pos.x, 0.04, hero.pos.z);
  aimRing.scale.setScalar(1 + Math.sin(performance.now() * 0.006) * 0.04);
  camera.position.set(hero.pos.x + 12, 14, hero.pos.z + 12);
  camera.lookAt(hero.pos.x, 0, hero.pos.z);
  if (hero.cooldown <= 0) {
    hero.cooldown = 0.48 / hero.fireRate;
    fireAtNearest();
  }
  updateEnemies(dt);
  updateShots(dt);
  updateGems(dt);
  updateParticles(dt);
  if (stageTime >= stage.duration) {
    if (stageIndex === stages.length - 1) endRun(true);
    else {
      setStage(stageIndex + 1);
      hero.hp = Math.min(hero.maxHp, hero.hp + 28);
      clearWorld();
      showUpgrade();
    }
  }
  if (hero.hp <= 0) endRun(false);
}

function updateEnemies(dt: number) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const dx = hero.pos.x - e.rig.position.x;
    const dz = hero.pos.z - e.rig.position.z;
    const len = Math.hypot(dx, dz) || 1;
    const weave = e.kind === 'wisp' ? Math.sin(stageTime * 5 + i) * 0.8 : 0;
    e.rig.position.x += ((dx / len) * e.speed + (dz / len) * weave) * dt;
    e.rig.position.z += ((dz / len) * e.speed - (dx / len) * weave) * dt;
    e.hitFlash = Math.max(0, e.hitFlash - dt);
    e.attackTime = Math.max(0, e.attackTime - dt);
    e.rig.update(dt, {
      moving: true,
      attack: e.attackTime > 0 ? 1 - e.attackTime / 0.35 : 0,
      hitFlash: e.hitFlash,
      facingX: dx,
      facingZ: dz,
    });
    if (len < 0.8 && hero.invuln <= 0) {
      hero.hp -= Math.max(2, e.touch - hero.armor);
      hero.invuln = 0.5;
      e.attackTime = 0.35;
    }
    if (e.hp <= 0) {
      dropGem(e.rig.position, e.kind === 'brute' ? 3 : 1);
      actorRoot.remove(e.rig.group);
      enemies.splice(i, 1);
    }
  }
}

function updateShots(dt: number) {
  for (let i = shots.length - 1; i >= 0; i--) {
    const s = shots[i];
    s.life -= dt;
    s.mesh.position.x += s.dir.x * 13 * dt;
    s.mesh.position.z += s.dir.y * 13 * dt;
    s.mesh.scale.setScalar(1 + Math.sin(s.life * 30) * 0.14);
    for (const e of enemies) {
      if (s.mesh.position.distanceToSquared(e.rig.position) < 0.42) {
        damageEnemy(e, s.damage);
        s.pierce -= 1;
        if (s.pierce < 0) s.life = 0;
        break;
      }
    }
    if (s.life <= 0) {
      actorRoot.remove(s.mesh);
      shots.splice(i, 1);
    }
  }
}

function updateGems(dt: number) {
  for (let i = gems.length - 1; i >= 0; i--) {
    const g = gems[i];
    g.mesh.rotation.y += dt * 4;
    const d = g.mesh.position.distanceTo(hero.pos);
    if (d < 1.05 * hero.magnet) g.pull = true;
    if (g.pull) g.mesh.position.lerp(new THREE.Vector3(hero.pos.x, 0.4, hero.pos.z), Math.min(1, dt * 7));
    if (d < 0.55) {
      gainXp(g.value);
      actorRoot.remove(g.mesh);
      gems.splice(i, 1);
    }
  }
}

function updateParticles(dt: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    p.vel.y -= 8 * dt;
    p.mesh.position.addScaledVector(p.vel, dt);
    p.mesh.scale.multiplyScalar(1 + dt * 5);
    const mat = p.mesh instanceof THREE.Sprite
      ? p.mesh.material
      : p.mesh.material as THREE.Material & { opacity?: number; transparent?: boolean };
    mat.transparent = true;
    mat.opacity = Math.max(0, p.life * 2);
    if (p.life <= 0) {
      actorRoot.remove(p.mesh);
      particles.splice(i, 1);
    }
  }
}

function renderHud() {
  hpBar.style.width = `${Math.max(0, (hero.hp / hero.maxHp) * 100)}%`;
  xpBar.style.width = `${(hero.xp / hero.nextXp) * 100}%`;
  const left = Math.max(0, stages[stageIndex].duration - stageTime);
  timerEl.textContent = `${Math.floor(left / 60)}:${Math.floor(left % 60).toString().padStart(2, '0')}`;
  levelEl.textContent = `LV ${hero.level}`;
  coinsEl.textContent = `${hero.relics} relics`;
  burstButton.disabled = hero.burstCooldown > 0;
  burstButton.textContent = hero.burstCooldown > 0 ? `${Math.ceil(hero.burstCooldown)}` : 'WARD';
  weaponRow.innerHTML = `<div class="panel chip">Sling ${hero.fireRate.toFixed(1)}x</div><div class="panel chip">Thorn ${hero.damage.toFixed(1)}x</div>`;
}

function loop(now: number) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  renderHud();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function setStick(clientX: number, clientY: number) {
  const rect = joystick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  const len = Math.min(48, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx);
  const sx = Math.cos(angle) * len;
  const sy = Math.sin(angle) * len;
  stick.style.transform = `translate(${sx}px, ${sy}px)`;
  input = { x: sx / 48, y: sy / 48 };
}

joystick.addEventListener('pointerdown', (ev) => {
  pointerId = ev.pointerId;
  joystick.setPointerCapture(ev.pointerId);
  setStick(ev.clientX, ev.clientY);
});
joystick.addEventListener('pointermove', (ev) => {
  if (pointerId === ev.pointerId) setStick(ev.clientX, ev.clientY);
});
function releaseStick(ev: PointerEvent) {
  if (pointerId !== ev.pointerId) return;
  pointerId = null;
  input = { x: 0, y: 0 };
  stick.style.transform = 'translate(0, 0)';
}
joystick.addEventListener('pointerup', releaseStick);
joystick.addEventListener('pointercancel', releaseStick);
burstButton.addEventListener('pointerdown', burstWard);
menuButton.addEventListener('click', () => {
  menuButton.textContent = 'Begin Run';
  startRun();
});

window.addEventListener('keydown', (ev) => {
  const keys: Record<string, Vec2> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 } };
  if (keys[ev.key]) input = keys[ev.key];
  if (ev.key === ' ') burstWard();
});
window.addEventListener('keyup', () => (input = { x: 0, y: 0 }));
setStage(0);
