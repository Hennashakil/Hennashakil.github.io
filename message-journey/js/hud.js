// Message Journey · Sound, HUD, language strings, camera moves and world state.
// Classic scripts share one global scope, so load order matters (see index.html).

// ---------- Sound ----------
const sfx = (() => {
  let ctx = null, on = true;
  try { if (localStorage.getItem('mj-sound') === '0') on = false; } catch (e) {}
  function start() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
  }
  function tone(f, d, type, v, delay, f2) {
    if (!ctx || !on) return;
    const t0 = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v || 0.1, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + d + 0.05);
  }
  return {
    start,
    get on() { return on; },
    set(v) { on = v; try { localStorage.setItem('mj-sound', v ? '1' : '0'); } catch (e) {} },
    send: () => tone(520, 0.12, 'sine', 0.05, 0, 780),
    land: () => tone(990, 0.08, 'triangle', 0.06),
    lock: () => { tone(660, 0.15, 'sine', 0.09); tone(1320, 0.25, 'sine', 0.07, 0.12); },
    bad: () => tone(160, 0.3, 'square', 0.05),
    good: () => { tone(660, 0.12, 'sine', 0.08); tone(990, 0.18, 'sine', 0.08, 0.1); },
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.08, i * 0.11)),
  };
})();

// ---------- HUD ----------
const LAYERS = [
  [7, 'Application'], [6, 'Presentation'], [5, 'Session'], [4, 'Transport'],
  [3, 'Network'], [2, 'Data link'], [1, 'Physical'],
];
const osiEl = document.getElementById('osi');
LAYERS.forEach(([n, name]) => {
  const d = document.createElement('div'); d.className = 'layer'; d.id = 'L' + n;
  d.innerHTML = '<b>L' + n + '</b><span>' + name + '</span>';
  osiEl.appendChild(d);
});
function setLayers(list) { LAYERS.forEach(([n]) => document.getElementById('L' + n).classList.toggle('on', list.includes(n))); }

const trackEl = document.getElementById('track');
const SCENES = ['Getting online', 'DNS', 'TCP handshake', 'End-to-end encryption', 'OSI layers', 'Home router & NAT',
  'Across the internet', 'Data center security', 'Inside the server', 'To Riya\'s phone', 'Antivirus & threats', 'Big picture'];
SCENES.forEach((name, i) => {
  const t = document.createElement('button'); t.type = 'button';
  t.title = 'Scene ' + (i + 1) + ': ' + name; t.setAttribute('aria-label', t.title);
  t.addEventListener('click', () => { const k = BEATS.findIndex(b => b.scene === i + 1); if (k >= 0) go(k); });
  trackEl.appendChild(t);
});

const insp = {
  dot: document.getElementById('iDot'), name: document.getElementById('iName'),
  rows: document.getElementById('iRows'), note: document.getElementById('iNote'),
};
function inspect(p) {
  insp.dot.style.setProperty('--c', hex(p.color));
  insp.name.textContent = p.name;
  insp.rows.textContent = '';
  p.rows.forEach(([k, v]) => {
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v;
    insp.rows.append(dt, dd);
  });
  insp.note.textContent = p.note || '';
}

