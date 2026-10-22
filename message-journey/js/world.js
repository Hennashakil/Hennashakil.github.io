// Message Journey · 3D world: renderer, camera, home, devices, scene props, people and packets.
// Classic scripts share one global scope, so load order matters (see index.html).

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ALL_TAGS = [];
const C = { wifi: 0x4fd8ff, packet: 0xffb547, crypto: 0xa184ff, ok: 0x4ef0a0, bad: 0xff5470, dhcp: 0xffd36b };
const hex = n => '#' + n.toString(16).padStart(6, '0');

// ---------- Renderer, camera, controls ----------
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1.5 : 2));
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.inset = '0';
document.getElementById('labels').appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070a17);
scene.fog = new THREE.Fog(0x070a17, 16, 40);
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 200);
camera.position.set(0, 7.5, 11);
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 3; controls.maxDistance = 24;
controls.maxPolarAngle = Math.PI * 0.47;
controls.target.set(0, 0.6, -0.4);

scene.add(new THREE.HemisphereLight(0x6a7cff, 0x0a0c18, 0.55));
scene.add(new THREE.AmbientLight(0x303a66, 0.5));
const key = new THREE.DirectionalLight(0xbfd0ff, 0.6); key.position.set(4, 10, 6); scene.add(key);

// ---------- The home: floor, boundary, street ----------
function gridTex(size, step, bg, line, lw) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, size, size);
  g.strokeStyle = line; g.lineWidth = lw;
  for (let i = 0; i <= size; i += step) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, size); g.stroke();
    g.beginPath(); g.moveTo(0, i); g.lineTo(size, i); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
const HOME_R = 6.2;
const street = new THREE.Mesh(new THREE.PlaneGeometry(170, 170),
  new THREE.MeshStandardMaterial({ map: (() => { const t = gridTex(256, 64, '#080b19', '#121a38', 2); t.repeat.set(42, 42); return t; })(), roughness: 1 }));
street.rotation.x = -Math.PI / 2; street.position.y = -0.01; scene.add(street);
const floor = new THREE.Mesh(new THREE.CircleGeometry(HOME_R, 64),
  new THREE.MeshStandardMaterial({ map: (() => { const t = gridTex(256, 32, '#0d1430', '#1c2a5c', 2); t.repeat.set(5, 5); return t; })(), roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2; scene.add(floor);
const wall = new THREE.Mesh(new THREE.CylinderGeometry(HOME_R, HOME_R, 0.6, 96, 1, true),
  new THREE.MeshBasicMaterial({ color: C.wifi, transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
wall.position.y = 0.3; scene.add(wall);
const rim = new THREE.Mesh(new THREE.TorusGeometry(HOME_R, 0.02, 6, 128), new THREE.MeshBasicMaterial({ color: C.wifi }));
rim.rotation.x = Math.PI / 2; rim.position.y = 0.6; scene.add(rim);
const homeTag = makeTag('Henna\'s home', 'Wi-Fi: Henna_Home · WPA2');
homeTag.obj.position.set(-5.7, 0.7, -2.4); scene.add(homeTag.obj);

// Wi-Fi coverage dome
const dome = new THREE.Mesh(new THREE.SphereGeometry(HOME_R - 0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: C.wifi, wireframe: true, transparent: true, opacity: 0.05 }));
scene.add(dome);

// ---------- Labels ----------
function makeTag(name, sub, extra) {
  const el = document.createElement('div');
  el.className = 'tag' + (extra ? ' ' + extra : '');
  el.innerHTML = '<b></b><div class="sub"></div><div class="chips"></div>';
  el.querySelector('b').textContent = name;
  el.querySelector('.sub').textContent = sub || '';
  const obj = new THREE.CSS2DObject(el);
  const tagApi = {
    obj, el,
    sub(text, cls) { const s = el.querySelector('.sub'); s.textContent = text; s.className = 'sub' + (cls ? ' ' + cls : ''); },
    chips(list) {
      const box = el.querySelector('.chips'); box.textContent = '';
      list.forEach(([t, c]) => { const s = document.createElement('span'); s.className = 'chip ' + c; s.textContent = t; box.appendChild(s); });
    },
  };
  ALL_TAGS.push(tagApi);
  return tagApi;
}

// ---------- Devices ----------
const metal = new THREE.MeshStandardMaterial({ color: 0x1b2242, roughness: 0.45, metalness: 0.5 });
const darker = new THREE.MeshStandardMaterial({ color: 0x111630, roughness: 0.6, metalness: 0.3 });
function stand(x, z, h, parent) {
  const host = parent || scene;
  const s = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, h, 24), darker);
  s.position.set(x, h / 2, z); host.add(s);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.015, 6, 48), new THREE.MeshBasicMaterial({ color: 0x2b3a7a }));
  ring.rotation.x = Math.PI / 2; ring.position.set(x, h + 0.005, z); host.add(ring);
}
function screenCanvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const tex = new THREE.CanvasTexture(c);
  return { c, g: c.getContext('2d'), tex };
}

// Router
const router = new THREE.Group(); router.position.set(2.4, 0.8, -0.8); scene.add(router);
stand(2.4, -0.8, 0.8);
const rBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.22, 0.72), metal); rBody.position.y = 0.11; router.add(rBody);
[-0.4, 0.4].forEach(x => {
  const a = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.7, 8), darker);
  a.position.set(x, 0.55, -0.28); a.rotation.z = x < 0 ? 0.18 : -0.18; router.add(a);
});
const rLeds = [];
for (let i = 0; i < 5; i++) {
  const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.01), new THREE.MeshBasicMaterial({ color: i === 0 ? C.ok : C.wifi }));
  l.position.set(-0.32 + i * 0.16, 0.12, 0.362); l.userData.ph = i * 1.3; router.add(l); rLeds.push(l);
}
const routerTag = makeTag('Wi-Fi router', '192.168.1.1 · DHCP server');
routerTag.obj.position.set(0, 0.9, 0); router.add(routerTag.obj);
const routerPort = new THREE.Vector3(2.4, 1.15, -0.8);

// Phone
const phone = new THREE.Group(); phone.position.set(-2.4, 0.8, 1.2); phone.rotation.y = 0.55; scene.add(phone);
stand(-2.4, 1.2, 0.8);
const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.06, 0.07), metal);
pBody.position.y = 0.62; pBody.rotation.x = -0.12; phone.add(pBody);
const ps = screenCanvas(256, 480);
const pScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.96), new THREE.MeshBasicMaterial({ map: ps.tex }));
pScreen.position.set(0, 0, 0.037); pBody.add(pScreen);
const phoneTag = makeTag('Henna\'s phone', 'No IP yet');
phoneTag.obj.position.set(0, 1.35, 0); phone.add(phoneTag.obj);
const phonePort = new THREE.Vector3(-2.4, 1.55, 1.2);

