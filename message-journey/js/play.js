// Message Journey · Challenges, beat runner, quizzes, render loop, saved progress and welcome screen.
// Classic scripts share one global scope, so load order matters (see index.html).

// ---------- Packet challenges: the player is the packet ----------
function insertBeforeTitle(title, beats) {
  const k = BEATS.findIndex(b => b.title === title);
  BEATS.splice(k, 0, ...beats);
}
const chalEl = document.getElementById('chal'), chalOpts = document.getElementById('chalOpts'), chalMsg = document.getElementById('chalMsg');
const chalMistakes = {}, chalSolved = {};
let avatar = null, avatarAt = new THREE.Vector3(), chalCancel = null;
function showAvatar(pos) {
  if (!avatar) avatar = makePacket(C.packet, ui('you'), 0.32);
  avatar.userData.label.element.textContent = ui('you');
  avatar.visible = true; avatar.userData.label.visible = true;
  avatar.position.copy(pos); avatarAt = pos.clone();
}
function hideAvatar() { if (avatar) { avatar.visible = false; avatar.userData.label.visible = false; } }
function hopTime(a, b) { return Math.min(2.2, 0.7 + a.distanceTo(b) * 0.04); }
let chalMoveTok = 0;
async function moveAvatar(ok, to, color) {
  chalMoveTok++;
  hideAvatar();
  const from = avatarAt.clone();
  const r = await fly({ from, to, color, label: ui('you'), h: Math.max(1, from.distanceTo(to) * 0.2), dur: hopTime(from, to) });
  if (!ok()) return false;
  showAvatar(to); return r;
}
async function bounce(ok, to) {
  // A newer tap cancels this bounce, so the player never has to wait for it to finish
  const t = ++chalMoveTok, live = () => ok() && t === chalMoveTok;
  hideAvatar();
  const from = avatarAt.clone();
  await fly({ from, to, color: C.bad, label: '✗', h: Math.max(1, from.distanceTo(to) * 0.2), dur: hopTime(from, to) }); if (!live()) return;
  burst(to, C.bad);
  await fly({ from: to, to: from, color: C.packet, label: ui('you'), h: 0.6, dur: hopTime(from, to) * 0.7 }); if (!live()) return;
  showAvatar(from);
}
function shuffled(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function endChallengeUi() { chalEl.hidden = true; hideAvatar(); if (chalCancel) { chalCancel(); chalCancel = null; } }
function runChallenge(b, ok) {
  const c = b.challenge, sc = b.scene;
  chalMistakes[sc] = chalMistakes[sc] || 0;
  return new Promise(resolve => {
    chalCancel = () => resolve('cancel');
    chalEl.hidden = false; chalOpts.textContent = ''; chalMsg.textContent = ''; chalMsg.className = 'cmsg';
    document.getElementById('chalHead').textContent = ui('chalHead') + (c.type === 'order' ? ' · ' + ui('orderHint') : c.type === 'sort' ? ' · ' + ui('sortHint') : '');
    if (c.setup) c.setup();
    showAvatar(c.start);
    inspect({ name: 'Packet challenge', color: C.packet,
      rows: [['You are', 'the packet (orange "' + ui('you') + '")'], ['Type', c.type === 'pick' ? 'pick one' : c.type === 'order' ? 'right order' : 'sort each line'],
        ['First try', '+20 XP and a star'], ['After a slip', '+10 XP']],
      note: 'Wrong choices bounce back and tell you why. You can also skip.' });
    let busy = false, done = false, step = 0, slips = 0;
    const finish = skipped => {
      if (done) return; done = true;
      if (skipped) { chalMistakes[sc] += 1; chalSolved[sc] = false; chalMsg.className = 'cmsg'; chalMsg.textContent = ui('skipped'); }
      else {
        const gain = slips ? 10 : 20; addXp(gain); chalSolved[sc] = true; sfx.win();
        chalMsg.className = 'cmsg good'; chalMsg.innerHTML = '<b>★</b>' + ui('solved') + '+' + gain + ' XP';
      }
      [...chalOpts.querySelectorAll('button')].forEach(x => { x.disabled = true; });
      document.getElementById('nextBtn').disabled = false;
      chalCancel = null; resolve('done');
    };
    const wrong = why => { slips++; chalMistakes[sc] += 1; sfx.bad(); chalMsg.className = 'cmsg bad'; chalMsg.innerHTML = '<b>✗</b>'; chalMsg.appendChild(document.createTextNode(tr(why))); };
    const right = why => { sfx.good(); chalMsg.className = 'cmsg good'; chalMsg.innerHTML = '<b>✓</b>'; chalMsg.appendChild(document.createTextNode(tr(why || ''))); };
    if (c.type === 'pick' || c.type === 'order') {
      const opts = c.options.map((o, idx) => Object.assign({ idx }, o));
      (c.keepOrder ? opts : shuffled(opts)).forEach(o => {
        const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'copt'; btn.textContent = tr(o.label);
        btn.addEventListener('click', async () => {
          if (busy || done || !ok()) return;
          busy = true;
          const isRight = c.type === 'pick' ? !!o.ok : c.seq[step] === o.idx;
          if (isRight) {
            btn.classList.add('right'); btn.disabled = true;
            if (c.type === 'pick') [...chalOpts.children].forEach(x => { x.disabled = true; });
            if (o.at) { await moveAvatar(ok, o.at, C.ok); if (!ok()) return; } else burst(avatarAt, C.ok);
            if (o.onOk) o.onOk();
            right(o.good || o.why);
            if (c.type === 'pick') finish(false); else { step++; if (step >= c.seq.length) finish(false); }
          } else {
            btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 1400);
            wrong(o.why);
            busy = false;
            if (o.at) bounce(ok, o.at);
            return;
          }
          busy = false;
        });
        chalOpts.appendChild(btn);
      });
    } else if (c.type === 'sort') {
      let left = c.items.length;
      c.items.forEach(it => {
        const row = document.createElement('div'); row.className = 'srow';
        const lab = document.createElement('span'); lab.textContent = tr(it.label); row.appendChild(lab);
        ['a', 'b'].forEach(k => {
          const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'copt'; btn.textContent = tr(c[k]);
          btn.addEventListener('click', () => {
            if (done || row.classList.contains('done')) return;
            if (it.answer === k) {
              btn.classList.add('right'); row.classList.add('done');
              [...row.querySelectorAll('button')].forEach(x => { x.disabled = true; });
              right(it.why); if (it.fx) it.fx(k);
              if (--left === 0) finish(false);
            } else {
              btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 1400);
              wrong(it.why);
            }
          });
          row.appendChild(btn);
        });
        chalOpts.appendChild(row);
      });
    }
    document.getElementById('chalSkip').textContent = ui('skip');
    document.getElementById('chalSkip').onclick = () => finish(true);
  });
}
function chal(title, text, cam, layers, challenge, post) {
  return { title, text, cam, layers, challenge, async play(ok) { await runChallenge(this, ok); }, post: post || (() => {}) };
}
const lay = n => OSI.find(x => x.n === n);
insertBeforeQuiz(1, [chal('Challenge 🎮: Tum ho DHCP Discover',
  'Ab <b>tum packet ho</b>! Henna ke phone ko IP address chahiye. Kis device ke paas jaoge jo <b>IP de sakta hai</b>? Neeche chuno, ya galti karke dekho kya hota hai.',
  CAM.over, [7, 4, 3, 2], { type: 'pick', start: phonePort, options: [
    { label: 'Wi-Fi router', at: routerPort, ok: true, why: 'Router hi ghar ka DHCP server hai. Wahi IP, gateway aur DNS deta hai.' },
    { label: 'Smart TV', at: tvPort, why: 'TV khud ek client hai: woh IP leta hai, deta nahi.' },
    { label: 'Family laptop', at: lapPort, why: 'Laptop bhi client hai, DHCP server nahi.' },
    { label: 'Unknown device', at: intrPort, why: 'Yeh ghar ke bahar hai aur Wi-Fi ka hissa hi nahi. Isse baat nahi karni.' },
  ] })]);
insertBeforeQuiz(2, [chal('Challenge 🎮: DNS ka raasta',
  'Tum ho resolver ka sawaal <b>"g.whatsapp.net?"</b>. Servers ko <b>sahi order</b> mein ghoomo, bilkul waise jaise resolver ghoomta hai.',
  CAM.city, [7, 4, 3], { type: 'order', start: resolver.port, seq: [0, 1, 2], options: [
    { label: 'Root server ( . )', at: rootSrv.port, why: 'Root se hi shuru hota hai. Woh batata hai .net kaun sambhalta hai.', good: 'Root ne kaha: .net walon se poocho.' },
    { label: '.net TLD server', at: tldSrv.port, why: '.net TLD ka pata pehle root batata hai.', good: '.net ne bataya: a.ns.whatsapp.net se poocho.' },
    { label: 'whatsapp.net DNS', at: authSrv.port, why: 'whatsapp.net ka server kaunsa hai, yeh pehle .net TLD batata hai.', good: 'Asli jawab mila: 157.240.16.60' },
    { label: 'Riya\'s phone', at: riyaPort, why: 'Riya ka phone DNS server nahi hai.' },
  ] })]);
