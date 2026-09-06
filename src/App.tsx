import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// в… EDITABLE DATA вЂ” СЂРµРґР°РєС‚РёСЂСѓР№ Р·РґРµСЃСЊ, СЃР°Р№С‚ РѕР±РЅРѕРІРёС‚СЃСЏ СЃР°Рј
// ============================================================

export const PROJECTS: Project[] = [
  {
    id: "01",
    name: "GARANTO",
    category: "РЎС‚СЂР°С…РѕРІР°РЅРёРµ В· РђРІС‚РѕРјРѕР±РёР»Рё",
    description:
      "РљРѕСЂРїРѕСЂР°С‚РёРІРЅС‹Р№ СЃР°Р№С‚ СЃС‚СЂР°С…РѕРІРѕР№ РєРѕРјРїР°РЅРёРё СЃ РѕРЅР»Р°Р№РЅ-СЂР°СЃС‡С‘С‚РѕРј РїРѕР»РёСЃРѕРІ, Р»РёС‡РЅС‹Рј РєР°Р±РёРЅРµС‚РѕРј РєР»РёРµРЅС‚Р° Рё РёРЅС‚РµРіСЂР°С†РёРµР№ СЃ CRM-СЃРёСЃС‚РµРјРѕР№.",
    year: "2025",
    tags: ["Р”РёР·Р°Р№РЅ", "Р Р°Р·СЂР°Р±РѕС‚РєР°", "CRM"],
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&h=1000&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    id: "02",
    name: "CARSELLER",
    category: "РђРІС‚РѕРјРѕР±РёР»Рё В· Digital Platform",
    description:
      "РњР°СЂРєРµС‚РїР»РµР№СЃ Р°РІС‚РѕРјРѕР±РёР»РµР№ СЃ СѓРјРЅРѕР№ С„РёР»СЊС‚СЂР°С†РёРµР№, СЃСЂР°РІРЅРµРЅРёРµРј Рё РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹РјРё СЂРµРєРѕРјРµРЅРґР°С†РёСЏРјРё РЅР° РѕСЃРЅРѕРІРµ РїРѕРІРµРґРµРЅРёСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ.",
    year: "2025",
    tags: ["РџР»Р°С‚С„РѕСЂРјР°", "UI/UX", "Frontend"],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=1000&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    id: "03",
    name: "COOKIO",
    category: "AI В· Food В· Startup",
    description:
      "AI-СЃРµСЂРІРёСЃ РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… СЂРµС†РµРїС‚РѕРІ РїРѕ СЃРїРёСЃРєСѓ РїСЂРѕРґСѓРєС‚РѕРІ. MVP Р·Р° 6 РЅРµРґРµР»СЊ вЂ” РѕС‚ РєРѕРЅС†РµРїС†РёРё РґРѕ РїРµСЂРІС‹С… РїР»Р°С‚СЏС‰РёС… РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№.",
    year: "2024",
    tags: ["AI", "MVP", "Fullstack"],
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=1000&fit=crop&auto=format&q=80",
    href: "#",
  },
  // в†ђ РќРћР’Р«Р™ РџР РћР•РљРў: СЃРєРѕРїРёСЂСѓР№ Р±Р»РѕРє РІС‹С€Рµ Рё РІСЃС‚Р°РІСЊ СЃСЋРґР°
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
  const str = items.join("  В·  ");
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
    { l: "РЈРЎР›РЈР“Р", h: "#services" },
    { l: "РћР‘Рћ РњРќР•", h: "#about" },
    { l: "РљРћРќРўРђРљРў", h: "#contact" },
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
          BEDNINВ®
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
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.16em", color: "rgba(242,242,242,0.5)" }}>РћРўРљР Р«Рў Р”Р›РЇ РџР РћР•РљРўРћР’</span>
          </div>
          <button onClick={() => setOpen(!open)} className="m-burger" aria-label="РњРµРЅСЋ"
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
            РќРђР§РђРўР¬ РџР РћР•РљРў в†’
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
          FULL-STACK DEVELOPER<br />РњРћРЎРљР’Рђ В· 2026
        </p>
      </div>

      {/* Year stamp вЂ” large ghost */}
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
          РЎРђР™РўР«,<br />
          РљРћРўРћР Р«Р•{" "}
          <span style={{ WebkitTextStroke: "2px rgba(242,242,242,0.22)", color: "transparent" }}>
            РџР РћР”РђР®Рў.
          </span>
        </h1>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 36 }}>
          <div style={{ ...fade(0.3) }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 10, letterSpacing: "0.22em", color: "rgba(242,242,242,0.28)", marginBottom: 16 }}>
              РЎР°Р№С‚С‹ В· РРЅС‚РµСЂС„РµР№СЃС‹ В· Р Р°Р·СЂР°Р±РѕС‚РєР°
            </div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.68, color: "rgba(242,242,242,0.46)", maxWidth: 380, margin: 0 }}>
              Р Р°Р·СЂР°Р±Р°С‚С‹РІР°СЋ СЃРѕРІСЂРµРјРµРЅРЅС‹Рµ СЃР°Р№С‚С‹ Рё С†РёС„СЂРѕРІС‹Рµ РїСЂРѕРґСѓРєС‚С‹ РґР»СЏ РєРѕРјРїР°РЅРёР№, РїСЂРµРґРїСЂРёРЅРёРјР°С‚РµР»РµР№ Рё СЃС‚Р°СЂС‚Р°РїРѕРІ.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end", ...fade(0.45) }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <BtnPrimary href="#contact">РќРђР§РђРўР¬ РџР РћР•РљРў в†’</BtnPrimary>
              <BtnGhost href="#work">РЎРњРћРўР Р•РўР¬ Р РђР‘РћРўР« в†’</BtnGhost>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", animation: "blink 2.5s ease infinite" }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.18em", color: "rgba(242,242,242,0.3)" }}>
                РЎР•Р™Р§РђРЎ Р‘Р•Р РЈ РќРћР’Р«Р• РџР РћР•РљРўР«
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
// WORK SECTION вЂ” РїРѕР»РЅРѕС€РёСЂРёРЅРЅС‹Рµ editorial Р±Р»РѕРєРё
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
            РР—Р‘Р РђРќРќР«Р•<br />Р РђР‘РћРўР«
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 80, letterSpacing: "-0.06em", color: "rgba(242,242,242,0.03)", lineHeight: 1 }}>
            {String(PROJECTS.length).padStart(2, "0")}
          </div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.16em", color: "rgba(242,242,242,0.18)" }}>РџР РћР•РљРўРђ</div>
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
              РЎРњРћРўР Р•РўР¬ РљР•Р™РЎ в†’
            </a>
          </div>
        </div>

        {/* Image вЂ” browser frame */}
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
  { num: "01", title: "РЎРђР™РўР«", en: "Websites", desc: "РљРѕСЂРїРѕСЂР°С‚РёРІРЅС‹Рµ СЃР°Р№С‚С‹, Р»РµРЅРґРёРЅРіРё, РєР°С‚Р°Р»РѕРіРё Рё РєРѕРјРјРµСЂС‡РµСЃРєРёРµ РїСЂРѕРµРєС‚С‹. Р”РёР·Р°Р№РЅ Рё СЂР°Р·СЂР°Р±РѕС‚РєР° РїРѕРґ РєР»СЋС‡." },
  { num: "02", title: "Р¦РР¤Р РћР’Р«Р•\nРџР РћР”РЈРљРўР«", en: "Digital Products", desc: "РРЅС‚РµСЂС„РµР№СЃС‹, MVP Рё РІРµР±-РїСЂРёР»РѕР¶РµРЅРёСЏ РґР»СЏ СЃС‚Р°СЂС‚Р°РїРѕРІ Рё Р±РёР·РЅРµСЃР°. РћС‚ РєРѕРЅС†РµРїС†РёРё РґРѕ Р·Р°РїСѓСЃРєР°." },
  { num: "03", title: "Р РђР—Р РђР‘РћРўРљРђ", en: "Development", desc: "РЎРѕРІСЂРµРјРµРЅРЅР°СЏ frontend Рё full-stack СЂР°Р·СЂР°Р±РѕС‚РєР° СЃ РіРѕС‚РѕРІС‹Рј production-СЂРµР·СѓР»СЊС‚Р°С‚РѕРј." },
];

