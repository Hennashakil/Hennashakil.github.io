// Message Journey · The story: every beat of the 12 scenes, plus the extra beats.
// Classic scripts share one global scope, so load order matters (see index.html).

// ---------- The story, beat by beat ----------
const wait = ms => new Promise(r => setTimeout(r, reduce ? ms * 0.5 : ms));
const CAM = {
  over: [[0, 7.5, 11], [0, 0.6, -0.4]],
  hand: [[0, 3.8, 6.4], [0, 1.1, 0.2]],
  intr: [[3.2, 5.2, 11.5], [5.2, 0.4, 1.4]],
  bcast: [[-0.5, 7, 8.5], [0, 0.8, -1.2]],
  phone: [[-5.2, 3.2, 5.8], [-1.6, 1.1, 0.3]],
  // Scene 2
  city: [[-6, 26, 38], [16, 0, -4]],
  toRes: [[0, 9, 14], [8, 0.8, -2.5]],
  root: [[9, 12, 8], [20, 2.5, -12]],
  tld: [[17, 11, 14], [26, 2, -3]],
  auth: [[11, 10, 22], [19, 1.5, 4]],
  back: [[-2, 10, 16], [6, 0.8, -1.5]],
  hack: [[3, 9, 19], [11, 1, 2]],
  // Scene 3
  s3wide: [[-8, 30, 58], [24, 2, 13]],
  s3srv: [[27, 11, 36], [37, 3.5, 21]],
  s3mid: [[-2, 20, 48], [24, 3, 13]],
  s3hack: [[-1, 10, 21], [7, 1, 5]],
  // Scene 4
  s4wide: [[8, 42, 66], [30, 2, 6]],
  s4riya: [[38, 9, 8], [49, 1.6, -7]],
  s4keys: [[18, 22, 42], [40, 3, 6]],
  s4henna: [[-6.8, 4.4, 7.4], [-2.2, 2.2, 0.8]],
  s4hack: [[-2, 13, 27], [10, 3, 6]],
  // Scene 5
  s5stack: [[-5.4, 4.0, 9.8], [1.8, 2.4, 2.2]],
  s5arp: [[-1, 7.5, 9.5], [0, 1, -1]],
  s5air: [[-0.5, 4.6, 7.8], [0.2, 1.6, 0.4]],
  s5router: [[5.6, 4.2, 6.4], [2.4, 2, -0.2]],
  // Scene 6
  s6router: [[2.5, 8, 15], [7.5, 1.6, 1]],
  s6home: [[-0.5, 9, 13], [3, 1.2, -0.5]],
  s6hack: [[0, 10, 18], [7, 1.2, 3.5]],
  // Scene 7
  s7wide: [[-4, 34, 62], [24, 1, 18]],
  s7core: [[4, 12, 30], [16, 1.5, 12]],
  s7ixp: [[12, 13, 46], [28, 2, 26]],
  s7cut: [[14, 18, 48], [30, 2, 22]],
  s7sea: [[40, 22, 78], [70, 0, 46]],
  // Scene 8
  s8wide: [[18, 18, 52], [37, 2, 24]],
  s8shield: [[12, 24, 64], [36, 3, 26]],
  s8gate: [[24, 9, 42], [36, 2, 26]],
  s8lb: [[28, 8, 36], [39, 2.4, 22.5]],
  // Scene 9
  s9srv: [[30, 8.5, 31], [37.5, 3, 20.5]],
  s9db: [[29.5, 6.5, 27], [37, 1.8, 19]],
  s9phone: [[-5.6, 3.4, 6.4], [-1.8, 1.5, 0.6]],
  // Scene 10
  s10push: [[26, 18, 32], [45, 2, 6]],
  s10riya: [[43.2, 4.8, -1.2], [48.6, 2.3, -6.6]],
  s10deliver: [[24, 22, 34], [44, 2, 7]],
  // Scene 11
  s11riya: [[45, 7, 7.5], [55, 1.4, -4]],
  s11route: [[30, 20, 30], [47, 2, 4]],
  // Scene 12
  s12map: [[4, 62, 78], [30, 0, 8]],
  s12low: [[0, 30, 58], [28, 1, 10]],
};
const BEACON = {
  name: 'Beacon frame', color: C.wifi,
  rows: [['Layer', 'L2 Wi-Fi management'], ['From', 'Router · 98:da:c4:5e:21:aa'], ['To', 'Everyone · ff:ff:ff:ff:ff:ff'],
    ['SSID', 'Henna_Home'], ['Security', 'WPA2-PSK (AES)'], ['Channel', '6 · 2.4 GHz']],
  note: 'Sent about 10 times every second, so phones nearby can list the network.',
};
const BEATS = [
  {
    title: 'Phone abhi offline hai',
    layers: [1, 2], cam: CAM.over,
    text: 'Henna ka phone abhi internet se juda nahi hai. Router har second mein lagbhag 10 baar ek <b>beacon</b> bhejta hai, jaise dukaan ke bahar laga board: <b>"Main hoon Henna_Home, WPA2 security ke saath."</b> Phone in boards ko padh ke Wi-Fi list dikhata hai.',
    async play(ok) {
      inspect(BEACON);
      await wait(600); if (!ok()) return;
      await fly({ from: routerPort, to: phonePort, color: C.wifi, label: 'BEACON', dur: 1.8 });
    },
    post() {},
  },
  {
    title: 'Password daala, par bheja nahi',
    layers: [2], cam: CAM.hand,
    text: 'Henna password daalti hai. Mazedaar baat: <b>password kabhi hawa mein nahi jaata!</b> Router ek random number <b>ANonce</b> bhejta hai. Phone apna random number <b>SNonce</b> banata hai, aur password + dono numbers se ek session key (PTK) bana leta hai. Phir SNonce ke saath ek <b>MIC</b> (signature) bhejta hai, jo prove karta hai ki use sahi password pata hai.',
    async play(ok) {
      patch({ password: true });
      inspect({ name: 'EAPOL-Key · 1 of 4', color: C.crypto,
        rows: [['Layer', 'L2 · 802.1X'], ['From', 'Router'], ['To', 'Henna\'s phone'], ['Carries', 'ANonce (random number)']],
        note: 'Step 1 of the 4-way handshake. No password inside.' });
      await fly({ from: routerPort, to: phonePort, color: C.crypto, label: '1 · ANonce' }); if (!ok()) return;
      sfx.land(); await wait(500); if (!ok()) return;
      inspect({ name: 'EAPOL-Key · 2 of 4', color: C.crypto,
        rows: [['Layer', 'L2 · 802.1X'], ['From', 'Henna\'s phone'], ['To', 'Router'], ['Carries', 'SNonce + MIC'], ['Password sent?', 'No']],
        note: 'The MIC can only be correct if the phone knows the real password.' });
      await fly({ from: phonePort, to: routerPort, color: C.crypto, label: '2 · SNonce + MIC' }); if (!ok()) return;
      sfx.land();
    },
    post(s) { s.password = true; },
  },
  {
    title: 'Taala lag gaya 🔒',
    layers: [2], cam: CAM.hand,
    text: 'Router bhi wahi key banata hai aur MIC check karta hai. <b>Match!</b> Message 3 mein router group key (GTK) bhejta hai, Message 4 mein phone kehta hai "theek hai". Ab dono ke paas ek hi chaabi hai, <b>bina chaabi ek doosre ko diye</b>. Is ke baad phone aur router ke beech ka har frame encrypted hai.',
    async play(ok) {
      inspect({ name: 'EAPOL-Key · 3 of 4', color: C.crypto,
        rows: [['From', 'Router'], ['To', 'Henna\'s phone'], ['Carries', 'GTK (encrypted) + MIC'], ['Check', 'Phone MIC ✓ matched']],
        note: 'The group key is used for broadcast traffic on this Wi-Fi.' });
      await fly({ from: routerPort, to: phonePort, color: C.crypto, label: '3 · GTK + MIC' }); if (!ok()) return;
      sfx.land(); await wait(400); if (!ok()) return;
      inspect({ name: 'EAPOL-Key · 4 of 4', color: C.crypto,
        rows: [['From', 'Henna\'s phone'], ['To', 'Router'], ['Carries', 'ACK'], ['Result', 'Keys installed']],
        note: 'Both sides now encrypt every frame with AES.' });
      await fly({ from: phonePort, to: routerPort, color: C.crypto, label: '4 · ACK' }); if (!ok()) return;
      patch({ keyed: true }); sfx.lock(); burst(lock.position, C.crypto);
    },
    post(s) { s.keyed = true; },
  },
  {
    title: 'Galat password wala andar nahi aayega',
    layers: [2], cam: CAM.intr,
    text: 'Ghar ke bahar ek <b>anjaan laptop</b> bhi Henna_Home se judne ki koshish karta hai, par uske paas sahi password nahi hai. Uska MIC router ke MIC se match nahi karta, toh router use <b>reject</b> kar deta hai. Yeh Wi-Fi ki pehli security deewar hai.',
    async play(ok) {
      setVis(intruder, true); intrTag.chips([]);
      inspect({ name: 'EAPOL-Key · 2 of 4', color: C.bad,
        rows: [['From', 'Unknown device · 7e:11:0a:33:9c:42'], ['To', 'Router'], ['Carries', 'SNonce + MIC'], ['Check', 'MIC ✗ mismatch']],
        note: 'Wrong password gives a wrong key, so the signature cannot match.' });
      await wait(500); if (!ok()) return;
      await fly({ from: intrPort, to: routerPort, color: C.bad, label: 'JOIN? (wrong key)', h: 2 }); if (!ok()) return;
      sfx.bad(); burst(routerPort, C.bad);
      inspect({ name: 'Deauthentication', color: C.bad,
        rows: [['From', 'Router'], ['To', 'Unknown device'], ['Reason', 'Handshake failed'], ['Result', 'Not allowed on the network']],
        note: 'Repeated failures can also lock the device out for a while.' });
      await fly({ from: routerPort, to: intrPort, color: C.bad, label: 'REJECTED', h: 2 }); if (!ok()) return;
      intrTag.chips([['BLOCKED', 'bad']]);
    },
    post(s) { s.intruder = true; },
  },
  {
    title: 'D · Discover: "Mujhe address chahiye!"',
    layers: [7, 4, 3, 2], cam: CAM.bcast,
    text: 'Wi-Fi se jud gaye, par phone ke paas abhi apna <b>IP address</b> nahi hai. Jaise naye mohalle mein aaye ho aur ghar ka number nahi mila. Phone sabko chillake bolta hai: <b>"Koi DHCP server hai? Mujhe IP chahiye!"</b> Yeh <b>broadcast</b> hai, ghar ke har device tak jaata hai. TV aur laptop sun ke ignore kar dete hain.',
    async play(ok) {
      inspect({ name: 'DHCP DISCOVER', color: C.dhcp,
        rows: [['Layer', 'L7 DHCP over UDP'], ['From', '0.0.0.0 : 68 (no IP yet)'], ['To', '255.255.255.255 : 67'], ['To MAC', 'ff:ff:ff:ff:ff:ff (everyone)'], ['Asks', 'Any DHCP server here?']],
        note: 'The phone has no IP yet, so it uses 0.0.0.0 as its own address.' });
      await wait(400); if (!ok()) return;
      const a = fly({ from: phonePort, to: routerPort, color: C.dhcp, label: 'DISCOVER' });
      const b = fly({ from: phonePort, to: lapPort, color: C.dhcp, label: 'DISCOVER', h: 0.8 });
      const c = fly({ from: phonePort, to: tvPort, color: C.dhcp, label: 'DISCOVER', h: 1 });
      await Promise.all([a, b, c]); if (!ok()) return;
      sfx.land();
      lapTag.chips([['ignored', 'dim']]); tvTag.chips([['ignored', 'dim']]); routerTag.chips([['KEY ✓', 'key'], ['for me!', 'ok']]);
      await wait(1600);
      lapTag.chips([]); tvTag.chips([]);
    },
    post(s) { s.dhcp = 1; },
  },
  {
    title: 'O · Offer: "Yeh lo 192.168.1.5"',
    layers: [7, 4, 3, 2], cam: CAM.hand,
    text: 'Router (jo ghar ka <b>DHCP server</b> bhi hai) jawab deta hai: <b>"192.168.1.5 le lo, 24 ghante ke liye."</b> Saath mein subnet mask, <b>gateway</b> (bahar jaane ka darwaza, yaani router khud) aur DNS server ka address bhi deta hai.',
    async play(ok) {
      routerTag.chips([['KEY ✓', 'key']]);
      inspect({ name: 'DHCP OFFER', color: C.dhcp,
        rows: [['From', '192.168.1.1 : 67'], ['To', 'Phone · 3c:a6:f6:12:7b:01'], ['Offers IP', '192.168.1.5'], ['Mask', '255.255.255.0'], ['Gateway', '192.168.1.1'], ['DNS', '192.168.1.1'], ['Lease', '24 hours']],
        note: 'A lease is a rental: after 24 hours the phone must renew it.' });
      await fly({ from: routerPort, to: phonePort, color: C.dhcp, label: 'OFFER 192.168.1.5' }); if (!ok()) return;
      sfx.land();
    },
    post(s) { s.dhcp = 2; },
  },
  {
    title: 'R · Request: "Haan, mujhe yahi chahiye"',
    layers: [7, 4, 3, 2], cam: CAM.bcast,
    text: 'Phone kehta hai: <b>"Haan, mujhe 192.168.1.5 chahiye."</b> Yeh bhi broadcast hota hai, taaki agar network pe koi doosra DHCP server bhi offer de raha ho, toh use pata chal jaaye ki phone ne kiska offer chuna.',
    async play(ok) {
      inspect({ name: 'DHCP REQUEST', color: C.dhcp,
        rows: [['From', '0.0.0.0 : 68'], ['To', '255.255.255.255 : 67'], ['Wants IP', '192.168.1.5'], ['Chosen server', '192.168.1.1']],
        note: 'Still no IP of its own until the router confirms.' });
      const a = fly({ from: phonePort, to: routerPort, color: C.dhcp, label: 'REQUEST .5' });
      const b = fly({ from: phonePort, to: lapPort, color: C.dhcp, label: 'REQUEST', h: 0.8 });
      const c = fly({ from: phonePort, to: tvPort, color: C.dhcp, label: 'REQUEST', h: 1 });
      await Promise.all([a, b, c]); if (!ok()) return;
      sfx.land();
    },
    post(s) { s.dhcp = 3; },
  },
  {
    title: 'A · Acknowledge: Phone online! ✅',
    layers: [7, 4, 3, 2], cam: CAM.phone,
    text: 'Router confirm karta hai: <b>"Pakka, 192.168.1.5 ab tumhara."</b> Phone ab internet pe hai, aur WhatsApp khul sakta hai! Yaad rakhne ki trick: <b>DORA</b> = Discover, Offer, Request, Acknowledge.',
    async play(ok) {
      inspect({ name: 'DHCP ACK', color: C.ok,
        rows: [['From', '192.168.1.1 : 67'], ['To', '192.168.1.5 : 68'], ['Confirms', '192.168.1.5 for 24 h'], ['Result', 'Phone is online']],
        note: 'The phone can now send packets with a real source address.' });
      await fly({ from: routerPort, to: phonePort, color: C.ok, label: 'ACK ✓' }); if (!ok()) return;
      patch({ ip: '192.168.1.5', connected: true }); sfx.good(); burst(phonePort, C.ok);
    },
    post(s) { s.ip = '192.168.1.5'; s.connected = true; },
  },
  {
    title: 'Scene 1 ka quiz 🎯',
    layers: [], cam: CAM.over,
    text: 'Ab dekhte hain kitna yaad raha! 5 sawaal, har sahi jawab pe <b>+10 XP</b>. Quiz ke baad agla scene: <b>DNS</b>, jahan phone pata karega ki WhatsApp ka server kahan rehta hai.',
    async play() {
      inspect({ name: 'Phone online', color: C.ok,
        rows: [['IP', '192.168.1.5'], ['Gateway', '192.168.1.1'], ['Wi-Fi', 'WPA2 · encrypted'], ['Next', 'DNS lookup']],
        note: 'Small purple dots on the link are keep-alive frames between phone and router.' });
    },
    post() {}, quiz: true,
  },
];
BEATS.forEach(b => { b.scene = 1; });

