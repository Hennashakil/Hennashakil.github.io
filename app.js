/* Henna Shakil: portfolio. Two live parts: whycant's latest release from the
   GitHub API, and the chmod calculator API running on Render. */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- whycant's latest release, from the GitHub API ---------- */

  var CACHE_KEY = "hs-whycant", CACHE_MS = 600000;
  function cacheGet() {
    try { var c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); if (c && Date.now() - c.t < CACHE_MS) return c.d; } catch (e) {}
    return null;
  }
  function cacheSet(d) { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} }
  function day(iso) { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }

  function showRelease(d) {
    var rel = d.filter(function (r) { return !r.draft; }), latest = rel[0];
    if (!latest) return;
    var downloads = rel.reduce(function (n, r) {
      return n + r.assets.reduce(function (m, a) { return m + (a.download_count || 0); }, 0);
    }, 0);
    $("ws-version").textContent = latest.tag_name;
    $("ws-downloads").textContent = downloads.toLocaleString("en-IN");
    $("now-meta").textContent = "Released " + day(latest.published_at) + " · live from GitHub";
    var a = $("now-main").querySelector("a");
    a.textContent = "whycant " + latest.tag_name;
    a.href = latest.html_url;
    $("live-dot").classList.add("on");
  }

  (function loadRelease() {
    var cached = cacheGet();
    if (cached) { showRelease(cached); return; }
    fetch("https://api.github.com/repos/Hennashakil/whycant/releases?per_page=30", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw new Error("GitHub said " + r.status); return r.json(); })
      .then(function (list) {
        var d = list.map(function (x) {
          return { tag_name: String(x.tag_name), published_at: x.published_at, html_url: String(x.html_url), draft: !!x.draft,
                   assets: (x.assets || []).map(function (a) { return { download_count: +a.download_count || 0 }; }) };
        });
        // Only follow links that really point to the whycant repository
        d = d.filter(function (x) { return x.html_url.indexOf("https://github.com/Hennashakil/whycant/") === 0; });
        cacheSet(d); showRelease(d);
      })
      .catch(function () { /* keep the built-in text */ });
  })();

  /* ---------- chmod calculator: the Flask API on Render ---------- */

  var APIS = ["https://chmod-calculator-59m0.onrender.com", "https://chmod-calculator-1.onrender.com"];
  var MODE_RE = /^([0-7]{3,4}|[-dlbcps]?[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-])$/;
  var LEVEL = { danger: "Danger", warn: "Careful", info: "Note", ok: "OK" };
  var askOut = $("ask-out"), askIn = $("ask-mode"), askBtn = $("ask-btn");

  // Ask the first server; if it fails, ask the second one
  function callApi(i, mode) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 75000);
    return fetch(APIS[i] + "/api/mode/" + encodeURIComponent(mode), ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) {
        clearTimeout(timer);
        return r.json().then(function (j) { return { status: r.status, body: j, server: APIS[i] }; });
      })
      .catch(function (e) {
        clearTimeout(timer);
        if (i + 1 < APIS.length) return callApi(i + 1, mode);
        throw e;
      });
  }

  function showAnswer(res) {
    if (res.status === 400) { askOut.innerHTML = '<p class="err" role="alert">' + esc(res.body.error || "Not a permission mode.") + "</p>"; return; }
    if (res.status !== 200) throw new Error("status " + res.status);
    var b = res.body, sym = String(b.symbolic);
    var html = '<p class="api-mode"><span>' + esc(sym.slice(0, 3)) + "</span><span>" + esc(sym.slice(3, 6)) + "</span><span>" + esc(sym.slice(6, 9)) + "</span></p>";
    html += '<p class="mono">Octal ' + esc(b.octal) + (b.special && b.special.length ? ", with " + esc(b.special.join(" and ")) : "") + "</p>";
    html += '<div class="table-scroll" tabindex="0" role="region" aria-label="Who can do what"><table class="who"><thead><tr><th scope="col">Who</th><th scope="col">On a file</th><th scope="col">On a folder</th></tr></thead><tbody>';
    (b.classes || []).forEach(function (c) {
      html += "<tr><td><b>" + esc(c.who.charAt(0).toUpperCase() + c.who.slice(1)) + "</b> <code>" + esc(c.digit) + "</code></td><td>" +
        esc((c.file || []).join(", ")) + "</td><td>" + esc((c.folder || []).join(", ")) + "</td></tr>";
    });
    html += '</tbody></table></div><ul class="flags">';
    (b.warnings || []).forEach(function (w) {
      var lvl = LEVEL[w.level] ? w.level : "info";
      html += '<li class="' + lvl + '"><b>' + LEVEL[lvl] + "</b> " + esc(w.text) + "</li>";
    });
    html += "</ul><p>Set it with <code>" + esc(b.chmod_octal) + "</code> or <code>" + esc(b.chmod_symbolic) +
      '</code>. Answered live by <a href="' + esc(res.server) + "/?mode=" + encodeURIComponent(b.octal) + '">' + esc(res.server.replace("https://", "")) + "</a>.</p>";
    askOut.innerHTML = html;
  }

  function ask(mode) {
    mode = mode.trim();
    if (!MODE_RE.test(mode)) {
      askOut.innerHTML = '<p class="err" role="alert">That isn’t a permission. Use 3 or 4 digits (750, 4755) or 9 letters (rwxr-x---).</p>';
      return;
    }
    askBtn.disabled = true; askBtn.textContent = "Asking…";
    askOut.innerHTML = '<p class="waking">Asking the server…</p>';
    var slow = setTimeout(function () {
      askOut.innerHTML = '<p class="waking">Waking up the server. It sleeps when nobody uses it, so the first answer can take up to a minute.</p>';
    }, 2500);
    callApi(0, mode).then(showAnswer).catch(function () {
      askOut.innerHTML = '<p class="err" role="alert">The server didn’t answer. Try again in a minute, or open the <a href="' + APIS[0] + '">chmod calculator</a> directly.</p>';
    }).then(function () { clearTimeout(slow); askBtn.disabled = false; askBtn.textContent = "Explain"; });
  }

  $("ask").addEventListener("submit", function (e) { e.preventDefault(); ask(askIn.value); });
  document.querySelectorAll("#ask-presets [data-mode]").forEach(function (b) {
    b.addEventListener("click", function () { askIn.value = b.dataset.mode; ask(b.dataset.mode); });
  });

  // Wake the servers when the demo comes into view, so the first answer is quicker
  var woke = false;
  function wake() { if (woke) return; woke = true; APIS.forEach(function (u) { fetch(u + "/healthz", { mode: "no-cors" }).catch(function () {}); }); }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es, obs) { if (es.some(function (x) { return x.isIntersecting; })) { wake(); obs.disconnect(); } },
      { rootMargin: "300px" }).observe($("check"));
  }
  askIn.addEventListener("focus", wake);
})();
