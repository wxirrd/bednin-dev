import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// ★ EDITABLE DATA — редактируй здесь, сайт обновится сам
// ============================================================

export const PROJECTS: Project[] = [
  {
    id: "01",
    name: "GARANTO",
    category: "Страхование · Автомобили",
    description:
      "Корпоративный сайт страховой компании с онлайн-расчётом полисов, личным кабинетом клиента и интеграцией с CRM-системой.",
    year: "2025",
    tags: ["Дизайн", "Разработка", "CRM"],
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&h=1000&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    id: "02",
    name: "CARSELLER",
    category: "Автомобили · Digital Platform",
    description:
      "Маркетплейс автомобилей с умной фильтрацией, сравнением и персональными рекомендациями на основе поведения пользователя.",
    year: "2025",
    tags: ["Платформа", "UI/UX", "Frontend"],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=1000&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    id: "03",
    name: "COOKIO",
    category: "AI · Food · Startup",
    description:
      "AI-сервис персональных рецептов по списку продуктов. MVP за 6 недель — от концепции до первых платящих пользователей.",
    year: "2024",
    tags: ["AI", "MVP", "Fullstack"],
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=1000&fit=crop&auto=format&q=80",
    href: "#",
  },
  // ← НОВЫЙ ПРОЕКТ: скопируй блок выше и вставь сюда
];

type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  year: string;
  tags: string[];
  image: string;
  href: string;
};

// ============================================================
// UTILS
// ============================================================

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

// ============================================================
// NOISE OVERLAY
// ============================================================
function Noise() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.022,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

// ============================================================
// CURSOR
// ============================================================
function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const cur = useRef({ x: -200, y: -200 });
  const raf = useRef(0);
  const [big, setBig] = useState(false);

  useEffect(() => {
    const mv = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setBig(!!(t.closest("a") || t.closest("button")));
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseover", over);
    const loop = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.1;
      cur.current.y += (pos.current.y - cur.current.y) * 0.1;
      const rs = big ? 36 : 18;
      if (ring.current) ring.current.style.transform = `translate(${cur.current.x - rs / 2}px,${cur.current.y - rs / 2}px)`;
      if (dot.current) dot.current.style.transform = `translate(${pos.current.x - 3}px,${pos.current.y - 3}px)`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseover", over); cancelAnimationFrame(raf.current); };
  }, [big]);

  return (
    <>
      <div ref={dot} style={{ position: "fixed", top: 0, left: 0, width: 6, height: 6, background: "#F2F2F2", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, mixBlendMode: "difference" }} />
      <div ref={ring} style={{ position: "fixed", top: 0, left: 0, width: big ? 36 : 18, height: big ? 36 : 18, border: "1px solid rgba(242,242,242,0.6)", borderRadius: "50%", pointerEvents: "none", zIndex: 9998, transition: "width .3s, height .3s", mixBlendMode: "difference" }} />
    </>
  );
}

// ============================================================
// MARQUEE STRIP
// ============================================================
function Strip({ items, reverse = false, dim = false }: { items: string[]; reverse?: boolean; dim?: boolean }) {
  const str = items.join("  ·  ");
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(242,242,242,0.06)", borderBottom: "1px solid rgba(242,242,242,0.06)", padding: "12px 0" }}>
      <div style={{ display: "flex", animation: `ticker${reverse ? "R" : ""} 28s linear infinite`, whiteSpace: "nowrap" }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 10, letterSpacing: "0.2em", color: dim ? "rgba(242,242,242,0.14)" : "rgba(242,242,242,0.2)", paddingRight: 80 }}>{str}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// NAV