const QUERY_ROWS = [['Layer', 'L7 DNS over UDP'], ['Question', 'g.whatsapp.net · type A'], ['Query ID', '0x3f2a']];
function askAndRefer(ok, srv, askRows, reply) {
  return (async () => {
    inspect({ name: 'DNS QUERY', color: C.dhcp, rows: QUERY_ROWS.concat(askRows), note: 'The resolver asks on behalf of the phone (iterative lookup).' });
    await fly({ from: resolver.port, to: srv.port, color: C.dhcp, label: 'g.whatsapp.net ?', h: 3, dur: 1.8 }); if (!ok()) return false;
    sfx.land(); await wait(350); if (!ok()) return false;
    inspect(reply.info);
    await fly({ from: srv.port, to: resolver.port, color: reply.color, label: reply.label, h: 3, dur: 1.8 }); if (!ok()) return false;
    sfx.land(); return true;
  })();
}
BEATS.push(
  {
    scene: 2, title: 'WhatsApp khola, par server kahan hai?',
    layers: [7], cam: CAM.phone,
    text: 'Henna <b>WhatsApp</b> kholti hai. App ko apne chat server se baat karni hai, jiska naam hai <b>g.whatsapp.net</b>. Par internet naamon se nahi, <b>IP address</b> se chalta hai, jaise phone mein "Mummy" save hota hai par call number pe lagti hai. Naam ko number mein badalne wala system hai <b>DNS</b>, internet ki phonebook. Pehle phone apni yaadash (<b>cache</b>) dekhta hai: kuch nahi mila.',
    async play(ok) {
      patch({ app: true });
      inspect({ name: 'DNS cache check', color: C.wifi,
        rows: [['Looking for', 'g.whatsapp.net'], ['Phone cache', 'empty (first time)'], ['Next step', 'Ask the DNS server']],
        note: 'Every app and website starts with a name. DNS turns that name into an IP address.' });
      await wait(900); if (!ok()) return;
      burst(phonePort, C.wifi); sfx.land();
    },
    post(s) { s.app = true; },
  },
  {
    scene: 2, title: 'Sawaal ghar se bahar nikla',
    layers: [7, 4, 3], cam: CAM.toRes,
    text: 'Phone apne DNS server (router, 192.168.1.1) se poochta hai: <b>"g.whatsapp.net ka IP kya hai?"</b> Yeh chhota sa packet <b>UDP port 53</b> pe jaata hai. Router ise ghar se bahar <b>ISP ke DNS resolver</b> tak bhej deta hai. Resolver ek <b>librarian</b> jaisa hai: jawab khud dhoondh ke laayega.',
    async play(ok) {
      inspect({ name: 'DNS QUERY', color: C.dhcp,
        rows: QUERY_ROWS.concat([['From', '192.168.1.5 : 51034'], ['To', '192.168.1.1 : 53'], ['Flags', 'Recursion desired']]),
        note: '"Recursion desired" means: please find the full answer for me.' });
      await fly({ from: phonePort, to: routerPort, color: C.dhcp, label: 'g.whatsapp.net ?' }); if (!ok()) return;
      inspect({ name: 'DNS QUERY (forwarded)', color: C.dhcp,
        rows: QUERY_ROWS.concat([['From', '198.51.100.24 : 40122 (home public IP)'], ['To', '203.0.113.53 : 53 (ISP resolver)']]),
        note: 'IP addresses outside the home are examples from reserved test ranges.' });
      await fly({ from: routerPort, to: resolver.port, color: C.dhcp, label: 'g.whatsapp.net ?', h: 3, dur: 2.2 }); if (!ok()) return;
      sfx.land(); resolver.tag.chips([['cache: empty', 'dim']]);
    },
    post() {},
  },
  {
    scene: 2, title: 'Root server: "Mujhe nahi pata, .net walon se poocho"',
    layers: [7, 4, 3], cam: CAM.root,
    text: 'Resolver ke cache mein bhi jawab nahi hai, toh woh sabse upar se shuru karta hai: <b>root server</b>. Duniya mein 13 root server naam hain (a se m tak), aur unki <b>hazaron copies</b> alag-alag shehron mein. Root ko poora address nahi pata, par woh batata hai ki <b>.net</b> wale servers kahan milenge. Ise <b>referral</b> kehte hain, jaise reception wala bole "teesri manzil pe poochiye".',
    async play(ok) {
      resolver.tag.chips([['cache: empty', 'dim']]);
      await askAndRefer(ok, rootSrv, [['From', 'ISP resolver'], ['To', 'a.root-servers.net : 53']], {
        color: C.packet, label: 'ask .net →',
        info: { name: 'REFERRAL from root', color: C.packet,
          rows: [['From', 'a.root-servers.net'], ['Answer', 'none'], ['Referral', '.net → a.gtld-servers.net'], ['Glue IP', 'address of that server']],
          note: 'Root servers only know who runs each top-level domain.' },
      });
    },
    post() {},
  },
  {
    scene: 2, title: '.net server: "whatsapp.net ka server yeh raha"',
    layers: [7, 4, 3], cam: CAM.tld,
    text: 'Ab resolver <b>.net TLD server</b> se poochta hai. TLD yaani <b>Top Level Domain</b>: .com, .net, .in jaise. Yeh bhi poora jawab nahi deta, par batata hai ki <b>whatsapp.net</b> ka apna DNS server kaunsa hai: <b>a.ns.whatsapp.net</b>.',
    async play(ok) {
      await askAndRefer(ok, tldSrv, [['From', 'ISP resolver'], ['To', 'a.gtld-servers.net : 53']], {
        color: 0x7aa2ff, label: 'ask a.ns.whatsapp.net →',
        info: { name: 'REFERRAL from .net', color: 0x7aa2ff,
          rows: [['From', 'a.gtld-servers.net'], ['Answer', 'none'], ['Referral', 'whatsapp.net → a.ns.whatsapp.net']],
          note: 'The TLD server knows which name servers each domain uses.' },
      });
    },
    post() {},
  },
  {
    scene: 2, title: 'WhatsApp ka DNS: asli jawab!',
    layers: [7, 4, 3], cam: CAM.auth,
    text: 'Aakhir mein resolver <b>whatsapp.net ke authoritative server</b> se poochta hai. Yeh WhatsApp ka apna DNS server hai, iske paas <b>pakka jawab</b> hai: <b>g.whatsapp.net = 157.240.16.60</b>. Saath mein <b>TTL 300</b> aata hai, yaani yeh jawab 300 second tak yaad rakh sakte ho.',
    async play(ok) {
      await askAndRefer(ok, authSrv, [['From', 'ISP resolver'], ['To', 'a.ns.whatsapp.net : 53']], {
        color: C.ok, label: '157.240.16.60 ✓',
        info: { name: 'DNS ANSWER', color: C.ok,
          rows: [['From', 'a.ns.whatsapp.net'], ['Answer', 'g.whatsapp.net  A  157.240.16.60'], ['TTL', '300 seconds'], ['Authoritative', 'Yes']],
          note: 'Example IP from Meta\'s address range. Real answers change by location.' },
      });
    },
    post() {},
  },
  {
    scene: 2, title: 'Jawab wapas, aur yaad bhi rakh liya',
    layers: [7, 4, 3], cam: CAM.back,
    text: 'Resolver jawab phone tak wapas bhejta hai aur use apne <b>cache</b> mein rakh leta hai. Phone bhi yaad rakh leta hai. Yeh poori daud lagbhag <b>20 se 100 milliseconds</b> mein ho jaati hai! Agli baar koi bhi poochega toh jawab <b>cache</b> se turant milega. Resolver ke upar <b>TTL</b> ki ulti ginti dekho.',
    async play(ok) {
      inspect({ name: 'DNS ANSWER', color: C.ok,
        rows: [['From', '203.0.113.53 : 53'], ['To', '192.168.1.5 : 51034'], ['Answer', 'g.whatsapp.net = 157.240.16.60'], ['Query ID', '0x3f2a ✓ matches']],
        note: 'The phone only accepts an answer whose ID and port match its question.' });
      await fly({ from: resolver.port, to: routerPort, color: C.ok, label: '157.240.16.60', h: 3, dur: 2.2 }); if (!ok()) return;
      await fly({ from: routerPort, to: phonePort, color: C.ok, label: '157.240.16.60' }); if (!ok()) return;
      patch({ dns: true }); sfx.good(); burst(phonePort, C.ok);
    },
    post(s) { s.dns = true; },
  },
  {
    scene: 2, title: 'Hamla: nakli jawab (DNS spoofing)',
    layers: [7, 4, 3], cam: CAM.hack,
    text: 'Ek hacker resolver ko <b>nakli jawab</b> bhejta hai: "g.whatsapp.net = 203.0.113.66" (uska apna server). Agar yeh chal jaata, toh Henna ka message hacker ke paas jaata! Bachav: resolver har sawaal mein <b>random Query ID aur port</b> lagata hai, nakli jawab ka ID match nahi hua toh <b>drop</b>. <b>DNSSEC</b> wale domains ke jawab pe digital signature bhi hota hai, aur <b>DNS over HTTPS</b> sawaal-jawab ko encrypt kar deta hai.',
    async play(ok) {
      setVis(hacker, true); hackTag.chips([]); setVis(shield, false);
      inspect({ name: 'FAKE DNS ANSWER', color: C.bad,
        rows: [['From', 'Attacker (pretends to be a.ns.whatsapp.net)'], ['Answer', 'g.whatsapp.net = 203.0.113.66'], ['Query ID', '0x91c4 ✗ (expected 0x3f2a)'], ['Signature', 'missing ✗']],
        note: 'Spoofing works only if the fake reply guesses the right ID and port first.' });
      await wait(500); if (!ok()) return;
      await fly({ from: hackPort, to: resolver.port, color: C.bad, label: 'FAKE: 203.0.113.66', h: 2.5, dur: 2 }); if (!ok()) return;
      sfx.bad(); burst(resolver.port, C.bad);
      setVis(shield, true); hackTag.chips([['DROPPED', 'bad']]);
      inspect({ name: 'Fake answer dropped', color: C.ok,
        rows: [['Reason', 'Query ID and port do not match'], ['Kept answer', '157.240.16.60 (real)'], ['Extra safety', 'WhatsApp key check in Scene 3']],
        note: 'Even a fake server would fail later: it cannot prove it holds WhatsApp\'s private key.' });
    },
    post(s) { s.hacker = true; s.spoofBlocked = true; },
  },
  {
    scene: 2, title: 'Scene 2 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.city,
    text: 'Poora DNS ka safar ek nazar mein: phone → router → resolver → root → .net → whatsapp.net → wapas. Ab <b>5 sawaal</b>, har sahi jawab pe <b>+10 XP</b>. Is ke baad Scene 3: <b>TCP handshake</b>, jahan phone WhatsApp server se pehli baar haath milayega.',
    async play() {
      inspect({ name: 'Lookup complete', color: C.ok,
        rows: [['Name', 'g.whatsapp.net'], ['IP', '157.240.16.60'], ['Asked', 'root → .net → whatsapp.net'], ['Next', 'TCP handshake on port 443']],
        note: 'The resolver label counts down the TTL. When it reaches zero the answer is fetched again.' });
    },
    post() {},
  }
);

// Three hops: phone -> router -> across the internet -> WhatsApp server (and back)
async function toServer(ok, color, label, dur) {
  await fly({ from: phonePort, to: routerPort, color, label, dur: 1.1 }); if (!ok()) return false;
  await fly({ from: routerPort, to: waSrv.port, color, label, h: 7, dur: dur || 2.4 }); if (!ok()) return false;
  sfx.land(); return true;
}
async function toPhone(ok, color, label, dur) {
  await fly({ from: waSrv.port, to: routerPort, color, label, h: 7, dur: dur || 2.4 }); if (!ok()) return false;
  await fly({ from: routerPort, to: phonePort, color, label, dur: 1.1 }); if (!ok()) return false;
  sfx.land(); return true;
}
const PORTS = ['From', '192.168.1.5 : 51234'], PORTD = ['To', '157.240.16.60 : 443'];
BEATS.push(
  {
    scene: 3, title: 'Pehle haath milana zaroori hai',
    layers: [4], cam: CAM.s3wide,
    text: 'Phone ko ab server ka IP pata hai: <b>157.240.16.60</b>. Par data bhejne se pehle ek pakka <b>connection</b> banana padta hai, taaki kuch kho jaaye toh pata chale. Yeh kaam <b>TCP</b> (Layer 4) karta hai. Socho IP address ek <b>building ka pata</b> hai aur <b>port</b> us building ka <b>flat number</b>. WhatsApp server flat <b>443</b> pe sun raha hai, aur phone apne liye ek random flat <b>51234</b> chunta hai.',
    async play(ok) {
      patch({ port: true });
      inspect({ name: 'Socket pair', color: C.packet,
        rows: [['Phone', '192.168.1.5 : 51234 (random)'], ['Server', '157.240.16.60 : 443'], ['Protocol', 'TCP'], ['Server state', 'LISTEN']],
        note: 'A socket is IP + port. Two sockets together name one connection.' });
      await wait(700); if (!ok()) return;
      burst(waSrv.port, 0x25d366); sfx.land();
    },
    post(s) { s.port = true; },
  },
  {
    scene: 3, title: '1 · SYN: "Hello, baat karoge?"',
    layers: [4, 3], cam: CAM.s3mid,
    text: 'Phone pehla packet bhejta hai jismein sirf <b>SYN</b> flag laga hai, matlab "synchronize, baat shuru karein?" Saath mein ek <b>random sequence number</b> (Seq 2,904,117) bhejta hai. Yeh number aage har byte ki ginti ke kaam aayega, jaise parcel pe likha serial number.',
    async play(ok) {
      inspect({ name: 'TCP SYN', color: C.packet,
        rows: [PORTS, PORTD, ['Flags', 'SYN'], ['Seq', '2,904,117 (random)'], ['Window', '65,535 bytes'], ['MSS', '1460 bytes']],
        note: 'The starting number is random so attackers cannot guess it.' });
      await toServer(ok, C.packet, 'SYN · seq 2904117');
    },
    post(s) { s.tcp = 1; },
  },
  {
    scene: 3, title: '2 · SYN-ACK: "Haan, sun raha hoon"',
    layers: [4, 3], cam: CAM.s3mid,
    text: 'Server jawab deta hai <b>SYN + ACK</b>. ACK number <b>2,904,118</b> hai, yaani phone ka number <b>+1</b>: "tumhara SYN mil gaya, ab agla yeh bhejna." Saath mein server apna random number (Seq 8,551,302) bhi bhejta hai.',
    async play(ok) {
      inspect({ name: 'TCP SYN-ACK', color: C.packet,
        rows: [['From', '157.240.16.60 : 443'], ['To', '192.168.1.5 : 51234'], ['Flags', 'SYN, ACK'], ['Seq', '8,551,302 (server\'s own)'], ['Ack', '2,904,118 = phone Seq + 1']],
        note: 'The server keeps a half-open slot for this phone until the final ACK arrives.' });
      await toPhone(ok, C.packet, 'SYN-ACK · ack 2904118');
    },
    post(s) { s.tcp = 2; },
  },
  {
    scene: 3, title: '3 · ACK: connection pakka! 🤝',
    layers: [4, 3], cam: CAM.s3wide,
    text: 'Phone aakhri <b>ACK</b> bhejta hai: Ack <b>8,551,303</b> (server ka number +1). Bas! <b>3-way handshake</b> poora, connection <b>ESTABLISHED</b>. Poore mein ek round trip laga, lagbhag <b>30 se 80 milliseconds</b>. Ab phone aur server ke beech ek pakki line ban gayi hai (peeli pipe).',
    async play(ok) {
      inspect({ name: 'TCP ACK', color: C.ok,
        rows: [PORTS, PORTD, ['Flags', 'ACK'], ['Seq', '2,904,118'], ['Ack', '8,551,303 = server Seq + 1'], ['State', 'ESTABLISHED']],
        note: 'SYN, SYN-ACK, ACK. Like "Hello?" "Haan, sun raha hoon, tum sun rahe ho?" "Haan!"' });
      await toServer(ok, C.ok, 'ACK · ack 8551303'); if (!ok()) return;
      patch({ tcp: 3 }); sfx.good();
    },
    post(s) { s.tcp = 3; },
  },
  {
    scene: 3, title: 'Server ki pehchaan + taala (Noise handshake)',
    layers: [6, 5, 4], cam: CAM.s3srv,
    text: 'TCP sirf line banata hai, <b>suraksha nahi</b> deta. Isliye ab ek doosra handshake hota hai. WhatsApp yahan <b>Noise protocol</b> use karta hai (normal websites pe yahi kaam <b>TLS 1.3</b> karta hai). Phone aur server <b>temporary keys</b> badalte hain, aur server prove karta hai ki uske paas <b>WhatsApp ki asli private key</b> hai. Proof sahi nikla, toh dono ek session key bana lete hain aur pipe <b>bangni (encrypted)</b> ho jaati hai.',
    async play(ok) {
      inspect({ name: 'Noise · message 1', color: C.crypto,
        rows: [PORTS, PORTD, ['Carries', 'Phone\'s temporary public key'], ['Key type', 'Curve25519']],
        note: 'A fresh temporary key is made for every connection.' });
      await toServer(ok, C.crypto, 'hello + temp key', 2); if (!ok()) return;
      inspect({ name: 'Noise · message 2', color: C.crypto,
        rows: [['From', '157.240.16.60 : 443'], ['Carries', 'Server temp key + proof'], ['Proof', 'Made with WhatsApp\'s private key'], ['Phone check', 'Proof valid ✓']],
        note: 'Only the real WhatsApp server can make this proof. Websites use a TLS certificate for the same job.' });
      await toPhone(ok, C.crypto, 'temp key + proof ✓', 2); if (!ok()) return;
      sfx.lock();
      inspect({ name: 'Noise · message 3', color: C.crypto,
        rows: [PORTS, PORTD, ['Carries', 'Phone\'s identity (encrypted)'], ['Result', 'Session keys ready']],
        note: 'From here on, everything on this connection is encrypted (transport encryption).' });
      await toServer(ok, C.crypto, 'finish (encrypted)', 2); if (!ok()) return;
      patch({ secure: true }); sfx.good(); burst(waSrv.port, C.crypto);
    },
    post(s) { s.secure = true; },
  },
  {
    scene: 3, title: 'Packet kho gaya? TCP dobara bhejega',
    layers: [4], cam: CAM.s3mid,
    text: 'Internet pe kabhi-kabhi packet <b>raaste mein kho jaata hai</b> (bheed, kharab signal). Yahan phone ka ek encrypted packet beech mein gaayab ho gaya! Phone ne <b>timer</b> lagaya tha. Time pe <b>ACK nahi aaya</b>, toh TCP wahi packet <b>dobara bhejta hai</b>. Isi wajah se WhatsApp pe message adha-adhura nahi pahunchta.',
    async play(ok) {
      inspect({ name: 'TCP data segment', color: C.crypto,
        rows: [PORTS, PORTD, ['Seq', '2,904,118'], ['Length', '120 bytes (encrypted)'], ['Status', 'sent, waiting for ACK']],
        note: 'The phone starts a retransmission timer for every segment it sends.' });
      await fly({ from: phonePort, to: routerPort, color: C.crypto, label: 'seq 2904118', dur: 1.1 }); if (!ok()) return;
      const r = await fly({ from: routerPort, to: waSrv.port, color: C.crypto, label: 'seq 2904118', h: 7, dur: 2.4, lose: 0.5 }); if (!ok()) return;
      if (r === 'lost') sfx.bad();
      inspect({ name: 'Timeout: no ACK', color: C.bad,
        rows: [['Waited', 'about 1 round trip + margin'], ['ACK received', 'No ✗'], ['Action', 'Retransmit same segment']],
        note: 'The receiver never saw the lost copy, so nothing is duplicated.' });
      await wait(1100); if (!ok()) return;
      inspect({ name: 'TCP retransmission', color: C.crypto,
        rows: [PORTS, PORTD, ['Seq', '2,904,118 (same)'], ['Try', '2']], note: 'Same sequence number, so the server knows it is the same data.' });
      await toServer(ok, C.crypto, 'seq 2904118 · retry'); if (!ok()) return;
      inspect({ name: 'TCP ACK', color: C.ok,
        rows: [['From', '157.240.16.60 : 443'], ['Ack', '2,904,238 = 2,904,118 + 120'], ['Meaning', 'Got 120 bytes, send the next ones']],
        note: 'ACK numbers count bytes received, not packets.' });
      await toPhone(ok, C.ok, 'ACK 2904238'); if (!ok()) return;
      sfx.good();
    },
    post() {},
  },
  {
    scene: 3, title: 'Agar DNS spoof ho jaata toh?',
    layers: [6, 4], cam: CAM.s3hack,
    text: 'Socho Scene 2 wala hacker kamyaab ho jaata aur phone uske server se jud jaata. <b>TCP handshake toh ho jaata</b>, kyunki TCP koi pehchaan check nahi karta! Par Noise handshake mein hacker <b>WhatsApp ki private key ka proof nahi de sakta</b>. Proof galat, toh phone turant connection <b>tod deta hai</b>. Isiliye encryption sirf chhupane ke liye nahi, <b>pehchaan</b> ke liye bhi hai.',
    async play(ok) {
      setVis(hacker, true); hackTag.chips([]);
      inspect({ name: 'TCP to fake server', color: C.packet,
        rows: [['To', '203.0.113.66 : 443 (attacker)'], ['SYN / SYN-ACK / ACK', 'works ✓'], ['Identity checked?', 'Not by TCP']], note: 'TCP only checks that bytes arrive in order.' });
      await fly({ from: phonePort, to: hackPort, color: C.packet, label: 'SYN', h: 3, dur: 1.4 }); if (!ok()) return;
      await fly({ from: hackPort, to: phonePort, color: C.packet, label: 'SYN-ACK', h: 3, dur: 1.4 }); if (!ok()) return;
      await fly({ from: phonePort, to: hackPort, color: C.crypto, label: 'hello + temp key', h: 3, dur: 1.4 }); if (!ok()) return;
      inspect({ name: 'Fake proof', color: C.bad,
        rows: [['From', 'Attacker'], ['Proof', 'Not signed by WhatsApp\'s key'], ['Phone check', 'Invalid ✗'], ['Action', 'Close connection (TCP RST)']],
        note: 'No message, no keys and no data ever reach the fake server.' });
      await fly({ from: hackPort, to: phonePort, color: C.bad, label: 'fake proof ✗', h: 3, dur: 1.4 }); if (!ok()) return;
      sfx.bad(); burst(phonePort, C.bad);
      await fly({ from: phonePort, to: hackPort, color: C.bad, label: 'RST · bye', h: 3, dur: 1.2 }); if (!ok()) return;
      hackTag.chips([['DROPPED', 'bad'], ['NO KEY ✗', 'bad']]);
    },
    post(s) { s.fakeClosed = true; },
  },
  {
    scene: 3, title: 'Scene 3 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.s3wide,
    text: 'Phone aur WhatsApp server ke beech ab ek <b>pakki aur encrypted</b> line hai. Pipe pe safed dots asli data aur ACK ki tarah aate-jaate rehte hain. Ab <b>5 sawaal</b>, phir Scene 4: <b>End-to-end encryption</b>, jahan "Hi" pe aisa taala lagega jo sirf Riya khol sakti hai.',
    async play() {
      inspect({ name: 'Connection ready', color: C.crypto,
        rows: [['Phone', '192.168.1.5 : 51234'], ['Server', '157.240.16.60 : 443'], ['TCP', 'ESTABLISHED'], ['Transport', 'Encrypted (Noise)']],
        note: 'The same connection stays open so new messages arrive instantly.' });
    },
    post() {},
  }
);