let xp = 0, sceneStartAt = 0;
const sceneStars = {};
let LANG = 'hi';
try { const l = localStorage.getItem('mj-lang'); if (l === 'en' || l === 'hi') LANG = l; } catch (e) {}
const EN = Object.assign({ beats: {}, quiz: {}, meta: {}, hook: {}, str: {} }, window.MJ_EN || {});
const qT = Q => (LANG === 'en' && EN.quiz[Q.q]) || Q;
const metaT = n => Object.assign({}, SCENE_META[n], (LANG === 'en' && EN.meta[n]) || {});
const UI = {
  hi: { next: 'Next', startQuiz: 'Start quiz', soundOn: 'Sound on', soundOff: 'Sound off', more: 'Aur padho ▾', less: 'Kam dikhao ▴',
    tapMore: 'Tap for packet details ▾', tapLess: 'Tap to hide ▴', start: 'Start journey', startOver: 'Start over', continue: 'Continue',
    kicker: 'Ek 3D networking game',
    welcomeSub: 'Ek WhatsApp "Hi" ke saath chalo, Henna ke phone se Riya ke phone tak: Wi-Fi, DNS, encryption, routers, firewall aur wapas. 12 scenes, challenges aur quiz.',
    right: 'Sahi jawab!', wrong: 'Nahi, sahi jawab highlight hai.', nextQ: 'Next question', seeResult: 'See result', nextScene: 'Next scene',
    again: 'Watch again', explore: 'Explore', restart: 'Start again from Scene 1', tryAgain: 'Achha try! Galat wale sawaalon ke steps ek baar aur dekh lo.',
    nextStop: 'Agla padav: ', total: ' Poore game ka total: ',
    you: 'TUM', chalHead: 'Challenge · tum packet ho', skip: 'Skip (0 XP)', solved: 'Shabaash! ', skipped: 'Skip kiya. Koi baat nahi, quiz mein phir milega.',
    orderHint: 'Sahi order mein dabao', sortHint: 'Har line ke liye chuno', time: 'Time', stars: 'Stars' },
  en: { next: 'Next', startQuiz: 'Start quiz', soundOn: 'Sound on', soundOff: 'Sound off', more: 'Read more ▾', less: 'Show less ▴',
    tapMore: 'Tap for packet details ▾', tapLess: 'Tap to hide ▴', start: 'Start journey', startOver: 'Start over', continue: 'Continue',
    kicker: 'A 3D networking game',
    welcomeSub: 'Follow one WhatsApp "Hi" from Henna\'s phone to Riya\'s: Wi-Fi, DNS, encryption, routers, firewalls and back. 12 scenes, challenges and quizzes.',
    right: 'Correct!', wrong: 'Not quite, the right answer is highlighted.', nextQ: 'Next question', seeResult: 'See result', nextScene: 'Next scene',
    again: 'Watch again', explore: 'Explore', restart: 'Start again from Scene 1', tryAgain: 'Good try! Replay the steps behind the ones you missed.',
    nextStop: 'Next stop: ', total: ' Total for the whole game: ',
    you: 'YOU', chalHead: 'Challenge · you are the packet', skip: 'Skip (0 XP)', solved: 'Well done! ', skipped: 'Skipped. No problem, it comes back in the quiz.',
    orderHint: 'Tap them in the right order', sortHint: 'Choose for each line', time: 'Time', stars: 'Stars' },
};
const ui = k => (UI[LANG] && UI[LANG][k]) || UI.hi[k] || k;
const tr = str => (LANG === 'en' && EN.str && EN.str[str]) || str;
const beatTitle = b => (LANG === 'en' && EN.beats[b.title]) ? EN.beats[b.title][0] : b.title;
const beatText = b => (LANG === 'en' && EN.beats[b.title]) ? EN.beats[b.title][1] : b.text;
const hookFor = sc => (LANG === 'en' && EN.hook[sc]) ? EN.hook[sc] : SCENE_HOOK[sc];
function setLang(l) {
  LANG = l;
  try { localStorage.setItem('mj-lang', l); } catch (e) {}
  document.documentElement.lang = l === 'en' ? 'en' : 'hi-Latn';
  if (typeof cur === 'number' && cur >= 0) {
    const b = BEATS[cur];
    document.getElementById('beatTitle').textContent = beatTitle(b);
    setStoryText(beatText(b));
    document.querySelector('#nextBtn .txt').textContent = b.quiz ? ui('startQuiz') : ui('next');
    syncSound();
    if (b.challenge && typeof go === 'function' && !chalSolved[b.scene]) go(cur);
  }
  syncLangBtn();
  if (!quizEl.hidden && !document.getElementById('qBody').hidden && document.getElementById('qWhy').hidden) showQ();
}
function syncLangBtn() {
  const lb = document.getElementById('langBtn'); if (!lb) return;
  lb.querySelector('.txt').textContent = LANG === 'en' ? 'Hinglish' : 'English';
  lb.querySelector('.ico').textContent = LANG === 'en' ? 'हि' : 'EN';
  lb.title = LANG === 'en' ? 'Hinglish mein padho' : 'Read in English';
}
const xpEl = document.getElementById('xpPill');
function addXp(n) { xp += n; xpEl.textContent = 'XP ' + xp; if (typeof saveProgress === 'function') saveProgress(); }