// ============================================================
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { l: "WORK", h: "#work" },
    { l: "УСЛУГИ", h: "#services" },
    { l: "ОБО МНЕ", h: "#about" },
    { l: "КОНТАКТ", h: "#contact" },
  ];

  const navLink: React.CSSProperties = {
    fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 10,
    letterSpacing: "0.16em", color: "rgba(242,242,242,0.4)",
    textDecoration: "none", transition: "color .2s",
  };

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: scrolled ? "1px solid rgba(242,242,242,0.06)" : "1px solid transparent",
      background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      transition: "all .45s ease",
    }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        <a href="#" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 14, letterSpacing: "0.12em", color: "#F2F2F2", textDecoration: "none" }}>
          BEDNIN®
        </a>

        {/* Desktop links */}
        <nav style={{ display: "flex", gap: 44 }} className="d-nav">
          {links.map(l => (
            <a key={l.l} href={l.h} style={navLink}
              onMouseEnter={e => (e.currentTarget.style.color = "#F2F2F2")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,242,242,0.4)")}
            >{l.l}</a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="d-nav" style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(242,242,242,0.09)", padding: "7px 14px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "block", animation: "blink 2.5s ease infinite" }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.16em", color: "rgba(242,242,242,0.5)" }}>ОТКРЫТ ДЛЯ ПРОЕКТОВ</span>
          </div>
          <button onClick={() => setOpen(!open)} className="m-burger" aria-label="Меню"
            style={{ background: "none", border: "none", padding: 8, display: "none", flexDirection: "column", gap: 5, cursor: "pointer" }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 22, height: 1, background: "#F2F2F2", transition: "all .3s",
                transform: open && i === 0 ? "rotate(45deg) translate(4px,4px)" : open && i === 2 ? "rotate(-45deg) translate(4px,-4px)" : "none",
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ background: "#050505", borderTop: "1px solid rgba(242,242,242,0.06)", padding: "40px 48px 48px" }}>
          {links.map((l, i) => (
            <a key={l.l} href={l.h} onClick={() => setOpen(false)} style={{
              display: "block", fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 34,
              letterSpacing: "-0.02em", color: "#F2F2F2", textDecoration: "none",
              paddingBottom: 22, borderBottom: i < links.length - 1 ? "1px solid rgba(242,242,242,0.06)" : "none", marginBottom: i < links.length - 1 ? 22 : 32,
            }}>{l.l}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", color: "#080808", background: "#F2F2F2", padding: "14px 24px", textDecoration: "none" }}>
            НАЧАТЬ ПРОЕКТ →
          </a>
        </div>
      )}
    </header>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "none" : "translateY(20px)",
    transition: `opacity .9s ease ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  return (
    <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 48px 88px", maxWidth: 1440, margin: "0 auto", position: "relative" }}>

      {/* Thin vertical rule left */}
      <div style={{ position: "absolute", left: 48, top: 66, bottom: 0, width: 1, background: "rgba(242,242,242,0.05)" }} />

      {/* Top-right meta */}
      <div style={{ position: "absolute", top: 96, right: 48, textAlign: "right", ...fade(0.7) }}>
        <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.22em", color: "rgba(242,242,242,0.2)", lineHeight: 2.2, margin: 0 }}>
          FULL-STACK DEVELOPER<br />МОСКВА · 2026
        </p>
      </div>

      {/* Year stamp — large ghost */}
      <div style={{ position: "absolute", right: 48, bottom: 80, fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(80px,12vw,160px)", letterSpacing: "-0.06em", color: "rgba(242,242,242,0.025)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
        2026
      </div>

      {/* Main headline */}
      <div style={{ maxWidth: 1060, ...fade(0.05) }}>
        <h1 style={{
          fontFamily: "'Inter',sans-serif", fontWeight: 900,
          fontSize: "clamp(54px,10.8vw,152px)", lineHeight: 0.86,
          letterSpacing: "-0.045em", color: "#F2F2F2", margin: "0 0 60px 0",
        }}>
          САЙТЫ,<br />
          КОТОРЫЕ{" "}
          <span style={{ WebkitTextStroke: "2px rgba(242,242,242,0.22)", color: "transparent" }}>
            ПРОДАЮТ.
          </span>
        </h1>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 36 }}>
          <div style={{ ...fade(0.3) }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 10, letterSpacing: "0.22em", color: "rgba(242,242,242,0.28)", marginBottom: 16 }}>
              Сайты · Интерфейсы · Разработка
            </div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.68, color: "rgba(242,242,242,0.46)", maxWidth: 380, margin: 0 }}>
              Разрабатываю современные сайты и цифровые продукты для компаний, предпринимателей и стартапов.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end", ...fade(0.45) }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <BtnPrimary href="#contact">НАЧАТЬ ПРОЕКТ →</BtnPrimary>
              <BtnGhost href="#work">СМОТРЕТЬ РАБОТЫ →</BtnGhost>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", animation: "blink 2.5s ease infinite" }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.18em", color: "rgba(242,242,242,0.3)" }}>
                СЕЙЧАС БЕРУ НОВЫЕ ПРОЕКТЫ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", left: 72, bottom: 44, display: "flex", alignItems: "center", gap: 10, ...fade(1.1) }}>
        <div style={{ width: 1, height: 40, background: "rgba(242,242,242,0.12)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, width: 1, height: "100%", background: "rgba(242,242,242,0.5)", animation: "slideDown 2s ease infinite" }} />
        </div>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.22em", color: "rgba(242,242,242,0.18)", writingMode: "vertical-rl" }}>SCROLL</span>
      </div>
    </section>
  );
}

// ============================================================
// BUTTONS
// ============================================================
function BtnPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", color: "#050505", background: "#F2F2F2", padding: "17px 32px", textDecoration: "none", display: "inline-block", transition: "opacity .2s" }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
      {children}
    </a>
  );
}

function BtnGhost({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", color: "#F2F2F2", border: "1px solid rgba(242,242,242,0.16)", padding: "17px 32px", textDecoration: "none", display: "inline-block", transition: "border-color .2s" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(242,242,242,0.55)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(242,242,242,0.16)")}>
      {children}
    </a>
  );
}

// ============================================================
// WORK SECTION — полноширинные editorial блоки
// ============================================================
function WorkSection() {
  const { ref, on } = useReveal();

  return (
    <section id="work" style={{ paddingTop: 100 }}>
      {/* Header */}
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px 60px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid rgba(242,242,242,0.06)", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(20px)", transition: "all .8s ease" }}>
        <div>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,242,242,0.2)", display: "block", marginBottom: 20 }}>SELECTED WORK</span>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F2F2F2", margin: 0 }}>
            ИЗБРАННЫЕ<br />РАБОТЫ
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 80, letterSpacing: "-0.06em", color: "rgba(242,242,242,0.03)", lineHeight: 1 }}>
            {String(PROJECTS.length).padStart(2, "0")}
          </div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.16em", color: "rgba(242,242,242,0.18)" }}>ПРОЕКТА</div>
        </div>
      </div>

      {PROJECTS.map((p, i) => <ProjectBlock key={p.id} project={p} index={i} />)}
    </section>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const { ref, on } = useReveal();
  const [hov, setHov] = useState(false);
  const even = index % 2 === 0;

  return (
    <article
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: "1px solid rgba(242,242,242,0.06)",
        padding: "72px 48px",
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(40px)",
        transition: `opacity .9s ease ${index * 0.06}s, transform .9s cubic-bezier(.16,1,.3,1) ${index * 0.06}s`,
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 72px", alignItems: "center" }} className="proj-grid">

        {/* Info */}
        <div style={{ order: even ? 1 : 2 }} className="proj-info">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 44 }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.24em", color: "rgba(242,242,242,0.16)" }}>{project.id}</span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.14em", color: "rgba(242,242,242,0.18)" }}>{project.year}</span>
          </div>

          <h3 style={{
            fontFamily: "'Inter',sans-serif", fontWeight: 900,
            fontSize: "clamp(40px,5.5vw,80px)", lineHeight: 0.9,
            letterSpacing: "-0.04em", color: hov ? "#F2F2F2" : "rgba(242,242,242,0.82)",
            margin: "0 0 14px 0", transition: "color .3s",
          }}>{project.name}</h3>

          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.18em", color: "rgba(242,242,242,0.24)", marginBottom: 32, textTransform: "uppercase" }}>
            {project.category}
          </div>

          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 15, lineHeight: 1.74, color: "rgba(242,242,242,0.45)", margin: "0 0 48px 0", maxWidth: 390 }}>
            {project.description}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {project.tags.map(t => (
                <span key={t} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.14em", color: "rgba(242,242,242,0.28)", border: "1px solid rgba(242,242,242,0.07)", padding: "5px 10px" }}>{t}</span>
              ))}
            </div>
            <a href={project.href} style={{
              fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 10,
              letterSpacing: "0.14em", color: "#F2F2F2", textDecoration: "none",
              borderBottom: "1px solid rgba(242,242,242,0.22)", paddingBottom: 3,
              transition: "border-color .2s, letter-spacing .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F2F2F2"; e.currentTarget.style.letterSpacing = "0.2em"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(242,242,242,0.22)"; e.currentTarget.style.letterSpacing = "0.14em"; }}>
              СМОТРЕТЬ КЕЙС →
            </a>
          </div>
        </div>

        {/* Image — browser frame */}
        <div style={{ order: even ? 2 : 1, perspective: "1400px" }} className="proj-img">
          <div style={{
            transform: hov ? (even ? "rotateY(-2.5deg) rotateX(1.5deg) scale(1.01)" : "rotateY(2.5deg) rotateX(1.5deg) scale(1.01)") : "rotateY(0) rotateX(0) scale(1)",
            transition: "transform .7s cubic-bezier(.25,.46,.45,.94)",
          }}>
            {/* Browser chrome */}
            <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(242,242,242,0.07)", boxShadow: hov ? "0 48px 96px rgba(0,0,0,0.7)" : "0 24px 48px rgba(0,0,0,0.5)", transition: "box-shadow .5s ease", background: "#111" }}>
              <div style={{ background: "#181818", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(242,242,242,0.05)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.55 }} />)}
                </div>
                <div style={{ flex: 1, background: "#0d0d0d", borderRadius: 5, height: 22, display: "flex", alignItems: "center", paddingLeft: 10 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(242,242,242,0.18)", letterSpacing: "0.04em" }}>{project.name.toLowerCase()}.ru</span>
                </div>
              </div>
              <div style={{ overflow: "hidden", maxHeight: 340 }}>
                <img src={project.image} alt={project.name}
                  style={{ width: "100%", display: "block", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .8s cubic-bezier(.25,.46,.45,.94)", filter: "grayscale(12%) contrast(1.05)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ============================================================
// SERVICES
// ============================================================
const SERVICES = [
  { num: "01", title: "САЙТЫ", en: "Websites", desc: "Корпоративные сайты, лендинги, каталоги и коммерческие проекты. Дизайн и разработка под ключ." },
  { num: "02", title: "ЦИФРОВЫЕ\nПРОДУКТЫ", en: "Digital Products", desc: "Интерфейсы, MVP и веб-приложения для стартапов и бизнеса. От концепции до запуска." },
  { num: "03", title: "РАЗРАБОТКА", en: "Development", desc: "Современная frontend и full-stack разработка с готовым production-результатом." },
];

function ServicesSection() {
  const { ref, on } = useReveal();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" style={{ padding: "120px 0", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px" }}>
        <div ref={ref as React.RefObject<HTMLDivElement>} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 24, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(20px)", transition: "all .8s ease" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,242,242,0.2)" }}>УСЛУГИ</span>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F2F2F2", margin: 0 }}>ЧТО Я ДЕЛАЮ</h2>
        </div>

        {SERVICES.map((s, i) => (
          <div key={s.num}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              display: "grid", gridTemplateColumns: "56px 1fr max-content",
              gap: "0 48px", padding: "52px 0",
              borderTop: "1px solid rgba(242,242,242,0.06)",
              alignItems: "center", cursor: "default",
              opacity: on ? 1 : 0, transform: on ? "none" : "translateY(20px)",
              transition: `opacity .7s ease ${i * .1 + .2}s, transform .7s ease ${i * .1 + .2}s`,
            }} className="svc-row">
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.22em", color: active === i ? "rgba(242,242,242,0.35)" : "rgba(242,242,242,0.14)", transition: "color .25s" }}>{s.num}</span>
            <div>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4.5vw,62px)", letterSpacing: "-0.035em", lineHeight: 0.95, color: active === i ? "#F2F2F2" : "rgba(242,242,242,0.5)", margin: 0, whiteSpace: "pre-line", transition: "color .3s" }}>{s.title}</h3>
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,242,242,0.14)", display: "block", marginTop: 7 }}>{s.en}</span>
            </div>
            <p className="svc-desc" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 14, lineHeight: 1.72, color: "rgba(242,242,242,0.35)", margin: 0, maxWidth: 320, textAlign: "right", opacity: active === i ? 1 : 0.5, transition: "opacity .3s" }}>{s.desc}</p>
          </div>
        ))}
        <div style={{ height: 1, background: "rgba(242,242,242,0.06)" }} />
      </div>
    </section>
  );
}

// ============================================================
// ABOUT
// ============================================================
function AboutSection() {
  const { ref, on } = useReveal();
  const stats = [
    { target: 30, suffix: "+", label: "проектов" },
    { target: 5, suffix: "+", label: "лет опыта" },
  ];

  return (
    <section id="about" style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 100px", alignItems: "start", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(28px)", transition: "all .9s ease" }}
        className="about-grid">

        {/* Left */}
        <div>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,242,242,0.2)", display: "block", marginBottom: 48 }}>ОБО МНЕ</span>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(28px,3.8vw,50px)", letterSpacing: "-0.03em", lineHeight: 1.03, color: "#F2F2F2", margin: "0 0 48px 0" }}>
            Я ДЕЛАЮ ТО,<br />ЧЕМ ХОЧУ<br />ПОЛЬЗОВАТЬСЯ<br />
            <span style={{ WebkitTextStroke: "1.5px rgba(242,242,242,0.2)", color: "transparent" }}>САМ.</span>
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.72, color: "rgba(242,242,242,0.46)", margin: "0 0 22px 0", maxWidth: 440 }}>
            Я независимый разработчик, занимаюсь созданием современных сайтов, цифровых продуктов и веб-приложений.
          </p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.72, color: "rgba(242,242,242,0.46)", margin: "0 0 64px 0", maxWidth: 440 }}>
            Для меня важны не только код и функциональность, но и то, как продукт выглядит, ощущается и работает для пользователя.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 40px", paddingTop: 48, borderTop: "1px solid rgba(242,242,242,0.06)" }}>
            {stats.map(s => <StatItem key={s.label} target={s.target} suffix={s.suffix} label={s.label} active={on} />)}
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 40, letterSpacing: "-0.04em", lineHeight: 1, color: "#F2F2F2", marginBottom: 6 }}>∞</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.22)" }}>итераций до результата</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 40, letterSpacing: "-0.04em", lineHeight: 1, color: "#F2F2F2", marginBottom: 6 }}>1</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.22)" }}>человек → весь результат</div>
            </div>
          </div>
        </div>

        {/* Right: editorial photo */}
        <div style={{ position: "relative" }}>
          <div style={{ aspectRatio: "4/5", background: "#111", overflow: "hidden", position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&h=1125&fit=crop&auto=format&q=85"
              alt="BEDNIN"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%) contrast(1.08)" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,5,0.5) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 26, left: 26 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.24em", color: "rgba(242,242,242,0.38)" }}>BEDNIN — DEVELOPER</span>
            </div>
          </div>
          {/* Ghost frame */}
          <div style={{ position: "absolute", top: 28, right: -28, bottom: -28, left: 28, border: "1px solid rgba(242,242,242,0.05)", zIndex: -1 }} />
        </div>
      </div>
    </section>
  );
}

function StatItem({ target, suffix, label, active }: { target: number; suffix: string; label: string; active: boolean }) {
  const val = useCountUp(target, active);
  return (
    <div>
      <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 40, letterSpacing: "-0.04em", lineHeight: 1, color: "#F2F2F2", marginBottom: 6 }}>{val}{suffix}</div>
      <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.22)" }}>{label}</div>
    </div>
  );
}

// ============================================================
// PROCESS
// ============================================================
const PROCESS = [
  { num: "01", title: "ЗАДАЧА", desc: "Разбираемся в бизнесе, продукте и целях проекта." },
  { num: "02", title: "ДИЗАЙН", desc: "Определяем визуальное направление и пользовательский опыт." },
  { num: "03", title: "РАЗРАБОТКА", desc: "Превращаем дизайн в быстрый адаптивный работающий продукт." },
  { num: "04", title: "ЗАПУСК", desc: "Передаём готовый сайт и помогаем запустить его." },
];

function ProcessSection() {
  const { ref, on } = useReveal();
  return (
    <section style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 24 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,242,242,0.2)" }}>ПРОЦЕСС</span>
        <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F2F2F2", margin: 0 }}>КАК МЫ РАБОТАЕМ</h2>
      </div>
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }} className="proc-grid">
        {PROCESS.map((s, i) => (
          <div key={s.num} style={{ paddingRight: 40, paddingLeft: i === 0 ? 0 : 40, borderLeft: i === 0 ? "none" : "1px solid rgba(242,242,242,0.06)", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(20px)", transition: `all .7s ease ${i * .1 + .15}s` }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 52, letterSpacing: "-0.05em", color: "rgba(242,242,242,0.04)", lineHeight: 1, marginBottom: 32 }}>{s.num}</div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", color: "#F2F2F2", margin: "0 0 12px 0" }}>{s.title}</h3>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: 1.7, color: "rgba(242,242,242,0.32)", margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// WHY
// ============================================================
function WhySection() {
  const { ref, on } = useReveal();
  const items = [
    { title: "ДИЗАЙН + КОД", desc: "Один человек отвечает за весь результат." },
    { title: "БЫСТРАЯ\nКОММУНИКАЦИЯ", desc: "Без длинной цепочки менеджеров и посредников." },
    { title: "ФОКУС НА\nРЕЗУЛЬТАТ", desc: "Сайт должен решать бизнес-задачу, а не просто красиво выглядеть." },
  ];
  return (
    <section style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: "all .9s ease" }}>
        <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(64px,11vw,152px)", letterSpacing: "-0.055em", lineHeight: 0.85, color: "#F2F2F2", margin: "0 0 80px 0" }}>
          НЕ ПРОСТО<br />
          <span style={{ WebkitTextStroke: "2px rgba(242,242,242,0.16)", color: "transparent" }}>САЙТ.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }} className="why-grid">
          {items.map((it, i) => (
            <div key={it.title} style={{ paddingRight: 48, paddingLeft: i === 0 ? 0 : 48, borderLeft: i === 0 ? "none" : "1px solid rgba(242,242,242,0.06)", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(20px)", transition: `all .7s ease ${i * .1 + .2}s` }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(16px,2vw,22px)", letterSpacing: "0.02em", lineHeight: 1.08, color: "#F2F2F2", margin: "0 0 14px 0", whiteSpace: "pre-line" }}>{it.title}</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: 1.7, color: "rgba(242,242,242,0.36)", margin: 0 }}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// DESIGN SYSTEM SECTION
// ============================================================
function DesignSystemSection() {
  const { ref, on } = useReveal();
  return (
    <section style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: "all .9s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 24 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,242,242,0.2)" }}>DESIGN SYSTEM</span>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(36px,4.5vw,60px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F2F2F2", margin: 0 }}>КОМПОНЕНТЫ</h2>
        </div>

        {/* Typography scale */}
        <div style={{ borderTop: "1px solid rgba(242,242,242,0.06)", paddingTop: 48, marginBottom: 64 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.22em", color: "rgba(242,242,242,0.2)", display: "block", marginBottom: 32 }}>ТИПОГРАФИКА</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "Display / 152px", size: "clamp(48px,8vw,96px)", weight: 900, text: "ЗАГОЛОВОК" },
              { label: "Heading / 72px", size: "clamp(32px,5vw,56px)", weight: 900, text: "Раздел сайта" },
              { label: "Subhead / 24px", size: 20, weight: 700, text: "Подзаголовок блока" },
              { label: "Body / 16px", size: 15, weight: 400, text: "Основной текст страницы — читабельный и чистый." },
              { label: "Label / 10px", size: 10, weight: 500, text: "МЕТКА · КАТЕГОРИЯ · ТЕГ" },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", alignItems: "baseline", gap: 32, padding: "20px 0", borderBottom: "1px solid rgba(242,242,242,0.04)" }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.16em", color: "rgba(242,242,242,0.2)", minWidth: 130, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: row.weight, fontSize: row.size, letterSpacing: typeof row.size === "number" && row.size <= 10 ? "0.18em" : "-0.03em", color: "#F2F2F2", lineHeight: 1 }}>{row.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ borderTop: "1px solid rgba(242,242,242,0.06)", paddingTop: 48, marginBottom: 64 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.22em", color: "rgba(242,242,242,0.2)", display: "block", marginBottom: 32 }}>КНОПКИ</span>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <BtnPrimary href="#">НАЧАТЬ ПРОЕКТ →</BtnPrimary>
            <BtnGhost href="#">СМОТРЕТЬ РАБОТЫ →</BtnGhost>
            <a href="#" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: "0.14em", color: "#F2F2F2", textDecoration: "none", borderBottom: "1px solid rgba(242,242,242,0.3)", paddingBottom: 3 }}>ТЕКСТОВАЯ ССЫЛКА →</a>
          </div>
        </div>

        {/* Labels & tags */}
        <div style={{ borderTop: "1px solid rgba(242,242,242,0.06)", paddingTop: 48, marginBottom: 64 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.22em", color: "rgba(242,242,242,0.2)", display: "block", marginBottom: 32 }}>МЕТКИ И ТЕГИ</span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {["Дизайн", "Разработка", "UI/UX", "AI", "MVP", "Frontend", "CRM"].map(t => (
              <span key={t} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.14em", color: "rgba(242,242,242,0.32)", border: "1px solid rgba(242,242,242,0.08)", padding: "6px 12px" }}>{t}</span>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(242,242,242,0.08)", padding: "6px 14px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "block" }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.14em", color: "rgba(242,242,242,0.4)" }}>ОТКРЫТ ДЛЯ ПРОЕКТОВ</span>
            </div>
          </div>
        </div>

        {/* Color palette */}
        <div style={{ borderTop: "1px solid rgba(242,242,242,0.06)", paddingTop: 48 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.22em", color: "rgba(242,242,242,0.2)", display: "block", marginBottom: 32 }}>ЦВЕТА</span>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { c: "#050505", l: "Background" },
              { c: "#111111", l: "Surface" },
              { c: "#1A1A1A", l: "Elevated" },
              { c: "rgba(242,242,242,0.06)", l: "Border" },
              { c: "rgba(242,242,242,0.25)", l: "Muted text" },
              { c: "#F2F2F2", l: "Foreground" },
              { c: "#4ade80", l: "Status" },
            ].map(s => (
              <div key={s.l}>
                <div style={{ width: 56, height: 56, background: s.c, border: "1px solid rgba(242,242,242,0.1)", marginBottom: 8 }} />
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.1em", color: "rgba(242,242,242,0.28)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA
// ============================================================
function CTASection() {
  const { ref, on } = useReveal();
  return (
    <section id="contact" style={{ padding: "140px 48px 120px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(32px)", transition: "all 1s ease" }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.26em", color: "rgba(242,242,242,0.22)", display: "block", marginBottom: 36 }}>ЕСТЬ ЗАДАЧА?</span>
        <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(44px,9vw,130px)", letterSpacing: "-0.055em", lineHeight: 0.86, color: "#F2F2F2", margin: "0 0 88px 0" }}>
          ДАВАЙТЕ<br />СДЕЛАЕМ ЕЁ<br />
          <span style={{ WebkitTextStroke: "2px rgba(242,242,242,0.2)", color: "transparent" }}>КРАСИВОЙ.</span>
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <BtnPrimary href="https://t.me/bednin">ОБСУДИТЬ ПРОЕКТ →</BtnPrimary>
          <div style={{ display: "flex", gap: 44 }}>
            {[{ l: "Telegram", h: "https://t.me/bednin" }, { l: "Email", h: "mailto:hello@bednin.ru" }].map(c => (
              <a key={c.l} href={c.h} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 14, color: "rgba(242,242,242,0.32)", textDecoration: "none", borderBottom: "1px solid transparent", paddingBottom: 2, transition: "color .2s, border-color .2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#F2F2F2"; e.currentTarget.style.borderColor = "rgba(242,242,242,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(242,242,242,0.32)"; e.currentTarget.style.borderColor = "transparent"; }}>
                {c.l} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer style={{ maxWidth: 1440, margin: "0 auto", padding: "44px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: "0.12em", color: "#F2F2F2", marginBottom: 6 }}>BEDNIN®</div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.2)" }}>Независимый разработчик · digital studio</div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.1)", marginTop: 3 }}>Сайты · Цифровые продукты · Разработка</div>
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
          {[{ l: "TELEGRAM", h: "https://t.me/bednin" }, { l: "EMAIL", h: "mailto:hello@bednin.ru" }].map(lk => (
            <a key={lk.l} href={lk.h} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,242,242,0.22)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F2F2F2")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,242,242,0.22)")}
            >{lk.l}</a>
          ))}
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.12em", color: "rgba(242,242,242,0.1)" }}>© 2026 BEDNIN</span>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Noise />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Strip items={["FULL-STACK DEVELOPMENT", "WEB DESIGN", "UI/UX", "MVP", "NEXT.JS", "REACT", "TYPESCRIPT", "DIGITAL PRODUCTS"]} />
        <WorkSection />
        <Strip items={["ОТКРЫТ ДЛЯ ПРОЕКТОВ", "ДИЗАЙН + КОД", "БЫСТРЫЙ РЕЗУЛЬТАТ", "ФОКУС НА БИЗНЕС", "СТАРТАПЫ", "ПРЕДПРИНИМАТЕЛИ"]} reverse dim />
        <ServicesSection />
        <AboutSection />
        <ProcessSection />
        <WhySection />
        <DesignSystemSection />
        <CTASection />
      </main>
      <Footer />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-20%)} }
        @keyframes tickerR { from{transform:translateX(-20%)} to{transform:translateX(0)} }
        @keyframes slideDown { 0%{transform:translateY(-100%)} 100%{transform:translateY(200%)} }

        * { box-sizing:border-box; }
        ::selection { background:#F2F2F2; color:#050505; }
        ::-webkit-scrollbar { width:0 }

        @media (max-width:960px) {
          .d-nav { display:none !important; }
          .m-burger { display:flex !important; }
          .proj-grid { grid-template-columns:1fr !important; gap:48px 0 !important; }
          .proj-info { order:2 !important; }
          .proj-img { order:1 !important; }
          .about-grid { grid-template-columns:1fr !important; gap:64px 0 !important; }
          .proc-grid { grid-template-columns:1fr 1fr !important; gap:48px !important; }
          .why-grid { grid-template-columns:1fr !important; gap:36px !important; }
          .svc-desc { display:none !important; }
          .svc-row { grid-template-columns:48px 1fr !important; }
        }
        @media (max-width:600px) {
          section,[style*="padding:120px 48px"],[style*="padding: 120px 48px"] { padding-left:24px !important; padding-right:24px !important; }
          .proc-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}
