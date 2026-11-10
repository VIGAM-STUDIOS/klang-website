/**
 * KLANG Website Animations (GSAP + ScrollTrigger)
 *
 * Minimalist, high-precision motion system inspired by modern developer & audio SaaS
 * (Linear, Vercel, Raycast). Focuses on crisp exponential easing, subtle vertical depth,
 * and zero layout shift or CSS transition conflicts.
 *
 * Includes a gracious, luxurious preloader that ensures all animations, fonts, and
 * layouts are fully ready before the user sees the page.
 */
(() => {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function dismissPreloaderImmediately() {
    const preloader = document.getElementById("klang-preloader");
    if (preloader) {
      preloader.style.display = "none";
    }
    document.documentElement.classList.remove("klang-loading");
  }

  // Accessibility check: instantly show page without motion
  if (prefersReducedMotion) {
    dismissPreloaderImmediately();
    return;
  }

  function initAnimations() {
    const gsap = window.gsap;
    if (!gsap) {
      dismissPreloaderImmediately();
      return;
    }

    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // -------------------------------------------------------------------------
    // 1. Hero Entrance Choreography (Created paused, triggered after preloader)
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
      paused: true,
      defaults: { ease: "expo.out" },
    });

    heroTl.from(".nav", {
      y: -16,
      opacity: 0,
      duration: 0.75,
      clearProps: "transform,opacity",
    });

    const animWords = document.querySelectorAll(".hero h1 .anim-word");
    if (animWords.length > 0) {
      heroTl.from(
        animWords,
        {
          yPercent: 110,
          opacity: 0,
          stagger: 0.035,
          duration: 0.85,
          clearProps: "transform,opacity",
        },
        "-=0.5"
      );
    } else {
      heroTl.from(
        ".hero h1",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          clearProps: "transform,opacity",
        },
        "-=0.5"
      );
    }

    heroTl.from(
      [".hero .lede", ".hero-ctas", "#hero-note"],
      {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        clearProps: "transform,opacity",
      },
      "-=0.55"
    );

    heroTl.from(
      ".demo",
      {
        y: 32,
        opacity: 0,
        scale: 0.985,
        duration: 0.95,
        clearProps: "transform,opacity",
      },
      "-=0.6"
    );

    // -------------------------------------------------------------------------
    // 2. Subtle Interactive Tilt on Primary App Window (.demo)
    // -------------------------------------------------------------------------
    const demo = document.querySelector(".demo");
    if (demo && !window.matchMedia("(pointer: coarse)").matches) {
      let rect = null;

      demo.addEventListener("mouseenter", () => {
        rect = demo.getBoundingClientRect();
      });

      demo.addEventListener("mousemove", (e) => {
        if (!rect) rect = demo.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(demo, {
          rotateX: normY * -3.5,
          rotateY: normX * 3.5,
          transformPerspective: 1400,
          duration: 0.35,
          ease: "power2.out",
        });
      });

      demo.addEventListener("mouseleave", () => {
        rect = null;
        gsap.to(demo, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "expo.out",
          clearProps: "transform",
        });
      });
    }

    // -------------------------------------------------------------------------
    // 3. Scroll-Triggered Section Reveals (High-Performance, once: true)
    // -------------------------------------------------------------------------
    if (ScrollTrigger) {
      // Problem Band
      gsap.from(".band .wrap > *", {
        scrollTrigger: {
          trigger: ".band",
          start: "top 85%",
          once: true,
        },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "expo.out",
        clearProps: "transform,opacity",
      });

      // Section Headers
      gsap.utils.toArray(".section-head").forEach((head) => {
        gsap.from(head.children, {
          scrollTrigger: {
            trigger: head,
            start: "top 85%",
            once: true,
          },
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "expo.out",
          clearProps: "transform,opacity",
        });
      });

      // Standalone Section Titles (Specs, FAQ)
      gsap.utils.toArray(".section > .wrap > .section-title").forEach((title) => {
        gsap.from(title, {
          scrollTrigger: {
            trigger: title,
            start: "top 86%",
            once: true,
          },
          y: 18,
          opacity: 0,
          duration: 0.75,
          ease: "expo.out",
          clearProps: "transform,opacity",
        });
      });

      // Showcase Rows: crisp vertical entrance
      gsap.utils.toArray(".showcase-item").forEach((item) => {
        const media = item.querySelector(".showcase-media");
        const copyChildren = item.querySelectorAll(".showcase-copy > *");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        });

        if (media) {
          tl.from(media, {
            y: 24,
            opacity: 0,
            scale: 0.99,
            duration: 0.85,
            clearProps: "transform,opacity",
          });
        }

        if (copyChildren.length) {
          tl.from(
            copyChildren,
            {
              y: 16,
              opacity: 0,
              stagger: 0.06,
              duration: 0.75,
              clearProps: "transform,opacity",
            },
            "-=0.6"
          );
        }
      });

      // "How it works" 3-Column Grid
      gsap.from(".steps li", {
        scrollTrigger: {
          trigger: ".steps",
          start: "top 82%",
          once: true,
        },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "expo.out",
        clearProps: "transform,opacity",
      });

      // Privacy Section: Left Copy + Right Specification Ledger
      gsap.from(".privacy-copy > *", {
        scrollTrigger: {
          trigger: "#privacy",
          start: "top 80%",
          once: true,
        },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "expo.out",
        clearProps: "transform,opacity",
      });

      gsap.from(".privacy-specs > div", {
        scrollTrigger: {
          trigger: ".privacy-specs",
          start: "top 82%",
          once: true,
        },
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.75,
        ease: "expo.out",
        clearProps: "transform,opacity",
      });

      // Pricing Cards: Simultaneous reveal so cards share exact baseline
      gsap.from(".pricing .plan", {
        scrollTrigger: {
          trigger: ".pricing",
          start: "top 82%",
          once: true,
        },
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.85,
        ease: "expo.out",
        clearProps: "transform,opacity",
      });

      gsap.from("#pricing .fineprint", {
        scrollTrigger: {
          trigger: ".pricing",
          start: "top 82%",
          once: true,
        },
        opacity: 0,
        y: 10,
        duration: 0.7,
        delay: 0.2,
        ease: "expo.out",
        clearProps: "transform,opacity",
      });

      // System Requirements Ledger
      gsap.from(".specs > div", {
        scrollTrigger: {
          trigger: ".specs",
          start: "top 85%",
          once: true,
        },
        y: 14,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: "expo.out",
        clearProps: "transform,opacity",
      });

      // FAQ Accordion Items
      gsap.from(".faq details", {
        scrollTrigger: {
          trigger: ".faq",
          start: "top 85%",
          once: true,
        },
        y: 14,
        opacity: 0,
        stagger: 0.05,
        duration: 0.7,
        ease: "expo.out",
        clearProps: "transform,opacity",
      });
    }

    // -------------------------------------------------------------------------
    // 4. Gracious Preloader Orchestration
    // -------------------------------------------------------------------------
    const preloader = document.getElementById("klang-preloader");
    const preloaderBar = document.getElementById("preloader-bar");
    const preloaderText = document.getElementById("preloader-text");

    let isDismissed = false;
    function finishPreloader() {
      if (isDismissed) return;
      isDismissed = true;

      if (!preloader) {
        document.documentElement.classList.remove("klang-loading");
        heroTl.play();
        if (ScrollTrigger) ScrollTrigger.refresh();
        return;
      }

      if (preloaderText) preloaderText.textContent = "READY";

      gsap.to(preloader, {
        opacity: 0,
        scale: 1.015,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          document.documentElement.classList.remove("klang-loading");
          heroTl.play();
          if (ScrollTrigger) ScrollTrigger.refresh();
        },
      });
    }

    if (preloader && preloaderBar) {
      // Smooth progress bar advancing to 100%
      gsap.to(preloaderBar, {
        width: "100%",
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: finishPreloader,
      });
    } else {
      finishPreloader();
    }

    // Safety timeout: Never keep the user waiting more than 1.2s under any condition
    setTimeout(finishPreloader, 1200);
  }

  // Execute as soon as the DOM is interactive
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnimations);
  } else {
    initAnimations();
  }
})();