function ServicesSection() {
  const { ref, on } = useReveal();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" style={{ padding: "120px 0", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px" }}>
        <div ref={ref as React.RefObject<HTMLDivElement>} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 24, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(20px)", transition: "all .8s ease" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,242,242,0.2)" }}>РЈРЎР›РЈР“Р</span>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F2F2F2", margin: 0 }}>Р§РўРћ РЇ Р”Р•Р›РђР®</h2>
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
    { target: 30, suffix: "+", label: "РїСЂРѕРµРєС‚РѕРІ" },
    { target: 5, suffix: "+", label: "Р»РµС‚ РѕРїС‹С‚Р°" },
  ];

  return (
    <section id="about" style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 100px", alignItems: "start", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(28px)", transition: "all .9s ease" }}
        className="about-grid">

        {/* Left */}
        <div>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,242,242,0.2)", display: "block", marginBottom: 48 }}>РћР‘Рћ РњРќР•</span>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(28px,3.8vw,50px)", letterSpacing: "-0.03em", lineHeight: 1.03, color: "#F2F2F2", margin: "0 0 48px 0" }}>
            РЇ Р”Р•Р›РђР® РўРћ,<br />Р§Р•Рњ РҐРћР§РЈ<br />РџРћР›Р¬Р—РћР’РђРўР¬РЎРЇ<br />
            <span style={{ WebkitTextStroke: "1.5px rgba(242,242,242,0.2)", color: "transparent" }}>РЎРђРњ.</span>
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.72, color: "rgba(242,242,242,0.46)", margin: "0 0 22px 0", maxWidth: 440 }}>
            РЇ РЅРµР·Р°РІРёСЃРёРјС‹Р№ СЂР°Р·СЂР°Р±РѕС‚С‡РёРє, Р·Р°РЅРёРјР°СЋСЃСЊ СЃРѕР·РґР°РЅРёРµРј СЃРѕРІСЂРµРјРµРЅРЅС‹С… СЃР°Р№С‚РѕРІ, С†РёС„СЂРѕРІС‹С… РїСЂРѕРґСѓРєС‚РѕРІ Рё РІРµР±-РїСЂРёР»РѕР¶РµРЅРёР№.
          </p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.72, color: "rgba(242,242,242,0.46)", margin: "0 0 64px 0", maxWidth: 440 }}>
            Р”Р»СЏ РјРµРЅСЏ РІР°Р¶РЅС‹ РЅРµ С‚РѕР»СЊРєРѕ РєРѕРґ Рё С„СѓРЅРєС†РёРѕРЅР°Р»СЊРЅРѕСЃС‚СЊ, РЅРѕ Рё С‚Рѕ, РєР°Рє РїСЂРѕРґСѓРєС‚ РІС‹РіР»СЏРґРёС‚, РѕС‰СѓС‰Р°РµС‚СЃСЏ Рё СЂР°Р±РѕС‚Р°РµС‚ РґР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 40px", paddingTop: 48, borderTop: "1px solid rgba(242,242,242,0.06)" }}>
            {stats.map(s => <StatItem key={s.label} target={s.target} suffix={s.suffix} label={s.label} active={on} />)}
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 40, letterSpacing: "-0.04em", lineHeight: 1, color: "#F2F2F2", marginBottom: 6 }}>в€ћ</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.22)" }}>РёС‚РµСЂР°С†РёР№ РґРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р°</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 40, letterSpacing: "-0.04em", lineHeight: 1, color: "#F2F2F2", marginBottom: 6 }}>1</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.22)" }}>С‡РµР»РѕРІРµРє в†’ РІРµСЃСЊ СЂРµР·СѓР»СЊС‚Р°С‚</div>
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
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.24em", color: "rgba(242,242,242,0.38)" }}>BEDNIN вЂ” DEVELOPER</span>
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
  { num: "01", title: "Р—РђР”РђР§Рђ", desc: "Р Р°Р·Р±РёСЂР°РµРјСЃСЏ РІ Р±РёР·РЅРµСЃРµ, РїСЂРѕРґСѓРєС‚Рµ Рё С†РµР»СЏС… РїСЂРѕРµРєС‚Р°." },
  { num: "02", title: "Р”РР—РђР™Рќ", desc: "РћРїСЂРµРґРµР»СЏРµРј РІРёР·СѓР°Р»СЊРЅРѕРµ РЅР°РїСЂР°РІР»РµРЅРёРµ Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊСЃРєРёР№ РѕРїС‹С‚." },
  { num: "03", title: "Р РђР—Р РђР‘РћРўРљРђ", desc: "РџСЂРµРІСЂР°С‰Р°РµРј РґРёР·Р°Р№РЅ РІ Р±С‹СЃС‚СЂС‹Р№ Р°РґР°РїС‚РёРІРЅС‹Р№ СЂР°Р±РѕС‚Р°СЋС‰РёР№ РїСЂРѕРґСѓРєС‚." },
  { num: "04", title: "Р—РђРџРЈРЎРљ", desc: "РџРµСЂРµРґР°С‘Рј РіРѕС‚РѕРІС‹Р№ СЃР°Р№С‚ Рё РїРѕРјРѕРіР°РµРј Р·Р°РїСѓСЃС‚РёС‚СЊ РµРіРѕ." },
];

