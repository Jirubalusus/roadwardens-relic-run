import * as THREE from 'three';

export type RuntimeArt = {
  sprites: {
    hero: THREE.CanvasTexture;
    skulk: THREE.CanvasTexture;
    brute: THREE.CanvasTexture;
    wisp: THREE.CanvasTexture;
    shot: THREE.CanvasTexture;
    relic: THREE.CanvasTexture;
    coin: THREE.CanvasTexture;
    waystone: THREE.CanvasTexture;
    tree: THREE.CanvasTexture;
    cairn: THREE.CanvasTexture;
    lanternReed: THREE.CanvasTexture;
  };
  ground: THREE.CanvasTexture[];
};

type DrawFn = (ctx: CanvasRenderingContext2D, size: number) => void;

function makeTexture(draw: DrawFn, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function outline(ctx: CanvasRenderingContext2D, points: number[][], fill: string, stroke = '#172026', line = 8) {
  ctx.beginPath();
  points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = line;
  ctx.strokeStyle = stroke;
  ctx.stroke();
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function hero(ctx: CanvasRenderingContext2D, s: number) {
  glow(ctx, s * 0.57, s * 0.5, s * 0.35, 'rgba(242, 192, 86, .2)');
  ellipse(ctx, 64, 105, 34, 10, 'rgba(5, 8, 10, .34)');
  outline(ctx, [[47, 37], [75, 35], [87, 97], [63, 111], [39, 96]], '#2f5f9d');
  outline(ctx, [[52, 48], [71, 47], [78, 88], [62, 99], [46, 88]], '#4879bd', '#172026', 5);
  outline(ctx, [[52, 28], [70, 25], [79, 38], [69, 51], [54, 49], [45, 37]], '#f1c66a', '#172026', 6);
  outline(ctx, [[78, 58], [92, 66], [91, 91], [80, 90]], '#bd7b41', '#172026', 5);
  ctx.strokeStyle = '#f7d987';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(91, 61);
  ctx.lineTo(105, 38);
  ctx.stroke();
  glow(ctx, 98, 69, 20, 'rgba(255, 197, 78, .62)');
  outline(ctx, [[91, 59], [107, 59], [111, 75], [99, 86], [87, 75]], '#ffc85a', '#172026', 5);
  ctx.fillStyle = '#fff3c0';
  ctx.fillRect(95, 63, 8, 12);
}

function skulk(ctx: CanvasRenderingContext2D) {
  glow(ctx, 54, 68, 38, 'rgba(225, 83, 91, .16)');
  ellipse(ctx, 64, 103, 34, 9, 'rgba(5, 8, 10, .32)');
  outline(ctx, [[19, 82], [49, 39], [91, 54], [109, 95], [56, 105]], '#823b52');
  outline(ctx, [[43, 61], [61, 39], [72, 78]], '#c65f65', '#172026', 5);
  outline(ctx, [[78, 61], [94, 48], [96, 85]], '#d97a67', '#172026', 5);
  ellipse(ctx, 67, 73, 5, 4, '#ffe69a');
  ellipse(ctx, 83, 77, 5, 4, '#ffe69a');
}

function brute(ctx: CanvasRenderingContext2D) {
  ellipse(ctx, 64, 106, 38, 10, 'rgba(5, 8, 10, .35)');
  outline(ctx, [[37, 34], [79, 24], [103, 52], [93, 93], [57, 111], [27, 86]], '#6b6673');
  outline(ctx, [[49, 45], [74, 39], [88, 56], [82, 83], [58, 92], [41, 76]], '#9a96a6', '#172026', 5);
  ctx.strokeStyle = '#d9c993';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(42, 65);
  ctx.lineTo(88, 58);
  ctx.stroke();
  ellipse(ctx, 58, 60, 5, 4, '#fff0aa');
  ellipse(ctx, 76, 57, 5, 4, '#fff0aa');
}

function wisp(ctx: CanvasRenderingContext2D) {
  glow(ctx, 63, 62, 48, 'rgba(98, 229, 212, .44)');
  ellipse(ctx, 64, 105, 24, 7, 'rgba(5, 8, 10, .24)');
  outline(ctx, [[64, 20], [87, 55], [75, 100], [56, 89], [41, 99], [48, 58]], '#5ad9c4', '#113035', 6);
  ellipse(ctx, 58, 58, 5, 7, '#fff7c2');
  ellipse(ctx, 72, 58, 5, 7, '#fff7c2');
}

function shot(ctx: CanvasRenderingContext2D) {
  glow(ctx, 64, 64, 45, 'rgba(151, 255, 218, .54)');
  outline(ctx, [[64, 26], [83, 64], [64, 102], [45, 64]], '#9df7d2', '#14353c', 5);
  ellipse(ctx, 64, 64, 10, 10, '#fffbd0');
}

function relic(ctx: CanvasRenderingContext2D) {
  glow(ctx, 64, 66, 34, 'rgba(84, 226, 194, .34)');
  outline(ctx, [[64, 20], [96, 58], [76, 105], [36, 96], [31, 52]], '#3cc8b2', '#102c31', 7);
  outline(ctx, [[64, 31], [84, 59], [70, 91], [45, 87], [42, 56]], '#84f4dd', '#19615f', 3);
}

function coin(ctx: CanvasRenderingContext2D) {
  glow(ctx, 64, 64, 34, 'rgba(242, 197, 102, .38)');
  ellipse(ctx, 64, 66, 31, 34, '#172026');
  ellipse(ctx, 64, 64, 27, 31, '#f1c566');
  ellipse(ctx, 58, 58, 10, 15, '#ffe594');
}

function waystone(ctx: CanvasRenderingContext2D) {
  ellipse(ctx, 64, 105, 29, 8, 'rgba(5, 8, 10, .28)');
  outline(ctx, [[48, 100], [43, 42], [64, 20], [85, 45], [78, 103]], '#8d938a', '#172026', 6);
  ctx.strokeStyle = '#b8dcb6';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(58, 47);
  ctx.lineTo(70, 58);
  ctx.lineTo(57, 74);
  ctx.stroke();
}

function tree(ctx: CanvasRenderingContext2D) {
  ellipse(ctx, 64, 109, 34, 8, 'rgba(5, 8, 10, .26)');
  outline(ctx, [[57, 105], [60, 63], [69, 63], [75, 106]], '#5a3e2f', '#172026', 5);
  outline(ctx, [[30, 64], [51, 25], [82, 21], [103, 61], [82, 86], [47, 83]], '#385d48', '#172026', 6);
  outline(ctx, [[41, 53], [61, 31], [87, 45], [72, 69]], '#4f7d5c', '#172026', 3);
}

function cairn(ctx: CanvasRenderingContext2D) {
  ellipse(ctx, 64, 108, 31, 8, 'rgba(5, 8, 10, .3)');
  outline(ctx, [[42, 92], [55, 72], [83, 75], [94, 94], [74, 106], [49, 104]], '#6b625d', '#172026', 5);
  outline(ctx, [[48, 70], [61, 51], [82, 55], [91, 75], [60, 80]], '#898178', '#172026', 5);
  glow(ctx, 76, 80, 18, 'rgba(255, 139, 82, .36)');
}

function lanternReed(ctx: CanvasRenderingContext2D) {
  ellipse(ctx, 64, 108, 28, 7, 'rgba(5, 8, 10, .24)');
  ctx.strokeStyle = '#294d42';
  ctx.lineWidth = 5;
  for (const x of [44, 55, 76, 86]) {
    ctx.beginPath();
    ctx.moveTo(x, 105);
    ctx.quadraticCurveTo(x - 8, 70, x + 4, 42);
    ctx.stroke();
  }
  glow(ctx, 66, 57, 25, 'rgba(255, 199, 82, .5)');
  outline(ctx, [[55, 48], [72, 44], [80, 60], [68, 77], [52, 68]], '#ffc75d', '#172026', 5);
}

function groundTexture(base: string, accent: string, road: string) {
  return makeTexture((ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = road;
    ctx.lineWidth = 22;
    ctx.globalAlpha = 0.42;
    ctx.beginPath();
    ctx.moveTo(-10, 118);
    ctx.bezierCurveTo(35, 87, 52, 55, 138, 18);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    for (let i = 0; i < 28; i++) {
      const x = (i * 47) % s;
      const y = (i * 29) % s;
      ctx.globalAlpha = 0.16 + (i % 4) * 0.04;
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 8, y + 4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, 256);
}

export function createRuntimeArt(): RuntimeArt {
  const ground = [
    groundTexture('#385b45', '#8bd4a2', '#617252'),
    groundTexture('#4d5261', '#b7c1d8', '#74737a'),
    groundTexture('#2d4f4d', '#59d9c1', '#4f706b'),
    groundTexture('#60463d', '#ff8b52', '#825746'),
  ];
  for (const texture of ground) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
  }

  return {
    sprites: {
      hero: makeTexture(hero),
      skulk: makeTexture(skulk),
      brute: makeTexture(brute),
      wisp: makeTexture(wisp),
      shot: makeTexture(shot, 96),
      relic: makeTexture(relic, 96),
      coin: makeTexture(coin, 96),
      waystone: makeTexture(waystone),
      tree: makeTexture(tree),
      cairn: makeTexture(cairn),
      lanternReed: makeTexture(lanternReed),
    },
    ground,
  };
}
