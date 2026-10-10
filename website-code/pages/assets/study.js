/* Quizzes, flashcards, interview drill and DataWeave practice.
   Each widget is a <div data-study="quiz|cards|drill|dataweave"> containing a
   <script type="application/json"> with its data (or data-src for a JSON file). */
(function () {
  "use strict";

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  // tiny inline formatter: `code`, **bold**, escaping
  function fmt(s) {
    s = String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return s.replace(/\n/g, "<br>");
  }
  function pre(s) {
    return "<pre><code>" + String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</code></pre>";
  }
  async function dataOf(box) {
    if (box.dataset.src) return (await fetch(box.dataset.src)).json();
    return JSON.parse(box.querySelector("script[type='application/json']").textContent);
  }

  /* ---------------- quiz ---------------- */
  function quiz(box, data) {
    let qs, i, score, wrong;
    const area = el("div", "st-area");
    box.appendChild(area);

    function start(list) {
      qs = shuffle(list).map(q => {
        const order = shuffle(q.options.map((t, k) => ({ t, ok: k === q.answer })));
        return Object.assign({}, q, { order });
      });
      i = 0; score = 0; wrong = [];
      show();
    }
    function show() {
      area.innerHTML = "";
      if (i >= qs.length) return finish();
      const q = qs[i];
      area.appendChild(el("div", "st-progress", `Question ${i + 1} of ${qs.length} · Score ${score}`));
      area.appendChild(el("div", "st-q", fmt(q.q)));
      const opts = el("div", "st-opts");
      const fb = el("div", "st-feedback");
      q.order.forEach(o => {
        const b = el("button", "st-opt", fmt(o.t));
        b.onclick = () => {
          if (opts.dataset.done) return;
          opts.dataset.done = 1;
          opts.querySelectorAll("button").forEach((x, k) => {
            if (q.order[k].ok) x.classList.add("st-right");
          });
          if (o.ok) { score++; fb.innerHTML = "<strong>Correct.</strong> " + fmt(q.explain || ""); fb.classList.add("ok"); }
          else { b.classList.add("st-wrong"); wrong.push(q); fb.innerHTML = "<strong>Not quite.</strong> " + fmt(q.explain || ""); fb.classList.add("bad"); }
          const next = el("button", "md-button md-button--primary st-next", i + 1 < qs.length ? "Next question" : "See result");
          next.onclick = () => { i++; show(); };
          fb.appendChild(el("div")).appendChild(next);
          next.focus();
        };
        opts.appendChild(b);
      });
      area.appendChild(opts);
      area.appendChild(fb);
    }
    function finish() {
      const pct = Math.round((score / qs.length) * 100);
      area.appendChild(el("div", "st-result", `You scored <strong>${score} / ${qs.length}</strong> (${pct}%).`));
      const row = el("div", "st-row");
      const again = el("button", "md-button md-button--primary", "Retake the quiz");
      again.onclick = () => start(data);
      row.appendChild(again);
      if (wrong.length) {
        const w = el("button", "md-button", `Retry the ${wrong.length} I missed`);
        const missed = wrong.map(q => ({ q: q.q, options: q.options, answer: q.answer, explain: q.explain }));
        w.onclick = () => start(missed);
        row.appendChild(w);
      }
      area.appendChild(row);
    }
    start(data);
  }

  /* ---------------- flashcards ---------------- */
  function cards(box, data, opts) {
    opts = opts || {};
    let deck, known, flipped;
    const area = el("div", "st-area");
    box.appendChild(area);

    function start(list) { deck = shuffle(list); known = 0; show(); }
    function show() {
      area.innerHTML = "";
      if (!deck.length) {
        area.appendChild(el("div", "st-result", "All cards done — you marked every card <strong>Know it</strong>."));
        const again = el("button", "md-button md-button--primary", "Start again");
        again.onclick = () => start(data);
        area.appendChild(again);
        return;
      }
      const c = deck[0];
      flipped = false;
      area.appendChild(el("div", "st-progress", `${deck.length} card${deck.length > 1 ? "s" : ""} left · ${known} known`
        + (c.src ? ` · <a href="${c.src}">${c.lecture}</a>` : "")));
      const card = el("div", "st-card");
      const front = el("div", "st-face st-front", fmt(c.front));
      const back = el("div", "st-face st-back", fmt(c.back));
      card.appendChild(front); card.appendChild(back);
      card.appendChild(el("div", "st-hint", "Click the card (or press Space) to flip"));
      card.onclick = flip;
      area.appendChild(card);
      const row = el("div", "st-row");
      const again = el("button", "md-button", "Again");
      const know = el("button", "md-button md-button--primary", "Know it");
      again.onclick = () => { deck.push(deck.shift()); show(); };
      know.onclick = () => { deck.shift(); known++; show(); };
      row.appendChild(again); row.appendChild(know);
      area.appendChild(row);
    }
    function flip() { flipped = !flipped; area.querySelector(".st-card").classList.toggle("flipped", flipped); }
    box.addEventListener("keydown", e => {
      if (e.code === "Space") { e.preventDefault(); flip(); }
    });
    box.tabIndex = 0;
    start(data);
  }

  /* ---------------- interview drill (all lectures) ---------------- */
  function drill(box, all) {
    const ctl = el("div", "st-row");
    const sel = el("select", "st-select");
    const groups = ["All phases"].concat([...new Set(all.map(c => c.phase))]);
    groups.forEach(g => { const o = el("option", "", g); o.value = g; sel.appendChild(o); });
    ctl.appendChild(el("span", "", "Questions from: ")); ctl.appendChild(sel);
    box.appendChild(ctl);
    const holder = el("div");
    box.appendChild(holder);
    function run() {
      holder.innerHTML = "";
      const list = sel.value === "All phases" ? all : all.filter(c => c.phase === sel.value);
      cards(holder, list);
    }
    sel.onchange = run;
    run();
  }

  /* ---------------- DataWeave practice ---------------- */
  function dataweave(box, list) {
    list.forEach((x, n) => {
      const d = el("div", "st-dw");
      d.appendChild(el("h3", "", `${n + 1}. ${fmt(x.title)} <span class="st-level st-${x.level}">${x.level}</span>`));
      if (x.lecture) d.appendChild(el("div", "st-progress", `From <a href="${x.src}">${x.lecture}</a>`));
      d.appendChild(el("p", "", fmt(x.task)));
      d.appendChild(el("div", "st-label", "Input (" + (x.inputType || "application/json") + ")"));
      d.appendChild(el("div", "", pre(x.input)));
      if (x.output) {
        d.appendChild(el("div", "st-label", "Expected output"));
        d.appendChild(el("div", "", pre(x.output)));
      }
      const det = el("details", "st-answer");
      det.appendChild(el("summary", "", "Show the answer"));
      det.appendChild(el("div", "", pre(x.answer)));
      if (x.explain) det.appendChild(el("p", "", fmt(x.explain)));
      d.appendChild(det);
      box.appendChild(d);
    });
  }

  async function init() {
    for (const box of document.querySelectorAll("[data-study]:not([data-ready])")) {
      box.dataset.ready = 1;
      const kind = box.dataset.study;
      try {
        const data = await dataOf(box);
        if (kind === "quiz") quiz(box, data);
        else if (kind === "cards") cards(box, data);
        else if (kind === "drill") drill(box, data);
        else if (kind === "dataweave") dataweave(box, data);
      } catch (e) {
        box.appendChild(el("p", "", "Could not load this exercise: " + e));
      }
    }
  }
  if (window.document$) window.document$.subscribe(init);   // Material instant navigation
  else document.addEventListener("DOMContentLoaded", init);
})();