function mix(ok, at) {
  return new Promise(res => {
    setVis(orbHenna, true); setVis(orbRiya, true); if (!at) setVis(orbSecret, false);
    mixAnim = { t: 0, res, ok, at: at || mixAt };
  });
}
let mixAnim = null;
const CIPHER = '8f2a91c4e7d0…b35c91e';
BEATS.push(
  {
    scene: 4, title: 'Riya ne pehle hi apne "khule taale" rakh diye',
    layers: [7, 6], cam: CAM.s4riya,
    text: 'Yeh hai <b>Riya</b>, Henna ki dost, doosre shehar mein. Jab Riya ne WhatsApp install kiya tha, uske phone ne do tarah ki chaabiyan banayi: <b>private key</b> jo kabhi phone se bahar nahi jaati, aur <b>public keys</b> jo usne WhatsApp server pe rakh di. Socho Riya ne server pe bahut saare <b>khule taale</b> rakh diye, jinki chaabi sirf uske paas hai.',
    async play(ok) {
      inspect({ name: 'Key upload (at install)', color: 0x25d366,
        rows: [['From', 'Riya\'s phone'], ['To', 'WhatsApp server'], ['Identity key', 'public part only'], ['Signed prekey', 'public + signature'], ['One-time prekeys', '100 public keys']],
        note: 'Private keys are created on the phone and never uploaded.' });
      await wait(500); if (!ok()) return;
      await fly({ from: riyaPort, to: waSrv.port, color: 0x25d366, label: 'public keys (khule taale)', h: 6, dur: 2.2 }); if (!ok()) return;
      sfx.land(); patch({ riyaKeys: true });
    },
    post(s) { s.riyaKeys = true; },
  },
  {
    scene: 4, title: 'Henna ne Riya ka ek taala maanga',
    layers: [7, 6], cam: CAM.s4keys,
    text: 'Henna "Hi" likhti hai. Pehli baar Riya ko message bhej rahi hai, toh phone server se poochta hai: <b>"Riya ki public keys do."</b> Server Riya ka <b>key bundle</b> bhejta hai. Phone check karta hai ki bundle pe <b>Riya ka signature</b> sahi hai, taaki koi beech mein nakli taala na thama de.',
    async play(ok) {
      patch({ bundle: true });
      inspect({ name: 'Key bundle request', color: C.crypto,
        rows: [['From', 'Henna\'s phone'], ['To', 'WhatsApp server'], ['Asks for', 'Riya\'s prekey bundle'], ['Travels inside', 'encrypted pipe (Scene 3)']],
        note: 'This happens once per new chat, not for every message.' });
      await toServer(ok, C.crypto, 'Riya ki keys?', 2); if (!ok()) return;
      inspect({ name: 'Riya\'s key bundle', color: 0x25d366,
        rows: [['Identity key', 'Riya · public'], ['Signed prekey', 'public + Riya\'s signature ✓'], ['One-time prekey', '#47 (used once, then deleted)']],
        note: 'The server hands out public keys only. It cannot open anything locked with them.' });
      await toPhone(ok, 0x25d366, 'Riya ki public keys', 2); if (!ok()) return;
      sfx.good();
    },
    post(s) { s.bundle = true; },
  },
  {
    scene: 4, title: 'Rangon ka jaadu: ek secret dono ke paas',
    layers: [6], cam: CAM.s4henna,
    text: 'Ab Henna ka phone ek jaadu karta hai jise <b>X3DH</b> kehte hain. Socho do rang: Henna ka <b>peela</b> (uski private key) aur Riya ka <b>hara</b> (uski public key). Dono milke <b>bangni rang</b> bante hain: <b>shared secret</b>. Riya baad mein apne private key aur Henna ki public key se <b>wahi bangni rang</b> bana legi. Beech mein dekhne wala yeh rang <b>kabhi nahi</b> bana sakta.',
    async play(ok) {
      inspect({ name: 'X3DH key agreement', color: C.crypto,
        rows: [['Inputs', 'Henna private keys + Riya public keys'], ['Steps', '4 Diffie-Hellman calculations'], ['Output', '32-byte shared secret'], ['Sent on network?', 'Never']],
        note: 'Riya gets the same secret from her private keys and Henna\'s public keys.' });
      await mix(ok); if (!ok()) return;
      patch({ secret: true }); sfx.lock(); burst(mixAt, C.crypto);
    },
    post(s) { s.secret = true; },
  },
  {
    scene: 4, title: '"Hi" pe pehla taala (end-to-end)',
    layers: [6], cam: CAM.s4henna,
    text: 'Shared secret se ek <b>message key</b> banti hai, aur usse <b>"Hi"</b> ko <b>AES-256</b> se lock kiya jaata hai. "Hi" ab <b>8f2a91c4e7…</b> jaisa bekaar dikhne wala data ban gaya. Yeh <b>andar wala taala</b> hai: ise sirf <b>Riya ka phone</b> khol sakta hai. WhatsApp bhi nahi.',
    async play(ok) {
      inspect({ name: 'Encrypting "Hi"', color: C.crypto,
        rows: [['Plaintext', 'Hi'], ['Key', 'message key #1'], ['Cipher', 'AES-256 + HMAC-SHA256'], ['Ciphertext', CIPHER]],
        note: 'The HMAC is a seal: if anyone changes even one bit, Riya\'s phone will notice.' });
      const p = makePacket(0xffffff, 'Hi', 0.22); p.position.copy(phonePort).add(new THREE.Vector3(0, 0.6, 0));
      await wait(1200); dropPacket(p); if (!ok()) return;
      const q = makePacket(C.crypto, '🔒 ' + CIPHER.slice(0, 10), 0.26); q.position.copy(phonePort).add(new THREE.Vector3(0, 0.6, 0));
      burst(q.position, C.crypto); sfx.lock();
      await wait(1500); dropPacket(q); if (!ok()) return;
      patch({ locked: true });
    },
    post(s) { s.locked = true; },
  },
  {
    scene: 4, title: 'Do taale: lifafe ke andar lifafa',
    layers: [7, 6, 4], cam: CAM.s3srv,
    text: 'Ab yeh locked "Hi" <b>Scene 3 wali encrypted pipe</b> mein daala jaata hai, yaani uske upar <b>doosra taala</b>. Server pe <b>bahar wala taala</b> khulta hai, taaki server jaane ki message <b>kisko</b> dena hai. Par <b>andar wala taala</b> band hi rehta hai. Server ko dikhta hai: "Henna se Riya ko, 64 bytes, 10:24 baje". Shabd nahi.',
    async play(ok) {
      inspect({ name: 'Message envelope', color: C.crypto,
        rows: [['Outer lock', 'Noise transport (phone ↔ server)'], ['Inner lock', 'Signal end-to-end (Henna ↔ Riya)'], ['To', 'Riya'], ['Body', CIPHER]],
        note: 'Two layers: the server can open only the outer one.' });
      await toServer(ok, C.crypto, '🔒🔒 Hi', 2.2); if (!ok()) return;
      patch({ held: true }); burst(waSrv.port, C.crypto);
      inspect({ name: 'What the server sees', color: 0x25d366,
        rows: [['From', 'Henna'], ['To', 'Riya'], ['Time', '10:24:07'], ['Size', '64 bytes'], ['Content', CIPHER + ' (cannot read)']],
        note: 'Honest point: the server knows who talks to whom and when (metadata), but not what is said.' });
    },
    post(s) { s.held = true; },
  },
  {
    scene: 4, title: 'Har message ki nayi chaabi (Double Ratchet)',
    layers: [6], cam: CAM.s4henna,
    text: 'Henna doosra message bhejti hai: "Kaise ho?". Iske liye <b>nayi chaabi</b> banti hai, aur purani <b>delete</b> ho jaati hai. Yeh ek <b>ratchet</b> (sirf aage ghoomne wala pahiya) jaisa hai. Agar kisi tarah ek chaabi chori ho bhi jaaye, toh <b>pichhle aur aane wale</b> messages phir bhi safe rehte hain.',
    async play(ok) {
      patch({ ratchet: 1 });
      inspect({ name: 'Double Ratchet', color: C.crypto,
        rows: [['Message 1', '"Hi" · key #1 → deleted'], ['Message 2', '"Kaise ho?" · key #2'], ['If key #2 leaks', 'key #1 messages stay safe'], ['Name', 'forward secrecy']],
        note: 'Every reply from Riya also brings fresh key material, so the chain heals itself.' });
      await wait(700); if (!ok()) return;
      gearClick += 1; sfx.lock(); patch({ ratchet: 2 });
      await toServer(ok, C.crypto, '🔒🔒 Kaise ho? · key #2', 2); if (!ok()) return;
    },
    post(s) { s.ratchet = 2; },
  },
  {
    scene: 4, title: 'Hacker ne raaste mein copy kar liya toh?',
    layers: [6, 4], cam: CAM.s4hack,
    text: 'Hacker pipe ke beech se packet ki <b>copy</b> chura leta hai. Par use kya milta hai? Pehle <b>bahar ka taala</b> (Noise), uske andar <b>andar ka taala</b> (Signal). Dono ke bina sirf <b>8f2a91c4e7…</b> jaisa kachra. Chaabi Riya ke phone ke alawa <b>kahin bhi nahi</b> hai.',
    async play(ok) {
      setVis(hacker, true);
      inspect({ name: 'Sniffed copy', color: C.bad,
        rows: [['Captured by', 'Attacker'], ['Outer layer', 'Noise ciphertext'], ['Inner layer', 'Signal ciphertext'], ['Readable?', 'No ✗']],
        note: 'This is why public Wi-Fi is far less scary for end-to-end encrypted apps.' });
      await wait(400); if (!ok()) return;
      await fly({ from: sniffAt, to: hackPort, color: C.bad, label: 'copy: 8f2a91c4…', h: 2, dur: 1.8 }); if (!ok()) return;
      sfx.bad(); burst(hackPort, C.bad); patch({ sniffed: true });
    },
    post(s) { s.sniffed = true; },
  },
  {
    scene: 4, title: 'Security code: asli Riya hi hai na?',
    layers: [7, 6], cam: CAM.s4wide,
    text: 'Aakhri suraksha: agar koi <b>server hi</b> Henna ko nakli "Riya ki key" de de toh? Iske liye WhatsApp mein <b>Security code</b> (60 numbers ya QR code) hota hai, jo dono ki keys se banta hai. Henna aur Riya milke <b>QR scan</b> karein ya numbers match karein: same hain toh beech mein koi nahi hai. ✅',
    async play(ok) {
      inspect({ name: 'Security code', color: C.ok,
        rows: [['Made from', 'Henna\'s + Riya\'s identity keys'], ['Looks like', '12 groups of 5 digits / QR'], ['Same on both?', 'Yes ✓ → no middleman'], ['Where', 'Contact info → Encryption']],
        note: 'If Riya reinstalls WhatsApp her keys change, and Henna sees a "security code changed" notice.' });
      await wait(500); if (!ok()) return;
      const a = fly({ from: phonePort, to: riyaPort, color: C.ok, label: '12345 67890 …', h: 12, dur: 2.6 });
      const b = fly({ from: riyaPort, to: phonePort, color: C.ok, label: '12345 67890 …', h: 14, dur: 2.6 });
      await Promise.all([a, b]); if (!ok()) return;
      patch({ verified: true }); sfx.good(); burst(riyaPort, C.ok); burst(phonePort, C.ok);
    },
    post(s) { s.verified = true; },
  },
  {
    scene: 4, title: 'Scene 4 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.s4wide,
    text: '"Hi" ab server pe <b>do taalon</b> mein band intezaar kar raha hai, Riya tak pahunchne ke liye. Ab <b>5 sawaal</b>, phir Scene 5: <b>OSI layers</b>, jahan dekhenge ki "Hi" pe 7 lifafe kaise chadhte hain.',
    async play() {
      inspect({ name: 'Ready to deliver', color: C.crypto,
        rows: [['Message', '"Hi"'], ['Inner lock', 'Only Riya can open'], ['Outer lock', 'Phone ↔ server'], ['Waiting at', 'WhatsApp server']],
        note: 'The ratchet gear keeps turning as new messages are sent.' });
    },
    post() {},
  }
);

