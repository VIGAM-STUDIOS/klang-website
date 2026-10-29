/**
 * KLANG Website Animations (GSAP + ScrollTrigger)
 * 
 * High-tech audio aesthetic with interactive physics, 3D card tilt, 
 * word-by-word headline reveals, audio waveform equalizer reactions, 
 * and scroll-driven depth.
 * 
 * To disable or scrap completely: set ANIMATIONS_ENABLED = false.
 */
(() => {
  "use strict";

  // MASTER TOGGLE: set to false to instantly turn off all animations
  const ANIMATIONS_ENABLED = true;

  if (!ANIMATIONS_ENABLED) return;

  function initAnimations() {
    const gsap = window.gsap;
    if (!gsap) {
      console.warn("GSAP not detected, skipping animations.");
      return;
    }

    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // -------------------------------------------------------------------------
    // 0. Word-by-Word Split for Hero Headline (Guaranteed Word Spacing)
    // -------------------------------------------------------------------------
    const h1 = document.querySelector(".hero h1");
    if (h1 && !h1.dataset.animated) {
      h1.dataset.animated = "true";
      // Extract text content and split by whitespace
      const words = h1.textContent.trim().split(/\s+/);
      h1.innerHTML = words
        .map((w, idx) => {
          // Explicit margin-right ensures words NEVER collide into each other
          const marginRight = idx === words.length - 1 ? "0" : "0.28em";
          return `<span class="anim-word-mask" style="display:inline-block;overflow:hidden;vertical-align:top;margin-right:${marginRight};"><span class="anim-word" style="display:inline-block;will-change:transform,opacity;">${w}</span></span>`;
        })
        .join("");
    }

    // -------------------------------------------------------------------------
    // 1. Initial Page Load Choreography (Timeline)
    // -------------------------------------------------------------------------
    const heroTl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.15,
    });

    // Nav drops down
    heroTl.from(".nav", {
      y: -30,
      opacity: 0,
      duration: 0.7,
    });

    // Brand mark pop
    heroTl.from(
      ".nav .brand",
      {
        opacity: 0,
        x: -15,
        duration: 0.5,
      },
      "-=0.4"
    );

    // Nav links & CTA
    heroTl.from(
      [".nav-links a", ".nav-actions"],
      {
        opacity: 0,
        y: -10,
        stagger: 0.05,
        duration: 0.5,
      },
      "-=0.4"
    );

    // Hero Headline: Word by word glide-up with tilt
    const animWords = document.querySelectorAll(".hero h1 .anim-word");
    if (animWords.length > 0) {
      heroTl.from(
        animWords,
        {
          y: 45,
          opacity: 0,
          rotateX: -20,
          stagger: 0.04,
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.3"
      );
    } else {
      heroTl.from(
        ".hero h1",
        {
          y: 35,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.3"
      );
    }

    // Hero lede
    heroTl.from(
      ".hero .lede",
      {
        y: 25,
        opacity: 0,
        duration: 0.75,
      },
      "-=0.5"
    );

    // Hero CTA buttons
    heroTl.from(
      ".hero-ctas .btn",
      {
        y: 20,
        opacity: 0,
        scale: 0.92,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.5)",
      },
      "-=0.4"
    );

    // Hero subnote
    heroTl.from(
      "#hero-note",
      {
        opacity: 0,
        y: 10,
        duration: 0.5,
      },
      "-=0.3"
    );

    // Product demo: 3D perspective entrance + continuous subtle levitation
    heroTl.from(
      ".demo",
      {
        y: 70,
        opacity: 0,
        scale: 0.94,
        rotateX: 8,
        duration: 1.1,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(".demo", {
            y: "-=6",
            duration: 3.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      },
      "-=0.5"
    );

    // -------------------------------------------------------------------------
    // 2. Interactive 3D Cursor Tilt for Product Demo
    // -------------------------------------------------------------------------
    const demo = document.querySelector(".demo");
    if (demo) {
      let rect = null;

      demo.addEventListener("mouseenter", () => {
        rect = demo.getBoundingClientRect();
      });

      demo.addEventListener("mousemove", (e) => {
        if (!rect) rect = demo.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const tiltX = (mouseY / rect.height - 0.5) * -8;
        const tiltY = (mouseX / rect.width - 0.5) * 8;

        gsap.to(demo, {
          rotateX: tiltX,
          rotateY: tiltY,
          transformPerspective: 1000,
          duration: 0.25,
          ease: "power1.out",
        });
      });

      demo.addEventListener("mouseleave", () => {
        rect = null;
        gsap.to(demo, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    }

    // -------------------------------------------------------------------------
    // 3. Audio Equalizer Waveform Reaction on Hover
    // -------------------------------------------------------------------------
    const demoList = document.querySelector("#demo-rows");
    if (demoList) {
      demoList.addEventListener("mouseover", (e) => {
        const row = e.target.closest(".row");
        if (!row) return;
        const waveSvg = row.querySelector(".wave");
        if (!waveSvg || waveSvg.dataset.animating === "true") return;

        waveSvg.dataset.animating = "true";
        const rects = waveSvg.querySelectorAll("rect");
        rects.forEach((r, idx) => {
          if (idx % 2 === 0) {
            const origH = parseFloat(r.getAttribute("height") || 10);
            const origY = parseFloat(r.getAttribute("y") || 10);
            const factor = 1.3 + Math.random() * 0.7;
            const newH = Math.min(30, origH * factor);
            const newY = origY - (newH - origH) / 2;

            gsap.to(r, {
              attr: { height: newH, y: newY },
              duration: 0.15 + Math.random() * 0.15,
              yoyo: true,
              repeat: 3,
              ease: "sine.inOut",
              onComplete: () => {
                gsap.to(r, {
                  attr: { height: origH, y: origY },
                  duration: 0.2,
                });
                if (idx === rects.length - 1 || idx === rects.length - 2) {
                  waveSvg.dataset.animating = "false";
                }
              },
            });
          }
        });
      });
    }

    // -------------------------------------------------------------------------
    // 4. ScrollTrigger Depth & Parallax
    // -------------------------------------------------------------------------
    if (!ScrollTrigger) return;

    // Demo Parallax during scroll down
    gsap.to(".demo", {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Problem Band
    gsap.from(".band .wrap", {
      scrollTrigger: {
        trigger: ".band",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      scale: 0.98,
      duration: 0.8,
      ease: "power2.out",
    });

    // Section Titles
    gsap.utils.toArray(".section-title").forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: "top 82%",
        },
        y: 35,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    });

    // 3 Main Feature Cards (Lift & staggered entrance)
    gsap.from(".features-hero-grid .feature-card", {
      scrollTrigger: {
        trigger: ".features-hero-grid",
        start: "top 78%",
      },
      y: 50,
      opacity: 0,
      scale: 0.96,
      stagger: 0.15,
      duration: 0.75,
      ease: "power2.out",
    });

    // Feature Card Icons playful spring
    gsap.from(".features-hero-grid .feature-icon", {
      scrollTrigger: {
        trigger: ".features-hero-grid",
        start: "top 78%",
      },
      scale: 0.5,
      rotate: -15,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      delay: 0.1,
      ease: "back.out(2)",
    });

    // Flat secondary feature cards
    gsap.from(".grid-gap-top .feature-card-flat", {
      scrollTrigger: {
        trigger: ".grid-gap-top",
        start: "top 82%",
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.65,
      ease: "power2.out",
    });

    // "How it works" steps (animate entire LI container so numbers NEVER disappear)
    gsap.from(".steps li", {
      scrollTrigger: {
        trigger: ".steps",
        start: "top 78%",
      },
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: "power2.out",
    });

    // Privacy Section (split reveal)
    gsap.from(".privacy > div", {
      scrollTrigger: {
        trigger: ".privacy",
        start: "top 78%",
      },
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.from(".privacy .checks li", {
      scrollTrigger: {
        trigger: ".privacy .checks",
        start: "top 80%",
      },
      x: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.55,
      ease: "power2.out",
    });

    // Pricing Cards
    gsap.from(".pricing .plan", {
      scrollTrigger: {
        trigger: ".pricing",
        start: "top 76%",
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: "power2.out",
    });

    gsap.from("#pricing .fineprint", {
      scrollTrigger: {
        trigger: ".pricing",
        start: "top 76%",
      },
      opacity: 0,
      y: 15,
      duration: 0.6,
      delay: 0.35,
      ease: "power2.out",
    });

    // Pro badge pop
    gsap.from("[data-early-badge]", {
      scrollTrigger: {
        trigger: ".plan-pro",
        start: "top 76%",
      },
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      delay: 0.35,
      ease: "back.out(2)",
    });

    // System Requirements
    gsap.from(".specs div", {
      scrollTrigger: {
        trigger: ".specs",
        start: "top 82%",
      },
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: "power2.out",
    });

    // FAQ details
    gsap.from(".faq details", {
      scrollTrigger: {
        trigger: ".faq",
        start: "top 82%",
      },
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: "power2.out",
    });

    // Early Access Signup Card
    gsap.from("#early-access .narrow", {
      scrollTrigger: {
        trigger: "#early-access",
        start: "top 82%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    // Refresh ScrollTrigger to recalculate exact offsets
    ScrollTrigger.refresh();
  }

  // Initialize once window has loaded
  if (document.readyState === "complete") {
    initAnimations();
  } else {
    window.addEventListener("load", initAnimations);
  }
})();