function paintPhone(s) {
  const g = ps.g, W = 256, H = 480;
  g.fillStyle = '#060914'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#c9cfec'; g.font = '500 20px "IBM Plex Mono", monospace'; g.fillText('10:24', 18, 34);
  // Wi-Fi icon: arcs fill when connected
  const lit = s.connected ? 3 : s.keyed ? 2 : s.password ? 1 : 0;
  for (let i = 0; i < 3; i++) {
    g.strokeStyle = i < lit ? '#4fd8ff' : '#2a3358'; g.lineWidth = 4;
    g.beginPath(); g.arc(220, 40, 8 + i * 8, Math.PI * 1.25, Math.PI * 1.75); g.stroke();
  }
  let big = 'Offline', small = 'No internet', col = '#ff5470';
  if (s.password && !s.keyed) { big = 'Joining'; small = 'Henna_Home'; col = '#a184ff'; }
  if (s.keyed && !s.connected) { big = 'Getting IP'; small = 'Wi-Fi joined'; col = '#ffd36b'; }
  if (s.connected) { big = 'Online'; small = s.ip; col = '#4ef0a0'; }
  if (s.app) { big = 'WhatsApp'; small = s.secure ? 'Connected' : s.tcp >= 3 ? 'Securing...' : s.port ? 'Connecting...' : s.dns ? 'Server found' : 'Finding server'; col = '#25d366'; }
  if (s.bundle) { big = 'Riya'; small = s.tick2 ? 'Hi  ✓✓' : s.tick1 ? 'Hi  ✓' : s.locked ? 'Hi  🕓' : 'typing: Hi'; col = '#25d366'; }
  g.fillStyle = col; g.font = '700 40px Oxanium, sans-serif'; g.textAlign = 'center';
  g.fillText(big, W / 2, 230);
  g.fillStyle = s.read ? '#4fb8ff' : '#8a93b8'; g.font = '500 20px "IBM Plex Mono", monospace'; g.fillText(small, W / 2, 268);
  g.textAlign = 'left';
  // app icons row
  const apps = ['#25d366', '#4fd8ff', '#ffb547', '#a184ff'];
  apps.forEach((c, i) => {
    g.fillStyle = c; g.globalAlpha = s.connected ? 1 : 0.25;
    g.beginPath(); g.arc(50 + i * 52, 400, 18, 0, Math.PI * 2); g.fill();
  });
  g.globalAlpha = 1;
  ps.tex.needsUpdate = true;
}

// Family laptop
function laptop(x, z, ry, screenColor, parent) {
  const outer = new THREE.Group(); outer.position.set(x, 0, z); (parent || scene).add(outer);
  stand(0, 0, 0.8, outer);
  const grp = new THREE.Group(); grp.position.y = 0.8; grp.rotation.y = ry; outer.add(grp);
  grp.userData.outer = outer;
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.55), metal); base.position.y = 0.02; grp.add(base);
  const lid = new THREE.Group(); lid.position.set(0, 0.04, -0.27); lid.rotation.x = -0.25; grp.add(lid);
  const lidM = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.52, 0.03), metal); lidM.position.y = 0.26; lid.add(lidM);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.44), new THREE.MeshBasicMaterial({ color: screenColor }));
  scr.position.set(0, 0.26, 0.017); lid.add(scr);
  return grp;
}
const lap = laptop(-1.1, -2.7, 0.35, 0x1b3b6b);
const lapTag = makeTag('Family laptop', '192.168.1.3'); lapTag.obj.position.set(0, 1.0, 0); lap.add(lapTag.obj);
const lapPort = new THREE.Vector3(-1.1, 1.3, -2.7);

// Smart TV
const tv = new THREE.Group(); tv.position.set(1.2, 0, -4.2); tv.rotation.y = -0.15; scene.add(tv);
const tvPanel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.08, 0.06), metal); tvPanel.position.y = 1.5; tv.add(tvPanel);
const tvScr = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.98), new THREE.MeshBasicMaterial({ color: 0x15204a }));
tvScr.position.set(0, 1.5, 0.031); tv.add(tvScr);
const tvLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.96, 0.08), darker); tvLeg.position.y = 0.48; tv.add(tvLeg);
const tvFoot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.4), darker); tvFoot.position.y = 0.02; tv.add(tvFoot);
const tvTag = makeTag('Smart TV', '192.168.1.4'); tvTag.obj.position.set(0, 2.3, 0); tv.add(tvTag.obj);
const tvPort = new THREE.Vector3(1.2, 1.9, -4.2);

// Intruder outside the house
const intruderBody = laptop(8.4, 2.4, -1.1, 0x5a1424);
const intruder = intruderBody.userData.outer;
const intrTag = makeTag('Unknown device', 'Outside the house', 'bad');
intrTag.obj.position.set(0, 1.0, 0); intruderBody.add(intrTag.obj);
const intrPort = new THREE.Vector3(8.4, 1.3, 2.4);
function setVis(obj, v) { obj.traverse(o => { o.visible = v; }); }

// ---------- The internet outside: DNS servers (Scene 2) ----------
const city = new THREE.Group(); scene.add(city);
const serverLeds = [];
function tower(x, z, h, color, name, sub) {
  const g = new THREE.Group(); g.position.set(x, 0, z); city.add(g);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 0.2, 40), darker); base.position.y = 0.1; g.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.03, 6, 64), new THREE.MeshBasicMaterial({ color }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.21; g.add(ring);
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, h, 1.3), metal); body.position.y = 0.2 + h / 2; g.add(body);
  for (let k = 0; k < Math.floor((h - 0.3) / 0.32); k++) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.035, 1.32), new THREE.MeshBasicMaterial({ color }));
    st.position.y = 0.45 + k * 0.32; st.userData.ph = Math.random() * 6; st.userData.sp = 1 + Math.random() * 3;
    g.add(st); serverLeds.push(st);
  }
  const cap = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexLazy(), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  cap.scale.set(2.6, 2.6, 1); cap.position.y = h + 0.3; g.add(cap);
  const tag = makeTag(name, sub); tag.obj.position.set(0, h + 1.1, 0); g.add(tag.obj);
  return { g, tag, port: new THREE.Vector3(x, h + 0.35, z) };
}
let _glow = null;
function glowTexLazy() {
  if (_glow) return _glow;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,0.8)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); _glow = new THREE.CanvasTexture(c); return _glow;
}
const resolver = tower(13, -4, 3.2, C.wifi, 'ISP DNS resolver', '203.0.113.53 · port 53');
const rootSrv = tower(25, -18, 6.6, C.packet, 'Root server ( . )', 'a.root-servers.net');
const tldSrv = tower(33, -2, 4.8, 0x7aa2ff, '.net TLD server', 'a.gtld-servers.net');
const authSrv = tower(24, 10, 4.0, 0x25d366, 'whatsapp.net DNS', 'a.ns.whatsapp.net · authoritative');
// Fibre lines joining the home to the resolver and the resolver to each server
function fibre(a, b, color) {
  const curve = new THREE.QuadraticBezierCurve3(a.clone().setY(0.05), a.clone().lerp(b, 0.5).setY(0.05), b.clone().setY(0.05));
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
  const line = new THREE.Line(geo, new THREE.LineDashedMaterial({ color, dashSize: 0.4, gapSize: 0.3, transparent: true, opacity: 0.55 }));
  line.computeLineDistances(); city.add(line);
  return line;
}
const fibres = [
  fibre(new THREE.Vector3(HOME_R, 0, -1.4), resolver.port, C.wifi),
  fibre(resolver.port, rootSrv.port, C.packet),
  fibre(resolver.port, tldSrv.port, 0x7aa2ff),
  fibre(resolver.port, authSrv.port, 0x25d366),
];
// The attacker who tries DNS spoofing
const hackerBody = laptop(11, 7.5, -2.2, 0x5a1424, city);
const hacker = hackerBody.userData.outer;
const hackTag = makeTag('Attacker', 'Pretends to be WhatsApp DNS', 'bad');
hackTag.obj.position.set(0, 1.0, 0); hackerBody.add(hackTag.obj);
const hackPort = new THREE.Vector3(11, 1.3, 7.5);
// Shield that appears on the resolver when it drops the fake answer
const shield = new THREE.Mesh(new THREE.SphereGeometry(2.3, 32, 16), new THREE.MeshBasicMaterial({ color: C.ok, wireframe: true, transparent: true, opacity: 0.35 }));
shield.position.set(13, 1.8, -4); city.add(shield);

