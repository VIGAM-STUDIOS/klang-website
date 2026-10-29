(() => {
  "use strict";

  const cfg = Object.assign(
    {
      downloadUrl: "",
      checkoutUrl: "",
      waitlistFormAction: "",
      priceCurrency: "$",
      proPrice: 39,
      earlyBirdPrice: null,
      freeSampleLimit: 2500,
      contactEmail: "",
      version: "",
    },
    window.KLANG_CONFIG || {},
  );
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => `${cfg.priceCurrency}${n}`;

  // ---------------------------------------------------------------------------
  // Apply config: prices, links, which mode the page is in
  // ---------------------------------------------------------------------------
  function applyConfig() {
    const early = typeof cfg.earlyBirdPrice === "number" && cfg.earlyBirdPrice < cfg.proPrice;
    $$('[data-price="pro"]').forEach((el) => (el.textContent = money(early ? cfg.earlyBirdPrice : cfg.proPrice)));
    $$('[data-price="pro-was"]').forEach((el) => {
      el.textContent = money(cfg.proPrice);
      el.hidden = !early;
    });
    $$('[data-price="free"]').forEach((el) => (el.textContent = money(0)));
    $$("[data-early-badge]").forEach((el) => (el.hidden = !early));
    $$("[data-free-limit]").forEach((el) => (el.textContent = Number(cfg.freeSampleLimit).toLocaleString("en-US")));

    const canDownload = Boolean(cfg.downloadUrl);
    $$('[data-cta="download"]').forEach((a) => {
      const inNav = Boolean(a.closest(".nav"));
      if (canDownload) {
        a.href = cfg.downloadUrl;
        a.textContent = inNav ? "Download" : a.closest('[data-mode="download"]') ? "Download for Windows" : "Download free";
      } else {
        a.href = "#early-access";
        a.textContent = "Get early access";
      }
    });
    $$('[data-mode="waitlist"]').forEach((el) => (el.hidden = canDownload && Boolean(cfg.checkoutUrl)));
    $$('[data-mode="download"]').forEach((el) => (el.hidden = !canDownload));
    $$("[data-version-line]").forEach((el) => {
      el.textContent = cfg.version ? `Version ${cfg.version} · Windows 10 & 11 (64-bit)` : "Windows 10 & 11 (64-bit)";
    });

    const canBuy = Boolean(cfg.checkoutUrl);
    $$('[data-cta="buy"]').forEach((a) => {
      a.href = canBuy ? cfg.checkoutUrl : "#early-access";
      a.textContent = canBuy ? `Buy Pro · ${money(early ? cfg.earlyBirdPrice : cfg.proPrice)}` : "Join early access";
    });
    $$("[data-buy-note]").forEach((el) => (el.hidden = canBuy));

    if (cfg.contactEmail) {
      $$("[data-contact-link]").forEach((a) => {
        a.href = `mailto:${cfg.contactEmail}`;
        a.textContent = cfg.contactEmail;
        a.hidden = false;
      });
      $$("[data-contact-faq]").forEach((el) => (el.hidden = false));
    }
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  // ---------------------------------------------------------------------------
  // Theme toggle (light / dark, remembered)
  // ---------------------------------------------------------------------------
  function initTheme() {
    const btn = $("#theme-toggle");
    if (!btn) return;
    const label = () =>
      btn.setAttribute(
        "aria-label",
        document.documentElement.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    label();
    btn.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("klang_site_theme", next);
      } catch (e) {
        /* storage unavailable: theme just won't persist */
      }
      label();
    });
  }

  // ---------------------------------------------------------------------------
  // Product demo: an animated recreation of KLANG's results view
  // ---------------------------------------------------------------------------
  const DEMO = [
    {
      query: "short woody acoustic snare",
      ms: 11,
      rows: [
        ["snare_woody_acoustic_short_decay", "snares", "snare", "249 ms", 81],
        ["snare_trap_snappy_tight", "snares", "snare", "197 ms", 64],
        ["snare_lofi_dark_muffled", "snares", "snare", "300 ms", 58],
        ["clap_reverb_long_tail", "snares", "clap", "1.20 s", 49],
        ["hat_tick_short_click", "hats", "hat", "50 ms", 41],
      ],
    },
    {
      query: "aggressive distorted 808",
      voice: true,
      ms: 9,
      rows: [
        ["808_kick_punchy_deep", "kicks", "kick", "600 ms", 74],
        ["kick_distorted_aggressive_hardstyle", "kicks", "kick", "700 ms", 71],
        ["bass_reese_distorted_gritty_Dmin", "bass", "bass", "1.53 s", 66],
        ["808_kick_long_sub_boom", "kicks", "kick", "1.60 s", 62],
        ["kick_soft_lofi_vinyl", "kicks", "kick", "500 ms", 47],
      ],
    },
    {
      query: "ethereal shimmer pad in D minor",
      ms: 12,
      rows: [
        ["pad_ethereal_shimmer_evolving_Dmin", "pads", "pad", "4.99 s", 86],
        ["pad_bright_glassy_strings_Gmaj", "pads", "pad", "4.00 s", 61],
        ["pad_lush_chorus_ambient_Fmaj", "pads", "pad", "4.49 s", 57],
        ["atmos_dark_drone_texture_Cmin", "pads", "pad", "4.99 s", 44],
        ["lead_bright_saw_supersaw_Emaj", "leads", "bass", "1.14 s", 33],
      ],
    },
    {
      query: "bright metallic hi-hat",
      ms: 10,
      rows: [
        ["hihat_open_shimmer_sizzle", "hats", "openhat", "900 ms", 79],
        ["ride_metallic_bell", "hats", "openhat", "1.50 s", 72],
        ["hihat_closed_crisp_tight", "hats", "hat", "120 ms", 70],
        ["hat_tick_short_click", "hats", "hat", "50 ms", 62],
        ["shaker_noisy_loose", "hats", "hat", "400 ms", 55],
      ],
    },
  ];

  // Deterministic waveform envelopes per sound type, so the bars look like the real thing.
  function peaks(kind, seed, n = 72) {
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      let v;
      switch (kind) {
        case "kick":
          v = Math.exp(-t * 3.2) * (0.85 + 0.15 * rnd());
          break;
        case "snare":
        case "clap":
          v = Math.exp(-t * (kind === "clap" ? 3 : 7)) * (0.7 + 0.3 * rnd());
          break;
        case "hat":
          v = Math.exp(-t * 11) * (0.6 + 0.4 * rnd());
          break;
        case "openhat":
          v = Math.exp(-t * 2.6) * (0.55 + 0.45 * rnd());
          break;
        case "pad": {
          const env = Math.min(1, t / 0.35) * (t > 0.8 ? (1 - t) / 0.2 : 1);
          v = env * (0.6 + 0.25 * Math.sin(t * 22 + seed) + 0.15 * rnd());
          break;
        }
        default: {
          // bass / lead: gated notes
          const gate = (Math.floor(t * 4) % 1 === 0 && (t * 4) % 1 < 0.82) ? 1 : 0.06;
          v = gate * (0.75 + 0.25 * rnd());
        }
      }
      out.push(Math.max(0.05, Math.min(1, v)));
    }
    return out;
  }

  function waveformSvg(kind, seed) {
    const p = peaks(kind, seed);
    const w = 3, gap = 2, h = 32;
    const bars = p
      .map((v, i) => {
        const bh = Math.max(2, v * h);
        return `<rect x="${i * (w + gap)}" y="${(h - bh) / 2}" width="${w}" height="${bh}" rx="1"/>`;
      })
      .join("");
    return `<svg class="wave" viewBox="0 0 ${p.length * (w + gap)} ${h}" preserveAspectRatio="none" aria-hidden="true">${bars}</svg>`;
  }

  function renderRows(item) {
    const list = $("#demo-rows");
    list.innerHTML = item.rows
      .map(
        ([name, cat, kind, dur, score], i) => `
        <li class="row${i === 0 ? " row-top" : ""}" style="--i:${i}">
          <span class="play" aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z"/></svg></span>
          <span class="meta"><span class="name">${name}</span><span class="cat">${cat}</span></span>
          ${waveformSvg(kind, name.length * 7 + i)}
          <span class="dur">${dur}</span>
          <span class="score">${score}%</span>
        </li>`,
      )
      .join("");
    $("#demo-count").textContent = `${item.rows.length} sounds · ${item.ms} ms`;
  }

  function initDemo() {
    const q = $("#demo-query");
    const mic = $("#demo-mic");
    if (!q) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderRows(DEMO[0]);
    if (reduced) return;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let visible = true;
    document.addEventListener("visibilitychange", () => (visible = !document.hidden));

    (async () => {
      let idx = 0;
      await sleep(2600);
      for (;;) {
        if (!visible) {
          await sleep(500);
          continue;
        }
        idx = (idx + 1) % DEMO.length;
        const item = DEMO[idx];
        // erase
        for (let n = q.textContent.length; n >= 0; n--) {
          q.textContent = q.textContent.slice(0, n);
          await sleep(14);
        }
        $("#demo-rows").classList.add("fading");
        if (item.voice) {
          mic.classList.add("live");
          q.classList.add("placeholder");
          q.textContent = "Listening…";
          await sleep(1500);
          mic.classList.remove("live");
          q.classList.remove("placeholder");
          q.textContent = item.query;
        } else {
          for (const ch of item.query) {
            q.textContent += ch;
            await sleep(38 + Math.random() * 40);
          }
        }
        await sleep(220);
        $("#demo-rows").classList.remove("fading");
        renderRows(item);
        await sleep(3800);
      }
    })();
  }

  // ---------------------------------------------------------------------------
  // Early-access signup
  // ---------------------------------------------------------------------------
  function initSignup() {
    const form = $("#signup");
    if (!form) return;
    const msg = $("#signup-msg");
    const input = $("#signup-email");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "Please enter a valid email address.";
        msg.dataset.state = "error";
        input.focus();
        return;
      }
      if (!cfg.waitlistFormAction) {
        msg.textContent = "Signups aren't connected yet. Set waitlistFormAction in config.js.";
        msg.dataset.state = "error";
        return;
      }
      const btn = form.querySelector("button");
      btn.disabled = true;
      msg.textContent = "Joining…";
      msg.dataset.state = "";
      try {
        const res = await fetch(cfg.waitlistFormAction, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        msg.textContent = "You're on the list. We'll email you as soon as KLANG is ready.";
        msg.dataset.state = "ok";
      } catch (err) {
        msg.textContent = "Something went wrong. Please try again in a moment.";
        msg.dataset.state = "error";
      } finally {
        btn.disabled = false;
      }
    });
  }

  applyConfig();
  initTheme();
  initDemo();
  initSignup();
})();