function wrapBeat(k, title, text, rows, note) {
  const L = OSI[k];
  return {
    scene: 5, title, text, layers: [L.n], cam: CAM.s5stack,
    async play(ok) {
      inspect({ name: 'L' + L.n + ' · ' + L.name, color: L.c, rows, note });
      await wait(500); if (!ok()) return;
      live.wrap = k + 1; applyState(live); sfx.lock(); burst(STATION, L.c);
    },
    post(s) { s.wrap = k + 1; },
  };
}
BEATS.push(
  {
    scene: 5, title: 'Phone ke andar 7 manzil ki factory',
    layers: [7, 6, 5, 4, 3, 2, 1], cam: CAM.s5stack,
    text: 'Locked "Hi" sirf <b>2 bytes</b> ka text tha. Bhejne se pehle yeh phone ke andar <b>7 manzil</b> neeche utarta hai, aur har manzil uspe ek <b>lifafa (header)</b> chadhati hai, jispe us manzil ka zaroori pata likha hota hai. Ise <b>encapsulation</b> kehte hain. Upar se neeche: L7 se L1. Right side ka <b>Packet anatomy</b> card har lifafa dikhayega.',
    async play(ok) {
      live.wrap = 0; applyState(live);
      inspect({ name: 'Encapsulation', color: 0xffffff,
        rows: [['Start', '"Hi" (2 bytes)'], ['Goes through', 'L7 → L6 → L5 → L4 → L3 → L2 → L1'], ['Each layer adds', 'its own header'], ['At the other end', 'removed in reverse order']],
        note: 'OSI is a teaching model. The real internet uses the TCP/IP model, where L5, L6 and L7 are all part of the app.' });
      await wait(600); if (!ok()) return;
      burst(STATION, 0xffffff); sfx.land();
    },
    post(s) { s.wrap = 0; },
  },
  wrapBeat(0, 'L7 · Application: WhatsApp ka lifafa',
    'Sabse upar <b>WhatsApp app</b> khud. Yeh message ko apne format mein rakhta hai: <b>kisko</b> (Riya ka WhatsApp ID), <b>message ID</b>, time, aur type "text". Yeh woh layer hai jise hum user ke roop mein dekhte hain.',
    [['Layer', 'L7 Application'], ['Added by', 'WhatsApp app'], ['To', 'Riya (WhatsApp ID)'], ['Message ID', '3EB0C4F1…'], ['Type', 'text']],
    'Other L7 protocols you know: HTTP, DNS, DHCP, SMTP.'),
  wrapBeat(1, 'L6 · Presentation: format aur andar ka taala',
    'Yahan data ka <b>format</b> tay hota hai (WhatsApp <b>protobuf</b> naam ka compact format use karta hai), aur yahi woh jagah hai jahan Scene 4 ka <b>end-to-end taala</b> lagta hai. Is layer ko "translator" samjho: data ko aisi shakal deta hai jo doosri taraf samajh aaye.',
    [['Layer', 'L6 Presentation'], ['Encoding', 'protobuf (binary)'], ['Encryption', 'Signal E2E (AES-256)'], ['Size now', 'about 64 bytes']],
    'Compression and character sets (like UTF-8 for Hindi text) also belong here.'),
  wrapBeat(2, 'L5 · Session: baat-cheet chalu rakho',
    'Session layer <b>connection ko zinda</b> rakhti hai: kaunsi baat-cheet chal rahi hai, kab shuru hui, kab band karni hai. WhatsApp ka <b>Noise session</b> (Scene 3 wala bahar ka taala) yahin baitha hai, aur beech-beech mein chhote <b>keep-alive</b> signal bhejta hai taaki line kat na jaaye.',
    [['Layer', 'L5 Session'], ['Session', 'Noise · keys from Scene 3'], ['Outer lock', 'added ✓'], ['Keep-alive', 'every few minutes']],
    'If the app goes to the background, the session can pause and resume without a new handshake.'),
  wrapBeat(3, 'L4 · Transport: TCP ka lifafa',
    'Ab <b>TCP header</b> lagta hai: <b>source port 51234</b>, <b>destination port 443</b>, sequence number, ACK number, flags aur ek <b>checksum</b>. Yaad hai? <b>Port = flat number</b>. Agar data bada hota toh TCP use chhote <b>segments</b> mein kaat deta.',
    [['Layer', 'L4 Transport'], ['Ports', '51234 → 443'], ['Seq / Ack', '2,904,238 / 8,551,303'], ['Flags', 'PSH, ACK'], ['Checksum', '0x6c3e'], ['Name now', 'segment']],
    'UDP is the other L4 protocol: no handshake, no retransmission, faster. DNS and video calls use it.'),
  wrapBeat(4, 'L3 · Network: IP ka lifafa',
    'Ab <b>IP header</b>: <b>From 192.168.1.5</b>, <b>To 157.240.16.60</b>. Yeh hai poore safar ka <b>asli pata</b>, jo shuru se aakhir tak <b>same</b> rehta hai. Saath mein <b>TTL 64</b>: har router pe 1 ghatega, 0 hua toh packet khatam (taaki packet hamesha ke liye na ghoome).',
    [['Layer', 'L3 Network'], ['From IP', '192.168.1.5'], ['To IP', '157.240.16.60'], ['TTL', '64'], ['Protocol', '6 (TCP)'], ['Name now', 'packet']],
    'Routers work at this layer: they only read the IP header to choose the next hop.'),
  {
    scene: 5, title: 'L2 · Data link: pehle ARP se padosi ka MAC',
    layers: [2], cam: CAM.s5arp,
    text: 'Layer 2 ko agle <b>padosi</b> ka hardware address (<b>MAC</b>) chahiye. Padosi kaun? <b>Router</b>, WhatsApp nahi! Phone ghar mein chillata hai: <b>"192.168.1.1 kiska hai?"</b> (ARP). Router bolta hai: "Mera, MAC <b>98:da:c4:5e:21:aa</b>". Ab frame pe phone ka MAC aur router ka MAC lagta hai, aur aakhir mein <b>FCS</b> (galti pakadne wala code). Wi-Fi ka WPA2 taala bhi yahin lagta hai.',
    async play(ok) {
      inspect({ name: 'ARP REQUEST', color: C.wifi,
        rows: [['Layer', 'L2 · ARP'], ['Asks', 'Who has 192.168.1.1?'], ['From MAC', '3c:a6:f6:12:7b:01'], ['To MAC', 'ff:ff:ff:ff:ff:ff (everyone)']],
        note: 'The phone already knows the gateway IP from DHCP. It needs the matching MAC.' });
      const a = fly({ from: phonePort, to: routerPort, color: C.wifi, label: 'ARP: 192.168.1.1?' });
      const b = fly({ from: phonePort, to: lapPort, color: C.wifi, label: 'ARP', h: 0.8 });
      const c = fly({ from: phonePort, to: tvPort, color: C.wifi, label: 'ARP', h: 1 });
      await Promise.all([a, b, c]); if (!ok()) return;
      inspect({ name: 'ARP REPLY', color: C.ok,
        rows: [['From', 'Router'], ['Says', '192.168.1.1 is at 98:da:c4:5e:21:aa'], ['Phone saves', 'ARP cache entry']], note: 'The answer is cached, so ARP is not repeated for every packet.' });
      await fly({ from: routerPort, to: phonePort, color: C.ok, label: '98:da:c4:5e:21:aa' }); if (!ok()) return;
      patch({ arp: true }); sfx.good();
      camTo(CAM.s5stack[0], CAM.s5stack[1]);
      await wait(1200); if (!ok()) return;
      inspect({ name: 'L2 · Data link', color: C.wifi,
        rows: [['Src MAC', '3c:a6:f6:12:7b:01 (phone)'], ['Dst MAC', '98:da:c4:5e:21:aa (router)'], ['Wi-Fi lock', 'WPA2 AES (Scene 1)'], ['Trailer', 'FCS · CRC-32'], ['Name now', 'frame']],
        note: 'MAC addresses change at every hop. IP addresses stay the same end to end.' });
      live.wrap = 6; applyState(live); sfx.lock(); burst(STATION, C.wifi);
    },
    post(s) { s.arp = true; s.wrap = 6; },
  },
  {
    scene: 5, title: 'L1 · Physical: bits ban gaye tarangein',
    layers: [1], cam: CAM.s5air,
    text: 'Aakhri manzil: poora frame ab sirf <b>0 aur 1</b> hai. "Hi" ka "H" = <b>01001000</b>, "i" = <b>01101001</b> (lock hone se pehle). Wi-Fi chip in bits ko <b>2.4 GHz ki radio tarangon</b> mein badal deti hai, yaani har second 2.4 arab baar hilne wali tarang. Wire wale network mein yahi bits <b>bijli</b> ya fibre mein <b>roshni</b> bante hain.',
    async play(ok) {
      inspect({ name: 'L1 · Physical', color: 0xffffff,
        rows: [['"H" (before lock)', '01001000'], ['"i" (before lock)', '01101001'], ['Medium', 'radio waves · 2.4 GHz'], ['Wi-Fi standard', '802.11n · channel 6']],
        note: 'Layer 1 does not understand addresses at all. It only moves bits.' });
      patch({ onAir: true });
      await moveStack(phonePort.clone().add(new THREE.Vector3(0, 0.2, 0)), 1); if (!ok()) return;
      live.wrap = -1; applyState(live);
      await fly({ from: phonePort, to: routerPort, color: C.wifi, label: '0100100001101001…', dur: 2.2 }); if (!ok()) return;
      sfx.land();
    },
    post(s) { s.onAir = true; s.wrap = -1; },
  },
  {
    scene: 5, title: 'Router pe ulta khel: lifafa badla, pata wahi',
    layers: [1, 2, 3], cam: CAM.s5router,
    text: 'Router tarangon ko wapas bits banata hai, <b>FCS check</b> karta hai, Wi-Fi taala kholta hai aur <b>sirf L1, L2 kholke L3 padhta hai</b>: "To 157.240.16.60". Phir purana Wi-Fi lifafa hata ke ISP wale raaste ka <b>naya L2 lifafa</b> (naye MAC) lagata hai. <b>IP address wahi rehta hai</b>, andar ke lifafe chhuye bhi nahi jaate.',
    async play(ok) {
      live.wrap = 6; live.atRouter = false; applyState(live);
      stack.position.copy(routerPort).add(new THREE.Vector3(0, 1.1, 0.6));
      inspect({ name: 'Router: decapsulate', color: C.wifi,
        rows: [['L1', 'radio → bits'], ['L2', 'FCS ✓ · Wi-Fi decrypted · removed'], ['L3', 'To 157.240.16.60 → send to ISP'], ['L4–L7', 'not opened']],
        note: 'Next scene: the router also swaps the private IP for the home\'s public IP (NAT).' });
      await wait(1600); if (!ok()) return;
      live.atRouter = true; applyState(live); sfx.lock(); burst(stack.position, 0xff8a3c);
      inspect({ name: 'Router: new L2 frame', color: 0xff8a3c,
        rows: [['Src MAC', 'router WAN port'], ['Dst MAC', 'ISP equipment'], ['IP (L3)', '157.240.16.60 · unchanged'], ['TTL', '64 → 63']],
        note: 'This rewrap happens at every router on the way, many times per trip.' });
    },
    post(s) { s.wrap = 6; s.atRouter = true; },
  },
  {
    scene: 5, title: 'Scene 5 ka quiz 🎯', quiz: true,
    layers: [7, 6, 5, 4, 3, 2, 1], cam: CAM.s5router,
    text: '"Hi" 2 bytes se lagbhag <b>220 bytes</b> ka ho gaya, 6 lifafon aur tarangon ke saath. Ab <b>5 sawaal</b>, phir Scene 6: <b>Home router aur NAT</b>, jahan router ghar ke private address ko public address se badlega.',
    async play() {
      inspect({ name: 'Layer cheat sheet', color: 0xffffff,
        rows: [['L7–L5', 'app data, format, session'], ['L4', 'ports · TCP / UDP'], ['L3', 'IP addresses · routers'], ['L2', 'MAC addresses · switches'], ['L1', 'bits · cables, radio']],
        note: 'Trick to remember top to bottom: "All People Seem To Need Data Processing".' });
    },
    post(s) { s.quizSeen5 = true; },
  }
);

BEATS.push(
  {
    scene: 6, title: 'Ghar ka address bahar kaam nahi karta',
    layers: [3], cam: CAM.s6router,
    text: '<b>192.168.1.5</b> ek <b>private address</b> hai. Duniya ke crore gharon mein yahi number hai! Jaise har building mein "Flat 5" hota hai, par bahar ki duniya ko building ka <b>pura pata</b> chahiye. ISP ne Henna ke ghar ko ek <b>public IP</b> diya hai: <b>198.51.100.24</b>. Router ke do munh hain: andar (LAN) aur bahar (WAN).',
    async play(ok) {
      patch({ wrap: -1, atRouter: false });
      inspect({ name: 'Private vs public', color: 0xff8a3c,
        rows: [['Private ranges', '10.x · 172.16–31.x · 192.168.x'], ['Henna\'s phone', '192.168.1.5 (private)'], ['Home public IP', '198.51.100.24'], ['Given by', 'ISP (often by DHCP too)']],
        note: 'Internet routers refuse to forward private addresses, so they must be swapped at the edge of the home.' });
      await wait(500); if (!ok()) return;
      await fly({ from: gwPort, to: routerPort, color: 0xff8a3c, label: 'your IP: 198.51.100.24', h: 2.5, dur: 1.8 }); if (!ok()) return;
      patch({ wan: true }); sfx.good();
    },
    post(s) { s.wrap = -1; s.atRouter = false; s.wan = true; },
  },
  {
    scene: 6, title: 'NAT: router ne pata badal diya',
    layers: [3, 4], cam: CAM.s6router,
    text: 'Henna ka packet router pe aata hai: "From <b>192.168.1.5:51234</b>". Router ise bahar bhejne se pehle <b>source</b> badal deta hai: "From <b>198.51.100.24:40001</b>". Aur ek <b>NAT table</b> mein likh leta hai ki 40001 matlab Henna ka phone. Ise <b>NAT</b> (Network Address Translation) kehte hain.',
    async play(ok) {
      inspect({ name: 'Packet inside home', color: C.crypto,
        rows: [['From', '192.168.1.5 : 51234'], ['To', '157.240.16.60 : 443'], ['TTL', '64']], note: 'This is what the phone sent.' });
      await fly({ from: phonePort, to: routerPort, color: C.crypto, label: 'from 192.168.1.5:51234' }); if (!ok()) return;
      natNew = 'phone'; patch({ nat: 1 }); sfx.lock(); burst(routerPort, 0xff8a3c);
      inspect({ name: 'Packet after NAT', color: 0xff8a3c,
        rows: [['From', '198.51.100.24 : 40001 (changed)'], ['To', '157.240.16.60 : 443 (same)'], ['TTL', '63'], ['Checksums', 'recalculated']],
        note: 'Only the outside of the envelope changes. The encrypted "Hi" inside is untouched.' });
      await wait(700); if (!ok()) return;
      await fly({ from: routerPort, to: gwPort, color: 0xff8a3c, label: 'from 198.51.100.24:40001', h: 2.5, dur: 1.8 }); if (!ok()) return;
      sfx.land(); natNew = ''; applyState(live);
    },
    post(s) { s.nat = Math.max(s.nat, 1); },
  },
  {
    scene: 6, title: 'Ek public IP, kai devices (PAT)',
    layers: [3, 4], cam: CAM.s6home,
    text: 'Usi waqt family laptop bhi YouTube chala raha hai, aur ittefaq se usne bhi port <b>51234</b> liya! Koi baat nahi: router laptop ko bahar ka alag port <b>40002</b> de deta hai. Isi tarah ghar ke <b>saare devices ek hi public IP</b> share karte hain, sirf port number alag. Ise <b>PAT</b> (port address translation) bhi kehte hain.',
    async play(ok) {
      inspect({ name: 'Laptop packet', color: 0x6a8cff,
        rows: [['From', '192.168.1.3 : 51234'], ['To', '203.0.113.80 : 443 (video site)'], ['Same port as phone?', 'Yes, by chance']], note: 'Port numbers only need to be unique per device, not per home.' });
      await fly({ from: lapPort, to: routerPort, color: 0x6a8cff, label: 'from 192.168.1.3:51234', h: 1 }); if (!ok()) return;
      natNew = 'laptop'; patch({ nat: 2 }); sfx.lock(); burst(routerPort, 0xff8a3c);
      inspect({ name: 'Laptop after NAT', color: 0xff8a3c,
        rows: [['From', '198.51.100.24 : 40002'], ['To', '203.0.113.80 : 443'], ['Table rows', '2']], note: 'A home router can track tens of thousands of these rows at once.' });
      await fly({ from: routerPort, to: gwPort, color: 0xff8a3c, label: 'from …:40002', h: 2.5, dur: 1.8 }); if (!ok()) return;
      natNew = ''; applyState(live);
    },
    post(s) { s.nat = 2; },
  },
  {
    scene: 6, title: 'Jawab aaya: router ne table dekhi',
    layers: [3, 4], cam: CAM.s6router,
    text: 'WhatsApp ka jawab aata hai: "To <b>198.51.100.24:40001</b>". Router apni NAT table dekhta hai: 40001 = <b>Henna ka phone</b>. Woh destination wapas <b>192.168.1.5:51234</b> kar deta hai aur phone tak pahuncha deta hai. Laptop ko yeh packet kabhi nahi milta.',
    async play(ok) {
      inspect({ name: 'Reply from WhatsApp', color: C.ok,
        rows: [['From', '157.240.16.60 : 443'], ['To', '198.51.100.24 : 40001'], ['Router looks up', '40001 → 192.168.1.5:51234']], note: 'The table row matches IP, port and protocol before it lets the reply in.' });
      await fly({ from: gwPort, to: routerPort, color: C.ok, label: 'to 198.51.100.24:40001', h: 2.5, dur: 1.8 }); if (!ok()) return;
      burst(routerPort, C.ok); sfx.land();
      inspect({ name: 'Reply after reverse NAT', color: C.ok,
        rows: [['From', '157.240.16.60 : 443'], ['To', '192.168.1.5 : 51234 (restored)'], ['Delivered to', 'Henna\'s phone only']], note: 'NAT works in both directions for connections that started inside.' });
      await fly({ from: routerPort, to: phonePort, color: C.ok, label: 'to 192.168.1.5:51234' }); if (!ok()) return;
      sfx.good(); burst(phonePort, C.ok);
    },
    post(s) { s.replied = true; },
  },
  {
    scene: 6, title: 'Bahar se anjaan dastak: darwaza band',
    layers: [3, 4], cam: CAM.s6hack,
    text: 'Hacker seedha ghar ke public IP pe dastak deta hai: <b>198.51.100.24 port 22</b> ("andar aane do"). Router NAT table dekhta hai: is port ke liye <b>koi andar se shuru hua connection nahi</b>. Router ka <b>stateful firewall</b> packet chupchap <b>drop</b> kar deta hai. Isi wajah se ghar ke devices bahar se seedhe nahi dikhte. Dhyan: <b>port forwarding</b> ya UPnP is darwaze mein jaan-boojh ke chhed karte hain.',
    async play(ok) {
      setVis(hacker, true);
      inspect({ name: 'Unsolicited packet', color: C.bad,
        rows: [['From', '203.0.113.66 : 55100 (attacker)'], ['To', '198.51.100.24 : 22 (SSH)'], ['Flags', 'SYN'], ['NAT match', 'none ✗']], note: 'Attackers scan whole IP ranges looking for open doors like this.' });
      await fly({ from: hackPort, to: routerPort, color: C.bad, label: 'SYN → :22 ?', h: 2.5, dur: 1.8 }); if (!ok()) return;
      sfx.bad(); burst(routerPort, C.bad); patch({ fwDrop: true });
      inspect({ name: 'Dropped by router', color: C.ok,
        rows: [['Rule', 'allow replies only (stateful)'], ['Action', 'drop silently'], ['Attacker sees', 'nothing, no reply'], ['Logged', 'yes']], note: 'Silent drops tell a scanner nothing, not even that a device exists.' });
    },
    post(s) { s.fwDrop = true; },
  },
  {
    scene: 6, title: 'Router ko khud bhi suraksha chahiye',
    layers: [7, 2], cam: CAM.s6home,
    text: 'Router poore ghar ka <b>chowkidaar</b> hai, toh use khud mazboot rehna chahiye: <b>admin password</b> badlo (default "admin" nahi), <b>firmware update</b> rakho, <b>WPS band</b> karo, ho sake toh <b>WPA3</b> lagao, aur smart TV jaise devices ko <b>guest Wi-Fi</b> pe rakho. Kamzor router = poore ghar ka darwaza khula.',
    async play(ok) {
      inspect({ name: 'Router checklist', color: C.ok,
        rows: [['Admin password', 'changed ✓'], ['Firmware', 'latest ✓'], ['WPS', 'off ✓'], ['Wi-Fi', 'WPA2/WPA3 ✓'], ['IoT devices', 'guest network ✓']],
        note: 'Many home attacks start with a router that still uses its factory password.' });
      await wait(600); if (!ok()) return;
      burst(routerPort, C.ok); sfx.good(); patch({ hardened: true });
    },
    post(s) { s.hardened = true; },
  },
  {
    scene: 6, title: 'Scene 6 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.s6router,
    text: 'NAT table mein dono rows ka <b>timer</b> chal raha hai, connection band hote hi row hat jaayegi. Ab <b>6 sawaal</b>, phir Scene 7: <b>Internet ke paar</b>, jahan packet router-router se hote hue, samundar ke neeche ke cables se WhatsApp tak pahunchega.',
    async play() {
      inspect({ name: 'Home edge summary', color: 0xff8a3c,
        rows: [['Inside', '192.168.1.x (private)'], ['Outside', '198.51.100.24 (public)'], ['NAT rows', '2'], ['Inbound unknown', 'dropped']],
        note: 'NAT is not a full firewall, but it blocks unsolicited traffic as a side effect.' });
    },
    post() {},
  }
);