// ---------- WhatsApp chat server and the TCP connection (Scene 3) ----------
const waSrv = tower(38, 22, 7.2, 0x25d366, 'WhatsApp chat server', 'g.whatsapp.net · 157.240.16.60');
const waBig = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.05, 8, 80), new THREE.MeshBasicMaterial({ color: 0x25d366, transparent: true, opacity: 0.6 }));
waBig.rotation.x = Math.PI / 2; waBig.position.set(38, 0.25, 22); city.add(waBig);
fibres.push(fibre(new THREE.Vector3(HOME_R * 0.8, 0, HOME_R * 0.55), waSrv.port, 0x25d366));
const pipeCurve = new THREE.CatmullRomCurve3([
  phonePort.clone(), routerPort.clone(), new THREE.Vector3(12, 5.5, 8), new THREE.Vector3(26, 8, 17), waSrv.port.clone(),
]);
const pipeTex = (() => {
  const c = document.createElement('canvas'); c.width = 128; c.height = 8;
  const g = c.getContext('2d'); g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(0, 0, 128, 8);
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 36, 8);
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.set(30, 1); return t;
})();
const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 200, 0.07, 8, false),
  new THREE.MeshBasicMaterial({ map: pipeTex, color: C.packet, transparent: true, opacity: 0.85 }));
city.add(pipe);
const pipeDots = [0, 1, 2, 3].map(i => {
  const d = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  d.userData.off = i / 4; d.userData.dir = i % 2 ? -1 : 1; city.add(d); return d;
});

// ---------- Riya's home and phone (Scene 4) ----------
const RIYA = new THREE.Vector3(50, 0, -8);
const riyaHome = new THREE.Group(); riyaHome.position.copy(RIYA); city.add(riyaHome);
const rFloor = new THREE.Mesh(new THREE.CircleGeometry(4, 48),
  new THREE.MeshStandardMaterial({ map: (() => { const t = gridTex(256, 32, '#0f1a2a', '#1d3a4a', 2); t.repeat.set(3, 3); return t; })(), roughness: 0.9 }));
rFloor.rotation.x = -Math.PI / 2; rFloor.position.y = 0.01; riyaHome.add(rFloor);
const rRim = new THREE.Mesh(new THREE.TorusGeometry(4, 0.03, 6, 96), new THREE.MeshBasicMaterial({ color: 0x25d366 }));
rRim.rotation.x = Math.PI / 2; rRim.position.y = 0.5; riyaHome.add(rRim);
const rWall = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 0.5, 64, 1, true),
  new THREE.MeshBasicMaterial({ color: 0x25d366, transparent: true, opacity: 0.1, side: THREE.DoubleSide }));
rWall.position.y = 0.25; riyaHome.add(rWall);
stand(0, 0, 0.8, riyaHome);
const rPhone = new THREE.Group(); rPhone.position.set(0, 0.8, 0); rPhone.rotation.y = -0.9; riyaHome.add(rPhone);
const rpBody = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.06, 0.07), metal); rpBody.position.y = 0.62; rpBody.rotation.x = -0.12; rPhone.add(rpBody);
const rs = screenCanvas(256, 480);
const rScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.96), new THREE.MeshBasicMaterial({ map: rs.tex }));
rScreen.position.z = 0.037; rpBody.add(rScreen);
const riyaTag = makeTag('Riya\'s phone', 'Henna\'s friend · WhatsApp');
riyaTag.obj.position.set(0, 1.35, 0); rPhone.add(riyaTag.obj);
const riyaHomeTag = makeTag('Riya\'s home', 'another city');
riyaHomeTag.obj.position.set(-3.2, 0.6, 2.4); riyaHome.add(riyaHomeTag.obj);
const riyaPort = new THREE.Vector3(RIYA.x, 1.55, RIYA.z);
function paintRiya(lines, col) {
  const g = rs.g;
  g.fillStyle = '#060914'; g.fillRect(0, 0, 256, 480);
  g.fillStyle = '#c9cfec'; g.font = '500 20px "IBM Plex Mono", monospace'; g.fillText('10:24', 18, 34);
  g.textAlign = 'center';
  g.fillStyle = col; g.font = '700 38px Oxanium, sans-serif'; g.fillText(lines[0], 128, 220);
  g.fillStyle = '#8a93b8'; g.font = '500 19px "IBM Plex Mono", monospace';
  (lines.slice(1)).forEach((l, i) => g.fillText(l, 128, 260 + i * 28));
  g.textAlign = 'left'; rs.tex.needsUpdate = true;
}
paintRiya(['WhatsApp', 'Online'], '#25d366');
fibres.push(fibre(RIYA.clone().add(new THREE.Vector3(-4, 0, 0)), waSrv.port, 0x25d366));

// Key mixing above Henna's phone: her colour + Riya's colour = shared secret
const mixAt = phonePort.clone().add(new THREE.Vector3(-0.9, 1.5, 1.3));
function orb(color, r) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), new THREE.MeshBasicMaterial({ color })));
  const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexLazy(), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  gl.scale.set(r * 6, r * 6, 1); g.add(gl); city.add(g); return g;
}
const orbHenna = orb(C.packet, 0.16), orbRiya = orb(0x25d366, 0.16), orbSecret = orb(C.crypto, 0.24);
const secretTag = makeTag('Shared secret', 'same on both phones');
secretTag.obj.position.set(0, 0.55, 0); orbSecret.add(secretTag.obj);
// Ratchet gear: turns one click for every message
const gear = new THREE.Group();
gear.add(new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 8, 32), new THREE.MeshBasicMaterial({ color: C.crypto })));
for (let k = 0; k < 10; k++) {
  const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.08), new THREE.MeshBasicMaterial({ color: 0xc9b8ff }));
  const a = k / 10 * Math.PI * 2; tooth.position.set(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0); tooth.rotation.z = a; gear.add(tooth);
}
gear.position.copy(phonePort).add(new THREE.Vector3(-2.2, 0.9, 1.6)); city.add(gear);
const gearTag = makeTag('Double Ratchet', 'new key every message');
gearTag.obj.position.set(0, 0.75, 0); gear.add(gearTag.obj);
let gearClick = 0;
// Spy probe for the sniffing beat
const sniffAt = pipeCurve.getPointAt(0.45);

