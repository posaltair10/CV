(() => {
  const progress = document.querySelector(".scroll-progress");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelectorAll(".nav__links a");
  const sections = [...document.querySelectorAll("section[id]")];
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const quote = document.querySelector("[data-type]");
  const canvas = document.querySelector(".hero__canvas");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.width = `${ratio * 100}%`;

    const current = [...sections].reverse().find((section) => window.scrollY + 120 >= section.offsetTop);
    links.forEach((link) => {
      link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
    });
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  links.forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        const ring = entry.target.querySelector(".ring");
        if (ring) ring.classList.add("is-on");
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  if (quote) {
    const full = quote.textContent.trim();
    quote.textContent = "";
    let i = 0;
    const type = () => {
      quote.textContent = full.slice(0, i);
      i += 1;
      if (i <= full.length) window.setTimeout(type, 28);
    };
    window.setTimeout(type, 350);
  }

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0)";
    });
  });

  if (cursor && cursorDot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = 0;

    window.addEventListener("mousemove", (event) => {
      x = event.clientX;
      y = event.clientY;
      cursorDot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });

    const follow = () => {
      dx += (x - dx) * 0.16;
      dy += (y - dy) * 0.16;
      cursor.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    };
    follow();

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  if (canvas) {
    const ctx = canvas.getContext("2d");
    const particles = [];
    const count = 46;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = () => {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(212, 168, 83, 0.55)";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = "rgba(212, 168, 83, 0.12)";
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > 120) continue;
          ctx.globalAlpha = 1 - dist / 120;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      requestAnimationFrame(draw);
    };

    resize();
    spawn();
    draw();
    window.addEventListener("resize", () => {
      resize();
      spawn();
    });
  }

  const modal = document.getElementById("project-modal");
  const projects = {
    pulse: {
      tag: "Produto",
      title: "Pulse Analytics",
      text: "Dashboard operacional com alertas em tempo real, filas e visão por squad. A interface prioriza o que precisa de ação agora — sem ruído, com histórico e exportação.",
    },
    atlas: {
      tag: "Open source",
      title: "Atlas UI Kit",
      text: "Kit de interface com componentes reutilizáveis, estados de foco visíveis e tokens de cor, espaço e tipografia. Feito para times que precisam ir rápido sem perder consistência.",
    },
    rota: {
      tag: "Mobile",
      title: "Rota Certa",
      text: "Aplicativo de entregas urbanas com cálculo de rotas, status ao vivo e modo offline. Pensado para motoristas em movimento e operadores no centro de controle.",
    },
  };

  if (modal) {
    const tagEl = modal.querySelector("[data-modal-tag]");
    const titleEl = modal.querySelector("[data-modal-title]");
    const textEl = modal.querySelector("[data-modal-text]");

    document.querySelectorAll("[data-project]").forEach((button) => {
      button.addEventListener("click", () => {
        const data = projects[button.dataset.project];
        if (!data) return;
        tagEl.textContent = data.tag;
        titleEl.textContent = data.title;
        textEl.textContent = data.text;
        modal.showModal();
      });
    });

    modal.querySelector(".modal__close").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.close();
    });
  }

  const themeToggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;

  const syncThemeLabel = () => {
    if (!themeToggle) return;
    const isLight = root.getAttribute("data-theme") === "light";
    themeToggle.setAttribute("aria-label", isLight ? "Ativar tema escuro" : "Ativar tema claro");
    themeToggle.title = isLight ? "Tema escuro" : "Tema claro";
  };

  if (themeToggle) {
    syncThemeLabel();
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("cv-theme", next);
      syncThemeLabel();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