async function hop(ok, a, b, color, label, h, dur) {
  await fly({ from: a, to: b, color, label, h: h === undefined ? 2.5 : h, dur: dur || 1.5 }); if (!ok()) return false;
  sfx.land(); return true;
}
BEATS.push(
  {
    scene: 7, title: 'Internet = networks ka jaal',
    layers: [3], cam: CAM.s7wide,
    text: 'ISP ke gateway ke aage <b>ek bada internet</b> nahi hai, balki <b>hazaron alag networks</b> hain (ISPs, companies, universities) jo aapas mein jude hain. Har network ko <b>AS</b> (Autonomous System) kehte hain, jaise Meta ka <b>AS32934</b>. Packet ko koi poora raasta nahi pata. <b>Har router</b> sirf yeh batata hai ki <b>agla</b> kaun, jaise har chowk pe raasta poochna.',
    async play(ok) {
      patch({ scene7: true, hop: 2 });
      inspect({ name: 'Packet at ISP gateway', color: 0xff8a3c,
        rows: [['From', '198.51.100.24 : 40001'], ['To', '157.240.16.60 : 443'], ['TTL', '62'], ['Next hop', 'ask the routing table']],
        note: 'Each router keeps a routing table: "for addresses like this, send to that neighbour".' });
      await wait(500); if (!ok()) return;
      burst(gwPort, 0xff8a3c); sfx.land();
    },
    post(s) { s.scene7 = true; s.hop = 2; },
  },
  {
    scene: 7, title: 'Hop 3: ISP ka core router',
    layers: [3], cam: CAM.s7core,
    text: 'Packet ISP ke <b>core router</b> tak pahunchta hai. Router <b>sirf destination IP</b> dekhta hai: 157.240.16.60. Uski <b>routing table</b> mein likha hai: "<b>157.240.0.0/16</b> ke liye <b>Internet Exchange</b> ki taraf bhejo". TTL <b>62 → 61</b>. Yeh sab lagbhag <b>ek microsecond</b> mein.',
    async play(ok) {
      inspect({ name: 'Routing table lookup', color: 0x9fb4ff,
        rows: [['Destination', '157.240.16.60'], ['Best match', '157.240.0.0/16'], ['Next hop', 'Internet exchange'], ['TTL', '62 → 61']],
        note: '"Longest prefix match": the most specific matching route wins.' });
      await hop(ok, gwPort, rCore.port, 0xff8a3c, 'TTL 62'); if (!ok()) return;
      patch({ hop: 3 });
    },
    post(s) { s.hop = 3; },
  },
  {
    scene: 7, title: 'IXP aur BGP: "157.240.x mere paas hai"',
    layers: [3], cam: CAM.s7ixp,
    text: 'Raasta kaise pata chala? <b>BGP</b> (Border Gateway Protocol) se. Meta ka edge router poori duniya ko <b>announce</b> karta hai: "<b>157.240.0.0/16 mere paas hai, AS32934</b>". Yeh khabar router-router failti hai. Henna ka ISP aur Meta ek <b>Internet Exchange (IXP)</b> pe seedhe jude hain (peering), toh packet wahin se Meta ke network mein ghus jaata hai. TTL <b>61 → 60</b>.',
    async play(ok) {
      inspect({ name: 'BGP announcement', color: 0x25d366,
        rows: [['From', 'Meta edge · AS32934'], ['Prefix', '157.240.0.0/16'], ['Path', 'AS32934'], ['Heard by', 'IXP → ISP core']],
        note: 'BGP is how separate networks tell each other which addresses they can reach.' });
      await hop(ok, rEdge.port, rIxp.port, 0x25d366, 'BGP: 157.240.0.0/16', 2, 1.3); if (!ok()) return;
      await hop(ok, rIxp.port, rCore.port, 0x25d366, 'BGP: 157.240.0.0/16', 2, 1.3); if (!ok()) return;
      patch({ bgp: true });
      inspect({ name: 'Packet at the IXP', color: 0xffd36b,
        rows: [['From', '198.51.100.24 : 40001'], ['To', '157.240.16.60 : 443'], ['TTL', '61 → 60'], ['Handover', 'ISP → Meta (peering)']],
        note: 'Peering at an IXP keeps traffic local, cheaper and faster.' });
      await hop(ok, rCore.port, rIxp.port, C.crypto, 'TTL 61'); if (!ok()) return;
      patch({ hop: 4 });
    },
    post(s) { s.bgp = true; s.hop = 4; },
  },
  {
    scene: 7, title: 'Meta ke network se WhatsApp server tak',
    layers: [3], cam: CAM.s7ixp,
    text: 'IXP se packet <b>Meta ke edge router</b> pe, aur wahan se <b>WhatsApp server</b> tak. TTL <b>60 → 59</b>. Bas! Henna ke phone se server tak sirf <b>6 hops</b> aur lagbhag <b>19 milliseconds</b>. Left side ka <b>traceroute</b> card har hop ka time dikha raha hai. Asli zindagi mein yeh aksar 8 se 15 hops hote hain.',
    async play(ok) {
      await hop(ok, rIxp.port, rEdge.port, C.crypto, 'TTL 60'); if (!ok()) return;
      patch({ hop: 5 });
      await hop(ok, rEdge.port, waSrv.port, C.crypto, 'TTL 59', 3); if (!ok()) return;
      patch({ hop: 6, traceDone: true }); sfx.good(); burst(waSrv.port, 0x25d366);
      inspect({ name: 'Arrived', color: 0x25d366,
        rows: [['Hops', '6'], ['Time', 'about 19 ms one way'], ['TTL left', '59'], ['IP changed on the way?', 'No (only MACs changed)']],
        note: 'Light in fibre covers about 200 km every millisecond, so distance matters.' });
    },
    post(s) { s.hop = 6; s.traceDone = true; },
  },
  {
    scene: 7, title: 'Cable kat gaya! BGP ne naya raasta dhoondha',
    layers: [3], cam: CAM.s7cut,
    text: 'Achanak IXP aur Meta edge ke beech ka <b>fibre kat</b> gaya (construction ka kaam!). Meta ka router BGP se khabar deta hai: "<b>yeh raasta band</b>". Kuch hi seconds mein routers <b>backup raasta</b> chun lete hain: ISP core → <b>Transit provider</b> → WhatsApp. Message thoda lamba ghoom ke, par <b>pahunchta zaroor</b> hai. Internet isi liye bana tha: ek raasta toote toh doosra.',
    async play(ok) {
      patch({ cut: true }); sfx.bad(); burst(cutMark.position, C.bad);
      inspect({ name: 'BGP withdraw', color: C.bad,
        rows: [['Link', 'IXP ↔ Meta edge'], ['State', 'down ✗'], ['Message', 'withdraw 157.240.0.0/16 via IXP'], ['Backup', 'via transit provider']],
        note: 'Routers recompute paths automatically, usually within seconds.' });
      await wait(900); if (!ok()) return;
      patch({ reroute: true });
      await hop(ok, rCore.port, rTransit.port, C.crypto, 'TTL 61 · new route'); if (!ok()) return;
      await hop(ok, rTransit.port, waSrv.port, C.crypto, 'TTL 60', 3); if (!ok()) return;
      sfx.good(); burst(waSrv.port, 0x25d366);
    },
    post(s) { s.cut = true; s.reroute = true; },
  },
  {
    scene: 7, title: 'TTL aur traceroute ka jaadu',
    layers: [3], cam: CAM.s7core,
    text: 'TTL ka ek aur kamaal: <b>traceroute</b>. Phone jaan-boojh ke <b>TTL 1</b> ka packet bhejta hai: pehla router TTL 0 karke use rok deta hai aur wapas <b>"Time Exceeded"</b> (ICMP) bhejta hai, apna address bata ke. Phir TTL 2, phir 3... Har baar ek hop aage ka router jawab deta hai. Aise poora raasta naap liya jaata hai. Agar galti se packet do routers ke beech <b>ghoomta</b> rahe, TTL use bhi aakhir mein khatam kar deta hai.',
    async play(ok) {
      inspect({ name: 'Probe with TTL 3', color: C.packet,
        rows: [['Sent with', 'TTL 3'], ['Hop 1 (home router)', '3 → 2, forward'], ['Hop 2 (ISP gateway)', '2 → 1, forward'], ['Hop 3 (ISP core)', '1 → 0, stop'], ['Reply', 'ICMP Time Exceeded']],
        note: 'Windows: tracert g.whatsapp.net · Linux: traceroute g.whatsapp.net' });
      await hop(ok, gwPort, rCore.port, C.packet, 'probe · TTL 1 → 0'); if (!ok()) return;
      sfx.bad(); burst(rCore.port, C.packet);
      await hop(ok, rCore.port, gwPort, C.bad, 'ICMP: Time Exceeded (hop 3)'); if (!ok()) return;
      sfx.good();
    },
    post() {},
  },
  {
    scene: 7, title: 'Desh ke bahar? Samundar ke neeche!',
    layers: [1], cam: CAM.s7sea,
    text: 'Agar Riya <b>Singapore</b> mein hoti, ya server kisi aur desh mein, toh packet <b>samundar ke neeche</b> bichhe <b>fibre cables</b> se jaata. Desh se desh ka <b>95% se zyada</b> data inhi cables se jaata hai, satellite se nahi! Cable ke andar data <b>roshni ki chamak</b> ban ke daudta hai: India se Singapore lagbhag <b>4,000 km</b>, sirf <b>~20 ms</b> mein.',
    async play(ok) {
      patch({ sea: true });
      inspect({ name: 'Undersea fibre', color: C.wifi,
        rows: [['Carries', 'over 95% of international data'], ['Signal', 'light pulses in glass fibre'], ['Speed', 'about 200,000 km per second'], ['India → Singapore', '~4,000 km · ~20 ms']],
        note: 'Cables are about as thick as a garden hose. Repeaters every 50–100 km keep the light strong.' });
      await hop(ok, rIxp.port, landing.port, C.wifi, 'to landing station', 2.5, 1.6); if (!ok()) return;
      await fly({ from: landing.port.clone().setY(0.3), to: farEnd, color: 0xbff4ff, label: 'light pulses 〰', h: 0.3, dur: 2.6 }); if (!ok()) return;
      sfx.good();
    },
    post(s) { s.sea = true; },
  },
  {
    scene: 7, title: 'Scene 7 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.s7wide,
    text: 'Packet WhatsApp ke darwaze pe khada hai. Par andar jaane se pehle <b>security check</b> hoga! Ab <b>5 sawaal</b>, phir Scene 8: <b>Data center security</b>: DDoS shield, firewall, IDS/IPS aur load balancer.',
    async play() {
      inspect({ name: 'Trip summary', color: 0x9fb4ff,
        rows: [['Hops', '6 (normal) · 5 (backup)'], ['Time', '~19–24 ms'], ['Path chosen by', 'BGP + routing tables'], ['TTL', '64 → 59']],
        note: 'The light dots on the sea cable keep flowing: the internet never sleeps.' });
    },
    post() {},
  }
);