// ---------- OSI wrapping station above Henna's phone (Scene 5) ----------
const STATION = phonePort.clone().add(new THREE.Vector3(0.6, 1.3, 1.7));
const stack = new THREE.Group(); stack.position.copy(STATION); scene.add(stack);
const OSI = [
  { n: 7, c: 0x25d366, name: 'Application', row: 'WhatsApp msg · to Riya · id 3EB0C4F1', bytes: 30 },
  { n: 6, c: C.crypto, name: 'Presentation', row: 'Signal E2E 🔒 · protobuf encoded', bytes: 64 },
  { n: 5, c: 0x4ff0d8, name: 'Session', row: 'Noise session 🔒 · keep-alive', bytes: 16 },
  { n: 4, c: C.packet, name: 'Transport', row: 'TCP 51234 → 443 · seq 2904238 · PSH ACK', bytes: 32 },
  { n: 3, c: 0x6a8cff, name: 'Network', row: 'IP 192.168.1.5 → 157.240.16.60 · TTL 64', bytes: 20 },
  { n: 2, c: C.wifi, name: 'Data link', row: 'Wi-Fi 3c:a6:…:01 → 98:da:…:aa · FCS', bytes: 54 },
  { n: 1, c: 0xffffff, name: 'Physical', row: 'bits → radio waves · 2.4 GHz', bytes: 0 },
];
const ISP_L2 = { n: 2, c: 0xff8a3c, name: 'Data link', row: 'Fibre · router → ISP · new MACs', bytes: 26 };
const core = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.3), new THREE.MeshBasicMaterial({ color: 0xffffff }));
stack.add(core);
const coreTag = makeTag('"Hi"', 'payload');
coreTag.obj.position.set(0, -0.35, 0); stack.add(coreTag.obj);
const shells = [];
const anatEl = document.createElement('div'); anatEl.className = 'anat';
const anatObj = new THREE.CSS2DObject(anatEl); stack.add(anatObj);
function setWrap(n, atRouter) {
  shells.splice(0).forEach(m => { stack.remove(m); });
  const list = OSI.slice(0, Math.min(n, 6)).map(x => x);
  if (atRouter && list.length === 6) list[5] = ISP_L2;
  list.forEach((L, k) => {
    const sz = 0.42 + k * 0.2;
    const box = new THREE.Mesh(new THREE.BoxGeometry(sz, sz * 0.72, sz),
      new THREE.MeshBasicMaterial({ color: L.c, transparent: true, opacity: 0.14, depthWrite: false }));
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({ color: L.c }));
    box.add(edge); box.userData.k = k; stack.add(box); shells.push(box);
  });
  anatEl.textContent = '';
  const h = document.createElement('div'); h.className = 'ah'; h.textContent = 'Packet anatomy · outermost first'; anatEl.appendChild(h);
  const rows = OSI.slice(0, n).map(x => x);
  if (atRouter && rows.length >= 6) rows[5] = ISP_L2;
  rows.slice().reverse().forEach((L, i) => {
    const r = document.createElement('div'); r.className = 'ar' + (i === 0 && !atRouter ? ' new' : '');
    r.style.setProperty('--c', hex(L.c));
    const b = document.createElement('b'); b.textContent = 'L' + L.n; r.appendChild(b);
    r.appendChild(document.createTextNode(L.row)); anatEl.appendChild(r);
  });
  const total = 2 + rows.reduce((a, L) => a + L.bytes, 0);
  const tl = document.createElement('div'); tl.className = 'at';
  tl.textContent = n === 0 ? '"Hi" = 2 bytes of text' : '"Hi" = 2 bytes → about ' + total + ' bytes with all wrappers';
  anatEl.appendChild(tl);
  coreTag.sub(n >= 2 ? 'payload (locked)' : 'payload');
}
// Radio waves between phone and router (Layer 1)
const WAVE_N = 120;
const waveGeo = new THREE.BufferGeometry().setFromPoints(new Array(WAVE_N).fill(0).map(() => new THREE.Vector3()));
const wave = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({ color: C.wifi, transparent: true, opacity: 0.9 }));
scene.add(wave);
const wave2 = new THREE.Line(waveGeo.clone(), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
scene.add(wave2);
function drawWave(t) {
  [wave, wave2].forEach((w, j) => {
    const pos = w.geometry.attributes.position;
    for (let i = 0; i < WAVE_N; i++) {
      const u = i / (WAVE_N - 1);
      v1.copy(phonePort).lerp(routerPort, u); v1.y += Math.sin(u * Math.PI) * 0.9;
      const amp = 0.12 * Math.sin(u * Math.PI);
      v1.y += Math.sin(u * 60 - t * 12 + j * 1.6) * amp;
      v1.z += Math.cos(u * 60 - t * 12 + j * 1.6) * amp * 0.6;
      pos.setXYZ(i, v1.x, v1.y, v1.z);
    }
    pos.needsUpdate = true;
  });
}
let stackAnim = null;
// ---------- ISP gateway and the router's NAT table (Scene 6) ----------
const ispGw = tower(12, 2.6, 2.4, 0xff8a3c, 'ISP gateway', 'your internet provider');
const gwPort = ispGw.port;
fibres.push(fibre(new THREE.Vector3(HOME_R, 0, 0.8), gwPort, 0xff8a3c));
const natEl = document.createElement('div'); natEl.className = 'nat';
const natObj = new THREE.CSS2DObject(natEl);
natObj.position.copy(routerPort).add(new THREE.Vector3(1.8, 2.0, 2.4)); scene.add(natObj);
const NAT_ROWS = {
  phone: ['192.168.1.5:51234', '198.51.100.24:40001', '157.240.16.60:443'],
  laptop: ['192.168.1.3:51234', '198.51.100.24:40002', '203.0.113.80:443'],
};
let natStamp = 0, natNew = '';
function paintNat(s) {
  natEl.textContent = '';
  const h = document.createElement('div'); h.className = 'ah'; h.textContent = 'Router NAT table'; natEl.appendChild(h);
  const grid = document.createElement('div'); grid.className = 'nr';
  ['Inside (private)', 'Outside (public)', 'Talking to', 'Expires'].forEach(k => {
    const e = document.createElement('span'); e.className = 'k'; e.textContent = k; grid.appendChild(e);
  });
  const left = Math.max(0, 7440 - Math.floor((performance.now() - natStamp) / 1000));
  const clock = Math.floor(left / 3600) + ':' + String(Math.floor(left / 60) % 60).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
  [['phone', s.nat >= 1], ['laptop', s.nat >= 2]].forEach(([k, on]) => {
    if (!on) return;
    const r = NAT_ROWS[k];
    [r[0], r[1], r[2], clock].forEach((v, i) => {
      const e = document.createElement('span');
      e.className = (i === 1 ? 'pub' : i === 3 ? 'ttl' : '') + (natNew === k ? ' newc' : '');
      if (natNew === k && i < 3) e.style.color = 'var(--ok)';
      e.textContent = v; grid.appendChild(e);
    });
  });
  natEl.appendChild(grid);
}
// ---------- Internet routers, BGP links and the undersea cable (Scene 7) ----------
const rCore = tower(18, 16, 2.2, 0x9fb4ff, 'ISP core router', '198.51.100.129');
const rIxp = tower(26, 28, 2.6, 0xffd36b, 'Internet exchange (IXP)', 'networks meet here');
const rEdge = tower(34, 32, 2.4, 0x25d366, 'Meta edge router', 'AS32934 · 157.240.0.1');
const rTransit = tower(30, 12, 2.2, 0xff8ad8, 'Transit provider', 'backup path · 192.0.2.10');
function wire(a, b, color) {
  const geo = new THREE.BufferGeometry().setFromPoints([a.clone().setY(0.12), b.clone().setY(0.12)]);
  const ln = new THREE.Line(geo, new THREE.LineDashedMaterial({ color, dashSize: 0.6, gapSize: 0.25, transparent: true, opacity: 0.8 }));
  ln.computeLineDistances(); city.add(ln); return ln;
}
const L = {
  gwCore: wire(gwPort, rCore.port, 0x9fb4ff),
  coreIxp: wire(rCore.port, rIxp.port, 0x9fb4ff),
  ixpEdge: wire(rIxp.port, rEdge.port, 0x9fb4ff),
  edgeWa: wire(rEdge.port, waSrv.port, 0x25d366),
  coreTr: wire(rCore.port, rTransit.port, 0x6a6f9a),
  trWa: wire(rTransit.port, waSrv.port, 0x6a6f9a),
};
const cutMark = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 8, 24), new THREE.MeshBasicMaterial({ color: C.bad }));
cutMark.position.copy(rIxp.port).lerp(rEdge.port, 0.5).setY(0.6); cutMark.rotation.x = Math.PI / 2; city.add(cutMark);
const cutTag = makeTag('Link down', 'fibre cut', 'bad'); cutTag.obj.position.set(0, 0.6, 0); cutMark.add(cutTag.obj);
// Sea with an undersea cable to another country
const sea = new THREE.Mesh(new THREE.PlaneGeometry(52, 40), new THREE.MeshBasicMaterial({ color: 0x062a3c, transparent: true, opacity: 0.85 }));
sea.rotation.x = -Math.PI / 2; sea.position.set(78, 0.02, 48); city.add(sea);
const seaTag = makeTag('Ocean', 'cables lie on the sea floor'); seaTag.obj.position.set(70, 0.6, 40); city.add(seaTag.obj);
const landing = tower(50, 38, 1.8, C.wifi, 'Cable landing station', 'where the sea cable comes ashore');
const farEnd = new THREE.Vector3(100, 0.6, 64);
const farTag = makeTag('Singapore →', 'about 4,000 km away'); farTag.obj.position.copy(farEnd); city.add(farTag.obj);
wire(rIxp.port, landing.port, C.wifi);
const seaCable = new THREE.Line(new THREE.BufferGeometry().setFromPoints([landing.port.clone().setY(-0.05), farEnd.clone().setY(-0.05)]),
  new THREE.LineBasicMaterial({ color: C.wifi })); city.add(seaCable);
