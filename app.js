(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && window.Lenis) {
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -12, duration: 1.1 });
      });
    });
  }

  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector(".hero");
    const heroTitle = document.querySelector(".hero__title");
    const heroBadges = gsap.utils.toArray(".hero__meta span");
    let heroTitleLines = heroTitle ? [heroTitle] : [];

    if (heroTitle && window.SplitType) {
      const splitTitle = new SplitType(heroTitle, { types: "lines" });
      heroTitleLines = splitTitle.lines.length ? splitTitle.lines : [heroTitle];
    }

    gsap.set(".section:not(.hero) .reveal, .hero .brand-mark, .hero .eyebrow, .hero__lead, .hero__meta, .hero .button", {
      opacity: 0,
      y: 28,
    });
    gsap.set(".hero__portrait", {
      opacity: 0.6,
      "--hero-photo-x": "0px",
      "--hero-photo-y": "0px",
      "--hero-enter-x": "0px",
      "--hero-enter-scale": 1,
      "--hero-photo-reveal": "100%",
      "--hero-photo-scale": 1.08,
      "--hero-mask-reveal": "0%",
      "--hero-mask-x": "0%",
    });
    gsap.set(heroTitleLines, { opacity: 0, y: 30 });
    gsap.set(".hero__meta", { opacity: 1, y: 0 });
    gsap.set(heroBadges, { opacity: 0, y: 16 });

    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top 88%",
      },
    });

    heroTimeline
      .to(".hero .brand-mark, .hero .eyebrow", {
        opacity: 1,
        y: 0,
        duration: 0.68,
        ease: "power3.out",
        stagger: 0.08,
      })
      .to(
        heroTitleLines,
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.2",
      )
      .to(
        ".hero__lead",
        {
          opacity: 1,
          y: 0,
          duration: 0.68,
          ease: "power3.out",
        },
        "-=0.22",
      )
      .to(
        heroBadges,
        {
          opacity: 1,
          y: 0,
          duration: 0.56,
          ease: "power3.out",
          stagger: 0.09,
        },
        "-=0.04",
      )
      .to(
        ".hero .button",
        {
          opacity: 1,
          y: 0,
          duration: 0.68,
          ease: "power3.out",
        },
        "-=0.14",
      )
      .to(
        ".hero__portrait",
        {
          opacity: 1,
          "--hero-photo-reveal": "0%",
          "--hero-photo-scale": 1,
          duration: 2.35,
          ease: "expo.out",
        },
        0.32,
      )
      .to(
        ".hero__portrait",
        {
          "--hero-mask-x": "112%",
          duration: 2.2,
          ease: "power3.out",
        },
        0.28,
      )
      .set(".hero__portrait", { "--hero-mask-reveal": "100%" });

    const problemBoard = document.querySelector(".problem-board");

    if (problemBoard) {
      const problemNotes = gsap.utils.toArray(".problem-board .problem-card");
      const problemLines = gsap.utils.toArray(".problem-board .board-line");
      const simpleBoardAnimation = window.matchMedia("(max-width: 640px)").matches;

      problemNotes.forEach((note, index) => {
        const finalRotate = simpleBoardAnimation ? 0 : parseFloat(getComputedStyle(note).getPropertyValue("--note-rotate")) || 0;
        note.dataset.finalRotate = finalRotate;
        gsap.set(note, {
          opacity: 0,
          y: simpleBoardAnimation ? 20 : 24,
          scale: simpleBoardAnimation ? 0.96 : 0.9,
          rotate: finalRotate + (index % 2 === 0 ? -3 : 3),
        });
      });

      if (simpleBoardAnimation) {
        gsap.set(problemLines, { opacity: 0 });
        gsap.set(problemBoard, { "--board-mobile-line-scale": 0 });
      } else {
        problemLines.forEach((line) => {
          const lineLength = line.getTotalLength();
          gsap.set(line, {
            strokeDasharray: lineLength,
            strokeDashoffset: lineLength,
            opacity: 0.72,
          });
        });
      }

      const problemTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: problemBoard,
          start: "top 78%",
          once: true,
        },
      });

      problemTimeline.fromTo(
        problemBoard,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.72, ease: "power3.out" },
      );

      if (simpleBoardAnimation) {
        problemTimeline.to(problemBoard, {
          "--board-mobile-line-scale": 1,
          duration: 0.72,
          ease: "power2.inOut",
        }, "-=0.22");
      }

      problemNotes.forEach((note, index) => {
        problemTimeline.to(note, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: Number(note.dataset.finalRotate),
          duration: simpleBoardAnimation ? 0.46 : 0.58,
          ease: simpleBoardAnimation ? "power3.out" : "back.out(1.16)",
        }, index === 0 ? (simpleBoardAnimation ? "-=0.18" : "-=0.2") : "+=0.04");

        if (!simpleBoardAnimation && problemLines[index]) {
          problemTimeline.to(problemLines[index], {
            strokeDashoffset: 0,
            duration: 0.46,
            ease: "power2.out",
          }, "-=0.08");
        }
      });
    }

    const programSection = document.querySelector(".program");

    if (programSection) {
      const programHead = programSection.querySelector(".program-head");
      const programTrack = programSection.querySelector(".program-track");
      const programSegments = gsap.utils.toArray(".program-line__segment");
      const programNodes = gsap.utils.toArray(".program-node");
      const programChapters = gsap.utils.toArray(".program .learn-card");
      const programAction = programSection.querySelector(".center-action");
      const programLine = programSection.querySelector(".program-line");
      const simpleProgramAnimation = window.matchMedia("(max-width: 640px)").matches;

      gsap.set(programTrack, { opacity: 1, y: 0 });
      gsap.set(programHead, { opacity: 0, y: 34 });
      gsap.set(programChapters, {
        opacity: 0,
        y: 30,
        scale: 0.98,
        rotateX: simpleProgramAnimation ? 0 : 8,
        transformPerspective: 900,
        "--program-node-opacity": simpleProgramAnimation ? 0 : 1,
        "--program-node-scale": simpleProgramAnimation ? 0.55 : 1,
      });
      gsap.set(programAction, { opacity: 0, y: 24 });
      gsap.set(programNodes, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: "50% 50%",
      });
      if (simpleProgramAnimation) {
        gsap.set(programLine, { "--program-mobile-line-scale": 0 });
      }

      if (!simpleProgramAnimation) {
        programSegments.forEach((segment) => {
          const segmentLength = segment.getTotalLength();
          gsap.set(segment, {
            strokeDasharray: segmentLength,
            strokeDashoffset: segmentLength,
          });
        });
      }

      const programTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: programSection,
          start: "top 72%",
          once: true,
        },
      });

      programTimeline.to(programHead, {
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
        });

      if (simpleProgramAnimation) {
        programTimeline
          .to(programLine, {
            "--program-mobile-line-scale": 0.34,
            duration: 0.48,
            ease: "power2.inOut",
          }, "-=0.08")
          .to(programChapters[0], {
            opacity: 1,
            y: 0,
            scale: 1,
            "--program-node-opacity": 1,
            "--program-node-scale": 1,
            duration: 0.56,
            ease: "power3.out",
          }, "-=0.08")
          .to(programLine, {
            "--program-mobile-line-scale": 0.68,
            duration: 0.52,
            ease: "power2.inOut",
          }, "-=0.06")
          .to(programChapters[1], {
            opacity: 1,
            y: 0,
            scale: 1,
            "--program-node-opacity": 1,
            "--program-node-scale": 1,
            duration: 0.56,
            ease: "power3.out",
          }, "-=0.08")
          .to(programLine, {
            "--program-mobile-line-scale": 1,
            duration: 0.52,
            ease: "power2.inOut",
          }, "-=0.06")
          .to(programChapters[2], {
            opacity: 1,
            y: 0,
            scale: 1,
            "--program-node-opacity": 1,
            "--program-node-scale": 1,
            duration: 0.56,
            ease: "power3.out",
          }, "-=0.08");
      } else {
        programTimeline
          .to(programNodes[0], {
          opacity: 1,
          scale: 1,
          duration: 0.36,
          ease: "power3.out",
        }, "-=0.1")
        .to(programChapters[0], {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.68,
          ease: "power3.out",
        }, "-=0.12")
        .to(programSegments[0], {
          strokeDashoffset: 0,
          duration: 0.62,
          ease: "power2.inOut",
        }, "-=0.1")
        .to(programNodes[1], {
          opacity: 1,
          scale: 1,
          duration: 0.34,
          ease: "power3.out",
        }, "-=0.08")
        .to(programChapters[1], {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.68,
          ease: "power3.out",
        }, "-=0.18")
        .to(programSegments[1], {
          strokeDashoffset: 0,
          duration: 0.62,
          ease: "power2.inOut",
        }, "-=0.1")
        .to(programNodes[2], {
          opacity: 1,
          scale: 1,
          duration: 0.34,
          ease: "power3.out",
        }, "-=0.08")
        .to(programChapters[2], {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.68,
          ease: "power3.out",
        }, "-=0.18");
      }

      programTimeline.to(programAction, {
        opacity: 1,
        y: 0,
        duration: 0.64,
        ease: "power3.out",
      }, "-=0.18");
    }

    const audienceSection = document.querySelector(".audience");

    if (audienceSection) {
      const audienceCards = gsap.utils.toArray(".audience .audience-card");
      const simpleAudienceAnimation = window.matchMedia("(max-width: 640px)").matches;

      audienceCards.forEach((card, index) => {
        const finalRotate = simpleAudienceAnimation ? 0 : parseFloat(getComputedStyle(card).getPropertyValue("--polaroid-rotate")) || 0;
        const startRotates = simpleAudienceAnimation ? [-2, 2, -2, 2] : [-12, 10, -8, 12];
        card.dataset.finalRotate = finalRotate;
        gsap.set(card, {
          opacity: 0,
          y: simpleAudienceAnimation ? -42 : -90,
          scale: 0.85,
          rotate: startRotates[index] ?? finalRotate,
        });
      });

      gsap.to(audienceCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: (index, card) => Number(card.dataset.finalRotate),
        duration: simpleAudienceAnimation ? 0.68 : 0.86,
        ease: "back.out(1.08)",
        stagger: simpleAudienceAnimation ? 0.16 : 0.3,
        scrollTrigger: {
          trigger: audienceSection,
          start: "top 72%",
          once: true,
        },
      });
    }

    const expertSection = document.querySelector(".expert");

    if (expertSection) {
      const expertPhoto = expertSection.querySelector(".expert-photo");
      const expertCopy = expertSection.querySelector(".expert-copy");
      const expertIntro = gsap.utils.toArray(".expert-label, .expert-copy h2, .expert-role");
      const expertFacts = gsap.utils.toArray(".expert-facts div");
      const expertButton = expertSection.querySelector(".button");

      const simpleExpertAnimation = window.matchMedia("(max-width: 640px)").matches;

      gsap.set(expertPhoto, {
        opacity: 0,
        x: simpleExpertAnimation ? 0 : -18,
        y: simpleExpertAnimation ? 26 : 40,
        scale: simpleExpertAnimation ? 0.96 : 0.94,
        rotate: simpleExpertAnimation ? 0 : -2,
        "--expert-photo-clip-top": simpleExpertAnimation ? "0%" : "100%",
        "--expert-photo-clip-bottom": "0%",
        "--expert-frame-opacity": 0,
        "--expert-frame-scale": 0.96,
        "--expert-shine-x": "-160%",
      });
      gsap.set(expertCopy, { opacity: 1, y: 0 });
      gsap.set(expertIntro, { opacity: 0, y: 22 });
      gsap.set(expertFacts, { opacity: 0, y: 18 });
      gsap.set(expertButton, { opacity: 0, y: 20 });

      const expertTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: expertSection,
          start: "top 74%",
          once: true,
        },
      });

      expertTimeline
        .to(expertPhoto, {
          opacity: 1,
          "--expert-frame-opacity": 0.75,
          "--expert-frame-scale": 1,
          duration: simpleExpertAnimation ? 0.32 : 0.68,
          ease: "power2.out",
        })
        .to(expertPhoto, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          "--expert-photo-clip-top": "0%",
          duration: simpleExpertAnimation ? 1.18 : 2.18,
          ease: "expo.out",
        }, simpleExpertAnimation ? 0 : "-=0.08")
        .to(expertPhoto, {
          "--expert-shine-x": "180%",
          duration: simpleExpertAnimation ? 0.01 : 1.34,
          ease: "power2.out",
        }, "-=0.36")
        .to(expertPhoto, {
          boxShadow: "0 54px 128px rgba(21, 8, 17, 0.25), 0 22px 52px rgba(83, 23, 69, 0.15)",
          duration: 0.5,
          ease: "power2.out",
        }, "-=0.48")
        .to(expertIntro, {
          opacity: 1,
          y: 0,
          duration: 0.66,
          ease: "power3.out",
          stagger: 0.1,
        }, "-=0.48")
        .to(expertFacts, {
          opacity: 1,
          y: 0,
          duration: 0.54,
          ease: "power3.out",
          stagger: 0.09,
        }, "-=0.18")
        .to(expertButton, {
          opacity: 1,
          y: 0,
          duration: 0.58,
          ease: "power3.out",
        }, "-=0.08");
    }

    document.querySelectorAll(".section:not(.hero):not(.program):not(.expert) .reveal:not(.problem-board):not(.audience-card)").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true,
          },
        },
      );
    });

    const canParallax = window.matchMedia("(min-width: 981px) and (pointer: fine)").matches;
    const portrait = document.querySelector(".hero__portrait");

    if (hero && portrait && canParallax) {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;

        gsap.to(portrait, {
          "--hero-photo-x": `${x.toFixed(2)}px`,
          "--hero-photo-y": `${y.toFixed(2)}px`,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      hero.addEventListener("pointerleave", () => {
        gsap.to(portrait, {
          "--hero-photo-x": "0px",
          "--hero-photo-y": "0px",
          duration: 0.9,
          ease: "power3.out",
        });
      });
    }

    gsap.to(".hero__noise", {
      backgroundPosition: "120px 80px",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  } else {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }

})();