async function throughGates(ok, from, upto, label) {
  const path = [rEdge.port, P9, P7, P5, lbPort, waSrv.port];
  for (let k = from; k < upto; k++) {
    await fly({ from: path[k], to: path[k + 1], color: C.crypto, label, h: k === 0 ? 1.5 : 0.8, dur: k === 0 ? 1.2 : 0.8 }); if (!ok()) return false;
    sfx.land();
  }
  return true;
}
BEATS.push(
  {
    scene: 8, title: 'WhatsApp ke darwaze pe: suraksha ki parat',
    layers: [3, 4], cam: CAM.s8wide,
    text: 'Kata hua cable repair ho gaya, aur packet WhatsApp ke <b>data center</b> ke paas hai. Server tak seedha raasta nahi: <b>pyaaz ki parton</b> jaisi kai suraksha deewarein hain. Bahar <b>traffic shield</b> (naranji gumbad), phir <b>firewall</b> (laal deewar), phir <b>IDS/IPS</b> (peela radar), aur andar <b>load balancer</b>. Ise <b>defence in depth</b> kehte hain: ek parat chook jaaye toh agli sambhal le.',
    async play(ok) {
      patch({ dc: true, cut: false, reroute: false });
      inspect({ name: 'Defence in depth', color: 0xff8a3c,
        rows: [['Layer 1', 'Traffic shield'], ['Layer 2', 'Firewall'], ['Layer 3', 'IDS / IPS'], ['Layer 4', 'Load balancer'], ['Then', 'Chat servers']],
        note: 'Like airport security: ticket check, bag scan, body scan, gate check. Each step has its own job.' });
      await wait(600); if (!ok()) return;
      burst(DC.clone().setY(2), 0xff8a3c); sfx.land();
    },
    post(s) { s.dc = true; s.cut = false; s.reroute = false; },
  },
  {
    scene: 8, title: 'Traffic shield: bheed mein se asli pehchaano',
    layers: [3, 4], cam: CAM.s8shield,
    text: 'Kabhi-kabhi server pe ek saath <b>bahut saara bekaar traffic</b> aa jaata hai, jisse asli users ke liye jagah na bache. Ise <b>DDoS</b> kehte hain. Sabse bahar ka <b>traffic shield</b> is bheed ko pehchaan ke wahin rok deta hai, aur zaroorat pade toh traffic ko <b>duniya ke kai data centers</b> mein baant deta hai. Henna ka asli packet bina ruke guzar jaata hai.',
    async play(ok) {
      inspect({ name: 'Traffic shield', color: 0xff8a3c,
        rows: [['Sees', 'sudden flood of junk requests'], ['Keeps', 'normal, well-formed traffic'], ['Tools', 'rate limits · traffic scrubbing'], ['Spreads load', 'same IP served from many sites (anycast)']],
        note: 'The goal of the shield is availability: the app must stay usable for real people.' });
      const junk = [];
      for (let k = 0; k < 14; k++) {
        const a = Math.random() * Math.PI * 2, r = 26 + Math.random() * 14;
        const from = DC.clone().add(new THREE.Vector3(Math.cos(a) * r, 5 + Math.random() * 9, Math.sin(a) * r));
        const dir = from.clone().sub(DC).setY(0).normalize();
        const to = DC.clone().add(dir.multiplyScalar(8.6)).setY(1.5 + Math.random() * 3);
        junk.push(fly({ from, to, color: 0xff8a3c, label: '', size: 0.16, h: 2, dur: 1.3 + Math.random() * 0.8 }).then(r2 => { if (r2 === true && ok()) burst(to, 0xff8a3c); }));
        await wait(110); if (!ok()) return;
      }
      throughGates(ok, 0, 1, 'Hi 🔒🔒');
      await Promise.all(junk); if (!ok()) return;
      patch({ shield: true }); sfx.good();
    },
    post(s) { s.shield = true; },
  },
  {
    scene: 8, title: 'Firewall: sirf zaroori darwaze khule',
    layers: [4, 3], cam: CAM.s8gate,
    text: '<b>Firewall</b> ek rule list se chalta hai: "<b>TCP 443 aur 5222 aane do, baaki sab mana</b>". Ek anjaan packet kisi <b>band port</b> pe aata hai: koi rule match nahi, toh <b>BLOCK</b>. Henna ka packet port <b>443</b> pe hai: rule match, <b>ALLOW</b>. Firewall message ke andar nahi dekhta, sirf <b>IP, port aur protocol</b> (Layer 3 aur 4).',
    async play(ok) {
      inspect({ name: 'Firewall rules', color: C.bad,
        rows: [['Rule 1', 'ALLOW TCP 443 from any'], ['Rule 2', 'ALLOW TCP 5222 from any'], ['Rule 3', 'DENY everything else'], ['Order', 'first match wins']],
        note: 'Ending with "deny everything else" is called default deny. It is the safest way to write firewall rules.' });
      await wait(400); if (!ok()) return;
      await fly({ from: hackPort, to: P7, color: C.bad, label: 'to a closed port', h: 6, dur: 2.2 }); if (!ok()) return;
      sfx.bad(); burst(P7, C.bad); patch({ fw: true });
      inspect({ name: 'Firewall decision', color: C.ok,
        rows: [['Closed port', 'no ALLOW rule → DENY ✗'], ['Henna → :443', 'Rule 1 → ALLOW ✓'], ['Looks at', 'IP, port, protocol only']],
        note: 'Blocked attempts are logged so the security team can review them.' });
      await throughGates(ok, 1, 2, 'Hi 🔒🔒 · :443 ✓'); if (!ok()) return;
      sfx.good();
    },
    post(s) { s.fw = true; },
  },
  {
    scene: 8, title: 'IDS/IPS: chaukidaar jo aadatein pehchaanta hai',
    layers: [4, 3], cam: CAM.s8gate,
    text: 'Firewall sirf darwaza dekhta hai. <b>IDS/IPS</b> ek samajhdaar <b>chaukidaar</b> hai jo <b>bartaav</b> dekhta hai: kya koi ek address normal se <b>bahut zyada</b> requests bhej raha hai? Kya traffic kisi <b>jaane-maane khatre</b> se milta hai? <b>IDS</b> sirf alarm bajata hai, <b>IPS</b> us source ko kuch der ke liye rok bhi deta hai. Henna ka normal packet aage badhta hai.',
    async play(ok) {
      inspect({ name: 'IDS / IPS', color: 0xffd36b,
        rows: [['IDS', 'detects and alerts'], ['IPS', 'detects and blocks'], ['Looks for', 'unusual rates · known bad patterns'], ['Encrypted data?', 'judges behaviour, not content']],
        note: 'Security teams tune these systems so normal users are never blocked by mistake.' });
      await wait(400); if (!ok()) return;
      const a = fly({ from: hackPort, to: P5, color: C.bad, label: 'too many requests', h: 6, dur: 2.2 });
      const b = fly({ from: hackPort, to: P5, color: C.bad, label: '', size: 0.16, h: 6.5, dur: 2.3 });
      const c = fly({ from: hackPort, to: P5, color: C.bad, label: '', size: 0.16, h: 7, dur: 2.4 });
      await Promise.all([a, b, c]); if (!ok()) return;
      sfx.bad(); burst(P5, 0xffd36b); patch({ mon: true });
      await throughGates(ok, 2, 3, 'Hi 🔒🔒 · normal ✓'); if (!ok()) return;
      sfx.good();
    },
    post(s) { s.mon = true; },
  },
  {
    scene: 8, title: 'Load balancer: sabse theek server chuno',
    layers: [4], cam: CAM.s8lb,
    text: 'WhatsApp ke paas ek nahi, <b>hazaron servers</b> hain. <b>Load balancer</b> har kuch second mein sabki <b>health check</b> karta hai. Server C <b>bimaar</b> hai (jawab nahi de raha), server B pe <b>bahut bheed</b> hai. Toh load balancer Henna ka message <b>server A</b> ko deta hai: healthy aur kam bheed wala. Isi se WhatsApp kabhi poora band nahi hota, ek server gire toh baaki sambhal lete hain.',
    async play(ok) {
      inspect({ name: 'Health checks', color: C.wifi,
        rows: [['Server A', 'healthy · 38% load'], ['Server B', 'healthy · 81% load'], ['Server C', 'no reply ✗ · skipped'], ['Rule', 'least busy healthy server']],
        note: 'Load balancers also spread new connections evenly so no single server gets overloaded.' });
      await throughGates(ok, 3, 4, 'Hi 🔒🔒'); if (!ok()) return;
      const pings = [fly({ from: lbPort, to: srvB.port, color: C.wifi, label: 'health?', h: 1, dur: 0.9 }),
        fly({ from: lbPort, to: srvC.port, color: C.wifi, label: 'health?', h: 1, dur: 0.9 }),
        fly({ from: lbPort, to: waSrv.port, color: C.wifi, label: 'health?', h: 1, dur: 0.9 })];
      await Promise.all(pings); if (!ok()) return;
      burst(srvC.port, C.bad); sfx.bad();
      await wait(500); if (!ok()) return;
      patch({ lb: true });
      await throughGates(ok, 4, 5, 'Hi 🔒🔒 → server A'); if (!ok()) return;
      sfx.good(); burst(waSrv.port, 0x25d366);
    },
    post(s) { s.lb = true; },
  },
  {
    scene: 8, title: 'Scene 8 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.s8wide,
    text: 'Message chaar parat paar karke <b>server A</b> tak pahunch gaya. Radar ghoomta rehta hai aur load balancer health check karta rehta hai. Ab <b>5 sawaal</b>, phir Scene 9: <b>Server ke andar</b>, jahan message ko ek tick milega.',
    async play() {
      inspect({ name: 'Inside the data center', color: 0x25d366,
        rows: [['Passed', 'shield · firewall · IDS/IPS · LB'], ['Server', 'A (healthy)'], ['Message', 'still end-to-end locked'], ['Next', 'store and forward to Riya']],
        note: 'None of these layers can read "Hi". They only judge where traffic comes from and how it behaves.' });
    },
    post() {},
  }
);

BEATS.push(
  {
    scene: 9, title: 'Server pe bahar ka taala khula, andar ka nahi',
    layers: [7, 6, 5], cam: CAM.s9srv,
    text: 'Server A ne packet liya, saare lifafe utaare (L1 se L4), aur <b>Noise wala bahar ka taala</b> khola. Ab use <b>routing ki jaankari</b> dikhti hai: message <b>kisko</b> dena hai, message ID, time. Par asli "Hi" ab bhi <b>Signal ke andar wale taale</b> mein band hai. Server ke liye yeh sirf <b>8f2a91c4e7…</b> hai.',
    async play(ok) {
      patch({ s9: true });
      inspect({ name: 'What server A opens', color: 0x25d366,
        rows: [['Outer lock (Noise)', 'opened ✓'], ['To', 'Riya (account ID)'], ['Message ID', '3EB0C4F1…'], ['Time', '10:24:07'], ['Body', CIPHER + ' 🔒']],
        note: 'The server needs the envelope to deliver the letter. It never gets the key to the letter itself.' });
      await wait(400); if (!ok()) return;
      burst(waSrv.port, C.crypto); sfx.lock();
      patch({ outerOpen: true });
    },
    post(s) { s.s9 = true; s.outerOpen = true; },
  },
  {
    scene: 9, title: 'Bhejne wala sach mein Henna hai?',
    layers: [7, 5], cam: CAM.s9srv,
    text: 'Server ko pakka pata hai ki yeh message <b>Henna ne hi</b> bheja, kyunki yeh us <b>encrypted connection</b> se aaya jo Scene 3 mein Henna ke phone ne <b>apni key</b> se banaya tha. Koi aur "main Henna hoon" bol ke message nahi daal sakta. Ise <b>authentication</b> kehte hain.',
    async play(ok) {
      inspect({ name: 'Sender check', color: C.ok,
        rows: [['Connection', 'Noise session from Scene 3'], ['Proved by', 'Henna\'s phone key'], ['Account', 'Henna · registered number'], ['Result', 'sender verified ✓']],
        note: 'WhatsApp\'s two-step verification PIN protects the account if someone tries to register the number on another phone.' });
      await wait(500); if (!ok()) return;
      burst(phonePort, C.ok); sfx.good(); patch({ authed: true });
    },
    post(s) { s.authed = true; },
  },
  {
    scene: 9, title: 'Riya kahan hai? Directory se poocho',
    layers: [7], cam: CAM.s9db,
    text: 'Ab server <b>user directory</b> se poochta hai: "Riya abhi <b>online</b> hai? Kis server se judi hai?" Jawab: <b>Riya offline hai</b>, uska phone screen band hai aur internet bhi off. Toh message abhi turant nahi ja sakta.',
    async play(ok) {
      inspect({ name: 'Directory lookup', color: C.wifi,
        rows: [['Asks', 'Where is Riya connected?'], ['Answer', 'not connected (offline)'], ['Last seen', '10:02'], ['Plan', 'store message, notify later']],
        note: 'Busy dots between the server and the databases are other people\'s messages being stored and delivered.' });
      await fly({ from: waSrv.port, to: dirDb.port, color: C.wifi, label: 'Riya online?', h: 1.2, dur: 1 }); if (!ok()) return;
      await fly({ from: dirDb.port, to: waSrv.port, color: 0x8a93b8, label: 'offline', h: 1.2, dur: 1 }); if (!ok()) return;
      patch({ riyaOffline: true }); sfx.land();
    },
    post(s) { s.riyaOffline = true; },
  },
  {
    scene: 9, title: 'Queue mein sambhal ke rakha',
    layers: [7], cam: CAM.s9db,
    text: 'Server locked "Hi" ko <b>message queue</b> mein rakh deta hai, jaise post office mein <b>"Riya ke naam"</b> ka dabba. Yeh <b>encrypted</b> hi rehta hai. Jaise hi Riya ko mil jaayega, server ise <b>delete</b> kar dega. Aur agar Riya <b>30 din</b> tak online na aaye, tab bhi yeh mita diya jaata hai.',
    async play(ok) {
      inspect({ name: 'Stored for delivery', color: C.crypto,
        rows: [['Queue', 'Riya'], ['Stored as', CIPHER + ' (locked)'], ['Deleted when', 'delivered to Riya'], ['Or after', '30 days undelivered']],
        note: 'WhatsApp keeps delivered messages on the phones, not on its servers.' });
      await fly({ from: waSrv.port, to: queueDb.port.clone().setY(2), color: C.crypto, label: 'store: Hi 🔒', h: 1.2, dur: 1.1 }); if (!ok()) return;
      patch({ queued: true }); sfx.lock();
    },
    post(s) { s.queued = true; },
  },
  {
    scene: 9, title: 'Pehla tick ✓ : server tak pahunch gaya',
    layers: [7, 4], cam: CAM.s3wide,
    text: 'Server Henna ke phone ko ek chhoti si <b>receipt</b> bhejta hai: "message mil gaya, sambhal liya". Henna ki screen pe "Hi" ke paas <b>ek grey tick ✓</b> aa jaata hai. Dhyan do: <b>ek tick ka matlab Riya ne nahi dekha</b>, sirf itna ki message <b>WhatsApp server</b> tak safely pahunch gaya.',
    async play(ok) {
      inspect({ name: 'Server receipt', color: 0x8a93b8,
        rows: [['From', 'WhatsApp server A'], ['To', 'Henna\'s phone'], ['Says', 'message 3EB0C4F1 received'], ['Shows as', '✓ (one grey tick)']],
        note: 'While a message is still leaving the phone, WhatsApp shows a small clock icon instead.' });
      await toPhone(ok, 0x8a93b8, '✓ server got it', 2.2); if (!ok()) return;
      camTo(CAM.s9phone[0], CAM.s9phone[1]);
      patch({ tick1: true }); sfx.good(); burst(phonePort, 0x8a93b8);
    },
    post(s) { s.tick1 = true; },
  },
  {
    scene: 9, title: 'Scene 9 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.s9srv,
    text: '"Hi" queue mein Riya ka intezaar kar raha hai, aur Henna ke phone pe <b>✓</b> hai. Server busy hai: doosre logon ke messages bhi aa-ja rahe hain. Ab <b>6 sawaal</b>, phir Scene 10: <b>Riya ke phone tak</b>, push notification aur <b>✓✓ blue ticks</b>.',
    async play() {
      inspect({ name: 'Server status', color: C.crypto,
        rows: [['Riya', 'offline'], ['Queue', '1 locked message'], ['Henna sees', '✓'], ['Next', 'wake Riya\'s phone']],
        note: 'The server still cannot read "Hi". It only knows it has one message waiting for Riya.' });
    },
    post() {},
  }
);