const seaGlow = [0, 1, 2, 3, 4].map(i => {
  const d = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexLazy(), color: 0xbff4ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  d.scale.set(1.4, 1.4, 1); d.userData.off = i / 5; city.add(d); return d;
});
const TRACE = [
  ['1', '192.168.1.1', 'Home router', '2 ms'],
  ['2', '198.51.100.1', 'ISP gateway', '6 ms'],
  ['3', '198.51.100.129', 'ISP core router', '9 ms'],
  ['4', '203.0.113.1', 'Internet exchange', '14 ms'],
  ['5', '157.240.0.1', 'Meta edge · AS32934', '17 ms'],
  ['6', '157.240.16.60', 'WhatsApp server', '19 ms'],
];
const TRACE_ALT = [
  ['4', '192.0.2.10', 'Transit provider', '18 ms'],
  ['5', '157.240.16.60', 'WhatsApp server', '24 ms'],
];
function paintTrace(s) {
  const box = document.getElementById('traceRows'); box.textContent = '';
  let rows = TRACE.slice(0, s.hop);
  if (s.reroute) rows = TRACE.slice(0, 3).concat(TRACE_ALT);
  rows.forEach((r, i) => {
    const d = document.createElement('div');
    d.className = 'tr' + (i === rows.length - 1 && !s.traceDone ? ' new' : '') + (s.reroute && i >= 3 ? ' alt' : '');
    r.forEach((v, k) => { const e = document.createElement('span'); if (k === 3) e.className = 'ms'; e.textContent = v; d.appendChild(e); });
    box.appendChild(d);
  });
}
// ---------- WhatsApp data center: layers of defence around the server (Scene 8) ----------
const DC = new THREE.Vector3(38, 0, 22);
const dc = new THREE.Group(); city.add(dc);
const toEdge = new THREE.Vector3(34 - 38, 0, 32 - 22).normalize();
const ringPt = (r, y) => DC.clone().add(toEdge.clone().multiplyScalar(r)).setY(y);
const shieldDome = new THREE.Mesh(new THREE.SphereGeometry(9, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0xff8a3c, wireframe: true, transparent: true, opacity: 0.12 }));
shieldDome.position.copy(DC); dc.add(shieldDome);
const fwWall = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 1.6, 72, 1, true),
  new THREE.MeshBasicMaterial({ color: C.bad, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false }));
fwWall.position.copy(DC).setY(0.8); dc.add(fwWall);
const fwRim = new THREE.Mesh(new THREE.TorusGeometry(7, 0.05, 6, 120), new THREE.MeshBasicMaterial({ color: C.bad }));
fwRim.rotation.x = Math.PI / 2; fwRim.position.copy(DC).setY(1.6); dc.add(fwRim);
const monRing = new THREE.Mesh(new THREE.TorusGeometry(5.3, 0.05, 6, 100), new THREE.MeshBasicMaterial({ color: 0xffd36b }));
monRing.rotation.x = Math.PI / 2; monRing.position.copy(DC).setY(0.3); dc.add(monRing);
const radar = new THREE.Mesh(new THREE.PlaneGeometry(5.3, 0.9),
  new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }));