insertBeforeQuiz(3, [chal('Challenge 🎮: Kis darwaze pe dastak?',
  'Tum ho <b>SYN</b> packet. WhatsApp server ke kaunse <b>port</b> (flat number) pe jaoge?',
  CAM.s3wide, [4], { type: 'pick', start: phonePort, options: [
    { label: 'Port 443', at: waSrv.port, ok: true, why: 'Haan! WhatsApp server 443 pe sun raha hai.' },
    { label: 'Port 53', at: waSrv.port, why: 'Port 53 DNS ka hai, chat ka nahi.' },
    { label: 'Port 23', at: waSrv.port, why: 'Port 23 Telnet hai: purana, asurakshit, aur band rehta hai.' },
    { label: 'Port 67', at: waSrv.port, why: 'Port 67 DHCP server ka hai.' },
  ] })]);
insertBeforeQuiz(4, [chal('Challenge 🎮: Kaunsa taala?',
  'Tum ho <b>"Hi"</b>. Aisa taala chuno ki raaste mein <b>koi bhi</b>, WhatsApp server bhi, tumhe na padh sake. Sirf Riya.',
  CAM.s4henna, [6], { type: 'pick', start: phonePort.clone().add(new THREE.Vector3(0, 0.6, 0)), options: [
    { label: 'Riya ki public key se bana shared secret', ok: true, why: 'Bilkul! Ise sirf Riya ki private key khol sakti hai.' },
    { label: 'Henna ka Wi-Fi password', why: 'Wi-Fi ka taala sirf router tak hai. Router ke baad khul jaata hai.' },
    { label: 'WhatsApp server ki key', why: 'Tab server tumhe khol ke padh sakta tha.' },
    { label: 'Koi taala nahi', why: 'Raaste mein koi bhi tumhe padh leta.' },
  ] })]);
insertBeforeQuiz(5, [chal('Challenge 🎮: Lifafe pehno',
  'Tum ho "Hi", phone ke andar. Neeche jaate hue lifafe <b>sahi order</b> mein pehno: sabse upar wali layer pehle, sabse neeche wali aakhir mein.',
  CAM.s5stack, [7, 6, 5, 4, 3, 2, 1], { type: 'order', start: STATION, seq: [0, 1, 2, 3, 4, 5, 6],
    setup() { live.wrap = 0; live.atRouter = false; live.atRiya = false; applyState(live); },
    options: [7, 6, 5, 4, 3, 2, 1].map((n, k) => ({
      label: 'L' + n + ' · ' + lay(n).name,
      why: 'Upar se neeche jao: L7 pehle, L1 aakhir mein.',
      good: 'L' + n + ' ka lifafa chadh gaya.',
      onOk() { live.wrap = Math.min(6, k + 1); applyState(live); burst(STATION, lay(n).c); },
    })) }, s => { s.wrap = 6; s.atRouter = true; })]);
insertBeforeQuiz(6, [chal('Challenge 🎮: Tum ho router, NAT karo',
  'Henna ka packet bahar ja raha hai. Tum ho <b>router</b>. Packet ke <b>source</b> mein ab kya likhoge?',
  CAM.s6router, [3, 4], { type: 'pick', start: routerPort, options: [
    { label: '198.51.100.24 : 40001', at: gwPort, ok: true, why: 'Sahi! Ghar ka public IP aur ek naya port. NAT table mein likh lo.' },
    { label: '192.168.1.5 : 51234', at: gwPort, why: 'Yeh private address hai. Bahar ke routers ise aage nahi bhejte.' },
    { label: '157.240.16.60 : 443', at: gwPort, why: 'Yeh destination hai, source nahi.' },
    { label: '255.255.255.255', at: gwPort, why: 'Yeh broadcast address hai, sirf ghar ke andar ke liye.' },
  ] })]);
insertBeforeQuiz(7, [chal('Challenge 🎮: Kata cable, naya raasta',
  'IXP aur Meta edge ke beech ka <b>cable kata</b> hai. Tum ho packet, ISP gateway pe khade. WhatsApp tak <b>chalne wala raasta</b> hop-by-hop chuno.',
  CAM.s7cut, [3], { type: 'order', start: gwPort, seq: [0, 3, 4], options: [
    { label: 'ISP core router', at: rCore.port, why: 'Pehla hop ISP core hi hai.', good: 'ISP core pe pahunche. TTL 61.' },
    { label: 'Internet exchange (IXP)', at: rIxp.port, why: 'IXP se aage Meta edge ka cable kata hai. Wahan se raasta band.' },
    { label: 'Meta edge router', at: rEdge.port, why: 'Meta edge tak pahunchne wala cable kata hua hai.' },
    { label: 'Transit provider', at: rTransit.port, why: 'Transit tak ISP core ke through hi jaate hain.', good: 'Backup raasta! TTL 60.' },
    { label: 'WhatsApp server', at: waSrv.port, why: 'Seedha nahi kood sakte. Pehle routers se guzarna hoga.', good: 'Pahunch gaye! TTL 59.' },
  ] })]);
insertBeforeQuiz(8, [chal('Challenge 🎮: Tum ho firewall',
  'Har packet ko <b>Allow</b> ya <b>Block</b> karo. Rule yaad hai? <b>TCP 443 aur 5222 allow</b>, baaki sab block.',
  CAM.s8gate, [4, 3], { type: 'sort', start: P7, a: 'Allow', b: 'Block', items: [
    { label: 'Henna → TCP 443', answer: 'a', why: 'Port 443 WhatsApp ke liye allowed hai.', fx() { fly({ from: rEdge.port, to: P5, color: C.ok, label: ':443 ✓', h: 1, dur: 1 }); } },
    { label: 'Unknown → TCP 23 (Telnet)', answer: 'b', why: 'Port 23 allow list mein nahi hai.', fx() { burst(P7, C.bad); } },
    { label: 'Riya → TCP 5222', answer: 'a', why: 'Port 5222 bhi WhatsApp ke liye allowed hai.', fx() { fly({ from: rEdge.port, to: P5, color: C.ok, label: ':5222 ✓', h: 1, dur: 1 }); } },
    { label: 'Unknown → UDP 1900', answer: 'b', why: 'UDP 1900 allow list mein nahi hai.', fx() { burst(P7, C.bad); } },
  ] })]);
insertBeforeTitle('Queue mein sambhal ke rakha', [Object.assign(chal('Challenge 🎮: Tum ho server',
  'Riya <b>offline</b> hai, aur Henna ka locked "Hi" aa gaya. Tum ho WhatsApp server. Kya karoge?',
  CAM.s9db, [7], { type: 'pick', start: waSrv.port, options: [
    { label: 'Queue mein locked rakho, Henna ko ✓ bhejo', at: queueDb.port.clone().setY(2), ok: true, why: 'Sahi! Riya online aate hi deliver hoga.' },
    { label: 'Khol ke padho aur SMS kar do', why: 'Server andar ka taala khol hi nahi sakta. Aur karna bhi nahi chahiye.' },
    { label: 'Delete kar do', why: 'Message kho jaata, Riya ko kabhi nahi milta.' },
    { label: 'Henna ko error bhejo', why: 'Offline hona error nahi hai. Server intezaar karta hai.' },
  ] }), { scene: 9 })]);
insertBeforeTitle('Soye phone ko jagao: push notification', [Object.assign(chal('Challenge 🎮: Riya ko jagao',
  'Riya ka phone so raha hai. Tum ho server ka <b>"jagao"</b> signal. Kiske through jaoge?',
  CAM.s10push, [7], { type: 'pick', start: waSrv.port, options: [
    { label: 'Push service (FCM)', at: pushSrv.port, ok: true, why: 'Haan! Phone push service se hamesha ek halki si connection rakhta hai.' },
    { label: 'ISP DNS resolver', at: resolver.port, why: 'DNS sirf naam ko IP mein badalta hai, phone nahi jagaata.' },
    { label: 'Root server ( . )', at: rootSrv.port, why: 'Root server sirf TLD ka pata batata hai.' },
    { label: 'Henna ka router', at: routerPort, why: 'Henna ka router Riya ke phone se juda hi nahi hai.' },
  ] }), { scene: 10 })]);
insertBeforeQuiz(11, [chal('Challenge 🎮: Safe ya khatra?',
  'Tum ho Riya ki <b>phone protection</b>. Har cheez ko <b>Safe</b> ya <b>Khatra</b> chuno.',
  CAM.s11riya, [7], { type: 'sort', start: riyaPort, a: 'Safe', b: 'Khatra', items: [
    { label: 'Henna ki photo (contact)', answer: 'a', why: 'Jaani-pehchaani contact ki photo, aur scan bhi saaf.' },
    { label: 'Prize_Winner.apk (anjaan number)', answer: 'b', why: 'Anjaan number se app file, aur fingerprint buri list mein.' },
    { label: 'Link: whatsapp-gold-update.example', answer: 'b', why: 'Yeh asli WhatsApp domain nahi hai. "WhatsApp Gold" hota hi nahi.' },
    { label: '"Apna 6 digit code bhejo"', answer: 'b', why: 'Code se koi bhi account le sakta hai. Kabhi share mat karo.' },
    { label: 'Mummy ka voice note', answer: 'a', why: 'Jaani-pehchaani contact ka normal message.' },
  ] })]);

