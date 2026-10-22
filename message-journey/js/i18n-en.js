// English text for Message Journey. Keys are the original Hinglish strings.
window.MJ_EN = {
 "beats": {
  "Phone abhi offline hai": [
   "The phone is offline",
   "Henna's phone isn't on the internet yet. About 10 times a second the router sends a <b>beacon</b>, like a sign outside a shop: <b>\"I am Henna_Home, secured with WPA2.\"</b> The phone reads these signs to build its Wi-Fi list."
  ],
  "Password daala, par bheja nahi": [
   "Password typed, but never sent",
   "Henna types the password. Fun fact: <b>the password never travels through the air!</b> The router sends a random number, the <b>ANonce</b>. The phone makes its own random number, the <b>SNonce</b>, and mixes the password with both numbers into a session key (PTK). Then it sends the SNonce with a <b>MIC</b> (a signature) that proves it knows the right password."
  ],
  "Taala lag gaya 🔒": [
   "Locked 🔒",
   "The router builds the same key and checks the MIC. <b>Match!</b> In message 3 the router sends the group key (GTK); in message 4 the phone says \"got it\". Now both sides hold the same key <b>without ever handing it over</b>. From here on, every frame between phone and router is encrypted."
  ],
  "Galat password wala andar nahi aayega": [
   "Wrong password stays outside",
   "An <b>unknown laptop</b> outside the house also tries to join Henna_Home, but it doesn't have the right password. Its MIC doesn't match the router's, so the router <b>rejects</b> it. That is Wi-Fi's first wall of security."
  ],
  "D · Discover: \"Mujhe address chahiye!\"": [
   "D · Discover: \"I need an address!\"",
   "Joined the Wi-Fi, but the phone has no <b>IP address</b> yet. Like moving to a new street without a house number. The phone shouts to everyone: <b>\"Is there a DHCP server? I need an IP!\"</b> This is a <b>broadcast</b>; it reaches every device in the house. The TV and the laptop hear it and ignore it."
  ],
  "O · Offer: \"Yeh lo 192.168.1.5\"": [
   "O · Offer: \"Take 192.168.1.5\"",
   "The router (which is also the home's <b>DHCP server</b>) answers: <b>\"Take 192.168.1.5 for 24 hours.\"</b> It also hands over the subnet mask, the <b>gateway</b> (the door to the outside, which is the router itself) and the DNS server's address."
  ],
  "R · Request: \"Haan, mujhe yahi chahiye\"": [
   "R · Request: \"Yes, I'll take that one\"",
   "The phone says: <b>\"Yes, I want 192.168.1.5.\"</b> This is broadcast too, so that if another DHCP server on the network also made an offer, it learns which offer the phone picked."
  ],
  "A · Acknowledge: Phone online! ✅": [
   "A · Acknowledge: phone online! ✅",
   "The router confirms: <b>\"Done, 192.168.1.5 is yours.\"</b> The phone is on the internet and WhatsApp can open! Memory trick: <b>DORA</b> = Discover, Offer, Request, Acknowledge."
  ],
  "Wi-Fi nahi toh? Mobile data ka raasta": [
   "No Wi-Fi? The mobile data route",
   "Away from home there's no Wi-Fi. Then the phone connects to a <b>mobile tower</b> through its <b>SIM</b>. The SIM holds a <b>secret key</b> the mobile company uses to recognise the phone, like a Wi-Fi password locked inside the SIM. Then the company gives the phone an IP, often a <b>shared</b> address like <b>100.64.x.x</b> (CGNAT), because IPv4 addresses are scarce. The radio link to the tower is encrypted too."
  ],
  "Challenge 🎮: Tum ho DHCP Discover": [
   "Challenge 🎮: You are the DHCP Discover",
   "Now <b>you are the packet</b>! Henna's phone needs an IP address. Which device will you go to that <b>can hand out an IP</b>? Pick below, or make a mistake and see what happens."
  ],
  "Scene 1 ka quiz 🎯": [
   "Scene 1 quiz 🎯",
   "Let's see how much stuck! 5 questions, <b>+10 XP</b> for each right answer. After the quiz, the next scene: <b>DNS</b>, where the phone finds out where WhatsApp's server lives."
  ],
  "WhatsApp khola, par server kahan hai?": [
   "WhatsApp is open, but where is the server?",
   "Henna opens <b>WhatsApp</b>. The app needs to talk to its chat server, named <b>g.whatsapp.net</b>. But the internet runs on <b>IP addresses</b>, not names, just like your phone saves \"Mum\" but the call goes to a number. The system that turns names into numbers is <b>DNS</b>, the internet's phonebook. First the phone checks its own memory (<b>cache</b>): nothing there."
  ],
  "Sawaal ghar se bahar nikla": [
   "The question leaves the house",
   "The phone asks its DNS server (the router, 192.168.1.1): <b>\"What is the IP of g.whatsapp.net?\"</b> This small packet goes to <b>UDP port 53</b>. The router passes it out of the house to the <b>ISP's DNS resolver</b>. The resolver is like a <b>librarian</b>: it will find the answer itself."
  ],
  "Root server: \"Mujhe nahi pata, .net walon se poocho\"": [
   "Root server: \"Don't know, ask the .net people\"",
   "The resolver's cache doesn't have it either, so it starts at the very top: a <b>root server</b>. There are 13 root server names in the world (a to m), with <b>thousands of copies</b> in different cities. The root doesn't know the full address, but it says where the <b>.net</b> servers are. This is called a <b>referral</b>, like a receptionist saying \"ask on the third floor\"."
  ],
  ".net server: \"whatsapp.net ka server yeh raha\"": [
   ".net server: \"Here is whatsapp.net's server\"",
   "Now the resolver asks a <b>.net TLD server</b>. TLD means <b>Top Level Domain</b>: .com, .net, .in and so on. It doesn't give the full answer either, but it says which DNS server belongs to <b>whatsapp.net</b>: <b>a.ns.whatsapp.net</b>."
  ],
  "WhatsApp ka DNS: asli jawab!": [
   "WhatsApp's DNS: the real answer!",
   "Finally the resolver asks the <b>authoritative server for whatsapp.net</b>. This is WhatsApp's own DNS server and it has the <b>definite answer</b>: <b>g.whatsapp.net = 157.240.16.60</b>. It comes with <b>TTL 300</b>, meaning the answer can be remembered for 300 seconds."
  ],
  "Jawab wapas, aur yaad bhi rakh liya": [
   "Answer back, and remembered",
   "The resolver sends the answer back to the phone and keeps it in its <b>cache</b>. The phone remembers it too. The whole run takes about <b>20 to 100 milliseconds</b>! Next time anyone asks, the answer comes straight from the <b>cache</b>. Watch the <b>TTL</b> countdown above the resolver."
  ],
  "Hamla: nakli jawab (DNS spoofing)": [
   "Attack: a fake answer (DNS spoofing)",
   "A hacker sends the resolver a <b>fake answer</b>: \"g.whatsapp.net = 203.0.113.66\" (the hacker's own server). If that worked, Henna's message would go to the hacker! The defence: the resolver puts a <b>random Query ID and port</b> on every question; if the fake answer's ID doesn't match, it is <b>dropped</b>. Answers for <b>DNSSEC</b> domains also carry a digital signature, and <b>DNS over HTTPS</b> encrypts the questions and answers."
  ],
  "Challenge 🎮: DNS ka raasta": [
   "Challenge 🎮: The DNS route",
   "You are the resolver's question <b>\"g.whatsapp.net?\"</b>. Visit the servers in the <b>right order</b>, exactly the way the resolver does."
  ],
  "Scene 2 ka quiz 🎯": [
   "Scene 2 quiz 🎯",
   "The whole DNS trip at a glance: phone → router → resolver → root → .net → whatsapp.net → back. Now <b>5 questions</b>, <b>+10 XP</b> for each right answer. Then Scene 3: the <b>TCP handshake</b>, where the phone shakes hands with WhatsApp's server for the first time."
  ],
  "Pehle haath milana zaroori hai": [
   "First, a handshake",
   "The phone now knows the server's IP: <b>157.240.16.60</b>. But before sending data it needs a solid <b>connection</b>, so that if something gets lost, someone notices. That's the job of <b>TCP</b> (Layer 4). Think of the IP address as a <b>building's address</b> and the <b>port</b> as a <b>flat number</b> inside it. WhatsApp's server listens on flat <b>443</b>, and the phone picks a random flat <b>51234</b> for itself."
  ],
  "1 · SYN: \"Hello, baat karoge?\"": [
   "1 · SYN: \"Hello, shall we talk?\"",
   "The phone sends a first packet with only the <b>SYN</b> flag set, meaning \"synchronize, shall we start?\" With it goes a <b>random sequence number</b> (Seq 2,904,117). This number will be used to count every byte from here on, like the serial number on a parcel."
  ],
  "2 · SYN-ACK: \"Haan, sun raha hoon\"": [
   "2 · SYN-ACK: \"Yes, I'm listening\"",
   "The server answers with <b>SYN + ACK</b>. The ACK number is <b>2,904,118</b>, the phone's number <b>+1</b>: \"got your SYN, send this one next.\" The server also sends its own random number (Seq 8,551,302)."
  ],
  "3 · ACK: connection pakka! 🤝": [
   "3 · ACK: connection set! 🤝",
   "The phone sends a final <b>ACK</b>: Ack <b>8,551,303</b> (the server's number +1). That's it! The <b>3-way handshake</b> is done and the connection is <b>ESTABLISHED</b>. It took one round trip, about <b>30 to 80 milliseconds</b>. Now there's a solid line between phone and server (the yellow pipe)."
  ],
  "Server ki pehchaan + taala (Noise handshake)": [
   "Server identity + lock (Noise handshake)",
   "TCP only builds the line; it gives <b>no security</b>. So a second handshake happens now. WhatsApp uses the <b>Noise protocol</b> here (on normal websites <b>TLS 1.3</b> does the same job). Phone and server swap <b>temporary keys</b>, and the server proves it holds <b>WhatsApp's real private key</b>. The proof checks out, so both build a session key and the pipe turns <b>purple (encrypted)</b>."
  ],
  "Packet kho gaya? TCP dobara bhejega": [
   "Packet lost? TCP sends it again",
   "On the internet a packet sometimes <b>gets lost on the way</b> (congestion, bad signal). Here one of the phone's encrypted packets vanished midway! The phone had set a <b>timer</b>. <b>No ACK came</b> in time, so TCP <b>sends the same packet again</b>. That's why WhatsApp messages never arrive half-finished."
  ],
  "Agar DNS spoof ho jaata toh?": [
   "What if DNS had been spoofed?",
   "Imagine the hacker from Scene 2 had succeeded and the phone connected to the hacker's server. <b>The TCP handshake would still work</b>, because TCP checks no identity! But in the Noise handshake the hacker <b>cannot prove WhatsApp's private key</b>. Wrong proof, so the phone <b>drops the connection</b> at once. That's why encryption is not only for hiding things, it is also for <b>identity</b>."
  ],
  "Challenge 🎮: Kis darwaze pe dastak?": [
   "Challenge 🎮: Which door to knock on?",
   "You are the <b>SYN</b> packet. Which <b>port</b> (flat number) on WhatsApp's server will you go to?"
  ],
  "Scene 3 ka quiz 🎯": [
   "Scene 3 quiz 🎯",
   "There is now a <b>solid, encrypted</b> line between the phone and WhatsApp's server. White dots keep moving on the pipe like real data and ACKs. Now <b>5 questions</b>, then Scene 4: <b>end-to-end encryption</b>, where \"Hi\" gets a lock only Riya can open."
  ],
  "Riya ne pehle hi apne \"khule taale\" rakh diye": [
   "Riya already left her \"open padlocks\"",
   "This is <b>Riya</b>, Henna's friend in another city. When Riya installed WhatsApp, her phone made two kinds of keys: a <b>private key</b> that never leaves the phone, and <b>public keys</b> that she put on WhatsApp's server. Imagine Riya left lots of <b>open padlocks</b> on the server, and only she has the key to them."
  ],
  "Henna ne Riya ka ek taala maanga": [
   "Henna asks for one of Riya's padlocks",
   "Henna types \"Hi\". It's her first message to Riya, so the phone asks the server: <b>\"Give me Riya's public keys.\"</b> The server sends Riya's <b>key bundle</b>. The phone checks that <b>Riya's signature</b> on the bundle is valid, so nobody can slip in a fake padlock along the way."
  ],
  "Rangon ka jaadu: ek secret dono ke paas": [
   "Colour magic: one secret, both sides",
   "Now Henna's phone does a trick called <b>X3DH</b>. Picture two colours: Henna's <b>yellow</b> (her private key) and Riya's <b>green</b> (her public key). Mixed together they make <b>purple</b>: the <b>shared secret</b>. Later Riya will make <b>the very same purple</b> from her private key and Henna's public key. Someone watching in the middle can <b>never</b> make that colour."
  ],
  "\"Hi\" pe pehla taala (end-to-end)": [
   "The first lock on \"Hi\" (end-to-end)",
   "The shared secret produces a <b>message key</b>, and <b>\"Hi\"</b> is locked with it using <b>AES-256</b>. \"Hi\" now looks like useless data, something like <b>8f2a91c4e7…</b>. This is the <b>inner lock</b>: only <b>Riya's phone</b> can open it. Not even WhatsApp."
  ],
  "Do taale: lifafe ke andar lifafa": [
   "Two locks: an envelope inside an envelope",
   "Now the locked \"Hi\" goes into the <b>encrypted pipe from Scene 3</b>, which puts a <b>second lock</b> on top. At the server the <b>outer lock</b> opens, so the server knows <b>who</b> to deliver to. But the <b>inner lock</b> stays shut. The server sees: \"From Henna to Riya, 64 bytes, 10:24\". Not the words."
  ],
  "Har message ki nayi chaabi (Double Ratchet)": [
   "A new key for every message (Double Ratchet)",
   "Henna sends a second message: \"How are you?\". It gets a <b>new key</b>, and the old one is <b>deleted</b>. It works like a <b>ratchet</b> (a wheel that only turns forward). Even if one key were somehow stolen, <b>earlier and later</b> messages stay safe."
  ],
  "Hacker ne raaste mein copy kar liya toh?": [
   "What if a hacker copies it on the way?",
   "A hacker grabs a <b>copy</b> of the packet from the middle of the pipe. What do they get? First the <b>outer lock</b> (Noise), and inside it the <b>inner lock</b> (Signal). Without both keys it's just junk like <b>8f2a91c4e7…</b>. The key exists <b>nowhere</b> except Riya's phone."
  ],
  "Security code: asli Riya hi hai na?": [
   "Security code: is it really Riya?",
   "One last safeguard: what if the <b>server itself</b> handed Henna a fake \"Riya key\"? For this WhatsApp has a <b>security code</b> (60 digits or a QR code) built from both people's keys. If Henna and Riya <b>scan the QR</b> or compare the digits and they match, nobody is in the middle. ✅"
  ],
  "Challenge 🎮: Kaunsa taala?": [
   "Challenge 🎮: Which lock?",
   "You are <b>\"Hi\"</b>. Pick a lock so that <b>nobody</b> on the way, not even WhatsApp's server, can read you. Only Riya."
  ],
  "Scene 4 ka quiz 🎯": [
   "Scene 4 quiz 🎯",
   "\"Hi\" is now waiting on the server, shut inside <b>two locks</b>, to reach Riya. Now <b>5 questions</b>, then Scene 5: <b>OSI layers</b>, where we see how \"Hi\" puts on 7 envelopes."
  ],
  "Phone ke andar 7 manzil ki factory": [
   "A 7-floor factory inside the phone",
   "The locked \"Hi\" was just <b>2 bytes</b> of text. Before it is sent, it travels down <b>7 floors</b> inside the phone, and each floor wraps it in an <b>envelope (header)</b> carrying the address that floor needs. This is called <b>encapsulation</b>. Top to bottom: L7 to L1. The <b>Packet anatomy</b> card on the right shows each envelope."
  ],
  "L7 · Application: WhatsApp ka lifafa": [
   "L7 · Application: WhatsApp's envelope",
   "At the top is the <b>WhatsApp app</b> itself. It puts the message in its own format: <b>to whom</b> (Riya's WhatsApp ID), the <b>message ID</b>, the time, and the type \"text\". This is the layer we see as users."
  ],
  "L6 · Presentation: format aur andar ka taala": [
   "L6 · Presentation: format and the inner lock",
   "Here the data's <b>format</b> is decided (WhatsApp uses a compact format called <b>protobuf</b>), and this is where Scene 4's <b>end-to-end lock</b> goes on. Think of this layer as a \"translator\": it shapes the data so the other side can understand it."
  ],
  "L5 · Session: baat-cheet chalu rakho": [
   "L5 · Session: keep the conversation going",
   "The session layer keeps the <b>connection alive</b>: which conversation is running, when it started, when to close it. WhatsApp's <b>Noise session</b> (the outer lock from Scene 3) sits here, and every so often it sends small <b>keep-alive</b> signals so the line doesn't drop."
  ],
  "L4 · Transport: TCP ka lifafa": [
   "L4 · Transport: the TCP envelope",
   "Now the <b>TCP header</b> goes on: <b>source port 51234</b>, <b>destination port 443</b>, sequence number, ACK number, flags and a <b>checksum</b>. Remember? <b>Port = flat number</b>. If the data were big, TCP would cut it into smaller <b>segments</b>."
  ],
  "L3 · Network: IP ka lifafa": [
   "L3 · Network: the IP envelope",
   "Now the <b>IP header</b>: <b>From 192.168.1.5</b>, <b>To 157.240.16.60</b>. This is the <b>real address</b> for the whole trip, and it stays the <b>same</b> from start to finish. It also carries <b>TTL 64</b>: each router takes 1 off, and at 0 the packet is dropped (so packets can't wander forever)."
  ],
  "L2 · Data link: pehle ARP se padosi ka MAC": [
   "L2 · Data link: first, ARP for the neighbour's MAC",
   "Layer 2 needs the hardware address (<b>MAC</b>) of the next <b>neighbour</b>. Who is the neighbour? The <b>router</b>, not WhatsApp! The phone shouts across the house: <b>\"Who has 192.168.1.1?\"</b> (ARP). The router says: \"Me, MAC <b>98:da:c4:5e:21:aa</b>\". Now the frame gets the phone's MAC and the router's MAC, plus an <b>FCS</b> at the end (an error-catching code). Wi-Fi's WPA2 lock is applied here too."
  ],
  "L1 · Physical: bits ban gaye tarangein": [
   "L1 · Physical: bits become waves",
   "Last floor: the whole frame is now just <b>0s and 1s</b>. The \"H\" in \"Hi\" = <b>01001000</b>, \"i\" = <b>01101001</b> (before locking). The Wi-Fi chip turns these bits into <b>2.4 GHz radio waves</b>, a wave that wiggles 2.4 billion times a second. On a wired network the same bits become <b>electricity</b>, or <b>light</b> in fibre."
  ],
  "Router pe ulta khel: lifafa badla, pata wahi": [
   "The reverse at the router: new envelope, same address",
   "The router turns the waves back into bits, <b>checks the FCS</b>, opens the Wi-Fi lock and <b>opens only L1 and L2 to read L3</b>: \"To 157.240.16.60\". Then it removes the old Wi-Fi envelope and puts on a <b>new L2 envelope</b> (new MACs) for the ISP link. <b>The IP address stays the same</b>, and the inner envelopes are never touched."
  ],
  "Challenge 🎮: Lifafe pehno": [
   "Challenge 🎮: Put on the envelopes",
   "You are \"Hi\", inside the phone. On the way down, put on the envelopes in the <b>right order</b>: the top layer first, the bottom layer last."
  ],
  "Scene 5 ka quiz 🎯": [
   "Scene 5 quiz 🎯",
   "\"Hi\" grew from 2 bytes to about <b>220 bytes</b>, with 6 envelopes and the waves. Now <b>5 questions</b>, then Scene 6: <b>home router and NAT</b>, where the router swaps the home's private address for a public one."
  ],
  "Ghar ka address bahar kaam nahi karta": [
   "A home address doesn't work outside",
   "<b>192.168.1.5</b> is a <b>private address</b>. Millions of homes around the world use the same number! Every building has a \"Flat 5\", but the outside world needs the building's <b>full address</b>. The ISP gave Henna's home a <b>public IP</b>: <b>198.51.100.24</b>. The router has two faces: inside (LAN) and outside (WAN)."
  ],
  "NAT: router ne pata badal diya": [
   "NAT: the router changes the address",
   "Henna's packet reaches the router: \"From <b>192.168.1.5:51234</b>\". Before sending it out, the router changes the <b>source</b> to \"From <b>198.51.100.24:40001</b>\". It writes in a <b>NAT table</b> that 40001 means Henna's phone. This is <b>NAT</b> (Network Address Translation)."
  ],
  "Ek public IP, kai devices (PAT)": [
   "One public IP, many devices (PAT)",
   "At the same moment the family laptop is playing YouTube, and by coincidence it also picked port <b>51234</b>! No problem: the router gives the laptop a different outside port, <b>40002</b>. This way <b>all the home's devices share one public IP</b>, with only the port numbers different. This is also called <b>PAT</b> (port address translation)."
  ],
  "Jawab aaya: router ne table dekhi": [
   "The reply arrives: the router checks its table",
   "WhatsApp's reply arrives: \"To <b>198.51.100.24:40001</b>\". The router checks its NAT table: 40001 = <b>Henna's phone</b>. It changes the destination back to <b>192.168.1.5:51234</b> and delivers it to the phone. The laptop never sees this packet."
  ],
  "Bahar se anjaan dastak: darwaza band": [
   "An unknown knock from outside: door shut",
   "A hacker knocks straight on the home's public IP: <b>198.51.100.24 port 22</b> (\"let me in\"). The router checks the NAT table: for this port there is <b>no connection started from inside</b>. The router's <b>stateful firewall</b> quietly <b>drops</b> the packet. That's why home devices aren't directly visible from outside. Note: <b>port forwarding</b> or UPnP deliberately punch holes in this door."
  ],
  "Router ko khud bhi suraksha chahiye": [
   "The router needs protecting too",
   "The router is the whole home's <b>guard</b>, so it has to be strong itself: change the <b>admin password</b> (not the default \"admin\"), keep the <b>firmware updated</b>, <b>turn off WPS</b>, use <b>WPA3</b> if you can, and keep devices like the smart TV on <b>guest Wi-Fi</b>. A weak router = the whole home's door left open."
  ],
  "IPv6: har device ka apna pata": [
   "IPv6: every device gets its own address",
   "IPv4 has only about <b>4.3 billion</b> addresses, which is why NAT was needed. The newer <b>IPv6</b> has so many that every device can get its own <b>public address</b>, like <b>2001:db8:1234::5</b>. Then NAT isn't needed. But security still is: the router's <b>firewall</b> still blocks unknown connections coming in from outside. Most networks today run IPv4 and IPv6 <b>together</b> (dual stack)."
  ],
  "Challenge 🎮: Tum ho router, NAT karo": [
   "Challenge 🎮: You are the router, do NAT",
   "Henna's packet is heading out. You are the <b>router</b>. What will you write in the packet's <b>source</b> now?"
  ],
  "Scene 6 ka quiz 🎯": [
   "Scene 6 quiz 🎯",
   "Both rows in the NAT table have a <b>timer</b> running; when the connection closes, the row goes away. Now <b>6 questions</b>, then Scene 7: <b>across the internet</b>, where the packet hops router to router, through cables under the sea, to WhatsApp."
  ],
  "Internet = networks ka jaal": [
   "Internet = a web of networks",
   "Past the ISP's gateway there isn't <b>one big internet</b>, but <b>thousands of separate networks</b> (ISPs, companies, universities) connected to each other. Each network is called an <b>AS</b> (Autonomous System), like Meta's <b>AS32934</b>. The packet doesn't know the full route. <b>Each router</b> only says who comes <b>next</b>, like asking for directions at every crossing."
  ],
  "Hop 3: ISP ka core router": [
   "Hop 3: the ISP's core router",
   "The packet reaches the ISP's <b>core router</b>. The router looks <b>only at the destination IP</b>: 157.240.16.60. Its <b>routing table</b> says: \"for <b>157.240.0.0/16</b>, send towards the <b>Internet Exchange</b>\". TTL <b>62 → 61</b>. All of this in about <b>a microsecond</b>."
  ],
  "IXP aur BGP: \"157.240.x mere paas hai\"": [
   "IXP and BGP: \"157.240.x is with me\"",
   "How was the route known? Through <b>BGP</b> (Border Gateway Protocol). Meta's edge router <b>announces</b> to the whole world: \"<b>157.240.0.0/16 is with me, AS32934</b>\". The news spreads router to router. Henna's ISP and Meta connect directly at an <b>Internet Exchange (IXP)</b> (peering), so the packet enters Meta's network right there. TTL <b>61 → 60</b>."
  ],
  "Meta ke network se WhatsApp server tak": [
   "Through Meta's network to WhatsApp's server",
   "From the IXP the packet goes to <b>Meta's edge router</b>, and from there to the <b>WhatsApp server</b>. TTL <b>60 → 59</b>. Done! From Henna's phone to the server in just <b>6 hops</b> and about <b>19 milliseconds</b>. The <b>traceroute</b> card on the left shows each hop's time. In real life it's often 8 to 15 hops."
  ],
  "Cable kat gaya! BGP ne naya raasta dhoondha": [
   "Cable cut! BGP finds a new route",
   "Suddenly the <b>fibre</b> between the IXP and Meta's edge is <b>cut</b> (construction work!). Meta's router sends word via BGP: \"<b>this route is down</b>\". Within seconds the routers pick a <b>backup route</b>: ISP core → <b>transit provider</b> → WhatsApp. The message takes a slightly longer way, but it <b>still arrives</b>. That's what the internet was built for: if one path breaks, use another."
  ],
  "TTL aur traceroute ka jaadu": [
   "The magic of TTL and traceroute",
   "One more TTL trick: <b>traceroute</b>. The phone deliberately sends a packet with <b>TTL 1</b>: the first router takes TTL to 0, stops it and sends back a <b>\"Time Exceeded\"</b> (ICMP) with its own address. Then TTL 2, then 3... Each time the router one hop further replies. That's how the whole route gets measured. And if a packet ever gets stuck <b>looping</b> between two routers, TTL eventually ends it too."
  ],
  "Desh ke bahar? Samundar ke neeche!": [
   "Abroad? Under the sea!",
   "If Riya were in <b>Singapore</b>, or the server in another country, the packet would travel through <b>fibre cables</b> laid <b>under the sea</b>. <b>More than 95%</b> of data between countries goes through these cables, not satellites! Inside the cable the data races as <b>flashes of light</b>: India to Singapore is about <b>4,000 km</b>, in just <b>~20 ms</b>."
  ],
  "Challenge 🎮: Kata cable, naya raasta": [
   "Challenge 🎮: Cut cable, new route",
   "The <b>cable</b> between the IXP and Meta's edge <b>is cut</b>. You are the packet, standing at the ISP gateway. Choose a <b>working route</b> to WhatsApp, hop by hop."
  ],
  "Scene 7 ka quiz 🎯": [
   "Scene 7 quiz 🎯",
   "The packet is standing at WhatsApp's door. But before it goes in there's a <b>security check</b>! Now <b>5 questions</b>, then Scene 8: <b>data center security</b>: DDoS shield, firewall, IDS/IPS and load balancer."
  ],
  "WhatsApp ke darwaze pe: suraksha ki parat": [
   "At WhatsApp's door: layers of security",
   "The cut cable has been repaired, and the packet is near WhatsApp's <b>data center</b>. There's no straight path to the server: there are several security walls, like the <b>layers of an onion</b>. Outside is the <b>traffic shield</b> (orange dome), then the <b>firewall</b> (red wall), then <b>IDS/IPS</b> (yellow radar), and inside the <b>load balancer</b>. This is called <b>defence in depth</b>: if one layer misses something, the next one catches it."
  ],
  "Traffic shield: bheed mein se asli pehchaano": [
   "Traffic shield: spot the real ones in the crowd",
   "Sometimes a server gets hit by <b>a huge amount of junk traffic</b> at once, leaving no room for real users. This is called <b>DDoS</b>. The outermost <b>traffic shield</b> recognises this crowd and stops it right there, and if needed spreads the traffic across <b>many data centers around the world</b>. Henna's real packet passes through without stopping."
  ],
  "Firewall: sirf zaroori darwaze khule": [
   "Firewall: only the needed doors open",
   "The <b>firewall</b> works from a rule list: \"<b>allow TCP 443 and 5222, deny everything else</b>\". An unknown packet arrives on a <b>closed port</b>: no rule matches, so <b>BLOCK</b>. Henna's packet is on port <b>443</b>: the rule matches, <b>ALLOW</b>. The firewall doesn't look inside the message, only at <b>IP, port and protocol</b> (Layers 3 and 4)."
  ],
  "IDS/IPS: chaukidaar jo aadatein pehchaanta hai": [
   "IDS/IPS: a guard who knows the patterns",
   "The firewall only checks the door. <b>IDS/IPS</b> is a smart <b>guard</b> that watches <b>behaviour</b>: is one address sending <b>far more</b> requests than normal? Does the traffic match a <b>known threat</b>? <b>IDS</b> only raises an alarm; <b>IPS</b> also blocks that source for a while. Henna's normal packet moves on."
  ],
  "Load balancer: sabse theek server chuno": [
   "Load balancer: pick the best server",
   "WhatsApp doesn't have one server, it has <b>thousands</b>. Every few seconds the <b>load balancer</b> runs a <b>health check</b> on all of them. Server C is <b>sick</b> (not responding), server B is <b>very crowded</b>. So the load balancer hands Henna's message to <b>server A</b>: healthy and less busy. That's why WhatsApp never goes fully down: if one server falls, the others take over."
  ],
  "Challenge 🎮: Tum ho firewall": [
   "Challenge 🎮: You are the firewall",
   "<b>Allow</b> or <b>Block</b> each packet. Remember the rule? <b>Allow TCP 443 and 5222</b>, block everything else."
  ],
  "Scene 8 ka quiz 🎯": [
   "Scene 8 quiz 🎯",
   "The message crossed four layers and reached <b>server A</b>. The radar keeps sweeping and the load balancer keeps running health checks. Now <b>5 questions</b>, then Scene 9: <b>inside the server</b>, where the message gets a tick."
  ],
  "Server pe bahar ka taala khula, andar ka nahi": [
   "At the server: the outer lock opens, the inner one doesn't",
   "Server A took the packet, removed all the envelopes (L1 to L4), and opened the <b>outer Noise lock</b>. Now it can see the <b>routing details</b>: <b>who</b> the message is for, the message ID, the time. But the actual \"Hi\" is still shut inside the <b>inner Signal lock</b>. To the server it's just <b>8f2a91c4e7…</b>."
  ],
  "Bhejne wala sach mein Henna hai?": [
   "Is the sender really Henna?",
   "The server knows for sure that <b>Henna</b> sent this message, because it came over the <b>encrypted connection</b> that Henna's phone built with <b>its own key</b> in Scene 3. Nobody else can say \"I'm Henna\" and drop in a message. This is called <b>authentication</b>."
  ],
  "Riya kahan hai? Directory se poocho": [
   "Where is Riya? Ask the directory",
   "Now the server asks the <b>user directory</b>: \"Is Riya <b>online</b> right now? Which server is she connected to?\" Answer: <b>Riya is offline</b>; her phone screen is off and so is her internet. So the message can't go right away."
  ],
  "Challenge 🎮: Tum ho server": [
   "Challenge 🎮: You are the server",
   "Riya is <b>offline</b>, and Henna's locked \"Hi\" has arrived. You are WhatsApp's server. What will you do?"
  ],
  "Queue mein sambhal ke rakha": [
   "Kept safe in the queue",
   "The server puts the locked \"Hi\" in a <b>message queue</b>, like a <b>\"for Riya\"</b> box at the post office. It stays <b>encrypted</b>. As soon as Riya receives it, the server <b>deletes</b> it. And if Riya doesn't come online for <b>30 days</b>, it is erased anyway."
  ],
  "Pehla tick ✓ : server tak pahunch gaya": [
   "First tick ✓ : it reached the server",
   "The server sends Henna's phone a small <b>receipt</b>: \"message received, it's safe with me\". On Henna's screen <b>one grey tick ✓</b> appears next to \"Hi\". Notice: <b>one tick does not mean Riya saw it</b>, only that the message safely reached <b>WhatsApp's server</b>."
  ],
  "Photo ka raasta alag hai 📷": [
   "Photos take a different route 📷",
   "If Henna sent a <b>photo</b> with \"Hi\", the photo wouldn't go through the chat server. The phone locks the photo with a <b>new random key</b> and uploads the locked file over <b>HTTPS</b> to a <b>media server</b>. Then a small end-to-end message goes to Riya with the <b>link, the key and a hash</b>. Riya's phone downloads the file and opens it itself. The media server only ever holds the <b>locked file</b>."
  ],
  "Scene 9 ka quiz 🎯": [
   "Scene 9 quiz 🎯",
   "\"Hi\" is waiting in the queue for Riya, and Henna's phone shows <b>✓</b>. The server is busy: other people's messages are coming and going too. Now <b>6 questions</b>, then Scene 10: <b>to Riya's phone</b>, push notification and <b>✓✓ blue ticks</b>."
  ],
  "Challenge 🎮: Riya ko jagao": [
   "Challenge 🎮: Wake Riya up",
   "Riya's phone is asleep. You are the server's <b>\"wake up\"</b> signal. Which way will you go?"
  ],
  "Soye phone ko jagao: push notification": [
   "Wake the sleeping phone: push notification",
   "Riya's phone is asleep and WhatsApp is closed. The server can't wake it directly. So it asks a <b>push service</b> (Google's <b>FCM</b> on Android, Apple's <b>APNs</b> on iPhone): \"wake Riya's phone\". The phone's system <b>always</b> keeps a thin connection to these services, so the phone <b>buzzes</b> at once. The push carries <b>no message text</b>, just the wake-up signal."
  ],
  "Riya ka phone online aaya": [
   "Riya's phone comes online",
   "Riya's phone wakes up and does everything Henna's phone did: <b>Wi-Fi handshake, DHCP, DNS, TCP handshake, Noise</b>. Then it tells the server: <b>\"I'm online, give me my messages.\"</b> Phones are fast; all of this takes less than a second."
  ],
  "Queue se nikla, Riya tak chala": [
   "Out of the queue, on to Riya",
   "The server takes the locked \"Hi\" out of the queue and sends it over Riya's <b>encrypted connection</b>. As soon as Riya's phone receives it, the server <b>erases it from its queue</b>. Now \"Hi\" exists in only <b>two places</b>: Henna's phone and Riya's phone."
  ],
  "Ulta safar: lifafe utarte hain (L1 → L7)": [
   "The reverse trip: envelopes come off (L1 → L7)",
   "On Riya's phone the <b>reverse</b> of Scene 5 happens, called <b>decapsulation</b>. Radio waves become bits (L1), the Wi-Fi frame opens (L2), the IP is checked (L3), TCP puts things in order (L4), the outer Noise lock opens (L5), and finally what's left is Signal's <b>locked box</b> (L6)."
  ],
  "Andar ka taala khula: \"Hi\" 💬": [
   "The inner lock opens: \"Hi\" 💬",
   "Now the magic that started in Scene 4. Riya's phone mixes its <b>private key</b> with Henna's <b>public key</b>, and out comes <b>the same purple shared secret</b> that Henna's phone made. From it comes the message key, the <b>HMAC seal</b> is checked (did anyone change it?), and the lock opens: <b>\"Hi\"</b>! Riya's screen shows: <b>Henna: Hi</b>."
  ],
  "Do grey tick ✓✓ : Riya ke phone tak pahuncha": [
   "Two grey ticks ✓✓ : it reached Riya's phone",
   "Riya's phone sends the server a <b>delivery receipt</b>, and the server passes it on to Henna. Henna's screen now shows <b>two grey ticks ✓✓</b>. Meaning: the message reached <b>Riya's phone</b>. Riya hasn't opened the chat to read it yet."
  ],
  "Blue ticks 💙 : Riya ne padh liya!": [
   "Blue ticks 💙 : Riya read it!",
   "Riya opens the chat and reads \"Hi\". Her phone sends a <b>read receipt</b>, and Henna's ticks turn <b>blue ✓✓</b>. If Riya had <b>turned off read receipts</b> in settings, the ticks would stay grey. That's it! The whole journey of \"Hi\" is over, in less than <b>a second</b> (when both are online)."
  ],
  "Group mein \"Hi\"? Pehle ek Sender Key": [
   "\"Hi\" in a group? First, a Sender Key",
   "Now Henna types \"Hi\" in the <b>\"College Friends\"</b> group: Riya, Aman and Sara. The first time, Henna's phone makes a <b>Sender Key</b> (the group key) and sends it to each member <b>separately</b>, inside their own end-to-end lock. The server can't see this key either."
  ],
  "Ek baar lock, server sabko baante": [
   "Lock once, the server shares it out",
   "Now Henna's phone locks every group message <b>just once</b> with the Sender Key and sends <b>a single copy</b> to the server. The server delivers it to <b>all three</b> (fan-out). This saves Henna's data and battery. In a group the ticks turn <b>blue</b> only when <b>everyone</b> has read it."
  ],
  "Scene 10 ka quiz 🎯": [
   "Scene 10 quiz 🎯",
   "\"Hi\" reached Riya and was read too! 💙 Now <b>6 questions</b>, then Scene 11: <b>antivirus and threats</b>, where we see what protects you around files and links."
  ],
  "Server andar nahi dekh sakta, toh phone ko dekhna hoga": [
   "The server can't look inside, so the phone must",
   "An <b>unknown number</b> sends Riya some messages. Remember, every message is <b>end-to-end locked</b>? That also means WhatsApp's server <b>can't look inside a file at all</b>. So the last line of defence is <b>on Riya's phone</b>: the phone's built-in protection (like <b>Play Protect</b> on Android) and antivirus, which check every new file and link."
  ],
  "Jaani-pehchaani buri file: signature se pakdi": [
   "A known bad file: caught by its signature",
   "The unknown number sends a file: <b>Prize_Winner.apk</b>. The phone's protection computes the file's <b>fingerprint</b> (hash) and compares it with a <b>list of bad files already caught</b>. Match! The file goes into <b>quarantine</b>, like shutting something sick in a separate room so it can't run."
  ],
  "Nayi file, list mein nahi: bartaav se pehchaan": [
   "A new file, not on the list: judged by behaviour",
   "The next file is <b>brand new</b> and on no list. Now the protection looks at its <b>behaviour</b>: why would a \"wallpaper app\" need <b>SMS, contacts and permission to draw over other apps</b>? This is a <b>heuristic</b> check: the job and the things it asks for don't fit, so the phone shows a <b>warning</b> and stops the install."
  ],
  "Nakli link: naam pe dhyan do": [
   "A fake link: look closely at the name",
   "Then a message: \"New features in <b>WhatsApp Gold</b>! Update here: <b>whatsapp-gold-update.example</b>\". That is not WhatsApp's real address. When the link opens, the browser's <b>safe browsing</b> compares it with a list of known fake sites and shows a <b>red warning</b>. Lesson: <b>read the domain name carefully</b>, and be suspicious of \"hurry, offer ends soon\" messages."
  ],
  "6 digit code? Kabhi share nahi!": [
   "A 6-digit code? Never share it!",
   "Finally the unknown number writes: \"I sent <b>my code</b> to your number by mistake, please tell me\". That is <b>WhatsApp's 6-digit login code</b>! Whoever knows it can run Riya's account <b>on their own phone</b>. Riya <b>doesn't share</b> the code, she <b>reports and blocks</b> the number, and keeps her <b>two-step verification PIN</b> on, so even if someone gets the code it's useless without the PIN."
  ],
  "Achhi aadatein = sabse mazboot antivirus": [
   "Good habits = the strongest antivirus",
   "The biggest protection is <b>habits</b>: keep the phone and apps <b>updated</b> (old bugs get fixed), get apps only from the <b>official store</b>, keep the <b>two-step PIN</b> on, <b>don't open</b> unknown files and links, and when in doubt, <b>report & block</b>. Technology protects layer by layer, but the final decision is a human one."
  ],
  "Challenge 🎮: Safe ya khatra?": [
   "Challenge 🎮: Safe or danger?",
   "You are Riya's <b>phone protection</b>. Mark each item <b>Safe</b> or <b>Danger</b>."
  ],
  "Scene 11 ka quiz 🎯": [
   "Scene 11 quiz 🎯",
   "Riya's phone is inside a green shield now and the scan ring keeps turning. Now <b>5 questions</b>, then the last one, Scene 12: <b>the big picture</b>, the whole journey at a glance."
  ],
  "Poora safar ek nazar mein 🗺️": [
   "The whole journey at a glance 🗺️",
   "Look from above! This is the <b>full route</b> of \"Hi\": Henna's phone → <b>home router</b> → <b>ISP gateway</b> → <b>ISP core</b> → <b>Internet Exchange</b> → <b>Meta edge</b> → <b>data center</b> → <b>WhatsApp server</b> → <b>Riya's phone</b>. Each stop lights up as the orange line passes through it."
  ],
  "Kitna time laga? ⏱️": [
   "How long did it take? ⏱️",
   "When both phones are online and the connection already exists, \"Hi\" takes about <b>45 milliseconds</b> to get from Henna to Riya. A <b>blink</b> takes ~300 ms, so \"Hi\" could make the trip <b>6 times</b> in one blink! The card on the left shows where the time went. Most of it goes on <b>distance</b> (light in fibre)."
  ],
  "Raaste ki 9 suraksha parat 🛡️": [
   "9 layers of security on the way 🛡️",
   "On this short trip \"Hi\" was protected by <b>9 different layers</b>: the Wi-Fi lock, DNS checks, Noise's outer lock, Signal's inner lock, the router's NAT/firewall, BGP's backup routes, the data center's walls, the phone's protection, and most important of all: <b>your own good sense</b>. If one layer breaks, the others hold."
  ],
  "Final quiz: poore safar ka test 🏆": [
   "Final quiz: test the whole journey 🏆",
   "You've seen the whole journey: from Wi-Fi to blue ticks! Now <b>6 questions</b> from all the scenes. Get them all right and you are a <b>\"Message Journey Master\"</b>! 🎓"
  ]
 },
 "quiz": {
  "Wi-Fi password router tak kaise pahunchta hai?": {
   "q": "How does the Wi-Fi password reach the router?",
   "o": [
    "Sent as plain text",
    "Sent encrypted",
    "It isn't sent at all; both sides build the key",
    "Through a QR code"
   ],
   "why": "The password is never sent. Both sides build the same key from password + ANonce + SNonce, and the MIC proves the password is right."
  },
  "Phone ko 192.168.1.5 address kisne diya?": {
   "q": "Who gave the phone the address 192.168.1.5?",
   "o": [
    "The DNS server",
    "The router's DHCP server",
    "WhatsApp's server",
    "The mobile tower"
   ],
   "why": "The home router is also the DHCP server. It hands out the IP, mask, gateway and DNS."
  },
  "DHCP Discover ka destination IP kya hota hai?": {
   "q": "What is the destination IP of a DHCP Discover?",
   "o": [
    "192.168.1.1",
    "0.0.0.0",
    "255.255.255.255",
    "8.8.8.8"
   ],
   "why": "255.255.255.255 means \"everyone\". The phone doesn't know the DHCP server's address yet, so it asks everybody. 0.0.0.0 is the phone's own address until it gets an IP."
  },
  "DHCP ka sahi order kya hai?": {
   "q": "What is the right DHCP order?",
   "o": [
    "Discover → Offer → Request → Acknowledge",
    "Request → Offer → Discover → Acknowledge",
    "Discover → Request → Offer → Acknowledge",
    "Offer → Discover → Acknowledge → Request"
   ],
   "why": "DORA: Discover, Offer, Request, Acknowledge."
  },
  "Mobile data pe phone ko IP kaun deta hai?": {
   "q": "On mobile data, who gives the phone its IP?",
   "o": [
    "The home router",
    "The mobile company (via the SIM)",
    "WhatsApp",
    "A root server"
   ],
   "why": "On mobile data the SIM identifies the phone and the mobile company gives the IP, often a shared (CGNAT) address like 100.64.x.x."
  },
  "DNS ka main kaam kya hai?": {
   "q": "What is DNS's main job?",
   "o": [
    "Encrypting messages",
    "Turning a domain name into an IP address",
    "Giving the phone an IP address",
    "Scanning for viruses"
   ],
   "why": "DNS is the internet's phonebook: g.whatsapp.net → 157.240.16.60. Giving the phone an IP was DHCP's job (Scene 1)."
  },
  "Normal DNS query kaunse port pe jaati hai?": {
   "q": "Which port does a normal DNS query use?",
   "o": [
    "80",
    "443",
    "53",
    "67"
   ],
   "why": "DNS uses port 53, mostly over UDP. 443 is HTTPS (DNS over HTTPS uses it too), 67 is DHCP."
  },
  "Root server ne resolver ko kya bataya?": {
   "q": "What did the root server tell the resolver?",
   "o": [
    "WhatsApp's IP address",
    "Where the .net TLD servers are (a referral)",
    "Henna's Wi-Fi password",
    "Nothing, it blocked the request"
   ],
   "why": "The root only knows who runs each TLD (.com, .net, .in). So it points to the .net servers."
  },
  "g.whatsapp.net ka pakka jawab kisne diya?": {
   "q": "Who gave the definite answer for g.whatsapp.net?",
   "o": [
    "A root server",
    "A .net TLD server",
    "whatsapp.net's authoritative server",
    "The home router"
   ],
   "why": "The authoritative server is the domain owner's (WhatsApp's) own DNS server. The real record lives there."
  },
  "Nakli DNS jawab kaise pakda gaya?": {
   "q": "How was the fake DNS answer caught?",
   "o": [
    "Its Query ID didn't match the question",
    "It arrived too fast",
    "It contained a virus",
    "The router made a noise"
   ],
   "why": "The resolver puts a random ID and port on every question. If the answer's ID doesn't match, it's dropped. DNSSEC signatures and DNS over HTTPS add more protection."
  },
  "TCP 3-way handshake ka sahi order kya hai?": {
   "q": "What is the right order of the TCP 3-way handshake?",
   "o": [
    "ACK → SYN → SYN-ACK",
    "SYN → SYN-ACK → ACK",
    "SYN → ACK → FIN",
    "HELLO → OK → BYE"
   ],
   "why": "The phone sends SYN, the server SYN-ACK, then the phone ACK. Three packets, hence \"3-way\"."
  },
  "Phone ne WhatsApp server ke kaunse port pe connect kiya?": {
   "q": "Which port on WhatsApp's server did the phone connect to?",
   "o": [
    "53",
    "67",
    "443",
    "51234"
   ],
   "why": "The server was listening on 443. 51234 was the phone's own random port, 53 is DNS and 67 is DHCP."
  },
  "SYN-ACK mein Ack number 2,904,118 kyon tha?": {
   "q": "Why was the Ack number in the SYN-ACK 2,904,118?",
   "o": [
    "The server's random number",
    "The phone's Seq (2,904,117) + 1",
    "Double the port number",
    "A time stamp"
   ],
   "why": "Ack = \"I've received up to here, send this one next\". So it's the phone's number + 1."
  },
  "Packet raaste mein kho jaaye toh TCP kya karta hai?": {
   "q": "What does TCP do if a packet is lost on the way?",
   "o": [
    "Nothing, the message stays incomplete",
    "If no ACK comes, it resends the same packet",
    "It builds a new connection",
    "It blocks the router"
   ],
   "why": "A timer runs for every segment. If the ACK doesn't arrive in time, it is retransmitted with the same sequence number."
  },
  "Fake server ko phone ne kaise pakda?": {
   "q": "How did the phone catch the fake server?",
   "o": [
    "The TCP handshake failed",
    "Its IP was short",
    "It couldn't prove it had WhatsApp's private key",
    "The router said so"
   ],
   "why": "A TCP handshake works even with a fake server. Identity comes from the key proof in the Noise/TLS handshake."
  },
  "End-to-end encryption mein \"Hi\" kaun padh sakta hai?": {
   "q": "With end-to-end encryption, who can read \"Hi\"?",
   "o": [
    "WhatsApp's server",
    "Henna's and Riya's phones",
    "The internet provider",
    "Anyone who grabs the packet"
   ],
   "why": "The inner lock opens only with Riya's private key. Anyone in the middle, even the server, sees only junk."
  },
  "Riya ki private key kahan rehti hai?": {
   "q": "Where does Riya's private key live?",
   "o": [
    "On WhatsApp's server",
    "In Henna's phone",
    "Only in Riya's phone",
    "In a Google Drive backup"
   ],
   "why": "The private key is made on the phone and never uploaded. Only public keys (open padlocks) go to the server."
  },
  "\"Do taale\" kaun se hain?": {
   "q": "What are the \"two locks\"?",
   "o": [
    "Wi-Fi password and PIN",
    "Inner: end-to-end (Henna ↔ Riya), outer: transport (phone ↔ server)",
    "Two different passwords",
    "SYN and ACK"
   ],
   "why": "Only Riya opens the Signal protocol lock. The server opens the outer Noise lock so it can route the message."
  },
  "Har message ke liye nayi key kyon?": {
   "q": "Why a new key for every message?",
   "o": [
    "The phone runs faster",
    "If one key is stolen, the other messages stay safe",
    "To save battery",
    "To give the server less work"
   ],
   "why": "The Double Ratchet turns forward with each message and deletes old keys. This is called forward secrecy."
  },
  "Security code (QR / 60 numbers) kis liye hai?": {
   "q": "What is the security code (QR / 60 digits) for?",
   "o": [
    "Resetting the account password",
    "Checking that nobody slipped in a fake key",
    "Sending messages faster",
    "Making a group"
   ],
   "why": "The code is built from both people's identity keys. If it's the same on both sides, no middleman (not even the server) is handing out a fake key."
  },
  "Encapsulation ka matlab kya hai?": {
   "q": "What does encapsulation mean?",
   "o": [
    "Deleting the message",
    "Each layer adds its own header (envelope) to the data",
    "Compressing the data",
    "Changing the Wi-Fi password"
   ],
   "why": "On the way down each layer adds its header (encapsulation). On the other side they come off in reverse order (decapsulation)."
  },
  "Port numbers (51234 → 443) kis layer pe hote hain?": {
   "q": "At which layer are port numbers (51234 → 443)?",
   "o": [
    "L2 Data link",
    "L3 Network",
    "L4 Transport",
    "L7 Application"
   ],
   "why": "TCP and UDP are Layer 4, and ports live in their headers."
  },
  "Henna ke Wi-Fi frame ka destination MAC kiska hai?": {
   "q": "Whose MAC is the destination of Henna's Wi-Fi frame?",
   "o": [
    "WhatsApp's server",
    "Riya's phone",
    "The home router",
    "The DNS resolver"
   ],
   "why": "Layer 2 only goes to the next neighbour. The first neighbour is the router, so it's the router's MAC. WhatsApp's address is in L3 (IP)."
  },
  "Router packet ka kaunsa hissa padh ke raasta chunta hai?": {
   "q": "Which part of the packet does a router read to choose the route?",
   "o": [
    "The L3 destination IP",
    "The L7 message text",
    "The L4 sequence number",
    "The inner E2E lock"
   ],
   "why": "A router is a Layer 3 device: it opens L1 and L2 and reads the destination IP. It doesn't touch the inner envelopes."
  },
  "Router pe kya badalta hai aur kya same rehta hai?": {
   "q": "At a router, what changes and what stays the same?",
   "o": [
    "The IP changes, the MAC stays",
    "The MAC (L2 envelope) changes, the destination IP stays",
    "Both stay the same",
    "The message text changes"
   ],
   "why": "Each hop builds a new L2 frame (new MACs), but the destination IP stays the same for the whole trip. TTL drops by 1."
  },
  "192.168.1.5 jaisa address internet pe seedha kyon nahi chalta?": {
   "q": "Why doesn't an address like 192.168.1.5 work directly on the internet?",
   "o": [
    "It's too long",
    "It's a private range, the same in millions of homes",
    "It has a virus",
    "It's only the Wi-Fi password"
   ],
   "why": "10.x, 172.16–31.x and 192.168.x are private ranges. Internet routers don't forward them."
  },
  "Bahar jaate packet mein NAT kya badalta hai?": {
   "q": "What does NAT change in an outgoing packet?",
   "o": [
    "The destination IP",
    "The source IP and port (private → public)",
    "The encrypted message",
    "Only the MAC address"
   ],
   "why": "From 192.168.1.5:51234 → From 198.51.100.24:40001. The destination stays the same."
  },
  "Phone aur laptop dono ne port 51234 liya. Router kya karega?": {
   "q": "The phone and the laptop both picked port 51234. What does the router do?",
   "o": [
    "Blocks the laptop",
    "Gives each a different public port (40001, 40002)",
    "Gives both the same port",
    "Shuts down the internet"
   ],
   "why": "PAT: one public IP, a different public port for each connection. The NAT table remembers who is who."
  },
  "Jawab aane pe router ko kaise pata chalta hai ki kis device ko dena hai?": {
   "q": "When a reply arrives, how does the router know which device gets it?",
   "o": [
    "By reading the message",
    "By looking up the public port in the NAT table",
    "It sends it to everyone",
    "By asking DNS"
   ],
   "why": "To 198.51.100.24:40001 → table row → 192.168.1.5:51234 (Henna's phone)."
  },
  "Bahar se anjaan connection (port 22) aaya. Router ne kya kiya?": {
   "q": "An unknown connection (port 22) came from outside. What did the router do?",
   "o": [
    "Let it in",
    "Found no match in the NAT table and quietly dropped it",
    "Sent the hacker a password",
    "Forwarded it to the phone"
   ],
   "why": "A stateful firewall only lets in replies to connections that started from inside."
  },
  "IPv6 mein NAT ki zaroorat kyon nahi padti?": {
   "q": "Why doesn't IPv6 need NAT?",
   "o": [
    "IPv6 is slow",
    "There are so many addresses that every device can get its own public one",
    "IPv6 has no firewall",
    "The router switches off"
   ],
   "why": "IPv6 is 128-bit. No NAT is needed, but the firewall still blocks unknown connections coming in from outside."
  },
  "Router packet ka raasta kaise chunta hai?": {
   "q": "How does a router choose a packet's route?",
   "o": [
    "The full route is written in advance",
    "It looks at the destination IP and picks the next hop from its routing table",
    "By reading the message",
    "Randomly, anyone will do"
   ],
   "why": "Each router only picks the next hop, using the routing table's \"longest prefix match\"."
  },
  "BGP ka kaam kya hai?": {
   "q": "What is BGP's job?",
   "o": [
    "Checking the Wi-Fi password",
    "Networks tell each other which IPs they have",
    "Encrypting messages",
    "Virus scanning"
   ],
   "why": "Meta announces \"157.240.0.0/16 is with me (AS32934)\". That's how routers around the world learn the way."
  },
  "Har router pe TTL ka kya hota hai?": {
   "q": "What happens to TTL at each router?",
   "o": [
    "It goes up by 1",
    "It goes down by 1; at 0 the packet is dropped",
    "It stays the same",
    "It doubles"
   ],
   "why": "TTL stops packets from wandering forever. At 0 the router sends back \"Time Exceeded\"."
  },
  "Fibre kat gaya toh kya hua?": {
   "q": "What happened when the fibre was cut?",
   "o": [
    "The message was lost forever",
    "BGP picked a backup route and the message arrived",
    "Henna had to buy a new phone",
    "WhatsApp shut down"
   ],
   "why": "The internet is built with multiple paths. If one link breaks, routers pick a new route within seconds."
  },
  "Desh se desh zyada tar data kaise jaata hai?": {
   "q": "How does most data travel between countries?",
   "o": [
    "By satellite",
    "Through fibre cables under the sea",
    "Through radio towers",
    "On pen drives"
   ],
   "why": "More than 95% of international data goes through undersea fibre cables, close to the speed of light."
  },
  "DDoS mein kya hota hai?": {
   "q": "What happens in a DDoS?",
   "o": [
    "A password is stolen",
    "So much junk traffic arrives that there's no room for real users",
    "The message gets encrypted",
    "The Wi-Fi switches off"
   ],
   "why": "A DDoS aims to take a service down (availability). The traffic shield filters out the junk traffic."
  },
  "Firewall kya dekh ke faisla karta hai?": {
   "q": "What does a firewall look at to decide?",
   "o": [
    "The words of the message",
    "IP, port and protocol",
    "The user's photo",
    "The battery level"
   ],
   "why": "A firewall works with rules at Layer 3/4: \"allow TCP 443, deny the rest\"."
  },
  "\"Default deny\" ka matlab?": {
   "q": "What does \"default deny\" mean?",
   "o": [
    "Allow everything",
    "Anything not allowed by a rule is denied",
    "Block only at night",
    "Block every other packet"
   ],
   "why": "Open only the ports you need; everything else is closed automatically. It's the safest approach."
  },
  "IDS aur IPS mein kya fark hai?": {
   "q": "What's the difference between IDS and IPS?",
   "o": [
    "No difference",
    "IDS raises an alarm, IPS also blocks",
    "IPS is only for Wi-Fi",
    "IDS reads the message"
   ],
   "why": "Detection System vs Prevention System. Both watch behaviour and patterns of known threats."
  },
  "Load balancer ne server C ko kyon chhod diya?": {
   "q": "Why did the load balancer skip server C?",
   "o": [
    "It didn't like its name",
    "Its health check failed (no response)",
    "It was the fastest",
    "Riya wasn't there"
   ],
   "why": "A load balancer only sends traffic to healthy servers, and picks the least busy of them."
  },
  "WhatsApp server kaunsa taala khol sakta hai?": {
   "q": "Which lock can WhatsApp's server open?",
   "o": [
    "Both locks",
    "Only the outer one (transport/Noise)",
    "Only the inner one (Signal)",
    "Neither"
   ],
   "why": "The outer lock only reaches the server, so it can route the message. Only Riya's phone opens the inner one."
  },
  "Server ko kaise pata ki message Henna ne hi bheja?": {
   "q": "How does the server know Henna really sent the message?",
   "o": [
    "Her name was written in the message",
    "It came over the encrypted connection built with Henna's phone's key",
    "Riya said so",
    "The router said so"
   ],
   "why": "Henna's phone built the Scene 3 Noise connection with its own key. That's how the sender is authenticated."
  },
  "Riya offline hai. Server kya karta hai?": {
   "q": "Riya is offline. What does the server do?",
   "o": [
    "Deletes the message",
    "Reads it and sends an SMS",
    "Keeps the encrypted message in a queue",
    "Sends Henna an error"
   ],
   "why": "The locked message waits in the queue until Riya comes online. Once delivered, it is erased from the server."
  },
  "Ek grey tick ✓ ka matlab kya hai?": {
   "q": "What does one grey tick ✓ mean?",
   "o": [
    "Riya read the message",
    "The message reached Riya's phone",
    "The message reached WhatsApp's server",
    "The message failed"
   ],
   "why": "✓ = reached the server. ✓✓ grey = reached Riya's phone. ✓✓ blue = Riya read it."
  },
  "Undelivered message server pe kitne din tak reh sakta hai?": {
   "q": "How long can an undelivered message stay on the server?",
   "o": [
    "1 hour",
    "30 days",
    "Forever",
    "1 year"
   ],
   "why": "According to WhatsApp, a message that isn't delivered is deleted from the server after about 30 days."
  },
  "Photo bhejne pe media server ko kya milta hai?": {
   "q": "When a photo is sent, what does the media server get?",
   "o": [
    "The plain photo",
    "Only the locked (encrypted) file",
    "The photo's key",
    "Riya's password"
   ],
   "why": "The photo is locked on the phone with a random key. The key and link go to Riya in an end-to-end message."
  },
  "Riya ka phone so raha tha. Use kisne jagaya?": {
   "q": "Riya's phone was asleep. Who woke it up?",
   "o": [
    "Henna, by calling",
    "A push service (FCM on Android, APNs on iPhone)",
    "The DNS server",
    "The router"
   ],
   "why": "WhatsApp's server asks the push service, and the phone always keeps a light connection to that service."
  },
  "Kya Google ki push service \"Hi\" padh sakti hai?": {
   "q": "Can Google's push service read \"Hi\"?",
   "o": [
    "Yes, the whole message",
    "No, a push only carries a wake-up signal or locked data",
    "Only the first word",
    "Only at night"
   ],
   "why": "The message is end-to-end locked. The push only wakes the phone; then the phone fetches the message from WhatsApp's server itself."
  },
  "Riya ke phone pe layers kis order mein khulti hain?": {
   "q": "In what order do the layers open on Riya's phone?",
   "o": [
    "L7 to L1",
    "L1 to L7 (decapsulation)",
    "Randomly",
    "Only L3"
   ],
   "why": "On the sender L7 → L1 (encapsulation), on the receiver L1 → L7 (decapsulation)."
  },
  "\"Hi\" ka andar wala taala kisne khola?": {
   "q": "Who opened the inner lock on \"Hi\"?",
   "o": [
    "WhatsApp's server",
    "The push service",
    "Riya's phone, with its private key",
    "Henna's router"
   ],
   "why": "Riya's private key + Henna's public key make the same shared secret, and only Riya's phone can do that."
  },
  "Do neele tick ✓✓ ka matlab?": {
   "q": "What do two blue ticks ✓✓ mean?",
   "o": [
    "It reached the server",
    "It reached Riya's phone, but she hasn't read it",
    "Riya read it",
    "The message failed"
   ],
   "why": "✓ server, ✓✓ grey Riya's phone, ✓✓ blue Riya read it (if read receipts are on)."
  },
  "Group message mein Henna ka phone kitni copies bhejta hai?": {
   "q": "In a group message, how many copies does Henna's phone send?",
   "o": [
    "One for each member",
    "Just one; the server shares it out",
    "Zero",
    "Two"
   ],
   "why": "With the Sender Key it locks once and sends one copy. The server delivers it to every member (fan-out)."
  },
  "WhatsApp server bheji gayi file ko scan kyon nahi kar sakta?": {
   "q": "Why can't WhatsApp's server scan a file that was sent?",
   "o": [
    "The server is slow",
    "The file is end-to-end encrypted, the server can't look inside",
    "The file is too small",
    "The server is off at night"
   ],
   "why": "E2E encryption means only Riya's phone can open the file. So the scan happens on the phone too."
  },
  "Signature scan kaise kaam karta hai?": {
   "q": "How does a signature scan work?",
   "o": [
    "By reading the file's name",
    "By matching the file's fingerprint (hash) against a list of known bad files",
    "By checking the file's size",
    "By checking the sender's name"
   ],
   "why": "Every file has a unique fingerprint. A match on the list sends the file to quarantine."
  },
  "Bilkul nayi buri file (list mein nahi) kaise pakdi jaati hai?": {
   "q": "How is a brand-new bad file (not on any list) caught?",
   "o": [
    "It can't be caught",
    "By behaviour (heuristics): what it asks for and what it tries to do",
    "By its colour",
    "By asking Riya's friend"
   ],
   "why": "Behaviour checks see whether an app's job matches the permissions it asks for."
  },
  "\"whatsapp-gold-update.example\" link aaya. Kya karein?": {
   "q": "A \"whatsapp-gold-update.example\" link arrived. What should you do?",
   "o": [
    "Update right away",
    "Don't open it: it's not WhatsApp's real domain",
    "Forward it to all your friends",
    "Type in your password"
   ],
   "why": "There's no such thing as WhatsApp Gold. Read the domain name carefully, and be suspicious of urgent messages."
  },
  "Koi WhatsApp ka 6 digit code maange toh?": {
   "q": "Someone asks for your WhatsApp 6-digit code. What then?",
   "o": [
    "Give it, they're a friend",
    "Never share it; report & block, keep the 2-step PIN on",
    "Give half the code",
    "Change it and give it"
   ],
   "why": "With the code anyone can run your account on their phone. Real WhatsApp or a bank will never ask for it."
  },
  "Henna ke phone ko 192.168.1.5 kisne diya?": {
   "q": "Who gave Henna's phone 192.168.1.5?",
   "o": [
    "The DNS server",
    "The router's DHCP server",
    "WhatsApp",
    "The ISP's core router"
   ],
   "why": "Scene 1: DHCP's DORA (Discover, Offer, Request, Acknowledge)."
  },
  "g.whatsapp.net ko IP address mein kisne badla?": {
   "q": "Who turned g.whatsapp.net into an IP address?",
   "o": [
    "DNS",
    "NAT",
    "TCP",
    "BGP"
   ],
   "why": "Scene 2: DNS is the internet's phonebook: root → .net → whatsapp.net."
  },
  "SYN → SYN-ACK → ACK kiska hissa hai?": {
   "q": "SYN → SYN-ACK → ACK is part of what?",
   "o": [
    "The Wi-Fi handshake",
    "The TCP handshake",
    "Signal encryption",
    "DHCP"
   ],
   "why": "Scene 3: TCP's 3-way handshake builds a solid connection."
  },
  "WhatsApp server \"Hi\" kyon nahi padh sakta?": {
   "q": "Why can't WhatsApp's server read \"Hi\"?",
   "o": [
    "The server's screen is small",
    "The inner Signal lock opens only with Riya's private key",
    "The message was too fast",
    "The router hid it"
   ],
   "why": "Scene 4: end-to-end encryption. The server only opens the outer lock."
  },
  "Ghar ke private IP ko public IP se kaun badalta hai?": {
   "q": "Who swaps the home's private IP for a public IP?",
   "o": [
    "Riya's phone",
    "The home router (NAT)",
    "A root server",
    "The load balancer"
   ],
   "why": "Scene 6: the NAT table holds the private ↔ public mapping."
  },
  "Henna ko ✓✓ blue kab dikhte hain?": {
   "q": "When does Henna see ✓✓ blue?",
   "o": [
    "When the message reaches the server",
    "When it reaches Riya's phone",
    "When Riya reads it (read receipts on)",
    "Never"
   ],
   "why": "Scene 10: ✓ server, ✓✓ grey Riya's phone, ✓✓ blue read."
  }
 },
 "str": {
  "Router hi ghar ka DHCP server hai. Wahi IP, gateway aur DNS deta hai.": "The router is the home's DHCP server. It hands out the IP, gateway and DNS.",
  "TV khud ek client hai: woh IP leta hai, deta nahi.": "The TV is a client itself: it takes an IP, it doesn't give one.",
  "Laptop bhi client hai, DHCP server nahi.": "The laptop is a client too, not a DHCP server.",
  "Yeh ghar ke bahar hai aur Wi-Fi ka hissa hi nahi. Isse baat nahi karni.": "This is outside the house and not part of the Wi-Fi. Don't talk to it.",
  "Root se hi shuru hota hai. Woh batata hai .net kaun sambhalta hai.": "It starts at the root. The root says who runs .net.",
  "Root ne kaha: .net walon se poocho.": "The root said: ask the .net people.",
  ".net TLD ka pata pehle root batata hai.": "The root tells you where the .net TLD is first.",
  ".net ne bataya: a.ns.whatsapp.net se poocho.": ".net said: ask a.ns.whatsapp.net.",
  "whatsapp.net ka server kaunsa hai, yeh pehle .net TLD batata hai.": "The .net TLD tells you which server runs whatsapp.net first.",
  "Asli jawab mila: 157.240.16.60": "Real answer: 157.240.16.60",
  "Riya ka phone DNS server nahi hai.": "Riya's phone is not a DNS server.",
  "Haan! WhatsApp server 443 pe sun raha hai.": "Yes! WhatsApp's server is listening on 443.",
  "Port 53 DNS ka hai, chat ka nahi.": "Port 53 is for DNS, not chat.",
  "Port 23 Telnet hai: purana, asurakshit, aur band rehta hai.": "Port 23 is Telnet: old, insecure, and kept closed.",
  "Port 67 DHCP server ka hai.": "Port 67 belongs to the DHCP server.",
  "Riya ki public key se bana shared secret": "A shared secret from Riya's public key",
  "Bilkul! Ise sirf Riya ki private key khol sakti hai.": "Exactly! Only Riya's private key can open it.",
  "Henna ka Wi-Fi password": "Henna's Wi-Fi password",
  "Wi-Fi ka taala sirf router tak hai. Router ke baad khul jaata hai.": "The Wi-Fi lock only reaches the router. After the router it comes off.",
  "WhatsApp server ki key": "WhatsApp server's key",
  "Tab server tumhe khol ke padh sakta tha.": "Then the server could open you and read you.",
  "Koi taala nahi": "No lock",
  "Raaste mein koi bhi tumhe padh leta.": "Anyone on the way could read you.",
  "Upar se neeche jao: L7 pehle, L1 aakhir mein.": "Go top to bottom: L7 first, L1 last.",
  "L7 ka lifafa chadh gaya.": "L7 envelope is on.",
  "L6 ka lifafa chadh gaya.": "L6 envelope is on.",
  "L5 ka lifafa chadh gaya.": "L5 envelope is on.",
  "L4 ka lifafa chadh gaya.": "L4 envelope is on.",
  "L3 ka lifafa chadh gaya.": "L3 envelope is on.",
  "L2 ka lifafa chadh gaya.": "L2 envelope is on.",
  "L1 ka lifafa chadh gaya.": "L1 envelope is on.",
  "Sahi! Ghar ka public IP aur ek naya port. NAT table mein likh lo.": "Right! The home's public IP and a new port. Note it in the NAT table.",
  "Yeh private address hai. Bahar ke routers ise aage nahi bhejte.": "That's a private address. Outside routers won't forward it.",
  "Yeh destination hai, source nahi.": "That's the destination, not the source.",
  "Yeh broadcast address hai, sirf ghar ke andar ke liye.": "That's the broadcast address, only for inside the home.",
  "Pehla hop ISP core hi hai.": "The first hop is the ISP core.",
  "ISP core pe pahunche. TTL 61.": "Reached the ISP core. TTL 61.",
  "IXP se aage Meta edge ka cable kata hai. Wahan se raasta band.": "Past the IXP the cable to Meta's edge is cut. The route is closed there.",
  "Meta edge tak pahunchne wala cable kata hua hai.": "The cable to Meta's edge is cut.",
  "Transit tak ISP core ke through hi jaate hain.": "You get to transit through the ISP core.",
  "Backup raasta! TTL 60.": "Backup route! TTL 60.",
  "Seedha nahi kood sakte. Pehle routers se guzarna hoga.": "You can't jump straight there. You have to pass through the routers first.",
  "Pahunch gaye! TTL 59.": "Arrived! TTL 59.",
  "Port 443 WhatsApp ke liye allowed hai.": "Port 443 is allowed for WhatsApp.",
  "Port 23 allow list mein nahi hai.": "Port 23 isn't on the allow list.",
  "Port 5222 bhi WhatsApp ke liye allowed hai.": "Port 5222 is allowed for WhatsApp too.",
  "UDP 1900 allow list mein nahi hai.": "UDP 1900 isn't on the allow list.",
  "Allow": "Allow",
  "Block": "Block",
  "Queue mein locked rakho, Henna ko ✓ bhejo": "Keep it locked in the queue, send Henna ✓",
  "Sahi! Riya online aate hi deliver hoga.": "Right! It's delivered as soon as Riya comes online.",
  "Khol ke padho aur SMS kar do": "Open it, read it and send an SMS",
  "Server andar ka taala khol hi nahi sakta. Aur karna bhi nahi chahiye.": "The server can't open the inner lock at all. And it shouldn't.",
  "Delete kar do": "Delete it",
  "Message kho jaata, Riya ko kabhi nahi milta.": "The message would be lost and Riya would never get it.",
  "Henna ko error bhejo": "Send Henna an error",
  "Offline hona error nahi hai. Server intezaar karta hai.": "Being offline isn't an error. The server waits.",
  "Haan! Phone push service se hamesha ek halki si connection rakhta hai.": "Yes! The phone always keeps a light connection to the push service.",
  "DNS sirf naam ko IP mein badalta hai, phone nahi jagaata.": "DNS only turns names into IPs; it doesn't wake phones.",
  "Root server sirf TLD ka pata batata hai.": "A root server only tells you where a TLD is.",
  "Henna ka router": "Henna's router",
  "Henna ka router Riya ke phone se juda hi nahi hai.": "Henna's router isn't connected to Riya's phone at all.",
  "Henna ki photo (contact)": "Henna's photo (contact)",
  "Jaani-pehchaani contact ki photo, aur scan bhi saaf.": "A photo from a known contact, and the scan is clean.",
  "Prize_Winner.apk (anjaan number)": "Prize_Winner.apk (unknown number)",
  "Anjaan number se app file, aur fingerprint buri list mein.": "An app file from an unknown number, and its fingerprint is on the bad list.",
  "Yeh asli WhatsApp domain nahi hai. \"WhatsApp Gold\" hota hi nahi.": "That's not WhatsApp's real domain. \"WhatsApp Gold\" doesn't exist.",
  "\"Apna 6 digit code bhejo\"": "\"Send me your 6-digit code\"",
  "Code se koi bhi account le sakta hai. Kabhi share mat karo.": "With the code anyone can take the account. Never share it.",
  "Mummy ka voice note": "Mum's voice note",
  "Jaani-pehchaani contact ka normal message.": "A normal message from a known contact.",
  "Safe": "Safe",
  "Khatra": "Danger"
 },
 "meta": {
  "1": {
   "next": "Scene 2 · DNS: the phone finds out where WhatsApp's server lives.",
   "full": "Full marks! You've got the Wi-Fi handshake and DHCP down."
  },
  "2": {
   "next": "Scene 3 · TCP handshake: the phone and WhatsApp's server shake hands for the first time.",
   "full": "Full marks! You've got the whole DNS route down."
  },
  "3": {
   "next": "Scene 4 · End-to-end encryption: a lock on \"Hi\" that only Riya can open.",
   "full": "Full marks! You've got SYN, SYN-ACK, ACK and the key check down."
  },
  "4": {
   "next": "Scene 5 · OSI layers: how \"Hi\" puts on 7 envelopes.",
   "full": "Full marks! You've got the two locks, X3DH and the Double Ratchet down."
  },
  "5": {
   "next": "Scene 6 · Home router & NAT: how a home's private address becomes a public one.",
   "full": "Full marks! You've got the 7 layers and encapsulation down."
  },
  "6": {
   "next": "Scene 7 · Across the internet: router-to-router hops, BGP and undersea cables.",
   "full": "Full marks! You've got NAT, PAT and the stateful firewall down."
  },
  "7": {
   "next": "Scene 8 · Data center security: shield, firewall, IDS/IPS and load balancer.",
   "full": "Full marks! You've got routing, BGP and TTL down."
  },
  "8": {
   "next": "Scene 9 · Inside the server: the queue, the receipt and the first tick.",
   "full": "Full marks! You've got defence in depth down."
  },
  "9": {
   "next": "Scene 10 · To Riya's phone: push notification, delivery and blue ticks.",
   "full": "Full marks! You've got what happens inside the server down."
  },
  "10": {
   "next": "Scene 11 · Antivirus & threats: protecting files and links on the phone.",
   "full": "Full marks! You've got push, decapsulation and the ticks down."
  },
  "11": {
   "next": "Scene 12 · Big picture: the whole journey, the timeline and 9 layers of security.",
   "full": "Full marks! You've got device protection and safe habits down."
  },
  "12": {
   "next": "Congratulations! You've learned the whole journey of \"Hi\". 🎓",
   "full": "Full marks! You are a Message Journey Master! 🏆"
  }
 },
 "hook": {
  "1": "How a phone gets on the internet",
  "2": "From a name to an address",
  "3": "The first handshake with the server",
  "4": "A lock only Riya can open",
  "5": "7 envelopes on \"Hi\"",
  "6": "The home's front door: router and NAT",
  "7": "Router to router, across the sea",
  "8": "Security at WhatsApp's door",
  "9": "Inside the server",
  "10": "On to Riya's phone",
  "11": "The last line of defence on the phone",
  "12": "The whole journey at a glance"
 }
};