radar.geometry.translate(2.65, 0.45, 0);
const radarPivot = new THREE.Group(); radarPivot.position.copy(DC).setY(0.3); radarPivot.add(radar); dc.add(radarPivot);
const shieldTag = makeTag('Traffic shield', 'filters junk traffic'); shieldTag.obj.position.copy(ringPt(9, 5.6)); dc.add(shieldTag.obj);
const fwTag = makeTag('Firewall', 'allow TCP 443, 5222 · deny rest'); fwTag.obj.position.copy(ringPt(7, 2.3)).add(new THREE.Vector3(-2.4, 0, 0)); dc.add(fwTag.obj);
const monTag = makeTag('IDS / IPS', 'watches for unusual behaviour'); monTag.obj.position.copy(ringPt(5.3, 1)).add(new THREE.Vector3(2.6, 0, 0)); dc.add(monTag.obj);
const lbG = new THREE.Group(); lbG.position.copy(ringPt(3.2, 0)); dc.add(lbG);
const lbBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.1), metal); lbBody.position.y = 0.6; lbG.add(lbBody);
const lbTop = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.06, 1.12), new THREE.MeshBasicMaterial({ color: C.wifi })); lbTop.position.y = 0.86; lbG.add(lbTop);
const lbTag = makeTag('Load balancer', 'picks a healthy server'); lbTag.obj.position.set(0, 1.5, 0); lbG.add(lbTag.obj);
const lbPort = lbG.position.clone().setY(1.1);
function miniServer(x, z, name) {
  const g = new THREE.Group(); g.position.set(x, 0, z); dc.add(g);
  const b = new THREE.Mesh(new THREE.BoxGeometry(1, 3.4, 1), metal); b.position.y = 1.7; g.add(b);
  const st = [];
  for (let k = 0; k < 8; k++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.03, 1.02), new THREE.MeshBasicMaterial({ color: 0x25d366 }));
    m.position.y = 0.4 + k * 0.38; m.userData.ph = Math.random() * 6; m.userData.sp = 1 + Math.random() * 3; g.add(m); st.push(m); serverLeds.push(m);
  }
  const tag = makeTag(name, ''); tag.obj.position.set(0, 4.1, 0); g.add(tag.obj);
  return { g, tag, st, port: new THREE.Vector3(x, 3.3, z) };
}
const srvB = miniServer(42.2, 19.2, 'Chat server B');
const srvC = miniServer(42.4, 25.2, 'Chat server C');
const P9 = ringPt(9, 1.6), P7 = ringPt(7, 1.4), P5 = ringPt(5.3, 1.2);
const loads = { a: 38, b: 81 };
function paintLoads(s) {
  if (!s.dc) return;
  waSrv.tag.chips([['load ' + loads.a + '%', 'ok']].concat(s.lb ? [['chosen ✓', 'ok']] : [], s.held ? [['1 msg · locked', 'key']] : []));
  srvB.tag.chips([['load ' + loads.b + '%', loads.b > 75 ? 'bad' : 'ok']]);
  srvC.tag.chips([['DOWN ✗', 'bad'], ['health check failed', 'dim']]);
  srvC.st.forEach(m => m.material.color.setHex(0x5a1424));
}
// ---------- Inside the server: user directory and message queue (Scene 9) ----------
function database(x, z, color, name, sub) {
  const g = new THREE.Group(); g.position.set(x, 0, z); dc.add(g);
  const discs = [];
  for (let k = 0; k < 4; k++) {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.32, 32), metal); d.position.y = 0.25 + k * 0.4; g.add(d);
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.025, 6, 48), new THREE.MeshBasicMaterial({ color }));
    r.rotation.x = Math.PI / 2; r.position.y = 0.42 + k * 0.4; r.userData.ph = k; g.add(r); discs.push(r);
  }
  const tag = makeTag(name, sub); tag.obj.position.set(0, 2.6, 0); g.add(tag.obj);
  return { g, tag, discs, port: new THREE.Vector3(x, 1.9, z) };
}
const dirDb = database(39.6, 17.6, C.wifi, 'User directory', 'who is online, on which server');
const queueDb = database(34.6, 19.6, C.crypto, 'Message queue', 'encrypted, waiting for delivery');
const qCube = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.32), new THREE.MeshBasicMaterial({ color: C.crypto }));
qCube.position.set(34.6, 2.0, 19.6); dc.add(qCube);
const qCubeTag = makeTag('"Hi" for Riya', 'locked · cannot be read'); qCubeTag.obj.position.set(0, 0.45, 0); qCube.add(qCubeTag.obj);
// Other people's messages flowing in and out keep the server visibly busy
const busy = [0, 1, 2, 3, 4, 5].map(i => {
  const d = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.12), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x8a93b8 : 0x6a5cff }));
  d.userData = { off: i / 6, to: i % 3 === 0 ? dirDb : queueDb, back: i % 2 === 1 }; dc.add(d); return d;
});
// ---------- Push service and Riya-side props (Scene 10) ----------
const pushSrv = tower(45, 5, 3, 0xffd36b, 'Push service (FCM)', 'wakes up sleeping Android phones');
fibres.push(fibre(waSrv.port, pushSrv.port, 0xffd36b));
const riyaMix = riyaPort.clone().add(new THREE.Vector3(-1.3, 1.3, 1.1));
const riyaStation = riyaPort.clone().add(new THREE.Vector3(-1.6, 1.4, 1.8));
const orbSecretR = orb(C.crypto, 0.24); orbSecretR.position.copy(riyaMix);
const secretTagR = makeTag('Same shared secret', 'made from Riya\'s private key');
secretTagR.obj.position.set(0, 0.55, 0); orbSecretR.add(secretTagR.obj);
const pushRings = [0, 1, 2].map(i => {
  const r = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 6, 40), new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0.6 }));
  r.position.copy(riyaPort).add(new THREE.Vector3(0, -0.3, 0)); r.rotation.x = Math.PI / 2; r.userData.off = i / 3; city.add(r); return r;
});
// ---------- Device protection around Riya's phone (Scene 11) ----------
const unkBody = laptop(56.5, -1.5, -2.4, 0x3a2030, city);
const unknown = unkBody.userData.outer;
const unkTag = makeTag('Unknown number', 'not in Riya\'s contacts', 'bad'); unkTag.obj.position.set(0, 1.0, 0); unkBody.add(unkTag.obj);
const unkPort = new THREE.Vector3(56.5, 1.3, -1.5);
const scanRing = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.035, 6, 48), new THREE.MeshBasicMaterial({ color: C.ok, transparent: true, opacity: 0.85 }));
scanRing.rotation.x = Math.PI / 2; scanRing.position.copy(riyaPort); city.add(scanRing);
const guard = new THREE.Mesh(new THREE.SphereGeometry(1.5, 28, 14), new THREE.MeshBasicMaterial({ color: C.ok, wireframe: true, transparent: true, opacity: 0.25 }));
guard.position.copy(riyaPort).setY(1.2); city.add(guard);
const guardTag = makeTag('Phone protection', 'scans files and links'); guardTag.obj.position.set(0, 1.9, 0); guard.add(guardTag.obj);
const qBox = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.9, 0.9)), new THREE.LineBasicMaterial({ color: C.bad }));
qBox.position.set(52.6, 0.7, -5.6); city.add(qBox);
const qFile = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.38, 0.06), new THREE.MeshBasicMaterial({ color: C.bad })); qBox.add(qFile);
const qTag = makeTag('Quarantine', 'file locked away, cannot run', 'bad'); qTag.obj.position.set(0, 0.9, 0); qBox.add(qTag.obj);
async function viaServer(ok, from, color, label) {
  await fly({ from, to: waSrv.port, color, label, h: 7, dur: 1.8 }); if (!ok()) return false;
  await fly({ from: waSrv.port, to: riyaPort, color, label, h: 8, dur: 2 }); if (!ok()) return false;
  sfx.land(); return true;
}
// ---------- Big picture: the whole journey as one glowing trail (Scene 12) ----------
const TRAIL_PTS = [phonePort, routerPort, gwPort, rCore.port, rIxp.port, rEdge.port, P9, waSrv.port, riyaPort];
const trailCurve = new THREE.CatmullRomCurve3(TRAIL_PTS.map((p, i) => p.clone().setY(p.y + (i > 0 && i < TRAIL_PTS.length - 1 ? 1.2 : 0.3))));
const trailGeo = new THREE.TubeGeometry(trailCurve, 400, 0.28, 8, false);
const trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({ color: C.packet, transparent: true, opacity: 0.9 }));
scene.add(trail);
const trailTotal = trailGeo.index.count;
let trailU = 0, trailGoal = 0;
let runner = null;
function setRunner(v) {
  if (!runner) { if (!v) return; runner = makePacket(0xffffff, '"Hi"', 0.3); }
  runner.visible = v; runner.userData.label.visible = v;
}
let runnerU = -1;
const TIMELINE = [
  [C.crypto, 'Lock "Hi" on Henna\'s phone', '2 ms'],
  [C.wifi, 'Wi-Fi to home router', '3 ms'],
  [0xff8a3c, 'NAT + home firewall', '<1 ms'],
  [0x9fb4ff, 'ISP → IXP → Meta edge', '16 ms'],
  [0xffd36b, 'Data center layers + server', '2 ms'],
  [0x25d366, 'Server → Riya\'s phone', '20 ms'],
  [C.crypto, 'Unlock on Riya\'s phone', '2 ms'],
];
const SHIELDS = [
  [C.wifi, 'Wi-Fi WPA2 handshake', 'Scene 1'],
  [C.dhcp, 'DNS query ID / DNSSEC', 'Scene 2'],
  [C.crypto, 'Noise transport lock', 'Scene 3'],
  [C.crypto, 'Signal end-to-end lock', 'Scene 4'],
  [0xff8a3c, 'NAT + stateful firewall', 'Scene 6'],
  [0x9fb4ff, 'BGP backup routes', 'Scene 7'],
  [C.bad, 'Shield · firewall · IDS/IPS', 'Scene 8'],
  [C.ok, 'Phone protection', 'Scene 11'],
  [0xffffff, 'Your own good habits', 'always'],
];
function paintRecap(s) {
  const box = document.getElementById('recapRows'); box.textContent = '';
  const isTime = s.recap === 'time';
  const list = isTime ? TIMELINE : SHIELDS;
  document.getElementById('recapTitle').textContent = isTime ? 'Timeline · both phones online' : 'Security layers on the way';
  list.forEach(([c, label, val], i) => {
    const r = document.createElement('div'); r.className = 'rr ' + (i < s.recapLit ? 'lit' : 'dim');
    const dot = document.createElement('i'); dot.style.setProperty('--c', hex(c));
    const a = document.createElement('span'); a.textContent = label;
    const b = document.createElement('b'); b.textContent = val;
    r.append(dot, a, b); box.appendChild(r);
  });
  document.getElementById('recapFoot').textContent = isTime
    ? (s.recapLit >= list.length ? 'Total ≈ 45 ms · faster than a blink (~300 ms)' : '')
    : (s.recapLit >= list.length ? '9 layers · "Hi" stayed readable only to Henna and Riya' : '');
}
// ---------- People: Henna and Riya holding their phones ----------
const UP = new THREE.Vector3(0, 1, 0);
function limb(parent, a, b, r, mat) {
  const len = a.distanceTo(b);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.9, len, 10), mat);
  m.position.copy(a).lerp(b, 0.5);
  m.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize());
  parent.add(m); return m;
}
function person(o) {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: o.skin, roughness: 0.7 });
  const top = new THREE.MeshStandardMaterial({ color: o.top, roughness: 0.75 });
  const bottom = new THREE.MeshStandardMaterial({ color: o.bottom, roughness: 0.8 });
  const hairM = new THREE.MeshStandardMaterial({ color: 0x1b1210, roughness: 0.6 });
  const shoe = new THREE.MeshStandardMaterial({ color: 0x1a1d2b, roughness: 0.6 });
  // legs and shoes
  [-1, 1].forEach(sd => {
    limb(g, new THREE.Vector3(sd * 0.08, 0.82, 0), new THREE.Vector3(sd * 0.09, 0.07, 0), 0.06, bottom);
    const sh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.2), shoe); sh.position.set(sd * 0.09, 0.035, 0.04); g.add(sh);
  });
  // body: a long kurta or a short top
  const torso = new THREE.Group(); torso.position.y = 0.95; g.add(torso);
  const body = o.kurta
    ? new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.25, 0.84, 18), top)
    : new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.56, 18), top);
  body.position.y = o.kurta ? 0.0 : 0.14; torso.add(body);
  if (o.kurta) {
    const hem = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.015, 6, 36), new THREE.MeshStandardMaterial({ color: o.accent, roughness: 0.5 }));
    hem.rotation.x = Math.PI / 2; hem.position.y = -0.41; torso.add(hem);
  }
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), top);
  shoulders.scale.set(1.15, 0.45, 0.8); shoulders.position.y = 0.4; torso.add(shoulders);
  if (o.scarf) {
    const sc = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 8, 28), new THREE.MeshStandardMaterial({ color: o.accent, roughness: 0.5 }));
    sc.rotation.set(Math.PI / 2 + 0.25, 0, 0); sc.position.set(0, 0.42, 0.01); torso.add(sc);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.42, 0.02), sc.material);
    tail.position.set(0.12, 0.2, -0.13); tail.rotation.z = -0.15; torso.add(tail);
  }
  // neck and head (head tilts down towards the phone)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.08, 10), skin); neck.position.y = 1.4; g.add(neck);
  const head = new THREE.Group(); head.position.y = 1.44; g.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.115, 22, 16), skin); skull.position.y = 0.1; skull.scale.set(0.95, 1.05, 1); head.add(skull);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.124, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), hairM);
  hairCap.position.set(0, 0.11, -0.012); hairCap.rotation.x = -0.25; head.add(hairCap);
  if (o.short) {
    // short hair: the cap alone
  } else if (o.longHair) {
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.36, 0.06), hairM); back.position.set(0, -0.06, -0.09); back.rotation.x = 0.08; head.add(back);
  } else {
    const tie = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), hairM); tie.position.set(0, 0.15, -0.13); head.add(tie);
    const pony = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.24, 10), hairM); pony.position.set(0, 0.02, -0.17); pony.rotation.x = Math.PI + 0.35; head.add(pony);
  }
  const eyeM = new THREE.MeshBasicMaterial({ color: 0x120c0a });
  [-1, 1].forEach(sd => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), eyeM); e.position.set(sd * 0.04, 0.1, 0.106); head.add(e);
  });
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.006, 6, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x5a2a22 }));
  smile.position.set(0, 0.045, 0.108); smile.rotation.z = Math.PI; head.add(smile);
  if (o.bindi) {
    const bd = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), new THREE.MeshBasicMaterial({ color: 0xc0283c })); bd.position.set(0, 0.145, 0.112); head.add(bd);
  }
  head.rotation.x = 0.38;
  // Pose 1 "hold": arms bent forward, hands meeting at the phone
  const hold = new THREE.Group(); g.add(hold);
  const hands = new THREE.Group(); hold.add(hands);
  [-1, 1].forEach(sd => {
    const sh = new THREE.Vector3(sd * 0.2, 1.33, 0), el = new THREE.Vector3(sd * 0.23, 1.08, 0.07), hd = new THREE.Vector3(sd * 0.06, 1.12, 0.25);
    limb(hold, sh, el, 0.045, top); limb(hold, el, hd, 0.04, skin);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), skin); hand.position.copy(hd); hands.add(hand);
  });
  const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 6), skin); hands.add(thumb);
  // Pose 2 "rest": arms down, phone held loosely at the side
  const rest = new THREE.Group(); g.add(rest); rest.visible = false;
  [-1, 1].forEach(sd => {
    const sh = new THREE.Vector3(sd * 0.2, 1.33, 0), el = new THREE.Vector3(sd * 0.24, 1.06, -0.01), hd = new THREE.Vector3(sd * 0.25, 0.82, 0.04);
    limb(rest, sh, el, 0.045, top); limb(rest, el, hd, 0.04, skin);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), skin); hand.position.copy(hd); rest.add(hand);
  });
  // the small phone in her hands
  const ph = new THREE.Group(); ph.position.set(0, 1.15, 0.27); ph.rotation.x = -0.95; g.add(ph);
  ph.add(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.012), new THREE.MeshStandardMaterial({ color: 0x15192b, roughness: 0.4, metalness: 0.5 })));
  const scrM = new THREE.MeshBasicMaterial({ color: 0x4f5a7a });
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.145), scrM); scr.position.z = 0.0065; ph.add(scr);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexLazy(), color: 0x4f5a7a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(0.5, 0.5, 1); glow.position.z = 0.03; ph.add(glow);
  const tag = makeTag(o.name, o.role); tag.obj.position.set(0, 1.95, 0); g.add(tag.obj);
  g.position.copy(o.at); g.rotation.y = o.face;
  (o.parent || scene).add(g);
  function setPose(p) {
    if (p === pose) return; pose = p;
    hold.visible = p === 'hold'; rest.visible = p === 'rest';
    if (p === 'hold') { ph.position.set(0, 1.15, 0.27); ph.rotation.set(-0.95, 0, 0); }
    else { ph.position.set(0.25, 0.8, 0.07); ph.rotation.set(-0.15, 0, 0.1); }
  }
  let pose = 'hold';
  return { g, head, torso, hands, thumb, ph, scrM, glow, tag, smile, setPose, get pose() { return pose; } };
}
const henna = person({ name: 'Henna', role: 'sending "Hi"', at: new THREE.Vector3(-3.75, 0, 2.35), face: -0.35,
  skin: 0x9a6243, top: 0x7a2e4a, bottom: 0x2b2440, accent: 0xd9a441, kurta: true, scarf: true, longHair: true, bindi: true });