// Each label is shown in full only in the scenes where it matters; elsewhere it shrinks to a faint name
const TAG_SCENES = [
  [phoneTag, [1, 2, 3, 4, 5, 6, 9, 10]], [routerTag, [1, 5, 6]], [lapTag, [1, 5, 6]], [tvTag, [1, 5]],
  [intrTag, [1]], [homeTag, [1, 6]], [lockTag, [1, 5]],
  [resolver.tag, [2]], [rootSrv.tag, [2]], [tldSrv.tag, [2]], [authSrv.tag, [2]],
  [hackTag, [2, 3, 4, 6, 8]], [waSrv.tag, [3, 4, 8, 9, 10]],
  [riyaTag, [4, 10, 11]], [riyaHomeTag, [4, 10, 11]], [secretTag, [4]], [gearTag, [4]],
  [coreTag, [5, 10]], [ispGw.tag, [6, 7]],
  [rCore.tag, [7]], [rIxp.tag, [7]], [rEdge.tag, [7]], [rTransit.tag, [7]], [cutTag, [7]], [seaTag, [7]], [landing.tag, [7]], [farTag, [7]],
  [shieldTag, [8]], [fwTag, [8]], [monTag, [8]], [lbTag, [8]], [srvB.tag, [8, 9]], [srvC.tag, [8, 9]],
  [dirDb.tag, [9]], [queueDb.tag, [9]], [qCubeTag, [9]],
  [pushSrv.tag, [10]], [secretTagR, [10]],
  [unkTag, [11]], [guardTag, [11]], [qTag, [11]],
  [henna.tag, [1, 2, 3, 4, 5, 6, 9, 10]], [riya.tag, [4, 10, 11]],
  [cellTag, [1]], [mediaSrv.tag, [9]], [aman.tag, [10]], [sara.tag, [10]],
];
TAG_SCENES.forEach(([t, list]) => { t.scenes = list; });
function focusTags(sc) {
  ALL_TAGS.forEach(t => { if (t.scenes) t.el.classList.toggle('compact', !t.scenes.includes(sc)); });
}

// ---------- Beat runner ----------
let cur = -1, token = 0, autoplay = false, shownScene = 0;
const seen = new Set(), sceneDone = new Set();
const stepsEl = document.getElementById('steps');
function buildSteps(sc) {
  stepsEl.textContent = '';
  BEATS.forEach((b, i) => {
    if (b.scene !== sc) return;
    const d = document.createElement('button'); d.type = 'button'; d.dataset.i = i;
    d.setAttribute('aria-label', 'Step: ' + b.title);
    d.addEventListener('click', () => go(i)); stepsEl.appendChild(d);
  });
}
function syncTrack(sc) {
  [...trackEl.children].forEach((t, k) => {
    const n = k + 1, built = !!SCENE_META[n];
    t.disabled = !built;
    t.className = (built ? 'ready' : '') + (n === sc ? ' on' : '') + (sceneDone.has(n) ? ' done' : '');
  });
}
function stateBefore(i) {
  const s = Object.assign({}, BASE);
  for (let k = 0; k < i; k++) BEATS[k].post(s);
  return s;
}
const SCENE_HOOK = {
  1: 'Phone internet se kaise judta hai', 2: 'Naam se address tak', 3: 'Server se pehla haath milana',
  4: 'Aisa taala jo sirf Riya khole', 5: '"Hi" pe 7 lifafe', 6: 'Ghar ka darwaza: router aur NAT',
  7: 'Router-router, samundar ke paar', 8: 'WhatsApp ke darwaze pe suraksha', 9: 'Server ke andar',
  10: 'Riya ke phone tak', 11: 'Phone pe aakhri suraksha', 12: 'Poora safar ek nazar mein',
};
const sceneCardEl = document.getElementById('sceneCard');
let cardTimer = 0;
function showSceneCard(sc) {
  document.getElementById('scN').textContent = 'Scene ' + sc + ' of 12';
  document.getElementById('scT').textContent = SCENE_META[sc].name;
  document.getElementById('scH').textContent = hookFor(sc);
  sceneCardEl.classList.add('show');
  clearTimeout(cardTimer);
  cardTimer = setTimeout(() => sceneCardEl.classList.remove('show'), reduce ? 900 : 1500);
}
function enterScene(sc) {
  shownScene = sc;
  const m = SCENE_META[sc];
  scene.fog.near = m.fog[0]; scene.fog.far = m.fog[1];
  setVis(city, sc >= 2);
  controls.maxDistance = (sc >= 12 ? 170 : sc >= 7 ? 140 : sc >= 4 ? 95 : sc >= 3 ? 75 : sc >= 2 ? 48 : 24) * phoneZoom();
  document.getElementById('sceneName').textContent = 'Scene ' + sc + ' of 12 · ' + m.name;
  document.body.classList.toggle('mapmode', sc === 12);
  focusTags(sc);
  buildSteps(sc);
}
async function go(i) {
  i = Math.max(0, Math.min(BEATS.length - 1, i));
  const tok = ++token; cur = i;
  const ok = () => tok === token;
  const b = BEATS[i];
  clearFlights();
  endChallengeUi();
  document.getElementById('nextBtn').disabled = !!b.challenge;
  if (b.scene !== shownScene) {
    const first = shownScene === 0;
    enterScene(b.scene);
    sceneStartAt = performance.now();
    if (!first) {
      showSceneCard(b.scene);
      if (!reduce) {
        const tgt = new THREE.Vector3(...b.cam[1]);
        camera.position.copy(tgt).add(new THREE.Vector3(-6, 34, 38));
        controls.target.copy(tgt);
      }
    }
  }
  Object.assign(live, stateBefore(i)); applyState(live);
  syncTrack(b.scene);
  document.getElementById('beatTitle').textContent = beatTitle(b);
  setStoryText(beatText(b));
  saveProgress();
  setLayers(b.layers);
  camTo(b.cam[0], b.cam[1]);
  [...stepsEl.children].forEach(d => { const k = +d.dataset.i; d.className = k === i ? 'on' : seen.has(k) ? 'seen' : ''; });
  document.getElementById('backBtn').disabled = i === 0;
  document.querySelector('#nextBtn .txt').textContent = b.quiz ? ui('startQuiz') : ui('next');
  measureStory();
  await b.play(ok);
  if (!ok()) return;
  b.post(live); applyState(live); seen.add(i);
  if (autoplay && !b.quiz) {
    await wait(b.challenge ? 1800 : 2600);
    if (ok() && autoplay) go(i + 1);
  }
}
document.getElementById('nextBtn').addEventListener('click', () => {
  sfx.start();
  if (BEATS[cur].quiz) openQuiz(BEATS[cur].scene); else go(cur + 1);
});
document.getElementById('backBtn').addEventListener('click', () => { sfx.start(); go(cur - 1); });
document.getElementById('replayBtn').addEventListener('click', () => { sfx.start(); go(cur); });
const autoBtn = document.getElementById('autoBtn');
autoBtn.addEventListener('click', () => {
  sfx.start(); autoplay = !autoplay; autoBtn.setAttribute('aria-pressed', String(autoplay));
  if (autoplay && seen.has(cur) && !BEATS[cur].quiz) go(cur + 1);
});
const soundBtn = document.getElementById('soundBtn');
function syncSound() {
  soundBtn.querySelector('.txt').textContent = sfx.on ? ui('soundOn') : ui('soundOff');
  soundBtn.querySelector('.ico').textContent = sfx.on ? '♪' : '✕';
  soundBtn.setAttribute('aria-pressed', String(sfx.on));
}
document.getElementById('langBtn').addEventListener('click', () => setLang(LANG === 'en' ? 'hi' : 'en'));
syncLangBtn();
document.getElementById('viewBtn').addEventListener('click', () => { const b = BEATS[cur]; camTo(b.cam[0], b.cam[1]); });
soundBtn.addEventListener('click', () => { sfx.start(); sfx.set(!sfx.on); syncSound(); });
syncSound();
window.addEventListener('keydown', e => {
  if (!document.getElementById('quiz').hidden || !document.getElementById('welcome').hidden) return;
  if (e.target && e.target.closest && e.target.closest('button, a, input')) { if (e.key === ' ') return; }
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); document.getElementById('nextBtn').click(); }
  if (e.key === 'ArrowLeft') document.getElementById('backBtn').click();
  if (e.key === 'r' || e.key === 'R') document.getElementById('replayBtn').click();
});