// ---------- Camera moves ----------
let camGoal = null;
// Tall phone screens see much less sideways than a laptop. Each shot was composed for a wide screen,
// so on a phone we work out what that wide shot would show (the labelled devices in frame) and then
// slide and pull the camera back just enough to keep those same devices on the narrow screen.
function phoneZoom() {
  const a = window.innerWidth / window.innerHeight;
  return 1 + 0.8 * Math.min(1, Math.max(0, (0.8 - a) / 0.4));
}
const _deskCam = new THREE.PerspectiveCamera(48, 1.68, 0.1, 2000);
function shown(o) { for (; o; o = o.parent) if (!o.visible) return false; return true; }
function phoneFrame(pv, tv) {
  const aspect = window.innerWidth / window.innerHeight;
  if (aspect >= 0.8) return;
  scene.updateMatrixWorld();
  _deskCam.position.copy(pv); _deskCam.lookAt(tv); _deskCam.updateMatrixWorld(); _deskCam.updateProjectionMatrix();
  const pts = [tv.clone()], w = new THREE.Vector3();
  ALL_TAGS.forEach(t => {
    if (t.el.classList.contains('compact') || !shown(t.obj)) return;
    t.obj.getWorldPosition(w);
    const n = w.clone().project(_deskCam);
    if (n.z < 1 && Math.abs(n.x) < 0.92 && n.y > -0.5 && n.y < 0.95) pts.push(w.clone());
  });
  const f = tv.clone().sub(pv), dist = f.length(); f.normalize();
  const r = new THREE.Vector3().crossVectors(f, camera.up).normalize();
  const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect * 0.8;
  const xs = [], ds = [];
  pts.forEach(q => { const rel = q.clone().sub(pv); const d = rel.dot(f); if (d > 0.5) { xs.push(rel.dot(r)); ds.push(d); } });
  if (xs.length < 2) return;
  let sft = (Math.min(...xs) + Math.max(...xs)) / 2;
  sft = Math.max(-dist * 0.6, Math.min(dist * 0.6, sft));
  let back = 0;
  xs.forEach((x, i) => { back = Math.max(back, Math.abs(x - sft) / half - ds[i]); });
  back = Math.min(back, dist * 0.9);
  pv.addScaledVector(r, sft).addScaledVector(f, -back);
  tv.addScaledVector(r, sft);
}
function camTo(p, t) {
  const tv = new THREE.Vector3(...t), pv = new THREE.Vector3(...p);
  phoneFrame(pv, tv);
  camGoal = { p: pv, t: tv, k: 0 };
}
controls.addEventListener('start', () => { camGoal = null; });

// ---------- World state ----------
const BASE = { password: false, keyed: false, intruder: false, dhcp: 0, ip: null, connected: false,
  app: false, dns: false, hacker: false, spoofBlocked: false, port: false, tcp: 0, secure: false, fakeClosed: false,
  riyaKeys: false, bundle: false, secret: false, locked: false, held: false, ratchet: 0, sniffed: false, verified: false,
  wrap: -1, arp: false, onAir: false, atRouter: false,
  wan: false, nat: 0, replied: false, fwDrop: false, hardened: false,
  hop: 0, bgp: false, cut: false, reroute: false, traceDone: false, sea: false, scene7: false,
  dc: false, shield: false, fw: false, mon: false, lb: false,
  s9: false, outerOpen: false, authed: false, riyaOffline: false, queued: false, tick1: false, tick2: false,
  pushed: false, riyaOn: false, delivered: false, atRiya: false, decrypted: false, read: false,
  s11: false, quarantined: false, flagged: false, linkBlocked: false, codeSafe: false, habits: false,
  s12: false, trail: 0, recap: '', recapLit: 0,
  cellDemo: false, ipv6: false, photo: false, group: false, groupSent: false };