const riya = person({ name: 'Riya', role: 'Henna\'s friend', at: new THREE.Vector3(RIYA.x - 1.35, 0, RIYA.z + 1.15), face: -0.8,
  skin: 0xb07a55, top: 0xc9952b, bottom: 0x2b3d6b, accent: 0xffffff, kurta: false, scarf: false, longHair: false, bindi: false, parent: city });
// A faint beam from each small phone to its big "zoomed screen"
function mirrorBeam(pp, target, parent) {
  pp.g.updateMatrixWorld(true);
  const from = pp.ph.getWorldPosition(new THREE.Vector3());
  const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, target]),
    new THREE.LineDashedMaterial({ color: C.wifi, dashSize: 0.08, gapSize: 0.06, transparent: true, opacity: 0.55 }));
  ln.computeLineDistances(); (parent || scene).add(ln); return ln;
}
const hennaBeam = mirrorBeam(henna, phonePort.clone().add(new THREE.Vector3(0, -0.1, 0)));
// Day and night at Riya's home: dark while she is offline, warm light when she comes online
const riyaLamp = new THREE.PointLight(0xffd9a0, 0, 9, 2); riyaLamp.position.copy(RIYA).add(new THREE.Vector3(0, 3.2, 0)); city.add(riyaLamp);
const moon = new THREE.Group(); moon.position.copy(RIYA).add(new THREE.Vector3(2.6, 6.2, -2.4)); city.add(moon);
moon.add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), new THREE.MeshBasicMaterial({ color: 0xe8ecff })));
const moonShade = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 16), new THREE.MeshBasicMaterial({ color: 0x070a17 }));
moonShade.position.set(0.28, 0.12, 0.25); moon.add(moonShade);
const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexLazy(), color: 0xbfd0ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
moonGlow.scale.set(4, 4, 1); moon.add(moonGlow);
const zzz = makeTag('z z z', 'Riya is asleep'); zzz.obj.position.set(-0.8, 1.6, 0); riya.g.add(zzz.obj);
const nightDome = new THREE.Mesh(new THREE.SphereGeometry(4.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0x050816, transparent: true, opacity: 0.55, side: THREE.BackSide, depthWrite: false }));
nightDome.position.copy(RIYA); city.add(nightDome);
const riyaBeam = mirrorBeam(riya, riyaPort.clone().add(new THREE.Vector3(0, -0.1, 0)), city);
function moveStack(to, dur) {
  return new Promise(res => { stackAnim = { from: stack.position.clone(), to: to.clone(), t: 0, dur: dur * (reduce ? 0.6 : 1), res }; });
}