// ---------- Quizzes ----------
const QUIZZES = {
  1: [
    { q: 'Wi-Fi password router tak kaise pahunchta hai?',
      o: ['Plain text mein bheja jaata hai', 'Encrypt karke bheja jaata hai', 'Bheja hi nahi jaata, dono taraf se key banti hai', 'QR code ke through'], a: 2,
      why: 'Password kabhi bheja nahi jaata. Dono taraf password + ANonce + SNonce se ek hi key banti hai, aur MIC prove karta hai ki password sahi hai.' },
    { q: 'Phone ko 192.168.1.5 address kisne diya?',
      o: ['DNS server ne', 'Router ke DHCP server ne', 'WhatsApp server ne', 'Mobile tower ne'], a: 1,
      why: 'Ghar ka router hi DHCP server bhi hai. Wahi IP, mask, gateway aur DNS deta hai.' },
    { q: 'DHCP Discover ka destination IP kya hota hai?',
      o: ['192.168.1.1', '0.0.0.0', '255.255.255.255', '8.8.8.8'], a: 2,
      why: '255.255.255.255 ka matlab hai "sabko". Phone ko abhi DHCP server ka address pata hi nahi, isliye sabse poochta hai. 0.0.0.0 phone ka apna address hai jab tak IP na mile.' },
    { q: 'DHCP ka sahi order kya hai?',
      o: ['Discover → Offer → Request → Acknowledge', 'Request → Offer → Discover → Acknowledge', 'Discover → Request → Offer → Acknowledge', 'Offer → Discover → Acknowledge → Request'], a: 0,
      why: 'DORA: Discover, Offer, Request, Acknowledge.' },
  ],
  2: [
    { q: 'DNS ka main kaam kya hai?',
      o: ['Message encrypt karna', 'Domain naam ko IP address mein badalna', 'Phone ko IP address dena', 'Virus scan karna'], a: 1,
      why: 'DNS internet ki phonebook hai: g.whatsapp.net → 157.240.16.60. Phone ko IP dena DHCP ka kaam tha (Scene 1).' },
    { q: 'Normal DNS query kaunse port pe jaati hai?',
      o: ['80', '443', '53', '67'], a: 2,
      why: 'DNS port 53 use karta hai, zyada tar UDP pe. 443 HTTPS ka hai (DNS over HTTPS bhi yahi use karta hai), 67 DHCP ka.' },
    { q: 'Root server ne resolver ko kya bataya?',
      o: ['WhatsApp ka IP address', '.net TLD server ka pata (referral)', 'Henna ka Wi-Fi password', 'Kuch nahi, request block kar di'], a: 1,
      why: 'Root sirf yeh jaanta hai ki har TLD (.com, .net, .in) kaun sambhalta hai. Isliye woh .net servers ki taraf bhej deta hai.' },
    { q: 'g.whatsapp.net ka pakka jawab kisne diya?',
      o: ['Root server', '.net TLD server', 'whatsapp.net ka authoritative server', 'Ghar ka router'], a: 2,
      why: 'Authoritative server domain ke maalik (WhatsApp) ka apna DNS server hai. Asli record wahin rehta hai.' },
    { q: 'Nakli DNS jawab kaise pakda gaya?',
      o: ['Uska Query ID sawaal se match nahi hua', 'Woh bahut tez aaya', 'Usmein virus tha', 'Router ne awaaz di'], a: 0,
      why: 'Resolver har sawaal mein random ID aur port lagata hai. Jawab ka ID match na kare toh drop. DNSSEC signature aur DNS over HTTPS aur zyada suraksha dete hain.' },
  ],
};
QUIZZES[3] = [
  { q: 'TCP 3-way handshake ka sahi order kya hai?',
    o: ['ACK → SYN → SYN-ACK', 'SYN → SYN-ACK → ACK', 'SYN → ACK → FIN', 'HELLO → OK → BYE'], a: 1,
    why: 'Phone SYN bhejta hai, server SYN-ACK, phir phone ACK. Teen packets, isliye "3-way".' },
  { q: 'Phone ne WhatsApp server ke kaunse port pe connect kiya?',
    o: ['53', '67', '443', '51234'], a: 2,
    why: 'Server port 443 pe sun raha tha. 51234 phone ka apna random port tha, 53 DNS ka aur 67 DHCP ka.' },
  { q: 'SYN-ACK mein Ack number 2,904,118 kyon tha?',
    o: ['Server ka random number', 'Phone ke Seq (2,904,117) + 1', 'Port number ka double', 'Time stamp'], a: 1,
    why: 'Ack = "maine yahan tak paa liya, ab agla yeh bhejo". Isliye phone ka number + 1.' },
  { q: 'Packet raaste mein kho jaaye toh TCP kya karta hai?',
    o: ['Kuch nahi, message adhura reh jaata hai', 'ACK na aane pe wahi packet dobara bhejta hai', 'Naya connection banata hai', 'Router ko block kar deta hai'], a: 1,
    why: 'Har segment ke saath timer chalta hai. ACK time pe na aaye toh same sequence number ke saath retransmit.' },
  { q: 'Fake server ko phone ne kaise pakda?',
    o: ['TCP handshake fail ho gaya', 'Uska IP chhota tha', 'Woh WhatsApp ki private key ka proof nahi de saka', 'Router ne bataya'], a: 2,
    why: 'TCP handshake toh fake server ke saath bhi ho jaata hai. Pehchaan Noise/TLS handshake ke key proof se hoti hai.' },
];
QUIZZES[4] = [
  { q: 'End-to-end encryption mein "Hi" kaun padh sakta hai?',
    o: ['WhatsApp server', 'Henna aur Riya ke phone', 'Internet provider', 'Koi bhi jo packet pakad le'], a: 1,
    why: 'Andar wala taala sirf Riya ki private key se khulta hai. Beech mein koi bhi, server bhi, sirf kachra dekhta hai.' },
  { q: 'Riya ki private key kahan rehti hai?',
    o: ['WhatsApp server pe', 'Henna ke phone mein', 'Sirf Riya ke phone mein', 'Google Drive backup mein'], a: 2,
    why: 'Private key phone pe banti hai aur kabhi upload nahi hoti. Server pe sirf public keys (khule taale) jaati hain.' },
  { q: '"Do taale" kaun se hain?',
    o: ['Wi-Fi password aur PIN', 'Andar: end-to-end (Henna ↔ Riya), bahar: transport (phone ↔ server)', 'Do alag passwords', 'SYN aur ACK'], a: 1,
    why: 'Signal protocol ka taala sirf Riya kholti hai. Noise ka bahar wala taala server kholta hai taaki message route ho sake.' },
  { q: 'Har message ke liye nayi key kyon?',
    o: ['Phone fast chalta hai', 'Ek key chori ho jaaye toh baaki messages safe rahein', 'Battery bachane ke liye', 'Server ka kaam kam ho'], a: 1,
    why: 'Double Ratchet har message pe aage ghoomta hai aur purani keys delete karta hai. Ise forward secrecy kehte hain.' },
  { q: 'Security code (QR / 60 numbers) kis liye hai?',
    o: ['Account ka password reset karne ke liye', 'Check karne ke liye ki beech mein koi nakli key nahi', 'Message jaldi bhejne ke liye', 'Group banane ke liye'], a: 1,
    why: 'Code dono ki identity keys se banta hai. Dono taraf same hai toh koi middleman (server bhi) nakli key nahi de raha.' },
];
QUIZZES[5] = [
  { q: 'Encapsulation ka matlab kya hai?',
    o: ['Message ko delete karna', 'Har layer data pe apna header (lifafa) jodti hai', 'Data ko compress karna', 'Wi-Fi password badalna'], a: 1,
    why: 'Neeche jaate hue har layer apna header jodti hai (encapsulation). Doosri taraf ulte order mein utarte hain (decapsulation).' },
  { q: 'Port numbers (51234 → 443) kis layer pe hote hain?',
    o: ['L2 Data link', 'L3 Network', 'L4 Transport', 'L7 Application'], a: 2,
    why: 'TCP aur UDP Layer 4 hain, aur ports unke header mein hote hain.' },
  { q: 'Henna ke Wi-Fi frame ka destination MAC kiska hai?',
    o: ['WhatsApp server ka', 'Riya ke phone ka', 'Ghar ke router ka', 'DNS resolver ka'], a: 2,
    why: 'Layer 2 sirf agle padosi tak jaati hai. Pehla padosi router hai, isliye uska MAC. WhatsApp ka address L3 (IP) mein hai.' },
  { q: 'Router packet ka kaunsa hissa padh ke raasta chunta hai?',
    o: ['L3 ka destination IP', 'L7 ka message text', 'L4 ka sequence number', 'Andar wala E2E taala'], a: 0,
    why: 'Router Layer 3 device hai: L1 aur L2 kholke destination IP padhta hai. Andar ke lifafe nahi chhuta.' },
  { q: 'Router pe kya badalta hai aur kya same rehta hai?',
    o: ['IP badalta hai, MAC same', 'MAC (L2 lifafa) badalta hai, destination IP same', 'Dono same', 'Message text badalta hai'], a: 1,
    why: 'Har hop pe naya L2 frame banta hai (naye MAC), par destination IP poore safar mein same rehta hai. TTL 1 ghat jaata hai.' },
];
QUIZZES[6] = [
  { q: '192.168.1.5 jaisa address internet pe seedha kyon nahi chalta?',
    o: ['Woh bahut lamba hai', 'Woh private range hai, crore gharon mein same hai', 'Usmein virus hai', 'Woh sirf Wi-Fi ka password hai'], a: 1,
    why: '10.x, 172.16–31.x aur 192.168.x private ranges hain. Internet ke routers inhe aage nahi bhejte.' },
  { q: 'Bahar jaate packet mein NAT kya badalta hai?',
    o: ['Destination IP', 'Source IP aur port (private → public)', 'Encrypted message', 'MAC address sirf'], a: 1,
    why: 'From 192.168.1.5:51234 → From 198.51.100.24:40001. Destination wahi rehta hai.' },
  { q: 'Phone aur laptop dono ne port 51234 liya. Router kya karega?',
    o: ['Laptop ko block kar dega', 'Dono ko alag public port de dega (40001, 40002)', 'Dono ko same port de dega', 'Internet band kar dega'], a: 1,
    why: 'PAT: ek public IP, har connection ka alag public port. NAT table yaad rakhti hai kaun kaun hai.' },
  { q: 'Jawab aane pe router ko kaise pata chalta hai ki kis device ko dena hai?',
    o: ['Message padh ke', 'NAT table mein public port dekh ke', 'Sabko bhej deta hai', 'DNS se pooch ke'], a: 1,
    why: 'To 198.51.100.24:40001 → table row → 192.168.1.5:51234 (Henna ka phone).' },
  { q: 'Bahar se anjaan connection (port 22) aaya. Router ne kya kiya?',
    o: ['Andar aane diya', 'NAT table mein match nahi mila, chupchap drop kiya', 'Hacker ko password bhej diya', 'Phone ko forward kiya'], a: 1,
    why: 'Stateful firewall sirf un connections ke jawab andar aane deta hai jo andar se shuru hue the.' },
];
QUIZZES[7] = [
  { q: 'Router packet ka raasta kaise chunta hai?',
    o: ['Poora raasta pehle se likha hota hai', 'Destination IP dekh ke routing table se agla hop', 'Message padh ke', 'Random kisi ko bhi'], a: 1,
    why: 'Har router sirf agla hop chunta hai, routing table ke "longest prefix match" se.' },
  { q: 'BGP ka kaam kya hai?',
    o: ['Wi-Fi password check karna', 'Networks ek doosre ko batate hain ki kaunse IP unke paas hain', 'Message encrypt karna', 'Virus scan'], a: 1,
    why: 'Meta announce karta hai "157.240.0.0/16 mere paas hai (AS32934)". Isi se duniya ke routers raasta seekhte hain.' },
  { q: 'Har router pe TTL ka kya hota hai?',
    o: ['1 badhta hai', '1 ghat-ta hai, 0 hone pe packet drop', 'Same rehta hai', 'Double hota hai'], a: 1,
    why: 'TTL packet ko hamesha ghoomne se rokta hai. 0 hone pe router "Time Exceeded" bhejta hai.' },
  { q: 'Fibre kat gaya toh kya hua?',
    o: ['Message hamesha ke liye kho gaya', 'BGP ne backup raasta chuna, message pahunch gaya', 'Henna ko naya phone lena pada', 'WhatsApp band ho gaya'], a: 1,
    why: 'Internet multiple paths ke saath bana hai. Ek link toote toh routers kuch seconds mein naya raasta chun lete hain.' },
  { q: 'Desh se desh zyada tar data kaise jaata hai?',
    o: ['Satellite se', 'Samundar ke neeche fibre cables se', 'Radio towers se', 'Pen drive se'], a: 1,
    why: '95% se zyada international data undersea fibre cables se jaata hai, roshni ki speed ke kareeb.' },
];
QUIZZES[8] = [
  { q: 'DDoS mein kya hota hai?',
    o: ['Password chori hota hai', 'Itna bekaar traffic aata hai ki asli users ke liye jagah na bache', 'Message encrypt ho jaata hai', 'Wi-Fi band ho jaata hai'], a: 1,
    why: 'DDoS ka maqsad service ko band karna hai (availability). Traffic shield bekaar traffic ko chhaan deta hai.' },
  { q: 'Firewall kya dekh ke faisla karta hai?',
    o: ['Message ke shabd', 'IP, port aur protocol', 'User ki photo', 'Battery level'], a: 1,
    why: 'Firewall Layer 3/4 pe rules se kaam karta hai: "TCP 443 allow, baaki deny".' },
  { q: '"Default deny" ka matlab?',
    o: ['Sab allow', 'Jo rule mein allow nahi, woh sab mana', 'Sirf raat ko block', 'Har doosra packet block'], a: 1,
    why: 'Sirf zaroori ports kholo, baaki sab apne aap band. Yeh sabse surakshit tareeka hai.' },
  { q: 'IDS aur IPS mein kya fark hai?',
    o: ['Koi fark nahi', 'IDS alarm bajata hai, IPS rok bhi deta hai', 'IPS sirf Wi-Fi ke liye', 'IDS message padhta hai'], a: 1,
    why: 'Detection System vs Prevention System. Dono bartaav aur jaane-maane khatron ke pattern dekhte hain.' },
  { q: 'Load balancer ne server C ko kyon chhod diya?',
    o: ['Uska naam pasand nahi tha', 'Health check fail hua (jawab nahi diya)', 'Woh sabse tez tha', 'Riya wahan nahi thi'], a: 1,
    why: 'Load balancer sirf healthy servers ko traffic deta hai, aur unmein se kam bheed wala chunta hai.' },
];
QUIZZES[9] = [
  { q: 'WhatsApp server kaunsa taala khol sakta hai?',
    o: ['Dono taale', 'Sirf bahar wala (transport/Noise)', 'Sirf andar wala (Signal)', 'Koi bhi nahi'], a: 1,
    why: 'Bahar wala taala server tak ka hai, taaki woh message route kar sake. Andar wala sirf Riya ka phone kholta hai.' },
  { q: 'Server ko kaise pata ki message Henna ne hi bheja?',
    o: ['Message mein naam likha tha', 'Woh Henna ke phone ki key se bane encrypted connection se aaya', 'Riya ne bataya', 'Router ne bataya'], a: 1,
    why: 'Scene 3 ka Noise connection Henna ke phone ne apni key se banaya tha. Isi se sender authenticate hota hai.' },
  { q: 'Riya offline hai. Server kya karta hai?',
    o: ['Message delete kar deta hai', 'Message padh ke SMS bhejta hai', 'Encrypted message queue mein rakhta hai', 'Henna ko error bhejta hai'], a: 2,
    why: 'Locked message queue mein rehta hai jab tak Riya online na aaye. Deliver hote hi server se mit jaata hai.' },
  { q: 'Ek grey tick ✓ ka matlab kya hai?',
    o: ['Riya ne message padh liya', 'Message Riya ke phone tak pahunch gaya', 'Message WhatsApp server tak pahunch gaya', 'Message fail ho gaya'], a: 2,
    why: '✓ = server tak. ✓✓ grey = Riya ke phone tak. ✓✓ blue = Riya ne padh liya.' },
  { q: 'Undelivered message server pe kitne din tak reh sakta hai?',
    o: ['1 ghanta', '30 din', 'Hamesha', '1 saal'], a: 1,
    why: 'WhatsApp ke hisaab se jo message deliver nahi hua, woh lagbhag 30 din baad server se delete ho jaata hai.' },
];
QUIZZES[10] = [
  { q: 'Riya ka phone so raha tha. Use kisne jagaya?',
    o: ['Henna ne call karke', 'Push service (Android pe FCM, iPhone pe APNs)', 'DNS server ne', 'Router ne'], a: 1,
    why: 'WhatsApp server push service se kehta hai, aur phone us service se hamesha ek halki connection rakhta hai.' },
  { q: 'Kya Google ki push service "Hi" padh sakti hai?',
    o: ['Haan, poora message', 'Nahi, push mein sirf jagaane ka signal ya locked data hota hai', 'Sirf pehla shabd', 'Sirf raat ko'], a: 1,
    why: 'Message end-to-end locked hai. Push sirf phone ko jagaata hai, phir phone khud WhatsApp server se message leta hai.' },
  { q: 'Riya ke phone pe layers kis order mein khulti hain?',
    o: ['L7 se L1', 'L1 se L7 (decapsulation)', 'Random', 'Sirf L3'], a: 1,
    why: 'Bhejne wale pe L7 → L1 (encapsulation), lene wale pe L1 → L7 (decapsulation).' },
  { q: '"Hi" ka andar wala taala kisne khola?',
    o: ['WhatsApp server ne', 'Push service ne', 'Riya ke phone ne apni private key se', 'Henna ke router ne'], a: 2,
    why: 'Riya ki private key + Henna ki public key se wahi shared secret banta hai, aur sirf Riya ka phone yeh kar sakta hai.' },
  { q: 'Do neele tick ✓✓ ka matlab?',
    o: ['Server tak pahuncha', 'Riya ke phone tak pahuncha, par padha nahi', 'Riya ne padh liya', 'Message fail'], a: 2,
    why: '✓ server, ✓✓ grey Riya ka phone, ✓✓ blue Riya ne padha (agar read receipts on hain).' },
];
QUIZZES[11] = [
  { q: 'WhatsApp server bheji gayi file ko scan kyon nahi kar sakta?',
    o: ['Server slow hai', 'File end-to-end encrypted hai, server andar nahi dekh sakta', 'File bahut chhoti hai', 'Server raat ko band hota hai'], a: 1,
    why: 'E2E encryption ka matlab hai sirf Riya ka phone file khol sakta hai. Isliye scan bhi phone pe hi hota hai.' },
  { q: 'Signature scan kaise kaam karta hai?',
    o: ['File ka naam padh ke', 'File ka fingerprint (hash) jaani-maani buri files ki list se mila ke', 'File ka size dekh ke', 'Bhejne wale ka naam dekh ke'], a: 1,
    why: 'Har file ka ek unique fingerprint hota hai. List mein match mila toh file quarantine.' },
  { q: 'Bilkul nayi buri file (list mein nahi) kaise pakdi jaati hai?',
    o: ['Pakdi hi nahi ja sakti', 'Bartaav (heuristics) se: kya maang rahi hai, kya karna chahti hai', 'Uske colour se', 'Riya ke dost se pooch ke'], a: 1,
    why: 'Behaviour checks dekhte hain ki app ka kaam aur maangi gayi permissions mel khaate hain ya nahi.' },
  { q: '"whatsapp-gold-update.example" link aaya. Kya karein?',
    o: ['Turant update karo', 'Mat kholo: yeh asli WhatsApp domain nahi hai', 'Sab dosto ko forward karo', 'Password daal do'], a: 1,
    why: 'WhatsApp Gold naam ki koi cheez nahi hai. Domain ka naam dhyan se padho, aur urgency wale messages pe shak karo.' },
  { q: 'Koi WhatsApp ka 6 digit code maange toh?',
    o: ['De do, dost hai', 'Kabhi share mat karo, report & block karo, 2-step PIN on rakho', 'Aadha code de do', 'Code badal ke de do'], a: 1,
    why: 'Code se koi bhi aapka account apne phone pe chala sakta hai. Asli WhatsApp ya bank yeh code kabhi nahi maangte.' },
];
QUIZZES[12] = [
  { q: 'Henna ke phone ko 192.168.1.5 kisne diya?',
    o: ['DNS server', 'Router ka DHCP server', 'WhatsApp', 'ISP ka core router'], a: 1,
    why: 'Scene 1: DHCP ki DORA (Discover, Offer, Request, Acknowledge).' },
  { q: 'g.whatsapp.net ko IP address mein kisne badla?',
    o: ['DNS', 'NAT', 'TCP', 'BGP'], a: 0,
    why: 'Scene 2: DNS internet ki phonebook hai: root → .net → whatsapp.net.' },
  { q: 'SYN → SYN-ACK → ACK kiska hissa hai?',
    o: ['Wi-Fi handshake', 'TCP handshake', 'Signal encryption', 'DHCP'], a: 1,
    why: 'Scene 3: TCP ka 3-way handshake pakka connection banata hai.' },
  { q: 'WhatsApp server "Hi" kyon nahi padh sakta?',
    o: ['Server ki screen chhoti hai', 'Andar ka Signal taala sirf Riya ki private key se khulta hai', 'Message bahut tez tha', 'Router ne chhupa diya'], a: 1,
    why: 'Scene 4: end-to-end encryption. Server sirf bahar ka taala kholta hai.' },
  { q: 'Ghar ke private IP ko public IP se kaun badalta hai?',
    o: ['Riya ka phone', 'Home router (NAT)', 'Root server', 'Load balancer'], a: 1,
    why: 'Scene 6: NAT table mein private ↔ public mapping rehti hai.' },
  { q: 'Henna ko ✓✓ blue kab dikhte hain?',
    o: ['Message server pe pahunchne pe', 'Riya ke phone pe pahunchne pe', 'Riya ke padhne pe (read receipts on)', 'Kabhi nahi'], a: 2,
    why: 'Scene 10: ✓ server, ✓✓ grey Riya ka phone, ✓✓ blue padh liya.' },
];
QUIZZES[1].push({ q: 'Mobile data pe phone ko IP kaun deta hai?',
  o: ['Ghar ka router', 'Mobile company (SIM ke zariye)', 'WhatsApp', 'Root server'], a: 1,
  why: 'Mobile data pe SIM se pehchaan hoti hai aur mobile company IP deti hai, aksar 100.64.x.x jaisa shared (CGNAT) address.' });
