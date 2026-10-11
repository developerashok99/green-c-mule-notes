/* Study tools: quizzes, flashcards, Review Today (spaced repetition), My Mistakes,
   tests / mock exam, mock interview, DataWeave practice, Today dashboard,
   keyboard shortcuts, text size and focus mode.
   Each widget is a <div data-study="..."> with inline JSON (<script>) or data-src.
   Everything you do is saved only in this browser (localStorage). */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const DAY = 86400000;
  const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY);
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  }
  function pre(s) { return "<pre><code>" + esc(s) + "</code></pre>"; }
  function button(text, primary, onclick) {
    const b = el("button", "md-button" + (primary ? " md-button--primary" : ""), text);
    b.type = "button"; b.onclick = onclick; return b;
  }
  // site root, so links in the shared JSON files work from any page
  function siteBase() {
    try { const c = JSON.parse(document.getElementById("__config").textContent); return new URL(c.base + "/", location.href); }
    catch (e) { return new URL("./", location.href); }
  }
  function link(src) { return new URL(src, siteBase()).href; }

  const store = {
    get(k, d) { try { const v = localStorage.getItem("mule." + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("mule." + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- spaced repetition (Leitner boxes) ---------- */
  const INTERVALS = [0, 1, 3, 7, 21, 60];       // days until the card comes back, per box
  const srs = {
    all() { return store.get("srs", {}); },
    grade(id, known) {
      if (!id) return;
      const s = srs.all(), cur = s[id] || [0, today()];
      const box = known ? Math.min(cur[0] + 1, INTERVALS.length - 1) : 0;
      s[id] = [box, today() + (known ? INTERVALS[box] : 1)];
      store.set("srs", s);
    },
    due(cards) { const s = srs.all(), t = today(); return cards.filter(c => s[c.id] && s[c.id][1] <= t); },
    fresh(cards) { const s = srs.all(); return cards.filter(c => !s[c.id]); }
  };

  /* ---------- quiz mistakes ---------- */
  const mistakes = {
    all() { return store.get("mistakes", {}); },
    record(id, correct) {
      if (!id) return;
      const m = mistakes.all();
      if (correct) delete m[id]; else m[id] = (m[id] || 0) + 1;
      store.set("mistakes", m);
    }
  };

  /* ---------- keyboard: one active widget per page ---------- */
  let keyHandler = null;
  document.addEventListener("keydown", e => {
    if (!keyHandler) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || "")) || e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    keyHandler(e);
  });

  async function dataOf(box) {
    if (box.dataset.src) return (await fetch(box.dataset.src)).json();
    return JSON.parse(box.querySelector("script").textContent);
  }

  /* ================= quiz ================= */
  // opts: {timer: seconds, report: true (score per lecture), onDone()}
  function quiz(area, data, opts) {
    opts = opts || {};
    let qs, i, score, wrong, results, deadline, tick;
    function start(list) {
      qs = shuffle(list).map(q => Object.assign({}, q, { order: shuffle(q.options.map((t, k) => ({ t, ok: k === q.answer }))) }));
      i = 0; score = 0; wrong = []; results = [];
      clearInterval(tick);
      if (opts.timer) { deadline = Date.now() + opts.timer * 1000; tick = setInterval(timerTick, 1000); }
      show();
    }
    function timerTick() {
      if (!area.isConnected) return clearInterval(tick);
      const left = Math.max(0, deadline - Date.now()), t = area.querySelector(".st-timer");
      if (t) t.textContent = `⏱ ${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, "0")} left`;
      if (left <= 0) { clearInterval(tick); i = qs.length; show(true); }
    }
    function show(timeUp) {
      area.innerHTML = "";
      if (i >= qs.length) return finish(timeUp);
      const q = qs[i];
      const head = el("div", "st-progress", `Question ${i + 1} of ${qs.length} · Score ${score}` + (q.lecture && opts.report ? ` · ${esc(q.lecture)}` : ""));
      if (opts.timer) head.appendChild(el("span", "st-timer", ""));
      area.appendChild(head);
      if (opts.timer) timerTick();
      area.appendChild(el("div", "st-q", fmt(q.q)));
      const box = el("div", "st-opts"), fb = el("div", "st-feedback");
      fb.setAttribute("aria-live", "polite");
      let done = false;
      const btns = q.order.map((o, k) => {
        const b = el("button", "st-opt", `<span class="st-key">${k + 1}</span>${fmt(o.t)}`);
        b.type = "button";
        b.onclick = () => answer(o, b);
        box.appendChild(b);
        return b;
      });
      function answer(o, b) {
        if (done) return; done = true;
        btns.forEach((x, k) => { if (q.order[k].ok) x.classList.add("st-right"); });
        mistakes.record(q.id, o.ok);
        results.push({ q, ok: o.ok });
        if (o.ok) { score++; fb.innerHTML = "<strong>Correct.</strong> " + fmt(q.explain || ""); fb.classList.add("ok"); }
        else { b.classList.add("st-wrong"); wrong.push(q); fb.innerHTML = "<strong>Not quite.</strong> " + fmt(q.explain || ""); fb.classList.add("bad"); }
        if (q.src && opts.report) fb.appendChild(el("div", "st-src", `<a href="${link(q.src + "notes/")}">Revise in the ${esc(q.lecture)} notes →</a>`));
        const next = button(i + 1 < qs.length ? "Next question ⏎" : "See result", true, () => { i++; show(); });
        next.classList.add("st-next");
        fb.appendChild(el("div")).appendChild(next);
      }
      area.appendChild(box); area.appendChild(fb);
      keyHandler = e => {
        if (!area.isConnected) return;
        const n = parseInt(e.key, 10);
        if (!done && n >= 1 && n <= btns.length) { e.preventDefault(); btns[n - 1].click(); }
        else if (done && e.key === "Enter") { e.preventDefault(); area.querySelector(".st-next").click(); }
      };
    }
    function finish(timeUp) {
      clearInterval(tick);
      keyHandler = null;
      const pct = qs.length ? Math.round((score / qs.length) * 100) : 0;
      area.appendChild(el("div", "st-result", (timeUp ? "⏱ Time is up. " : "") +
        `You scored <strong>${score} / ${qs.length}</strong> (${pct}%).` + (opts.timer ? ` ${pct >= 70 ? "Pass." : "Below the 70% pass mark."}` : "")));
      if (opts.report && results.length) {
        const by = {};
        results.forEach(r => { const k = r.q.lecture || "—"; (by[k] = by[k] || { ok: 0, n: 0, src: r.q.src }).n++; if (r.ok) by[k].ok++; });
        const rows = Object.entries(by).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n);
        const t = el("table", "st-report");
        t.innerHTML = "<thead><tr><th>Lecture</th><th>Score</th><th></th></tr></thead><tbody>" + rows.map(([k, v]) =>
          `<tr><td>${esc(k)}</td><td>${v.ok} / ${v.n}</td><td>${v.src ? `<a href="${link(v.src + "notes/")}">Revise</a>` : ""}</td></tr>`).join("") + "</tbody>";
        area.appendChild(el("div", "st-label", "Score by lecture (weakest first)"));
        area.appendChild(t);
      }
      const row = el("div", "st-row");
      row.appendChild(button("Start again", true, () => (opts.onDone ? opts.onDone() : start(data))));
      if (wrong.length) row.appendChild(button(`Retry the ${wrong.length} I missed`, false, () => start(wrong.map(q => Object.assign({}, q)))));
      area.appendChild(row);
    }
    start(data);
  }

  /* ================= flashcards ================= */
  // opts: {onDone(known, total), showLecture}
  function cards(area, data, opts) {
    opts = opts || {};
    let deck, known, total;
    function start(list) { deck = shuffle(list); known = 0; total = list.length; show(); }
    function show() {
      area.innerHTML = "";
      if (!deck.length) {
        keyHandler = null;
        if (opts.onDone) return opts.onDone(known, total);
        area.appendChild(el("div", "st-result", "All cards done — every card is marked <strong>Know it</strong>."));
        area.appendChild(button("Start again", true, () => start(data)));
        return;
      }
      const c = deck[0];
      area.appendChild(el("div", "st-progress", `${deck.length} card${deck.length > 1 ? "s" : ""} left · ${known} known` +
        (c.src && opts.showLecture ? ` · <a href="${link(c.src)}">${esc(c.lecture)}</a>` : "")));
      const card = el("div", "st-card");
      card.appendChild(el("div", "st-face st-front", fmt(c.front)));
      card.appendChild(el("div", "st-face st-back", fmt(c.back)));
      card.appendChild(el("div", "st-hint", "Click or press Space to flip"));
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Flashcard — press Enter or Space to flip");
      const flip = () => { card.classList.toggle("flipped"); card.setAttribute("aria-pressed", card.classList.contains("flipped")); };
      card.onclick = flip;
      card.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); flip(); } };
      area.appendChild(card);
      const row = el("div", "st-row");
      const again = button("← Again", false, () => { srs.grade(c.id, false); deck.push(deck.shift()); show(); });
      const know = button("Know it →", true, () => { srs.grade(c.id, true); deck.shift(); known++; show(); });
      row.appendChild(again); row.appendChild(know);
      area.appendChild(row);
      keyHandler = e => {
        if (!area.isConnected) return;
        if (e.code === "Space") { e.preventDefault(); flip(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); again.click(); }
        else if (e.key === "ArrowRight") { e.preventDefault(); know.click(); }
      };
    }
    start(data);
  }

  /* ================= Review Today ================= */
  function review(box, all) {
    const area = el("div", "st-area");
    box.appendChild(area);
    function home() {
      keyHandler = null;
      area.innerHTML = "";
      const due = srs.due(all), fresh = srs.fresh(all), s = srs.all();
      const learned = Object.keys(s).length, wellKnown = Object.values(s).filter(v => v[0] >= 4).length;
      area.appendChild(el("div", "st-stats",
        `<div><b>${due.length}</b><span>due today</span></div><div><b>${learned}</b><span>cards started</span></div>` +
        `<div><b>${wellKnown}</b><span>well known (21+ days)</span></div><div><b>${fresh.length}</b><span>not seen yet</span></div>`));
      if (due.length) area.appendChild(button(`Review ${due.length} due card${due.length > 1 ? "s" : ""}`, true, () => run(due)));
      else area.appendChild(el("p", "", learned ? "Nothing due today — well done. Learn some new cards below." : "Start by learning some new cards."));
      const ctl = el("div", "st-row");
      const num = el("select", "st-select"), sel = el("select", "st-select");
      [10, 20, 30].forEach(n => num.appendChild(new Option(`${n} new cards`, n)));
      num.value = 20;
      sel.appendChild(new Option("in course order", "__order"));
      [...new Set(all.map(c => c.phase))].forEach(p => sel.appendChild(new Option(p, p)));
      ctl.appendChild(el("span", "", "Learn"));
      ctl.appendChild(num); ctl.appendChild(sel);
      ctl.appendChild(button("Start", !due.length, () => {
        let pool = fresh;
        if (sel.value !== "__order") pool = pool.filter(c => c.phase === sel.value);
        pool = pool.slice(0, +num.value);
        if (pool.length) run(pool); else alert("No unseen cards left there.");
      }));
      area.appendChild(ctl);
    }
    function run(list) {
      area.innerHTML = "";
      area.appendChild(button("← Back to Review Today", false, home));
      const holder = el("div");
      area.appendChild(holder);
      cards(holder, list, {
        showLecture: true,
        onDone: (known, total) => {
          holder.innerHTML = "";
          holder.appendChild(el("div", "st-result", `Session done: ${total} card${total > 1 ? "s" : ""}. Missed cards come back tomorrow; known cards later.`));
          holder.appendChild(button("Back to Review Today", true, home));
        }
      });
    }
    home();
  }

  /* ================= My Mistakes ================= */
  function mistakesPage(box, bank) {
    const area = el("div", "st-area");
    box.appendChild(area);
    function home() {
      keyHandler = null;
      area.innerHTML = "";
      const m = mistakes.all();
      const list = bank.filter(q => m[q.id]);
      if (!list.length) {
        area.appendChild(el("p", "", "No mistakes saved. Wrong answers from any quiz, test or mock exam will appear here."));
        return;
      }
      area.appendChild(el("p", "", `<strong>${list.length}</strong> question${list.length > 1 ? "s" : ""} to fix, from ${new Set(list.map(q => q.lecture)).size} lecture(s).`));
      const row = el("div", "st-row");
      row.appendChild(button(`Retry all ${list.length}`, true, () => run(list)));
      row.appendChild(button("Clear the list", false, () => { if (confirm("Remove all saved mistakes?")) { store.set("mistakes", {}); home(); } }));
      area.appendChild(row);
      const by = {};
      list.forEach(q => (by[q.lecture] = by[q.lecture] || []).push(q));
      Object.entries(by).forEach(([lec, qs]) => {
        const d = el("details", "st-mist");
        d.appendChild(el("summary", "", `${esc(lec)} — ${qs.length} question${qs.length > 1 ? "s" : ""}`));
        qs.forEach(q => d.appendChild(el("p", "", "• " + fmt(q.q) + ` <span class="st-dim">(missed ${m[q.id]}×)</span>`)));
        const r = el("div", "st-row");
        r.appendChild(button("Retry these", false, () => run(qs)));
        const a = el("a", "", "Revise the notes"); a.href = link(qs[0].src + "notes/"); r.appendChild(a);
        d.appendChild(r);
        area.appendChild(d);
      });
    }
    function run(list) {
      area.innerHTML = "";
      area.appendChild(button("← Back to My Mistakes", false, home));
      const holder = el("div");
      area.appendChild(holder);
      quiz(holder, list, { report: true, onDone: home });
    }
    home();
  }

  /* ================= Tests & Mock Exam ================= */
  function tests(box, bank) {
    const area = el("div", "st-area");
    box.appendChild(area);
    const phases = [...new Set(bank.map(q => q.phase))];
    function home() {
      keyHandler = null;
      area.innerHTML = "";
      const grid = el("div", "st-tests");
      phases.forEach(p => {
        const pool = bank.filter(q => q.phase === p);
        const c = el("div", "st-test", `<b>${esc(p)}</b><span>${Math.min(30, pool.length)} random questions from ${pool.length}</span>`);
        c.appendChild(button("Start test", false, () => run(shuffle(pool).slice(0, 30), null, `${p} — phase test`)));
        grid.appendChild(c);
      });
      const fin = el("div", "st-test st-final", `<b>Final mock exam</b><span>60 questions from every phase · 120 minutes · pass 70%</span>`);
      fin.appendChild(button("Start the exam", true, () => {
        const per = {};
        shuffle(bank).forEach(q => (per[q.phase] = per[q.phase] || []).push(q));
        const pick = [], keys = Object.keys(per);
        while (pick.length < 60 && keys.some(k => per[k].length)) keys.forEach(k => { if (pick.length < 60 && per[k].length) pick.push(per[k].pop()); });
        run(pick, 120 * 60, "Final mock exam");
      }));
      grid.appendChild(fin);
      area.appendChild(grid);
    }
    function run(list, timer, title) {
      area.innerHTML = "";
      area.appendChild(button("← All tests", false, () => { if (confirm("Leave this test?")) home(); }));
      area.appendChild(el("h2", "", esc(title)));
      const holder = el("div");
      area.appendChild(holder);
      quiz(holder, list, { report: true, timer, onDone: home });
    }
    home();
  }

  /* ================= Mock Interview ================= */
  function interview(box, all) {
    const pool = all.filter(c => /\?\s*\**\s*$/.test(c.front));
    const area = el("div", "st-area");
    box.appendChild(area);
    function home() {
      keyHandler = null;
      area.innerHTML = "";
      area.appendChild(el("p", "", `${pool.length} interview questions from all lectures.`));
      const ctl = el("div", "st-row");
      const sel = el("select", "st-select"), num = el("select", "st-select");
      sel.appendChild(new Option("All topics", ""));
      [...new Set(pool.map(c => c.phase))].forEach(p => sel.appendChild(new Option(p, p)));
      [10, 20, 30].forEach(n => num.appendChild(new Option(`${n} questions`, n)));
      ctl.appendChild(sel); ctl.appendChild(num);
      ctl.appendChild(button("Start the interview", true, () => run(shuffle(pool.filter(c => !sel.value || c.phase === sel.value)).slice(0, +num.value))));
      area.appendChild(ctl);
    }
    function run(list) {
      let i = 0, t0, tick;
      const res = [];
      function show() {
        clearInterval(tick);
        area.innerHTML = "";
        if (i >= list.length) return done();
        const c = list[i];
        const head = el("div", "st-progress", `Question ${i + 1} of ${list.length} · ${esc(c.lecture)}`);
        const timer = el("span", "st-timer", "⏱ 0:00");
        head.appendChild(timer);
        area.appendChild(head);
        t0 = Date.now();
        tick = setInterval(() => {
          if (!area.isConnected) return clearInterval(tick);
          const s = Math.floor((Date.now() - t0) / 1000);
          timer.textContent = `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
          timer.classList.toggle("st-late", s > 120);
        }, 1000);
        area.appendChild(el("div", "st-q st-iq", fmt(c.front)));
        area.appendChild(el("p", "st-dim", "Answer out loud as you would in the interview (aim for under 2 minutes), then reveal the model answer."));
        const ans = el("div", "st-model", "<div class='st-label'>Model answer</div>" + fmt(c.back));
        ans.style.display = "none";
        area.appendChild(ans);
        const row = el("div", "st-row");
        const reveal = button("Show model answer (Space)", true, () => {
          ans.style.display = ""; reveal.remove(); clearInterval(tick);
          [["Good", true, "1"], ["Partial", false, "2"], ["Missed", false, "3"]].forEach(([t, ok, k]) =>
            row.appendChild(button(`${k} · ${t}`, t === "Good", () => { srs.grade(c.id, ok); res.push({ c, t }); i++; show(); })));
        });
        row.appendChild(reveal);
        area.appendChild(row);
        keyHandler = e => {
          if (!area.isConnected) return;
          if (e.code === "Space" && reveal.isConnected) { e.preventDefault(); reveal.click(); }
          else if (!reveal.isConnected && ["1", "2", "3"].includes(e.key)) { e.preventDefault(); row.querySelectorAll("button")[+e.key - 1].click(); }
        };
      }
      function done() {
        keyHandler = null;
        const n = t => res.filter(r => r.t === t).length;
        area.appendChild(el("div", "st-result", `Interview done: <strong>${n("Good")}</strong> good, <strong>${n("Partial")}</strong> partial, <strong>${n("Missed")}</strong> missed.`));
        const weak = res.filter(r => r.t !== "Good");
        if (weak.length) {
          area.appendChild(el("p", "", "These are now scheduled in <strong>Review Today</strong>:"));
          weak.forEach(r => {
            const d = el("details", "st-mist");
            d.appendChild(el("summary", "", fmt(r.c.front) + ` <span class="st-dim">(${r.t}, ${esc(r.c.lecture)})</span>`));
            d.appendChild(el("p", "", fmt(r.c.back)));
            area.appendChild(d);
          });
        }
        area.appendChild(button("New interview", true, home));
      }
      show();
    }
    home();
  }

  /* ================= DataWeave practice ================= */
  function dataweave(box, list) {
    list.forEach((x, n) => {
      const d = el("div", "st-dw");
      d.appendChild(el("h3", "", `${n + 1}. ${fmt(x.title)} <span class="st-level st-${x.level}">${x.level}</span>`));
      if (x.lecture) d.appendChild(el("div", "st-progress", `From <a href="${x.src}">${x.lecture}</a>`));
      d.appendChild(el("p", "", fmt(x.task)));
      d.appendChild(el("div", "st-label", "Input (" + (x.inputType || "application/json") + ")"));
      d.appendChild(el("div", "", pre(x.input)));
      if (x.output) { d.appendChild(el("div", "st-label", "Expected output")); d.appendChild(el("div", "", pre(x.output))); }
      const det = el("details", "st-answer");
      det.appendChild(el("summary", "", "Show the answer"));
      det.appendChild(el("div", "", pre(x.answer)));
      if (x.explain) det.appendChild(el("p", "", fmt(x.explain)));
      d.appendChild(det);
      box.appendChild(d);
    });
  }

  /* ================= Today dashboard (home page) ================= */
  async function dashboard(box) {
    const [cardsAll, bank] = await Promise.all([
      fetch(box.dataset.cards).then(r => r.json()), fetch(box.dataset.quiz).then(r => r.json())]);
    const last = store.get("last", null), due = srs.due(cardsAll).length, mist = Object.keys(mistakes.all()).length;
    const started = Object.keys(srs.all()).length;
    // course order of sessions, taken from the card bank
    const order = [], labels = {};
    cardsAll.forEach(c => { if (!labels[c.sid]) { labels[c.sid] = c.lecture; order.push(c.sid); } });
    const lastSid = last && (last.href.match(/\/lectures\/([^/]+)\//) || [])[1];
    const nextSid = lastSid ? order[order.indexOf(lastSid) + 1] : null;
    const w = el("div", "st-today");
    const row = el("div", "st-today__row");
    function tile(big, small, href, cls) {
      const a = el("a", "st-tile" + (cls ? " " + cls : ""), `<b>${big}</b><span>${small}</span>`);
      a.href = href; row.appendChild(a);
    }
    if (last) tile("Continue →", esc(last.title), last.href, "st-tile--hot");
    else tile("Start →", "Day 1 — Summary", link("lectures/day01/"), "st-tile--hot");
    if (nextSid) tile("Next in plan", `${esc(labels[nextSid])} — Summary`, link(`lectures/${nextSid}/`), "st-tile--next");
    tile(due, (due === 1 ? "card due today" : "cards due today") + ` · ${started} of ${cardsAll.length} started`,
         link("practice/review/"), due > 0 ? "st-tile--hot" : "");
    tile(mist, mist === 1 ? "mistake to fix" : "mistakes to fix", link("practice/mistakes/"), "");
    tile("Test", `${bank.length} questions · phase tests & mock exam`, link("practice/tests/"), "");
    w.appendChild(row);
    box.appendChild(w);
  }

  /* ---------- remember the last lecture page you opened ---------- */
  function rememberPage() {
    if (!/\/lectures\/[^/]+\//.test(location.pathname)) return;
    const h1 = document.querySelector(".md-content h1");
    if (h1) store.set("last", { href: location.href.split("#")[0], title: h1.textContent.replace(/¶\s*$/, "").trim(), at: Date.now() });
  }

  /* ---------- floating controls: text size + focus mode ---------- */
  const ICON_ON = '<svg viewBox="0 0 24 24"><path d="M5 5h5V3H3v7h2V5zm9-2v2h5v5h2V3h-7zm5 16h-5v2h7v-7h-2v5zM5 14H3v7h7v-2H5v-5z"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24"><path d="M8 3H6v3H3v2h5V3zm8 0h-2v5h5V6h-3V3zM3 16v2h3v3h2v-5H3zm13 0v5h2v-3h3v-2h-5z"/></svg>';
  function controls() {
    const bar = el("div", "st-controls");
    const minus = el("button", "focus-btn st-small", "A−"), plus = el("button", "focus-btn st-small", "A+");
    const focus = el("button", "focus-btn st-focus");
    [minus, plus, focus].forEach(b => { b.type = "button"; bar.appendChild(b); });
    minus.title = "Smaller text"; plus.title = "Larger text";
    minus.setAttribute("aria-label", "Smaller text"); plus.setAttribute("aria-label", "Larger text");
    document.body.appendChild(bar);
    function scale(d) {
      let s = store.get("font", 1);
      if (d) s = Math.min(1.5, Math.max(0.8, Math.round((s + d) * 10) / 10));
      store.set("font", s);
      document.documentElement.style.setProperty("--st-scale", s);
    }
    minus.onclick = () => scale(-0.1); plus.onclick = () => scale(0.1);
    scale(0);
    function render() {
      const on = document.body.classList.contains("focus-mode");
      focus.innerHTML = (on ? ICON_OFF : ICON_ON) + `<span class="st-label-text">${on ? "Exit focus" : "Focus"}</span>`;
      focus.title = on ? "Exit focus mode (Esc)" : "Focus mode: notes only, fullscreen";
      focus.setAttribute("aria-label", focus.title);
      focus.setAttribute("aria-pressed", on);
    }
    function set(on, fullscreen) {
      document.body.classList.toggle("focus-mode", on);
      try { sessionStorage.setItem("focus-mode", on ? "1" : ""); } catch (e) {}
      if (fullscreen) {
        try {
          if (on && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
          if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
        } catch (e) {}
      }
      render();
      window.dispatchEvent(new Event("resize"));
    }
    focus.onclick = () => set(!document.body.classList.contains("focus-mode"), true);
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && document.body.classList.contains("focus-mode")) set(false, false);
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && document.body.classList.contains("focus-mode") && !document.fullscreenElement) set(false, false);
    });
    let saved = "";
    try { saved = sessionStorage.getItem("focus-mode") || ""; } catch (e) {}
    set(!!saved, false);
  }

  /* ---------- page init (first load and after every instant page change) ---------- */
  const KINDS = {
    quiz: (b, d) => { const a = el("div", "st-area"); b.appendChild(a); quiz(a, d); },
    cards: (b, d) => { const a = el("div", "st-area"); b.appendChild(a); cards(a, d); },
    review, mistakes: mistakesPage, tests, interview, dataweave
  };
  async function init() {
    keyHandler = null;
    rememberPage();
    for (const box of document.querySelectorAll("[data-study]:not([data-ready])")) {
      box.dataset.ready = 1;
      const kind = box.dataset.study;
      try {
        if (kind === "dashboard") await dashboard(box);
        else if (KINDS[kind]) KINDS[kind](box, await dataOf(box));
      } catch (e) {
        box.appendChild(el("p", "", "Could not load this exercise: " + e));
      }
    }
  }
  function boot() { init(); if (!document.querySelector(".st-controls")) controls(); }
  function hook() {
    if (window.document$ && window.document$.subscribe) window.document$.subscribe(boot);
    else boot();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hook);
  else hook();
})();