function ProcessSection() {
  const { ref, on } = useReveal();
  return (
    <section style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 24 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,242,242,0.2)" }}>РџР РћР¦Р•РЎРЎ</span>
        <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F2F2F2", margin: 0 }}>РљРђРљ РњР« Р РђР‘РћРўРђР•Рњ</h2>
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
    { title: "Р”РР—РђР™Рќ + РљРћР”", desc: "РћРґРёРЅ С‡РµР»РѕРІРµРє РѕС‚РІРµС‡Р°РµС‚ Р·Р° РІРµСЃСЊ СЂРµР·СѓР»СЊС‚Р°С‚." },
    { title: "Р‘Р«РЎРўР РђРЇ\nРљРћРњРњРЈРќРРљРђР¦РРЇ", desc: "Р‘РµР· РґР»РёРЅРЅРѕР№ С†РµРїРѕС‡РєРё РјРµРЅРµРґР¶РµСЂРѕРІ Рё РїРѕСЃСЂРµРґРЅРёРєРѕРІ." },
    { title: "Р¤РћРљРЈРЎ РќРђ\nР Р•Р—РЈР›Р¬РўРђРў", desc: "РЎР°Р№С‚ РґРѕР»Р¶РµРЅ СЂРµС€Р°С‚СЊ Р±РёР·РЅРµСЃ-Р·Р°РґР°С‡Сѓ, Р° РЅРµ РїСЂРѕСЃС‚Рѕ РєСЂР°СЃРёРІРѕ РІС‹РіР»СЏРґРµС‚СЊ." },
  ];
  return (
    <section style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: "all .9s ease" }}>
        <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(64px,11vw,152px)", letterSpacing: "-0.055em", lineHeight: 0.85, color: "#F2F2F2", margin: "0 0 80px 0" }}>
          РќР• РџР РћРЎРўРћ<br />
          <span style={{ WebkitTextStroke: "2px rgba(242,242,242,0.16)", color: "transparent" }}>РЎРђР™Рў.</span>
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
// CTA
// ============================================================
function CTASection() {
  const { ref, on } = useReveal();
  return (
    <section id="contact" style={{ padding: "140px 48px 120px", maxWidth: 1440, margin: "0 auto", borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(32px)", transition: "all 1s ease" }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.26em", color: "rgba(242,242,242,0.22)", display: "block", marginBottom: 36 }}>Р•РЎРўР¬ Р—РђР”РђР§Рђ?</span>
        <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(44px,9vw,130px)", letterSpacing: "-0.055em", lineHeight: 0.86, color: "#F2F2F2", margin: "0 0 88px 0" }}>
          Р”РђР’РђР™РўР•<br />РЎР”Р•Р›РђР•Рњ Р•РЃ<br />
          <span style={{ WebkitTextStroke: "2px rgba(242,242,242,0.2)", color: "transparent" }}>РљР РђРЎРР’РћР™.</span>
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <BtnPrimary href="https://t.me/bednin">РћР‘РЎРЈР”РРўР¬ РџР РћР•РљРў в†’</BtnPrimary>
          <div style={{ display: "flex", gap: 44 }}>
            {[{ l: "Telegram", h: "https://t.me/bednin" }, { l: "Email", h: "mailto:hello@bednin.ru" }].map(c => (
              <a key={c.l} href={c.h} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 14, color: "rgba(242,242,242,0.32)", textDecoration: "none", borderBottom: "1px solid transparent", paddingBottom: 2, transition: "color .2s, border-color .2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#F2F2F2"; e.currentTarget.style.borderColor = "rgba(242,242,242,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(242,242,242,0.32)"; e.currentTarget.style.borderColor = "transparent"; }}>
                {c.l} в†’
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
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: "0.12em", color: "#F2F2F2", marginBottom: 6 }}>BEDNINВ®</div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.2)" }}>РќРµР·Р°РІРёСЃРёРјС‹Р№ СЂР°Р·СЂР°Р±РѕС‚С‡РёРє В· digital studio</div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", color: "rgba(242,242,242,0.1)", marginTop: 3 }}>РЎР°Р№С‚С‹ В· Р¦РёС„СЂРѕРІС‹Рµ РїСЂРѕРґСѓРєС‚С‹ В· Р Р°Р·СЂР°Р±РѕС‚РєР°</div>
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
          {[{ l: "TELEGRAM", h: "https://t.me/bednin" }, { l: "EMAIL", h: "mailto:hello@bednin.ru" }].map(lk => (
            <a key={lk.l} href={lk.h} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,242,242,0.22)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F2F2F2")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,242,242,0.22)")}
            >{lk.l}</a>
          ))}
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.12em", color: "rgba(242,242,242,0.1)" }}>В© 2026 BEDNIN</span>
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
        <Strip items={["РћРўРљР Р«Рў Р”Р›РЇ РџР РћР•РљРўРћР’", "Р”РР—РђР™Рќ + РљРћР”", "Р‘Р«РЎРўР Р«Р™ Р Р•Р—РЈР›Р¬РўРђРў", "Р¤РћРљРЈРЎ РќРђ Р‘РР—РќР•РЎ", "РЎРўРђР РўРђРџР«", "РџР Р•Р”РџР РРќРРњРђРўР•Р›Р"]} reverse dim />
        <ServicesSection />
        <AboutSection />
        <ProcessSection />
        <WhySection />
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