QUIZZES[6].push({ q: 'IPv6 mein NAT ki zaroorat kyon nahi padti?',
  o: ['IPv6 slow hai', 'Itne address hain ki har device ko apna public address mil sakta hai', 'IPv6 mein firewall nahi hota', 'Router band ho jaata hai'], a: 1,
  why: 'IPv6 128-bit hai. NAT ki zaroorat nahi, par firewall phir bhi bahar se aane wale anjaan connections rokta hai.' });
QUIZZES[9].push({ q: 'Photo bhejne pe media server ko kya milta hai?',
  o: ['Saaf photo', 'Sirf locked (encrypted) file', 'Photo ki chaabi', 'Riya ka password'], a: 1,
  why: 'Photo phone pe random chaabi se lock hoti hai. Chaabi aur link Riya ko end-to-end message mein jaate hain.' });
QUIZZES[10].push({ q: 'Group message mein Henna ka phone kitni copies bhejta hai?',
  o: ['Har member ke liye ek', 'Sirf ek, server sabko baant deta hai', 'Zero', 'Do'], a: 1,
  why: 'Sender Key se ek baar lock karke ek copy jaati hai. Server use har member tak pahunchata hai (fan-out).' });
let qi = 0, qScore = 0, qScene = 1;
const quizEl = document.getElementById('quiz');
function openQuiz(sc) {
  qScene = sc; qi = 0; qScore = 0; quizEl.hidden = false;
  document.getElementById('qBody').hidden = false; document.getElementById('qEnd').hidden = true; showQ();
}
function showQ() {
  const QS = QUIZZES[qScene], Q = QS[qi];
  document.getElementById('qNum').textContent = 'Scene ' + qScene + ' · Question ' + (qi + 1) + ' of ' + QS.length;
  const QL = qT(Q);
  document.getElementById('qText').textContent = QL.q;
  const box = document.getElementById('qOpts'); box.textContent = '';
  const why = document.getElementById('qWhy'); why.hidden = true;
  const nx = document.getElementById('qNext'); nx.hidden = true;
  QL.o.forEach((t, k) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = t;
    b.addEventListener('click', () => {
      [...box.children].forEach((x, j) => { x.disabled = true; if (j === Q.a) x.classList.add('right'); });
      const right = k === Q.a;
      if (!right) b.classList.add('wrong');
      if (right) { qScore += 10; addXp(10); sfx.good(); } else sfx.bad();
      why.innerHTML = (right ? '<b>' + ui('right') + '</b> ' : '<b class="no">' + ui('wrong') + '</b> ') + QL.why;
      why.hidden = false;
      nx.textContent = qi === QS.length - 1 ? ui('seeResult') : ui('nextQ');
      nx.hidden = false; nx.focus();
    });
    box.appendChild(b);
  });
  box.firstChild.focus();
}
document.getElementById('qNext').addEventListener('click', () => {
  const QS = QUIZZES[qScene], max = QS.length * 10, m = metaT(qScene);
  qi++;
  if (qi < QS.length) return showQ();
  document.getElementById('qBody').hidden = true;
  document.getElementById('qEnd').hidden = false;
  document.getElementById('qEndScene').textContent = 'Scene ' + qScene + ' complete';
  document.getElementById('qEndName').textContent = m.name;
  document.getElementById('qScore').textContent = qScore + ' / ' + max + ' XP';
  const hasChal = BEATS.some(b => b.scene === qScene && b.challenge);
  const stars = 1 + (qScore === max ? 1 : 0) + (hasChal ? (chalSolved[qScene] && !chalMistakes[qScene] ? 1 : 0) : (qScore === max ? 1 : 0));
  sceneStars[qScene] = Math.max(sceneStars[qScene] || 0, stars);
  const stEl = document.getElementById('qStars');
  stEl.innerHTML = '★'.repeat(stars) + '<span class="off">' + '★'.repeat(3 - stars) + '</span>';
  stEl.setAttribute('aria-label', stars + ' of 3 stars');
  const secs = Math.round((performance.now() - sceneStartAt) / 1000);
  document.getElementById('qTime').textContent = ui('time') + ' ' + Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0')
    + (hasChal ? ' · challenge ' + (chalSolved[qScene] ? (chalMistakes[qScene] ? '✓ (' + chalMistakes[qScene] + ' slip)' : '✓ first try') : '✗') : '');
  document.getElementById('qMsg').textContent = (qScore === max ? m.full : ui('tryAgain'))
    + (qScene === 12 ? ui('total') + xp + ' XP.' : '');
  document.getElementById('qNextStop').textContent = ui('nextStop') + m.next;
  const hasNext = BEATS.some(b => b.scene === qScene + 1);
  const qGo = document.getElementById('qGo');
  qGo.hidden = !hasNext && qScene !== 12;
  qGo.textContent = qScene === 12 ? ui('restart') : ui('nextScene');
  sceneDone.add(qScene); syncTrack(qScene);
  sfx.win();
  document.getElementById(hasNext || qScene === 12 ? 'qGo' : 'qClose').focus();
});
document.getElementById('qClose').addEventListener('click', () => { quizEl.hidden = true; });
document.getElementById('qRetry').addEventListener('click', () => {
  quizEl.hidden = true; go(BEATS.findIndex(b => b.scene === qScene));
});
document.getElementById('qGo').addEventListener('click', () => {
  quizEl.hidden = true; go(qScene === 12 ? 0 : BEATS.findIndex(b => b.scene === qScene + 1));
});

