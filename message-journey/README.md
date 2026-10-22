# Message Journey

**Play it: [hennashakil.github.io/message-journey](https://hennashakil.github.io/message-journey/)**

A 3D networking game. You follow one WhatsApp "Hi" from Henna's phone to Riya's phone, and see every step on the way:
Wi-Fi handshake, DHCP, DNS, TCP and the Noise handshake, end-to-end encryption (X3DH, Double Ratchet), the 7 OSI layers,
NAT, routing and BGP, data center security, the server queue, push notifications, blue ticks, and phone protection.

- 12 scenes, 106 story steps, 64 quiz questions
- 11 challenges where **you are the packet**: wrong choices bounce back and explain why
- Stars, time and XP per scene, saved in your browser
- Hinglish and English (switch any time)
- Works on laptop and phone (portrait and landscape)

## How it is built

Plain HTML, CSS and JavaScript with [three.js](https://threejs.org/) r128. No build step, no trackers.

| File | What it holds |
|---|---|
| `index.html` | The page: panels, quiz and welcome screen |
| `style.css` | Layout for laptop, phone and phone held sideways |
| `js/i18n-en.js` | English text (the Hinglish text lives with the story) |
| `js/world.js` | The 3D world: home, devices, servers, routers, people, packets |
| `js/hud.js` | Sound, language, camera moves and world state |
| `js/story.js` | Every step of the 12 scenes |
| `js/play.js` | Challenges, step runner, quizzes, saved progress |
| `fonts/` | Oxanium, Figtree and IBM Plex Mono, self-hosted (SIL Open Font License) |

The scripts are classic scripts that share one global scope, so the order in `index.html` matters.

Built by Henna Shakil · [github.com/Hennashakil](https://github.com/Hennashakil)