async function serverToRiya(ok, color, label) {
  await fly({ from: waSrv.port, to: riyaPort, color, label, h: 8, dur: 2.4 }); if (!ok()) return false;
  sfx.land(); return true;
}
async function riyaToServer(ok, color, label) {
  await fly({ from: riyaPort, to: waSrv.port, color, label, h: 8, dur: 2.4 }); if (!ok()) return false;
  sfx.land(); return true;
}
BEATS.push(
  {
    scene: 10, title: 'Soye phone ko jagao: push notification',
    layers: [7], cam: CAM.s10push,
    text: 'Riya ka phone so raha hai, WhatsApp band hai. Server use seedha nahi jaga sakta. Isliye woh <b>push service</b> ko kehta hai (Android pe Google ka <b>FCM</b>, iPhone pe Apple ka <b>APNs</b>): "Riya ke phone ko jagao". Phone ka system in services se <b>hamesha</b> ek patli si connection rakhta hai, toh phone turant <b>buzz</b> karta hai. Push mein <b>message ka text nahi</b> hota, sirf jagaane ka signal.',
    async play(ok) {
      inspect({ name: 'Push request', color: 0xffd36b,
        rows: [['From', 'WhatsApp server'], ['Via', 'Push service (FCM)'], ['To', 'Riya\'s phone'], ['Contains', 'wake-up signal · no readable text']],
        note: 'This is why notifications still arrive when the app is closed. Phones keep one shared channel to the push service to save battery.' });
      await fly({ from: waSrv.port, to: pushSrv.port, color: 0xffd36b, label: 'wake Riya', h: 3, dur: 1.4 }); if (!ok()) return;
      await fly({ from: pushSrv.port, to: riyaPort, color: 0xffd36b, label: 'buzz 📳', h: 3, dur: 1.6 }); if (!ok()) return;
      patch({ pushed: true }); sfx.good();
    },
    post(s) { s.pushed = true; },
  },
  {
    scene: 10, title: 'Riya ka phone online aaya',
    layers: [7, 4, 3, 2, 1], cam: CAM.s10riya,
    text: 'Riya ka phone jaagta hai aur wahi sab karta hai jo Henna ke phone ne kiya tha: <b>Wi-Fi handshake, DHCP, DNS, TCP handshake, Noise</b>. Phir server ko batata hai: <b>"Main online hoon, mere messages do."</b> Phone fast hote hain, yeh sab ek second se kam mein ho jaata hai.',
    async play(ok) {
      inspect({ name: 'Riya reconnects', color: 0x25d366,
        rows: [['Wi-Fi + DHCP', 'Scene 1 ✓'], ['DNS', 'Scene 2 ✓ (cached)'], ['TCP + Noise', 'Scene 3 ✓'], ['Says', 'I am online, send my messages']],
        note: 'Everything you learned in Scenes 1 to 3 happens again on Riya\'s side.' });
      await wait(400); if (!ok()) return;
      await riyaToServer(ok, 0x25d366, 'main online hoon'); if (!ok()) return;
      patch({ riyaOn: true }); sfx.good(); burst(riyaPort, 0x25d366);
    },
    post(s) { s.riyaOn = true; },
  },
  {
    scene: 10, title: 'Queue se nikla, Riya tak chala',
    layers: [7, 4, 3], cam: CAM.s10deliver,
    text: 'Server queue se locked "Hi" nikalta hai aur Riya ke <b>encrypted connection</b> se bhej deta hai. Jaise hi Riya ka phone receive karta hai, server use <b>apni queue se mita</b> deta hai. Ab "Hi" sirf <b>do jagah</b> hai: Henna ke phone pe aur Riya ke phone pe.',
    async play(ok) {
      inspect({ name: 'Delivery', color: C.crypto,
        rows: [['From', 'WhatsApp server'], ['To', 'Riya\'s phone'], ['Body', CIPHER + ' 🔒🔒'], ['Server copy', 'deleted after delivery']],
        note: 'The packet goes through the same kind of journey as before: data center, routers, Riya\'s home router, Wi-Fi.' });
      await fly({ from: queueDb.port.clone().setY(2), to: waSrv.port, color: C.crypto, label: 'Hi 🔒', h: 1, dur: 0.8 }); if (!ok()) return;
      await serverToRiya(ok, C.crypto, 'Hi 🔒🔒 → Riya'); if (!ok()) return;
      patch({ delivered: true }); burst(riyaPort, C.crypto);
    },
    post(s) { s.delivered = true; },
  },
  {
    scene: 10, title: 'Ulta safar: lifafe utarte hain (L1 → L7)',
    layers: [1, 2, 3, 4, 5, 6, 7], cam: CAM.s10riya,
    text: 'Riya ke phone pe Scene 5 ka <b>ulta</b> hota hai, jise <b>decapsulation</b> kehte hain. Radio tarangein bits banti hain (L1), Wi-Fi frame khulta hai (L2), IP check hota hai (L3), TCP order theek karta hai (L4), Noise ka bahar wala taala khulta hai (L5), aur aakhir mein bachta hai Signal ka <b>locked dabba</b> (L6).',
    async play(ok) {
      inspect({ name: 'Decapsulation', color: 0xffffff,
        rows: [['L1', 'radio → bits'], ['L2', 'Wi-Fi frame · FCS ✓'], ['L3', 'IP for this phone ✓'], ['L4', 'TCP · in order ✓'], ['L5', 'Noise lock opened'], ['Left', 'Signal-locked message']],
        note: 'Each layer removes only its own header and hands the rest up.' });
      live.wrap = 6; live.atRiya = true; applyState(live);
      for (let k = 5; k >= 1; k--) {
        await wait(650); if (!ok()) return;
        live.wrap = k; applyState(live); sfx.land(); burst(riyaStation, OSI[k].c);
      }
    },
    post(s) { s.wrap = 1; s.atRiya = true; },
  },
  {
    scene: 10, title: 'Andar ka taala khula: "Hi" 💬',
    layers: [6, 7], cam: CAM.s10riya,
    text: 'Ab woh jaadu jo Scene 4 mein shuru hua tha. Riya ka phone apni <b>private key</b> aur Henna ki <b>public key</b> milaata hai, aur <b>wahi bangni shared secret</b> ban jaata hai jo Henna ke phone pe bana tha. Usse message key banti hai, <b>HMAC seal</b> check hota hai (kisi ne badla toh nahi?), aur taala khulta hai: <b>"Hi"</b>! Riya ki screen pe aata hai: <b>Henna: Hi</b>.',
    async play(ok) {
      inspect({ name: 'Decrypting', color: C.crypto,
        rows: [['Inputs', 'Riya private key + Henna public key'], ['Shared secret', 'same as Henna\'s ✓'], ['Seal (HMAC)', 'not changed ✓'], ['Plaintext', 'Hi']],
        note: 'If even one bit had been changed on the way, the seal check would fail and the message would be rejected.' });
      await mix(ok, riyaMix); if (!ok()) return;
      live.wrap = -1; live.decrypted = true; applyState(live);
      sfx.lock(); burst(riyaMix, C.crypto);
      const p = makePacket(0xffffff, 'Hi', 0.26); p.position.copy(riyaPort).add(new THREE.Vector3(0, 0.6, 0));
      await wait(1500); dropPacket(p);
    },
    post(s) { s.wrap = -1; s.decrypted = true; },
  },
  {
    scene: 10, title: 'Do grey tick ✓✓ : Riya ke phone tak pahuncha',
    layers: [7], cam: CAM.s3wide,
    text: 'Riya ka phone server ko <b>delivery receipt</b> bhejta hai, aur server use Henna tak pahunchata hai. Henna ki screen pe ab <b>do grey tick ✓✓</b> hain. Matlab: message <b>Riya ke phone</b> pe pahunch gaya. Riya ne abhi chat khol ke padha nahi.',
    async play(ok) {
      inspect({ name: 'Delivery receipt', color: 0x8a93b8,
        rows: [['From', 'Riya\'s phone'], ['Via', 'WhatsApp server'], ['To', 'Henna\'s phone'], ['Shows as', '✓✓ grey']],
        note: 'Receipts are tiny messages and are encrypted on the way too.' });
      await riyaToServer(ok, 0x8a93b8, '✓✓ delivered'); if (!ok()) return;
      await toPhone(ok, 0x8a93b8, '✓✓ delivered', 2.2); if (!ok()) return;
      camTo(CAM.s9phone[0], CAM.s9phone[1]);
      patch({ tick2: true }); sfx.good(); burst(phonePort, 0x8a93b8);
    },
    post(s) { s.tick2 = true; },
  },
  {
    scene: 10, title: 'Blue ticks 💙 : Riya ne padh liya!',
    layers: [7], cam: CAM.s3wide,
    text: 'Riya chat kholti hai aur "Hi" padhti hai. Uska phone ek <b>read receipt</b> bhejta hai, aur Henna ke ticks <b>neele ✓✓</b> ho jaate hain. Agar Riya ne settings mein <b>read receipts band</b> kiye hote, toh ticks grey hi rehte. Bas! "Hi" ka poora safar khatam, lagbhag <b>ek second</b> se bhi kam mein (jab dono online hon).',
    async play(ok) {
      inspect({ name: 'Read receipt', color: 0x4fb8ff,
        rows: [['From', 'Riya\'s phone'], ['To', 'Henna\'s phone'], ['Shows as', '✓✓ blue'], ['Can be turned off', 'Settings → Privacy → Read receipts']],
        note: 'In groups, ticks turn blue only when everyone has read the message.' });
      patch({ read: true });
      await riyaToServer(ok, 0x4fb8ff, '✓✓ read'); if (!ok()) return;
      await toPhone(ok, 0x4fb8ff, '✓✓ read', 2.2); if (!ok()) return;
      camTo(CAM.s9phone[0], CAM.s9phone[1]);
      sfx.win(); burst(phonePort, 0x4fb8ff);
    },
    post(s) { s.read = true; },
  },
  {
    scene: 10, title: 'Scene 10 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.s10deliver,
    text: '"Hi" Riya tak pahunch gaya aur padha bhi gaya! 💙 Ab <b>6 sawaal</b>, phir Scene 11: <b>Antivirus aur khatre</b>, jahan dekhenge ki file aur link ke saath kya suraksha hoti hai.',
    async play() {
      inspect({ name: 'Message delivered', color: 0x4fb8ff,
        rows: [['Henna sees', '✓✓ blue'], ['Riya sees', 'Henna: Hi'], ['Server copy', 'deleted'], ['Readable by', 'Henna and Riya only']],
        note: 'Every scene you watched happened in less time than it takes to blink.' });
    },
    post() {},
  }
);

BEATS.push(
  {
    scene: 11, title: 'Server andar nahi dekh sakta, toh phone ko dekhna hoga',
    layers: [7], cam: CAM.s11riya,
    text: 'Ek <b>anjaan number</b> Riya ko messages bhejta hai. Yaad hai, har message <b>end-to-end locked</b> hota hai? Iska ek matlab yeh bhi hai ki WhatsApp server <b>file ke andar dekh hi nahi sakta</b>. Isliye aakhri suraksha <b>Riya ke phone pe</b> hai: phone ki built-in protection (jaise Android pe <b>Play Protect</b>) aur antivirus, jo har nayi file aur link ko check karte hain.',
    async play(ok) {
      patch({ s11: true });
      inspect({ name: 'Where scanning happens', color: C.ok,
        rows: [['WhatsApp server', 'cannot see file contents'], ['Riya\'s phone', 'scans after decrypting'], ['Tools', 'Play Protect · antivirus app'], ['Also helps', 'Riya\'s own good sense']],
        note: 'Privacy and safety work together: the phone protects you, without the server reading your messages.' });
      await wait(500); if (!ok()) return;
      burst(riyaPort.clone().setY(1.2), C.ok); sfx.good();
    },
    post(s) { s.s11 = true; },
  },
  {
    scene: 11, title: 'Jaani-pehchaani buri file: signature se pakdi',
    layers: [7], cam: CAM.s11riya,
    text: 'Anjaan number ek file bhejta hai: <b>Prize_Winner.apk</b>. Phone ki protection file ka <b>fingerprint</b> (hash) nikaalti hai aur use <b>pehle se pakdi gayi buri files ki list</b> se milaati hai. Match mil gaya! File ko <b>quarantine</b> mein daal diya jaata hai, jaise kisi bimaar cheez ko alag kamre mein band karna, taaki woh chal na sake.',
    async play(ok) {
      inspect({ name: 'Signature check', color: C.bad,
        rows: [['File', 'Prize_Winner.apk'], ['Fingerprint', 'SHA-256 · 9c1e…a07b'], ['Known-bad list', 'match ✗'], ['Action', 'quarantine + warn Riya']],
        note: 'Signature lists are updated many times a day, which is one reason to keep protection up to date.' });
      await viaServer(ok, unkPort, C.bad, 'Prize_Winner.apk 🔒'); if (!ok()) return;
      burst(riyaPort, C.ok);
      await fly({ from: riyaPort, to: qBox.position, color: C.bad, label: 'quarantine', h: 1, dur: 1 }); if (!ok()) return;
      patch({ quarantined: true }); sfx.bad();
    },
    post(s) { s.quarantined = true; },
  },
  {
    scene: 11, title: 'Nayi file, list mein nahi: bartaav se pehchaan',
    layers: [7], cam: CAM.s11riya,
    text: 'Agli file <b>bilkul nayi</b> hai, kisi list mein nahi. Ab protection uska <b>bartaav</b> dekhti hai: ek "wallpaper app" ko <b>SMS, contacts aur doosre apps ke upar dikhne</b> ki permission kyon chahiye? Yeh <b>heuristic</b> check hai: kaam aur maangi gayi cheezon ka mel nahi baitha, toh phone <b>warning</b> deta hai aur install rok deta hai.',
    async play(ok) {
      inspect({ name: 'Behaviour check', color: 0xffb547,
        rows: [['File', 'Cool_Wallpapers.apk'], ['Known-bad list', 'no match'], ['Asks for', 'SMS · contacts · draw over apps'], ['Verdict', 'does not fit a wallpaper app ⚠']],
        note: 'Rule of thumb: install apps only from the official store, and question permissions that do not fit the app.' });
      await viaServer(ok, unkPort, 0xffb547, 'Cool_Wallpapers.apk 🔒'); if (!ok()) return;
      burst(riyaPort, 0xffb547); patch({ flagged: true }); sfx.bad();
    },
    post(s) { s.flagged = true; },
  },
  {
    scene: 11, title: 'Nakli link: naam pe dhyan do',
    layers: [7], cam: CAM.s11route,
    text: 'Phir ek message: "<b>WhatsApp Gold</b> mein naye features! Yahan update karo: <b>whatsapp-gold-update.example</b>". Yeh asli WhatsApp ka address nahi hai. Link kholte hi browser ki <b>safe browsing</b> use jaani-maani nakli websites ki list se milaati hai aur <b>laal warning</b> dikhati hai. Seekh: <b>domain ka naam dhyan se padho</b>, aur "jaldi karo, offer khatam" wale messages pe shak karo.',
    async play(ok) {
      inspect({ name: 'Link check', color: C.bad,
        rows: [['Link', 'whatsapp-gold-update.example'], ['Real WhatsApp?', 'No ✗ (official: whatsapp.com)'], ['Safe browsing', 'listed as deceptive'], ['Shown', 'red warning page']],
        note: 'There is no "WhatsApp Gold". Messages that create urgency or promise prizes are classic phishing signs.' });
      await viaServer(ok, unkPort, C.bad, '🔗 whatsapp-gold-update…'); if (!ok()) return;
      burst(riyaPort, C.bad); patch({ linkBlocked: true }); sfx.bad();
    },
    post(s) { s.linkBlocked = true; },
  },
  {
    scene: 11, title: '6 digit code? Kabhi share nahi!',
    layers: [7], cam: CAM.s11riya,
    text: 'Aakhir mein anjaan number likhta hai: "Galti se aapke number pe <b>mera code</b> chala gaya, please bata do". Yeh <b>WhatsApp ka 6 digit login code</b> hai! Jo bhi yeh code jaan le, woh Riya ka account <b>apne phone pe</b> chala sakta hai. Riya code <b>share nahi</b> karti, number <b>report aur block</b> karti hai, aur <b>two-step verification PIN</b> on rakhti hai, taaki code mil bhi jaaye toh PIN ke bina kaam na aaye.',
    async play(ok) {
      inspect({ name: 'Account safety', color: C.ok,
        rows: [['Asked for', 'WhatsApp 6-digit code'], ['Riya\'s answer', 'never shares it ✓'], ['Extra lock', 'two-step verification PIN ✓'], ['Then', 'report + block']],
        note: 'WhatsApp, banks and real friends will never ask for your verification code.' });
      await viaServer(ok, unkPort, 0xffb547, 'code bata do please?'); if (!ok()) return;
      patch({ codeSafe: true }); sfx.good(); burst(riyaPort, C.ok);
    },
    post(s) { s.codeSafe = true; },
  },
  {
    scene: 11, title: 'Achhi aadatein = sabse mazboot antivirus',
    layers: [7], cam: CAM.s11riya,
    text: 'Sabse badi suraksha <b>aadatein</b> hain: phone aur apps <b>update</b> rakho (purane bugs band hote hain), apps sirf <b>official store</b> se lo, <b>two-step PIN</b> on rakho, anjaan files aur links <b>mat kholo</b>, aur shak ho toh <b>report & block</b>. Technology parat-dar-parat bachati hai, par aakhri faisla insaan ka hota hai.',
    async play(ok) {
      inspect({ name: 'Safety checklist', color: C.ok,
        rows: [['Updates', 'on ✓'], ['Apps from', 'official store ✓'], ['Two-step PIN', 'on ✓'], ['Unknown files/links', 'do not open ✓'], ['Suspicious chats', 'report & block ✓']],
        note: 'In India you can also report cyber fraud at cybercrime.gov.in or call 1930.' });
      await wait(500); if (!ok()) return;
      patch({ habits: true }); sfx.win(); burst(riyaPort.clone().setY(1.2), C.ok);
    },
    post(s) { s.habits = true; },
  },
  {
    scene: 11, title: 'Scene 11 ka quiz 🎯', quiz: true,
    layers: [], cam: CAM.s11riya,
    text: 'Riya ka phone ab hari shield mein hai aur scan ring ghoomti rehti hai. Ab <b>5 sawaal</b>, phir aakhri Scene 12: <b>Big picture</b>, poora safar ek nazar mein.',
    async play() {
      inspect({ name: 'Device protection', color: C.ok,
        rows: [['Known bad files', 'signature match'], ['New bad files', 'behaviour checks'], ['Fake links', 'safe browsing'], ['Account', 'never share code · 2-step PIN']],
        note: 'Encryption protects messages on the way. Device protection and good habits protect you at the ends.' });
    },
    post() {},
  }
);