// Keep the inspector clear of the story panel on phones
const storyEl = document.getElementById('story');
const beatTextEl = document.getElementById('beatText');
const moreBtn = document.getElementById('moreBtn');
const shortLandscape = () => window.innerHeight < 520 && window.innerWidth > window.innerHeight;
const phoneLayout = () => window.innerWidth < 760 || shortLandscape();
let storyOpen = false;
function setStoryText(html) {
  beatTextEl.innerHTML = html;
  storyOpen = false; syncStory();
}
function syncStory() {
  beatTextEl.classList.toggle('clamp', !storyOpen);
  const overflow = storyOpen || beatTextEl.scrollHeight > beatTextEl.clientHeight + 2;
  moreBtn.hidden = !overflow;
  moreBtn.textContent = storyOpen ? ui('less') : ui('more');
  moreBtn.setAttribute('aria-expanded', String(storyOpen));
  measureStory();
}
moreBtn.addEventListener('click', () => { storyOpen = !storyOpen; syncStory(); });
// The panel grows when a challenge or a long text appears; keep the view and the phone inspector clear of it
if (window.ResizeObserver) new ResizeObserver(() => measureStory()).observe(storyEl);
const inspEl = document.getElementById('inspector');
inspEl.addEventListener('click', () => {
  if (!phoneLayout()) return;
  inspEl.classList.toggle('open');
  document.getElementById('iMore').textContent = inspEl.classList.contains('open') ? ui('tapLess') : ui('tapMore');
  measureStory();
});
// Shift the 3D view up so the action sits above the story panel instead of behind it
function measureStory() {
  const sh = storyEl.offsetHeight;
  document.documentElement.style.setProperty('--storyH', sh + 'px');
  const w = window.innerWidth, h = window.innerHeight;
  let off = Math.round(Math.min(sh * (w < 760 ? 0.45 : 0.3), h * 0.22));
  // On wide screens the inspector covers the right side, so shift the picture left by half its width
  let side = w >= 760 ? Math.round((inspEl.offsetWidth + 16) / 2) : 0;
  // Phone held sideways: the story sits on the left, so move the picture into the right part
  if (shortLandscape()) { side = -Math.round((storyEl.offsetWidth + 12) / 2); off = 0; }
  camera.setViewOffset(w, h, side, off, w, h);
  camera.updateProjectionMatrix();
}

