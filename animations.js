/**
 * KLANG Website Animations (GSAP + ScrollTrigger)
 *
 * Minimalist, high-precision motion system inspired by modern developer & audio SaaS
 * (Linear, Vercel, Raycast). Focuses on crisp exponential easing, subtle vertical depth,
 * and zero layout shift or CSS transition conflicts.
 *
 * To disable completely: set ANIMATIONS_ENABLED = false.
 */
(() => {
  "use strict";

  const ANIMATIONS_ENABLED = true;
  if (!ANIMATIONS_ENABLED) return;

  function initAnimations() {
    const gsap = window.gsap;
    if (!gsap) return;

    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // -------------------------------------------------------------------------
    // 1. Hero Entrance Choreography
    // -------------------------------------------------------------------------
    const h1 = document.querySelector(".hero h1");
    if (h1 && !h1.dataset.animated) {
      h1.dataset.animated = "true";
      const words = h1.textContent.trim().split(/\s+/);
      h1.innerHTML = words
        .map((w, idx) => {
          const marginRight = idx === words.length - 1 ? "0" : "0.28em";
          return `<span class="anim-word-mask" style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.08em;margin-bottom:-0.08em;margin-right:${marginRight};"><span class="anim-word" style="display:inline-block;will-change:transform,opacity;">${w}</span></span>`;
        })
        .join("");
    }

    const heroTl = gsap.timeline({
      defaults: { ease: "expo.out" },
      delay: 0.05,
    });

    heroTl.from(".nav", {
      y: -16,
      opacity: 0,
      duration: 0.7,
      clearProps: "transform",
    });

    const animWords = document.querySelectorAll(".hero h1 .anim-word");
    if (animWords.length > 0) {
      heroTl.from(
        animWords,
        {
          yPercent: 100,
          opacity: 0,
          stagger: 0.035,
          duration: 0.85,
          clearProps: "transform",
        },
        "-=0.45"
      );
    } else {
      heroTl.from(
        ".hero h1",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          clearProps: "transform",
        },
        "-=0.45"
      );
    }

    heroTl.from(
      [".hero .lede", ".hero-ctas", "#hero-note"],
      {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        clearProps: "transform",
      },
      "-=0.55"
    );

    heroTl.from(
      ".demo",
      {
        y: 36,
        opacity: 0,
        scale: 0.985,
        duration: 1.0,
        clearProps: "transform",
      },
      "-=0.6"
    );

    // -------------------------------------------------------------------------
    // 2. Subtle Interactive Tilt on Primary App Windows (.demo & .app-shot)
    // -------------------------------------------------------------------------
    function attachSubtlePerspective(selector, maxDeg) {
      const el = document.querySelector(selector);
      if (!el) return;
      let rect = null;

      el.addEventListener("mouseenter", () => {
        rect = el.getBoundingClientRect();
      });

      el.addEventListener("mousemove", (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(el, {
          rotateX: normY * -maxDeg,
          rotateY: normX * maxDeg,
          transformPerspective: 1400,
          duration: 0.35,
          ease: "power2.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        rect = null;
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: "expo.out",
          clearProps: "transform",
        });
      });
    }

    attachSubtlePerspective(".demo", 3.5);
    attachSubtlePerspective(".app-shot", 2.5);

    // -------------------------------------------------------------------------
    // 3. Scroll-Triggered Section Reveals
    // -------------------------------------------------------------------------
    if (!ScrollTrigger) return;

    // Problem Band
    gsap.from(".band .wrap > *", {
      scrollTrigger: {
        trigger: ".band",
        start: "top 85%",
      },
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "expo.out",
      clearProps: "transform",
    });

    // Section Headers
    gsap.utils.toArray(".section-head").forEach((head) => {
      gsap.from(head.children, {
        scrollTrigger: {
          trigger: head,
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "expo.out",
        clearProps: "transform",
      });
    });

    // Standalone Section Titles (Specs, FAQ)
    gsap.utils.toArray(".section > .wrap > .section-title").forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: "top 86%",
        },
        y: 18,
        opacity: 0,
        duration: 0.75,
        ease: "expo.out",
        clearProps: "transform",
      });
    });

    // Main App Capture Window
    gsap.from(".app-shot", {
      scrollTrigger: {
        trigger: ".app-shot",
        start: "top 85%",
      },
      y: 36,
      opacity: 0,
      scale: 0.985,
      duration: 1.0,
      ease: "expo.out",
      clearProps: "transform",
    });

    // Showcase Rows: crisp vertical + subtle lateral entrance
    gsap.utils.toArray(".showcase-item").forEach((item) => {
      const media = item.querySelector(".showcase-media");
      const copyChildren = item.querySelectorAll(".showcase-copy > *");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 82%",
        },
        defaults: { ease: "expo.out" },
      });

      if (media) {
        tl.from(media, {
          y: 28,
          opacity: 0,
          scale: 0.99,
          duration: 0.9,
          clearProps: "transform",
        });
      }

      if (copyChildren.length) {
        tl.from(
          copyChildren,
          {
            y: 18,
            opacity: 0,
            stagger: 0.06,
            duration: 0.75,
            clearProps: "transform",
          },
          "-=0.6"
        );
      }
    });

    // "How it works" 3-Column Architectural Grid
    gsap.from(".steps", {
      scrollTrigger: {
        trigger: ".steps",
        start: "top 82%",
      },
      y: 24,
      opacity: 0,
      duration: 0.85,
      ease: "expo.out",
      clearProps: "transform",
    });

    gsap.from(".steps li > *", {
      scrollTrigger: {
        trigger: ".steps",
        start: "top 82%",
      },
      y: 14,
      opacity: 0,
      stagger: 0.04,
      duration: 0.7,
      delay: 0.1,
      ease: "expo.out",
      clearProps: "transform",
    });

    // Privacy Section: Left Copy + Right Specification Ledger
    gsap.from(".privacy-copy > *", {
      scrollTrigger: {
        trigger: "#privacy",
        start: "top 80%",
      },
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "expo.out",
      clearProps: "transform",
    });

    gsap.from(".privacy-specs > div", {
      scrollTrigger: {
        trigger: ".privacy-specs",
        start: "top 82%",
      },
      y: 16,
      opacity: 0,
      stagger: 0.08,
      duration: 0.75,
      ease: "expo.out",
      clearProps: "transform",
    });

    // Pricing Cards: Simultaneous reveal so cards always share the exact same horizontal baseline
    gsap.from(".pricing .plan", {
      scrollTrigger: {
        trigger: ".pricing",
        start: "top 82%",
      },
      y: 24,
      opacity: 0,
      stagger: 0.08,
      duration: 0.85,
      ease: "expo.out",
      clearProps: "transform",
    });

    gsap.from("#pricing .fineprint", {
      scrollTrigger: {
        trigger: ".pricing",
        start: "top 82%",
      },
      opacity: 0,
      y: 10,
      duration: 0.7,
      delay: 0.2,
      ease: "expo.out",
      clearProps: "transform",
    });

    // System Requirements Ledger
    gsap.from(".specs > div", {
      scrollTrigger: {
        trigger: ".specs",
        start: "top 85%",
      },
      y: 14,
      opacity: 0,
      stagger: 0.06,
      duration: 0.7,
      ease: "expo.out",
      clearProps: "transform",
    });

    // FAQ Accordion Items
    gsap.from(".faq details", {
      scrollTrigger: {
        trigger: ".faq",
        start: "top 85%",
      },
      y: 14,
      opacity: 0,
      stagger: 0.05,
      duration: 0.7,
      ease: "expo.out",
      clearProps: "transform",
    });

    // Early Access Section
    gsap.from("#early-access .narrow > *", {
      scrollTrigger: {
        trigger: "#early-access",
        start: "top 85%",
      },
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "expo.out",
      clearProps: "transform",
    });

    ScrollTrigger.refresh();
  }

  if (document.readyState === "complete") {
    initAnimations();
  } else {
    window.addEventListener("load", initAnimations);
  }
})();