// ---------- Encrypted Wi-Fi link (appears after the handshake) ----------
const linkCurve = new THREE.QuadraticBezierCurve3(phonePort.clone(), new THREE.Vector3(0, 2.3, 0.2), routerPort.clone());
const stripe = (() => {
  const c = document.createElement('canvas'); c.width = 128; c.height = 8;
  const g = c.getContext('2d'); g.fillStyle = 'rgba(161,132,255,0.25)'; g.fillRect(0, 0, 128, 8);
  g.fillStyle = '#c9b8ff'; g.fillRect(0, 0, 40, 8);
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.set(8, 1); return t;
})();
const link = new THREE.Mesh(new THREE.TubeGeometry(linkCurve, 64, 0.035, 8, false),
  new THREE.MeshBasicMaterial({ map: stripe, transparent: true, opacity: 0.9 }));
scene.add(link);
// padlock above the link
const lock = new THREE.Group();
const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.1), new THREE.MeshBasicMaterial({ color: C.crypto }));
const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 24, Math.PI), new THREE.MeshBasicMaterial({ color: 0xc9b8ff }));
shackle.position.y = 0.11; lock.add(lockBody, shackle);
lock.position.copy(linkCurve.getPoint(0.5)).add(new THREE.Vector3(0, 0.35, 0)); scene.add(lock);
const lockTag = makeTag('Encrypted Wi-Fi', 'WPA2 · AES-CCMP');
lockTag.obj.position.set(0, 0.5, 0); lock.add(lockTag.obj);

// ---------- Beacon pulses from the router ----------
const pulses = [];
for (let i = 0; i < 3; i++) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), new THREE.MeshBasicMaterial({ color: C.wifi, wireframe: true, transparent: true, opacity: 0 }));
  m.position.copy(routerPort); scene.add(m); pulses.push({ m, off: i / 3 });
}

// ---------- Packets ----------
const glowTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
})();
function makePacket(color, label, size) {
  const g = new THREE.Group();
  const s = size || 0.24;
  const core = new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.75, s), new THREE.MeshBasicMaterial({ color }));
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(s * 1.25, s * 0.95, s * 1.25)),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(s * 5, s * 5, 1);
  g.add(core, edge, glow);
  if (label) {
    const el = document.createElement('div'); el.className = 'ptag'; el.textContent = label;
    el.style.setProperty('--c', hex(color));
    const lo = new THREE.CSS2DObject(el); g.add(lo); g.userData.label = lo;
  }
  scene.add(g);
  return g;
}
function dropPacket(g) {
  if (g.userData.label) g.userData.label.element.remove();
  scene.remove(g);
}
const flights = [];
function fly(o) {
  return new Promise(res => {
    const g = makePacket(o.color, o.label, o.size);
    const p0 = o.from.clone(), p2 = o.to.clone();
    const p1 = p0.clone().lerp(p2, 0.5); p1.y += (o.h === undefined ? 1.2 : o.h);
    g.position.copy(p0);
    flights.push({ g, p0, p1, p2, t: 0, dur: (o.dur || 1.6) * (reduce ? 0.6 : 1), res, spin: Math.random() * 6, lose: o.lose || 0 });
    sfx.send();
  });
}
function clearFlights() {
  if (runnerU >= 0) { runnerU = -1; setRunner(false); }
  flights.splice(0).forEach(f => { dropPacket(f.g); f.res(false); });
  bursts.splice(0).forEach(b => scene.remove(b.m));
}
const bursts = [];
function burst(pos, color) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, wireframe: true }));
  m.position.copy(pos); scene.add(m); bursts.push({ m, t: 0 });
}
// Ambient keep-alive dots once the phone is online
const keepDots = [0, 1, 2].map(i => {
  const d = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshBasicMaterial({ color: 0xc9b8ff }));
  d.userData.off = i / 3; d.visible = false; scene.add(d); return d;
});