const STOPS = [
  [phonePort, C.packet], [routerPort, C.wifi], [gwPort, 0xff8a3c], [rCore.port, 0x9fb4ff], [rIxp.port, 0xffd36b],
  [rEdge.port, 0x25d366], [waSrv.port, 0x25d366], [riyaPort, C.crypto],
];
BEATS.push(
  {
    scene: 12, title: 'Poora safar ek nazar mein 🗺️',
    layers: [7, 6, 5, 4, 3, 2, 1], cam: CAM.s12map,
    text: 'Upar se dekho! Yeh hai "Hi" ka <b>poora raasta</b>: Henna ka phone → <b>ghar ka router</b> → <b>ISP gateway</b> → <b>ISP core</b> → <b>Internet Exchange</b> → <b>Meta edge</b> → <b>data center</b> → <b>WhatsApp server</b> → <b>Riya ka phone</b>. Har padav jagmagata hai jab naarangi line wahan se guzarti hai.',
    async play(ok) {
      patch({ s12: true, trail: 0 });
      inspect({ name: 'The whole route', color: C.packet,
        rows: [['Stops', '9'], ['Distance (same city)', 'a few hundred km of fibre'], ['Layers used', 'all 7'], ['Readable by', 'Henna + Riya only']],
        note: 'Drag the map to look around. Every station you built is still running.' });
      for (let k = 0; k < STOPS.length; k++) {
        live.trail = (k + 1) / STOPS.length; applyState(live);
        await wait(550); if (!ok()) return;
        burst(STOPS[k][0], STOPS[k][1]); sfx.land();
      }
    },
    post(s) { s.s12 = true; s.trail = 1; },
  },
  {
    scene: 12, title: 'Kitna time laga? ⏱️',
    layers: [], cam: CAM.s12low,
    text: 'Jab dono phone online hon aur connection pehle se bana ho, toh "Hi" ko Henna se Riya tak pahunchne mein lagbhag <b>45 milliseconds</b> lagte hain. <b>Palak jhapakne</b> mein ~300 ms lagte hain, yaani ek palak mein "Hi" <b>6 baar</b> aa-ja sakta hai! Left side ka card dikhata hai ki time kahan kharch hua. Sabse zyada time <b>doori</b> (fibre mein roshni) mein jaata hai.',
    async play(ok) {
      patch({ recap: 'time', recapLit: 0 });
      inspect({ name: 'Speed facts', color: C.ok,
        rows: [['One-time setup', 'Wi-Fi · DHCP · DNS · TCP · Noise'], ['Per message', '≈ 45 ms (example)'], ['Biggest cost', 'distance in fibre'], ['If Riya is offline', 'waits in the queue']],
        note: 'Real times change with distance, network load and phone speed. These are example values.' });
      runnerU = 0; setRunner(true);
      for (let k = 1; k <= TIMELINE.length; k++) {
        await wait(420); if (!ok()) return;
        live.recapLit = k; applyState(live); sfx.land();
      }
      await wait(600); setRunner(false); runnerU = -1;
      if (!ok()) return;
      sfx.good();
    },
    post(s) { s.recap = 'time'; s.recapLit = 7; },
  },
  {
    scene: 12, title: 'Raaste ki 9 suraksha parat 🛡️',
    layers: [], cam: CAM.s12map,
    text: 'Is chhote se safar mein "Hi" ko <b>9 alag parton</b> ne bachaya: Wi-Fi ka taala, DNS ki jaanch, Noise ka bahar wala taala, Signal ka andar wala taala, router ka NAT/firewall, BGP ke backup raaste, data center ki deewarein, phone ki protection, aur sabse zaroori: <b>aapki apni samajhdaari</b>. Ek bhi parat toote toh baaki sambhal leti hain.',
    async play(ok) {
      patch({ recap: 'security', recapLit: 0 });
      inspect({ name: 'Defence in depth', color: C.ok,
        rows: [['On the network', 'Wi-Fi lock · NAT · firewalls'], ['On the data', 'Noise + Signal encryption'], ['At the server', 'shield · IDS/IPS · LB'], ['At the ends', 'phone protection · habits']],
        note: 'This is the main idea of cyber security: many layers, each catching what others might miss.' });
      const marks = [[phonePort, C.wifi], [resolver.port, C.dhcp], [waSrv.port, C.crypto], [mixAt, C.crypto], [routerPort, 0xff8a3c], [rTransit.port, 0x9fb4ff], [DC.clone().setY(2), C.bad], [riyaPort, C.ok], [phonePort, 0xffffff]];
      for (let k = 1; k <= SHIELDS.length; k++) {
        await wait(420); if (!ok()) return;
        live.recapLit = k; applyState(live); burst(marks[k - 1][0], marks[k - 1][1]); sfx.lock();
      }
    },
    post(s) { s.recap = 'security'; s.recapLit = 9; },
  },
  {
    scene: 12, title: 'Final quiz: poore safar ka test 🏆', quiz: true,
    layers: [7, 6, 5, 4, 3, 2, 1], cam: CAM.s12map,
    text: 'Aapne poora safar dekh liya: Wi-Fi se le ke blue ticks tak! Ab <b>6 sawaal</b> saare scenes se milke. Sab sahi kiye toh aap <b>"Message Journey Master"</b> ho! 🎓',
    async play() {
      inspect({ name: 'Journey complete', color: C.packet,
        rows: [['Scenes', '12'], ['Layers', '7'], ['Security layers', '9'], ['Made by', 'Henna Shakil']],
        note: 'Thank you for travelling with "Hi"!' });
    },
    post() {},
  }
);

const SCENE_META = {
  1: { name: 'Getting online', fog: [16, 40], next: 'Scene 2 · DNS: phone pata karega ki WhatsApp ka server kahan rehta hai.',
    full: 'Full marks! Wi-Fi handshake aur DHCP ab pakka yaad hai.' },
  2: { name: 'DNS', fog: [34, 100], next: 'Scene 3 · TCP handshake: phone aur WhatsApp server pehli baar haath milayenge.',
    full: 'Full marks! DNS ka poora raasta ab pakka yaad hai.' },
  3: { name: 'TCP handshake', fog: [46, 140], next: 'Scene 4 · End-to-end encryption: "Hi" pe aisa taala jo sirf Riya khol sakti hai.',
    full: 'Full marks! SYN, SYN-ACK, ACK aur key check ab pakka yaad hai.' },
  4: { name: 'End-to-end encryption', fog: [60, 170], next: 'Scene 5 · OSI layers: "Hi" pe 7 lifafe kaise chadhte hain.',
    full: 'Full marks! Do taale, X3DH aur Double Ratchet ab pakka yaad hain.' },
  5: { name: 'OSI layers', fog: [60, 170], next: 'Scene 6 · Home router & NAT: ghar ka private address public address se kaise badalta hai.',
    full: 'Full marks! 7 layers aur encapsulation ab pakka yaad hai.' },
  6: { name: 'Home router & NAT', fog: [60, 170], next: 'Scene 7 · Across the internet: router-router hop, BGP aur samundar ke cables.',
    full: 'Full marks! NAT, PAT aur stateful firewall ab pakka yaad hain.' },
  7: { name: 'Across the internet', fog: [80, 230], next: 'Scene 8 · Data center security: shield, firewall, IDS/IPS aur load balancer.',
    full: 'Full marks! Routing, BGP aur TTL ab pakka yaad hain.' },
  8: { name: 'Data center security', fog: [80, 230], next: 'Scene 9 · Inside the server: queue, receipt aur pehla tick.',
    full: 'Full marks! Defence in depth ab pakka yaad hai.' },
  9: { name: 'Inside the server', fog: [80, 230], next: 'Scene 10 · To Riya\'s phone: push notification, delivery aur blue ticks.',
    full: 'Full marks! Server ke andar ka kaam ab pakka yaad hai.' },
  10: { name: 'To Riya\'s phone', fog: [80, 230], next: 'Scene 11 · Antivirus & threats: phone pe file aur link ki suraksha.',
    full: 'Full marks! Push, decapsulation aur ticks ab pakka yaad hain.' },
  11: { name: 'Antivirus & threats', fog: [80, 230], next: 'Scene 12 · Big picture: poora safar, timeline aur suraksha ki 9 parat.',
    full: 'Full marks! Device protection aur safe habits ab pakka yaad hain.' },
  12: { name: 'Big picture', fog: [130, 320], next: 'Badhai ho! Aapne "Hi" ka poora safar seekh liya. 🎓',
    full: 'Full marks! Aap Message Journey Master ho! 🏆' },
};

// ---------- Extra content: mobile data, IPv6, photos and group messages ----------
function insertBeforeQuiz(sc, beats) {
  const k = BEATS.findIndex(b => b.scene === sc && b.quiz);
  BEATS.splice(k, 0, ...beats.map(b => Object.assign({ scene: sc }, b)));
}
// Mobile tower outside Henna's home (Scene 1)
const cell = new THREE.Group(); cell.position.set(-11, 0, -6); scene.add(cell);
const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 6, 8), metal); mast.position.y = 3; cell.add(mast);
[0, 2.1, 4.2].forEach(a => {
  const pnl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.9, 0.08), darker);
  pnl.position.set(Math.cos(a) * 0.32, 5.4, Math.sin(a) * 0.32); pnl.rotation.y = -a + Math.PI / 2; cell.add(pnl);
});
const cellLed = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: C.bad })); cellLed.position.y = 6.1; cell.add(cellLed);
const cellTag = makeTag('Mobile tower', '4G / 5G · your mobile company'); cellTag.obj.position.set(0, 6.8, 0); cell.add(cellTag.obj);
const cellPort = new THREE.Vector3(-11, 5.4, -6);
// Media server for photos and videos (Scene 9)
const mediaSrv = tower(46, 32, 3.6, 0x4fb8ff, 'Media server', 'stores encrypted photos and videos');
fibres.push(fibre(new THREE.Vector3(HOME_R * 0.9, 0, HOME_R * 0.3), mediaSrv.port, 0x4fb8ff));
// Two more friends for the group chat (Scene 10)
const aman = person({ name: 'Aman', role: 'College Friends group', at: new THREE.Vector3(43, 0, -17), face: -0.4,
  skin: 0x8a5a3c, top: 0x2f6f8f, bottom: 0x2a2a33, accent: 0xffffff, kurta: false, scarf: false, short: true, bindi: false, parent: city });
const sara = person({ name: 'Sara', role: 'College Friends group', at: new THREE.Vector3(57, 0, -17), face: -0.9,
  skin: 0xc28e6a, top: 0x6a4fb8, bottom: 0x22263a, accent: 0xffffff, kurta: false, scarf: false, longHair: true, bindi: false, parent: city });
const amanPort = new THREE.Vector3(43, 1.4, -17), saraPort = new THREE.Vector3(57, 1.4, -17);
CAM.x1cell = [[3, 9.5, 11], [-6.8, 2.6, -2.6]];
CAM.x9photo = [[16, 26, 56], [36, 2, 22]];
CAM.x10group = [[34, 24, 22], [50, 1.5, -10]];

insertBeforeQuiz(1, [{
  title: 'Wi-Fi nahi toh? Mobile data ka raasta',
  layers: [1, 2, 3], cam: CAM.x1cell,
  text: 'Ghar se bahar Wi-Fi nahi hota. Tab phone <b>SIM</b> ke zariye <b>mobile tower</b> se judta hai. SIM ke andar ek <b>secret key</b> hoti hai jisse mobile company phone ko pehchaanti hai, Wi-Fi password jaisi par SIM mein band. Phir company phone ko IP deti hai, aksar <b>100.64.x.x</b> jaisa <b>shared</b> address (CGNAT), kyunki IPv4 address kam hain. Tower tak ka radio link bhi encrypted hota hai.',
  async play(ok) {
    patch({ cellDemo: true });
    inspect({ name: 'Mobile data', color: C.bad,
      rows: [['Connects to', 'mobile tower (4G / 5G)'], ['Identity', 'SIM card (secret key inside)'], ['IP from', 'mobile company · 100.64.12.7'], ['Shared IP', 'CGNAT: many users, one public IP']],
      note: 'After this point DNS, TCP and encryption work exactly like on Wi-Fi.' });
    await fly({ from: phonePort, to: cellPort, color: C.bad, label: 'SIM check', h: 2, dur: 1.6 }); if (!ok()) return;
    sfx.land();
    await fly({ from: cellPort, to: phonePort, color: C.ok, label: 'IP 100.64.12.7', h: 2, dur: 1.6 }); if (!ok()) return;
    sfx.good();
  },
  post(s) { s.cellDemo = true; },
}]);
insertBeforeQuiz(6, [{
  title: 'IPv6: har device ka apna pata',
  layers: [3], cam: CAM.s6router,
  text: 'IPv4 mein sirf lagbhag <b>4.3 arab</b> address hain, isliye NAT ki zaroorat padi. Naya <b>IPv6</b> itne address deta hai ki har device ko apna <b>public address</b> mil sakta hai, jaise <b>2001:db8:1234::5</b>. Tab NAT ki zaroorat nahi. Par suraksha phir bhi chahiye: router ka <b>firewall</b> bahar se aane wale anjaan connections ab bhi rokta hai. Aaj zyada tar networks IPv4 aur IPv6 <b>dono</b> chalate hain (dual stack).',
  async play(ok) {
    inspect({ name: 'IPv4 vs IPv6', color: 0x6a8cff,
      rows: [['IPv4', '32-bit · about 4.3 billion'], ['IPv6', '128-bit · 340 undecillion'], ['Phone IPv6', '2001:db8:1234::5'], ['NAT needed', 'no'], ['Firewall needed', 'yes']],
      note: '2001:db8:: is a range reserved for examples and documentation.' });
    await fly({ from: phonePort, to: routerPort, color: 0x6a8cff, label: 'from 2001:db8:1234::5' }); if (!ok()) return;
    await fly({ from: routerPort, to: gwPort, color: 0x6a8cff, label: 'same address · no NAT', h: 2.5, dur: 1.8 }); if (!ok()) return;
    patch({ ipv6: true }); sfx.good();
  },
  post(s) { s.ipv6 = true; },
}]);
insertBeforeQuiz(9, [{
  title: 'Photo ka raasta alag hai 📷',
  layers: [7, 6, 4], cam: CAM.x9photo,
  text: 'Agar Henna "Hi" ke saath ek <b>photo</b> bhejti, toh photo chat server se nahi jaati. Phone photo ko ek <b>nayi random chaabi</b> se lock karta hai aur locked file <b>HTTPS</b> se <b>media server</b> pe upload karta hai. Phir Riya ko ek chhota end-to-end message jaata hai jismein <b>link, chaabi aur hash</b> hota hai. Riya ka phone file download karke khud kholta hai. Media server ke paas sirf <b>locked file</b> rehti hai.',
  async play(ok) {
    inspect({ name: 'Sending a photo', color: 0x4fb8ff,
      rows: [['Photo', 'locked with a new random key'], ['Upload', 'HTTPS → media server'], ['Chat message carries', 'link + key + hash (E2E)'], ['Media server sees', 'encrypted file only']],
      note: 'The hash lets Riya\'s phone check that the downloaded file was not changed.' });
    await fly({ from: phonePort, to: routerPort, color: 0x4fb8ff, label: '📷 photo 🔒' }); if (!ok()) return;
    await fly({ from: routerPort, to: mediaSrv.port, color: 0x4fb8ff, label: 'upload over HTTPS', h: 6, dur: 2.2 }); if (!ok()) return;
    patch({ photo: true }); sfx.land();
    await toServer(ok, C.crypto, 'link + key 🔒🔒', 2); if (!ok()) return;
    sfx.good();
  },
  post(s) { s.photo = true; },
}]);
insertBeforeQuiz(10, [{
  title: 'Group mein "Hi"? Pehle ek Sender Key',
  layers: [7, 6], cam: CAM.x10group,
  text: 'Ab Henna <b>"College Friends"</b> group mein "Hi" likhti hai: Riya, Aman aur Sara. Pehli baar Henna ka phone ek <b>Sender Key</b> (group ki chaabi) banata hai aur use har member ko <b>alag-alag</b>, unke apne end-to-end taale mein bhejta hai. Server ko yeh chaabi bhi nahi dikhti.',
  async play(ok) {
    patch({ group: true });
    inspect({ name: 'Sender Key', color: C.crypto,
      rows: [['Group', 'College Friends · 4 people'], ['Sender Key', 'made on Henna\'s phone'], ['Sent to each member', 'inside their own E2E lock'], ['How often', 'once, until someone joins or leaves']],
      note: 'When someone leaves, fresh Sender Keys are made so they cannot read new messages.' });
    await toServer(ok, C.crypto, 'sender key ×3 🔒', 2); if (!ok()) return;
    await Promise.all([
      fly({ from: waSrv.port, to: riyaPort, color: C.crypto, label: 'key 🔒', h: 7, dur: 2 }),
      fly({ from: waSrv.port, to: amanPort, color: C.crypto, label: 'key 🔒', h: 7, dur: 2.1 }),
      fly({ from: waSrv.port, to: saraPort, color: C.crypto, label: 'key 🔒', h: 7, dur: 2.2 }),
    ]); if (!ok()) return;
    sfx.lock();
  },
  post(s) { s.group = true; },
}, {
  title: 'Ek baar lock, server sabko baante',
  layers: [7, 6], cam: CAM.x10group,
  text: 'Ab har group message Henna ka phone <b>sirf ek baar</b> Sender Key se lock karta hai aur <b>ek hi copy</b> server ko bhejta hai. Server use <b>teeno</b> tak pahuncha deta hai (fan-out). Isse Henna ka data aur battery bachti hai. Group mein ticks <b>neele</b> tab hote hain jab <b>sab</b> padh lein.',
  async play(ok) {
    inspect({ name: 'Group fan-out', color: 0x25d366,
      rows: [['Henna sends', '1 copy'], ['Server delivers', '3 copies'], ['Lock', 'Sender Key (still E2E)'], ['Blue ticks', 'after everyone reads']],
      note: 'The server still cannot read group messages. It only copies the locked message to each member.' });
    await toServer(ok, C.crypto, 'Hi 🔒 (group)', 2); if (!ok()) return;
    await Promise.all([
      fly({ from: waSrv.port, to: riyaPort, color: 0x25d366, label: 'Hi 🔒', h: 7, dur: 2 }),
      fly({ from: waSrv.port, to: amanPort, color: 0x25d366, label: 'Hi 🔒', h: 7, dur: 2.1 }),
      fly({ from: waSrv.port, to: saraPort, color: 0x25d366, label: 'Hi 🔒', h: 7, dur: 2.2 }),
    ]); if (!ok()) return;
    patch({ groupSent: true }); sfx.good();
  },
  post(s) { s.groupSent = true; },
}]);