// ---------- Resize + loop ----------
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false); labelRenderer.setSize(w, h);
  camera.aspect = w / h;
  camera.fov = w < 700 ? 62 : 48;
  camera.updateProjectionMatrix();
  syncStory();
}
window.addEventListener('resize', resize); resize();

const v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
let last = performance.now(), lastTtl = -1, natTick = 0, loadTick = 0;
let lowQ = false, slowAvg = 1 / 60, slowFrames = 0;
function frame(now) {
  const rawDt = (now - last) / 1000;
  const dt = Math.min(0.05, rawDt); last = now;
  // If the device struggles (under ~30 fps for a while), render at a lower resolution
  if (!lowQ && rawDt > 0 && rawDt < 1) {
    slowAvg = slowAvg * 0.97 + rawDt * 0.03;
    if (++slowFrames > 120 && slowAvg > 1 / 30) { lowQ = true; renderer.setPixelRatio(1); resize(); }
  }
  const t = now / 1000;

  if (camGoal) {
    camGoal.k = Math.min(1, camGoal.k + dt * 1.1);
    const e = reduce ? 1 : 0.06 + camGoal.k * 0.1;
    camera.position.lerp(camGoal.p, e); controls.target.lerp(camGoal.t, e);
    if (camGoal.k >= 1 && camera.position.distanceTo(camGoal.p) < 0.02) camGoal = null;
  }
  controls.update();

  // packets in flight
  for (let i = flights.length - 1; i >= 0; i--) {
    const f = flights[i];
    f.t += dt / f.dur;
    const u = Math.min(1, f.t), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    v1.copy(f.p0).multiplyScalar((1 - e) * (1 - e)).add(v2.copy(f.p1).multiplyScalar(2 * (1 - e) * e)).add(v2.copy(f.p2).multiplyScalar(e * e));
    f.g.position.copy(v1);
    if (!reduce) { f.g.children[0].rotation.y = t * 2 + f.spin; f.g.children[1].rotation.y = t * 2 + f.spin; }
    if (f.lose && u >= f.lose) { burst(f.g.position.clone(), 0x8a93b8); dropPacket(f.g); flights.splice(i, 1); f.res('lost'); continue; }
    if (u >= 1) { dropPacket(f.g); flights.splice(i, 1); f.res(true); }
  }
  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i]; b.t += dt;
    b.m.scale.setScalar(1 + b.t * 6); b.m.material.opacity = Math.max(0, 0.9 - b.t * 1.4);
    if (b.t > 0.7) { scene.remove(b.m); bursts.splice(i, 1); }
  }

  // ambient life: beacon pulses, router LEDs, link flow, keep-alive dots, lock bob
  pulses.forEach(p => {
    const u = reduce ? 0.5 : ((t * 0.35 + p.off) % 1);
    p.m.scale.setScalar(0.3 + u * (HOME_R - 0.6));
    p.m.material.opacity = reduce ? 0.04 : 0.16 * (1 - u);
  });
  rLeds.forEach(l => { l.visible = reduce || Math.sin(t * 5 + l.userData.ph) > -0.5; });
  if (!reduce) { stripe.offset.x -= dt * 1.2; lock.position.y = linkCurve.getPoint(0.5).y + 0.35 + Math.sin(t * 2) * 0.05; lock.rotation.y = Math.sin(t * 0.8) * 0.4; }
  keepDots.forEach(d => {
    if (!d.visible) return;
    const u = reduce ? d.userData.off : (t * 0.4 + d.userData.off) % 1;
    d.position.copy(linkCurve.getPoint(u));
  });
  dome.rotation.y = reduce ? 0 : t * 0.03;
  // People: breathing, glancing at the phone, thumbs tapping, screens lit by what is happening
  const hCol = live.read ? 0x4fb8ff : live.tick1 ? 0x25d366 : live.bundle ? 0x25d366 : live.connected ? 0x4ef0a0 : live.password ? C.crypto : 0x4f5a7a;
  henna.scrM.color.setHex(hCol); henna.glow.material.color.setHex(hCol);
  const rCol = live.codeSafe ? C.ok : live.linkBlocked || live.quarantined ? C.bad : live.decrypted ? 0x25d366 : live.riyaOn ? 0x25d366 : live.pushed ? 0xffd36b : live.riyaOffline ? 0x1a2235 : 0x25d366;
  riya.scrM.color.setHex(rCol); riya.glow.material.color.setHex(rCol);
  // Riya rests with her phone down while offline, lifts it when the push arrives
  const riyaAsleep = live.riyaOffline && !live.pushed && !live.riyaOn;
  riya.setPose(live.riyaOffline && !live.riyaOn && !live.pushed ? 'rest' : 'hold');
  const night = live.riyaOffline && !live.riyaOn;
  nightDome.visible = moon.visible = night && city.visible;
  riyaLamp.intensity = night ? 0 : 1.1;
  zzz.obj.visible = riyaAsleep && shownScene >= 9;
  rRim.material.color.setHex(night ? 0x3a4a7a : 0x25d366);
  const typing = live.bundle && !live.locked;
  const happyH = live.read || (live.tick1 && shownScene === 9);
  const happyR = live.decrypted && !live.s11;
  const gCol = live.groupSent ? 0x25d366 : 0x4f5a7a;
  aman.scrM.color.setHex(gCol); aman.glow.material.color.setHex(gCol);
  sara.scrM.color.setHex(gCol); sara.glow.material.color.setHex(gCol);
  henna.smile.scale.setScalar(happyH ? 1.5 : 1); riya.smile.scale.setScalar(happyR ? 1.5 : 1);
  if (!reduce) {
    [henna, riya, aman, sara].forEach((pp, i) => {
      // thumb taps across the screen (faster while typing)
      const sp = (i === 0 && typing) ? 16 : 4;
      pp.thumb.position.set(0.035 + Math.sin(t * sp) * 0.02, 1.16 + Math.cos(t * sp * 0.5) * 0.012, 0.27);
    });
    if (live.pushed && !live.riyaOn) riya.ph.rotation.z = 0.1 + Math.sin(t * 40) * 0.08;
    else if (riya.pose === 'hold') riya.ph.rotation.z = 0;
    [henna, riya, aman, sara].forEach((pp, i) => {
      pp.torso.scale.y = 1 + 0.012 * Math.sin(t * 2 + i);
      pp.head.rotation.x = (pp.pose === 'rest' ? 0.02 : 0.38) + 0.04 * Math.sin(t * 0.9 + i * 2);
      pp.head.rotation.y = 0.08 * Math.sin(t * 0.5 + i);
      pp.hands.position.y = 0.004 * Math.sin(t * (i === 0 && live.bundle && !live.locked ? 14 : 6));
      pp.glow.material.opacity = 0.75 + 0.25 * Math.sin(t * 3 + i);
    });
    // Henna does a little happy bounce when Riya reads the message
    henna.g.position.y = live.read && shownScene >= 10 && shownScene <= 10 ? Math.abs(Math.sin(t * 4)) * 0.05 : 0;
    riya.g.position.y = live.decrypted && shownScene === 10 && !live.tick2 ? Math.abs(Math.sin(t * 4)) * 0.04 : 0;
    hennaBeam.material.opacity = 0.35 + 0.2 * Math.sin(t * 2.5);
    riyaBeam.material.opacity = 0.35 + 0.2 * Math.sin(t * 2.5 + 1);
  }
  if (city.visible) {
    serverLeds.forEach(l => { l.visible = reduce || Math.sin(t * l.userData.sp + l.userData.ph) > -0.7; });
    if (!reduce) fibres.forEach((f, k) => { f.material.dashSize = 0.4; f.material.opacity = 0.4 + 0.25 * Math.sin(t * 2 + k); });
    if (!reduce && shield.visible) { shield.rotation.y = t * 0.5; shield.material.opacity = 0.22 + 0.12 * Math.sin(t * 3); }
    if (busy[0].visible && !reduce) busy.forEach(d => {
      let u = (t * 0.35 + d.userData.off) % 1; if (d.userData.back) u = 1 - u;
      d.position.copy(waSrv.port).lerp(d.userData.to.port, u); d.position.y += Math.sin(u * Math.PI) * 1.2;
    });
    if (dirDb.g.visible && !reduce) [dirDb, queueDb].forEach(db => db.discs.forEach(r => { r.visible = Math.sin(t * 3 + r.userData.ph) > -0.4; }));
    if (qCube.visible && !reduce) { qCube.rotation.y = t; qCube.position.y = 2.0 + Math.sin(t * 2) * 0.06; }
    if (dc.visible && !reduce) {
      radarPivot.rotation.y = t * 1.4;
      shieldDome.rotation.y = t * 0.05;
      fwWall.material.opacity = 0.12 + 0.05 * Math.sin(t * 2);
    }
    if (dc.visible && now - (loadTick || 0) > 2000) {
      loadTick = now;
      loads.a = Math.max(30, Math.min(48, loads.a + Math.round((Math.random() - 0.5) * 6)));
      loads.b = Math.max(74, Math.min(90, loads.b + Math.round((Math.random() - 0.5) * 6)));
      paintLoads(live);
    }
    if (seaGlow[0].visible) seaGlow.forEach(d => {
      const u = reduce ? d.userData.off : (t * 0.18 + d.userData.off) % 1;
      d.position.copy(landing.port).setY(0.2).lerp(farEnd, u);
    });
    if (cutMark.visible && !reduce) cutMark.scale.setScalar(1 + 0.15 * Math.sin(t * 6));
    if (natObj.visible && now - (natTick || 0) > 1000) { natTick = now; paintNat(live); }
    if (stack.visible && !reduce) { shells.forEach((m, k) => { m.rotation.y = t * (0.25 + k * 0.05) * (k % 2 ? -1 : 1); }); core.rotation.y = t; }
    if (stackAnim) {
      stackAnim.t += dt / stackAnim.dur;
      const u = Math.min(1, stackAnim.t);
      stack.position.copy(stackAnim.from).lerp(stackAnim.to, u * u * (3 - 2 * u));
      stack.scale.setScalar(1 - 0.7 * u);
      if (u >= 1) { stack.scale.setScalar(1); const a = stackAnim; stackAnim = null; a.res(); }
    }
    if (wave.visible) drawWave(reduce ? 0 : t);
    if (mixAnim) {
      mixAnim.t += dt / (reduce ? 1 : 2.4);
      const u = Math.min(1, mixAnim.t), a = u * Math.PI * 3, r = 0.7 * (1 - u);
      orbHenna.position.copy(mixAnim.at).add(v1.set(Math.cos(a) * r, Math.sin(a * 0.5) * 0.15, Math.sin(a) * r));
      orbRiya.position.copy(mixAnim.at).add(v1.set(-Math.cos(a) * r, -Math.sin(a * 0.5) * 0.15, -Math.sin(a) * r));
      if (u >= 1) { setVis(orbHenna, false); setVis(orbRiya, false); const m = mixAnim; mixAnim = null; m.res(); }
    }
    if (trail.visible) {
      trailU += (trailGoal - trailU) * Math.min(1, dt * (reduce ? 20 : 2.5));
      trailGeo.setDrawRange(0, Math.floor(trailU * trailTotal / 6) * 6);
    }
    if (runnerU >= 0) {
      runnerU = Math.min(1, runnerU + dt / (reduce ? 1.5 : 3.2));
      if (runner) runner.position.copy(trailCurve.getPointAt(runnerU));
    }
    if (scanRing.visible && !reduce) {
      scanRing.position.y = riyaPort.y - 0.9 + (Math.sin(t * 2) * 0.5 + 0.5) * 1.6;
      guard.rotation.y = t * 0.4;
    }
    if (qBox.visible && !reduce) { qBox.rotation.y = t * 0.6; qFile.material.color.setHex(Math.sin(t * 5) > 0 ? C.bad : 0x7a1830); }
    if (orbSecretR.visible && !reduce) { orbSecretR.position.y = riyaMix.y + Math.sin(t * 1.6) * 0.08; }
    if (pushRings[0].visible && !reduce) pushRings.forEach(r => {
      const u = (t * 0.8 + r.userData.off) % 1; r.scale.setScalar(0.4 + u * 2.4); r.material.opacity = 0.7 * (1 - u);
    });
    if (orbSecret.visible && !reduce) { orbSecret.position.y = mixAt.y + Math.sin(t * 1.6) * 0.08; orbSecret.rotation.y = t; }
    if (gear.visible) {
      const goal = -gearClick * (Math.PI * 2 / 10);
      gear.rotation.z += (goal - gear.rotation.z) * Math.min(1, dt * 6);
      if (!reduce) gear.rotation.y = Math.sin(t * 0.7) * 0.3;
    }
    if (pipe.visible && !reduce) {
      pipeTex.offset.x -= dt * 1.5;
      pipeDots.forEach(d => {
        let u = (t * 0.12 + d.userData.off) % 1; if (d.userData.dir < 0) u = 1 - u;
        d.position.copy(pipeCurve.getPointAt(u));
      });
    }
    if (ttlAt) {
      const left = 300 - Math.floor(((now - ttlAt) / 1000) % 300);
      if (left !== lastTtl) { lastTtl = left; resolver.tag.chips([['cached · TTL ' + left + ' s', 'ok']]); }
    }
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---------- Saved progress and the welcome screen ----------
function saveProgress() {
  if (cur < 0 || !welcomeEl.hidden) return;
  try {
    localStorage.setItem('mj-progress', JSON.stringify({
      scene: BEATS[cur].scene, title: BEATS[cur].title, xp, done: [...sceneDone], stars: sceneStars, lang: LANG,
    }));
  } catch (e) {}
}
function loadProgress() {
  try { return JSON.parse(localStorage.getItem('mj-progress') || 'null'); } catch (e) { return null; }
}
const welcomeEl = document.getElementById('welcome');
const saved = loadProgress();
if (saved && saved.lang) LANG = saved.lang;
function paintWelcome() {
  document.getElementById('wSub').textContent = ui('welcomeSub');
  document.getElementById('wKicker').textContent = ui('kicker');
  document.getElementById('wStart').textContent = saved && saved.scene > 1 ? ui('startOver') : ui('start');
  const r = document.getElementById('wResume');
  r.hidden = !(saved && (saved.scene > 1 || (saved.done || []).length));
  if (!r.hidden) r.textContent = ui('continue') + ' · Scene ' + saved.scene;
  const st = saved && saved.stars ? Object.values(saved.stars).reduce((a, b) => a + b, 0) : 0;
  document.getElementById('wStars').textContent = st ? '★ ' + st + ' / 36 · XP ' + (saved.xp || 0) : '';
  document.querySelectorAll('.wlang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
}
document.querySelectorAll('.wlang button').forEach(b => b.addEventListener('click', () => { setLang(b.dataset.lang); paintWelcome(); }));
document.getElementById('wStart').addEventListener('click', () => {
  sfx.start(); welcomeEl.hidden = true;
  xp = 0; xpEl.textContent = 'XP 0'; sceneDone.clear(); seen.clear(); Object.keys(sceneStars).forEach(k => delete sceneStars[k]);
  go(0);
});
document.getElementById('wResume').addEventListener('click', () => {
  sfx.start(); welcomeEl.hidden = true;
  xp = saved.xp || 0; xpEl.textContent = 'XP ' + xp;
  (saved.done || []).forEach(n => sceneDone.add(n));
  Object.assign(sceneStars, saved.stars || {});
  let k = BEATS.findIndex(b => b.title === saved.title);
  if (k < 0) k = BEATS.findIndex(b => b.scene === saved.scene);
  go(Math.max(0, k));
});
paintWelcome();
go(0);