let ttlAt = 0;
function applyState(s) {
  setVis(hacker, s.hacker); setVis(shield, s.spoofBlocked);
  hackTag.chips(s.fakeClosed ? [['DROPPED', 'bad'], ['NO KEY ✗', 'bad']] : s.spoofBlocked ? [['DROPPED', 'bad']] : []);
  setVis(pipe, s.tcp >= 3); pipeDots.forEach(d => { d.visible = s.tcp >= 3; });
  pipe.material.color.setHex(s.secure ? C.crypto : C.packet);
  pipeDots.forEach(d => d.material.color.setHex(s.secure ? 0xd9ccff : 0xffe2a8));
  waSrv.tag.chips(s.riyaKeys
    ? [['Riya keys ✓', 'ok']].concat(s.held ? [['1 msg · locked', 'key']] : [])
    : s.tcp >= 3
      ? [['ESTABLISHED', 'ok']].concat(s.secure ? [['ENCRYPTED', 'key']] : [])
      : s.app ? [['LISTEN :443', 'ok'], [':5222', 'ok'], [':23 closed', 'dim']] : []);
  riyaTag.chips([].concat(s.riyaKeys ? [['private key 🔑', 'key']] : [], s.verified ? [['verified ✓', 'ok']] : [], s.riyaOffline && !s.riyaOn ? [['offline', 'dim']] : [], s.riyaOn ? [['online', 'ok']] : []));
  const s4Props = s.wrap < 0 && !s.onAir;
  setVis(orbSecret, s.secret && s4Props); setVis(orbHenna, false); setVis(orbRiya, false);
  if (s.secret) orbSecret.position.copy(mixAt);
  setVis(gear, s.ratchet > 0 && s4Props);
  if (s.ratchet > 1) gearClick = Math.max(gearClick, s.ratchet - 1);
  gearTag.sub(s.ratchet > 1 ? 'key #' + s.ratchet + ' · old keys deleted' : 'new key every message');
  hackTag.sub(s.sniffed ? 'sees: 8f2a91c4e7… (gibberish)' : 'Pretends to be WhatsApp DNS');
  setVis(stack, s.wrap >= 0);
  if (s.wrap >= 0) { setWrap(s.wrap, s.atRouter && !s.atRiya); stack.position.copy(s.atRiya ? riyaStation : s.atRouter ? routerPort.clone().add(new THREE.Vector3(0, 1.1, 0.6)) : STATION); }
  wave.visible = wave2.visible = s.onAir;
  natObj.visible = s.nat >= 1 && shownScene === 6;
  if (s.nat >= 1) { if (!natStamp) natStamp = performance.now(); paintNat(s); }
  if (s.dns && !ttlAt) ttlAt = performance.now();
  if (!s.dns) { ttlAt = 0; resolver.tag.chips([]); }
  setVis(link, s.keyed); setVis(lock, s.keyed);
  setVis(intruder, s.intruder);
  intrTag.chips(s.intruder ? [['BLOCKED', 'bad']] : []);
  phoneTag.sub(s.ip || 'No IP yet', s.ip ? 'ip' : '');
  phoneTag.chips([].concat(s.keyed ? [['KEY ✓', 'key']] : [], s.dns && !s.port ? [['DNS cache ✓', 'ok']] : [], s.port && !s.arp ? [['port 51234', 'dim']] : [], s.arp ? [['ARP cache ✓', 'ok']] : []));
  routerTag.chips([].concat(
    s.keyed && !s.wan ? [['KEY ✓', 'key']] : [],
    s.wan ? [['LAN 192.168.1.1', 'dim'], ['WAN 198.51.100.24', 'ok']] : [],
    s.fwDrop ? [['firewall ✓', 'ok']] : []));
  routerTag.sub(s.hardened ? 'firmware ✓ · admin pwd ✓ · WPS off' : '192.168.1.1 · DHCP server');
  ispGw.tag.chips(s.wan ? [['gave 198.51.100.24', 'ok']] : []);
  document.getElementById('trace').hidden = !(s.scene7 && s.hop > 0 && shownScene === 7);
  if (s.scene7) paintTrace(s);
  setVis(cutMark, s.cut);
  L.ixpEdge.material.color.setHex(s.cut ? C.bad : 0x9fb4ff); L.ixpEdge.material.opacity = s.cut ? 0.35 : 0.8;
  [L.coreTr, L.trWa].forEach(l => { l.material.color.setHex(s.reroute ? 0xff8ad8 : 0x6a6f9a); });
  rEdge.tag.chips(s.bgp ? [['announces 157.240.0.0/16', 'ok']] : []);
  rCore.tag.chips(s.hop >= 3 ? [['TTL 61', 'dim']] : []);
  seaGlow.forEach(d => { d.visible = s.sea; });
  setVis(dc, s.dc);
  shieldTag.chips(s.shield ? [['junk filtered', 'ok']] : []);
  fwTag.chips(s.fw ? [['closed port blocked', 'bad']] : []);
  monTag.chips(s.mon ? [['unusual source paused', 'bad']] : []);
  lbTag.chips(s.lb ? [['→ server A', 'ok']] : []);
  paintLoads(s);
  setVis(dirDb.g, s.s9); setVis(queueDb.g, s.s9); setVis(qCube, s.queued);
  busy.forEach(d => { d.visible = s.s9; });
  dirDb.tag.chips(s.riyaOffline ? [['Riya: offline', 'dim']] : []);
  queueDb.tag.chips(s.queued ? [['1 for Riya', 'key'], ['kept max 30 days', 'dim']] : []);
  setVis(unknown, s.s11); setVis(scanRing, s.s11); setVis(guard, s.s11); setVis(qBox, s.quarantined);
  unkTag.chips(s.codeSafe ? [['reported & blocked', 'bad']] : []);
  guardTag.chips([].concat(s.quarantined ? [['known bad ✓', 'ok']] : [], s.flagged ? [['unsafe behaviour ✓', 'ok']] : [], s.linkBlocked ? [['link warning ✓', 'ok']] : []));
  if (typeof cell !== 'undefined') {
    setVis(cell, s.cellDemo && shownScene === 1);
    setVis(aman.g, s.group); setVis(sara.g, s.group);
    mediaSrv.tag.chips(s.photo ? [['1 encrypted photo', 'key']] : []);
    if (s.ipv6) routerTag.chips([['IPv6 2001:db8:1234::/64', 'ok'], ['firewall ✓', 'ok']]);
  }
  trail.visible = s.s12; trailGoal = s.trail; if (!s.s12) { trailU = 0; trailGeo.setDrawRange(0, 0); }
  document.getElementById('recap').hidden = !(s.s12 && s.recap && shownScene === 12);
  if (s.recap) paintRecap(s);
  guardTag.sub(s.habits ? 'updated · 2-step PIN on · store apps only' : 'scans files and links');
  if (s.s11 && s.codeSafe) paintRiya(['Safe ✓', 'code not shared', 'number blocked'], '#4ef0a0');
  else if (s.s11 && s.linkBlocked) paintRiya(['Warning', 'unsafe link blocked', ''], '#ff5470');
  else if (s.s11 && s.flagged) paintRiya(['Warning', 'app asks for too much', ''], '#ffb547');
  else if (s.s11 && s.quarantined) paintRiya(['Blocked', 'harmful file removed', ''], '#ff5470');
  else if (s.decrypted) paintRiya(['Henna', s.read ? 'Hi  (read)' : 'Hi', '1 new message'], '#25d366');
  else if (s.riyaOffline && !s.riyaOn) paintRiya(['Offline', 'screen off · no internet'], '#4f5a7a');
  else if (s.pushed && !s.riyaOn) paintRiya(['WhatsApp', 'waking up...'], '#ffd36b');
  else paintRiya(['WhatsApp', s.delivered ? 'new message 🔒' : 'Online'], '#25d366');
  setVis(orbSecretR, s.decrypted && !s.s11);
  pushRings.forEach(r => { r.visible = s.pushed && !s.riyaOn; });
  pushSrv.tag.chips(s.pushed ? [['sent wake-up · no message text', 'ok']] : []);
  if (s.delivered) queueDb.tag.chips([['empty · deleted after delivery', 'ok']]);
  if (s.delivered) setVis(qCube, false);
  keepDots.forEach(d => { d.visible = s.connected; });
  paintPhone(s);
}
const live = Object.assign({}, BASE);
function patch(obj) { Object.assign(live, obj); applyState(live); }
