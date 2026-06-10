import { ArrowUpRight, Facebook, Menu, Twitter, X, Youtube } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

const navItems = [
  ["Nuestra Mirada", "/nuestra-mirada"],
  ["Conferencias", "/conferencias"],
  ["Galeria", "/galeria"],
  ["Noticias", "/noticias"],
  ["Contacto", "/contacto"],
];

export function Layout() {
  const headerRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const header = headerRef.current;

    const resetPagePosition = () => {
      setIsMobileMenuOpen(false);
      header?.classList.remove("is-visible");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetPagePosition();
    const frame = window.requestAnimationFrame(resetPagePosition);

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    const header = headerRef.current;
    let frame = 0;
    let isActive = true;

    header?.classList.remove("is-visible");
    const updateScrolled = () => {
      const scrollTop =
        window.scrollY ||
        window.pageYOffset ||
        document.scrollingElement?.scrollTop ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      header?.classList.toggle("is-visible", scrollTop > 36);
    };

    const tick = () => {
      if (!isActive) return;
      updateScrolled();
      frame = window.requestAnimationFrame(tick);
    };

    updateScrolled();
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("scroll", updateScrolled, { passive: true });
    document.addEventListener("scroll", updateScrolled, { passive: true });
    const interval = window.setInterval(updateScrolled, 150);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrolled);
      document.removeEventListener("scroll", updateScrolled);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="lom-page">
      <header ref={headerRef} className={`lom-header is-scroll${isMobileMenuOpen ? " is-menu-open" : ""}`}>
        <nav className="lom-nav lom-shell" aria-label="Principal">
          <Logo />
          <button
            aria-controls="lom-primary-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
            className="lom-menu-toggle"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="lom-nav-panel" id="lom-primary-menu">
            <div className="lom-nav-panel-inner">
              <div className="lom-nav-links">
                {navItems.map(([label, to]) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `lom-nav-link${isActive ? " is-active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
              <div className="lom-socials" aria-label="Redes sociales">
                <a href="https://www.facebook.com/laotramirada" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="https://twitter.com/laotramirada" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="https://www.youtube.com/@LaOtraMirada" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="lom-footer">
        <div className="lom-shell-wide lom-footer-hero">
          <div className="lom-footer-brand">
            <p className="lom-footer-kicker">La Otra Mirada</p>
            <h2>Ideas para mirar mas alto.</h2>
          </div>
          <div className="lom-footer-cta">
            <Logo />
            <p>
              Conferencias, publicaciones y conversaciones para ampliar el debate publico
              desde Chile hacia America Latina.
            </p>
            <Link className="lom-footer-button" to="/contacto">
              Conversemos <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        <div className="lom-shell-wide lom-footer-grid">
          <div className="lom-footer-column lom-footer-manifesto">
            <p className="lom-footer-title">Nuestra causa</p>
            <p>
              Promover una reflexion abierta, exigente y en libertad sobre los temas que
              definen el futuro institucional, cultural y democratico de la region.
            </p>
          </div>
          <nav className="lom-footer-column" aria-label="Navegacion secundaria">
            <p className="lom-footer-title">Explora</p>
            <div className="lom-footer-links">
              {navItems.map(([label, to]) => (
                <NavLink key={to} to={to}>
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>
          <div className="lom-footer-column">
            <p className="lom-footer-title">No te pierdas</p>
            <p className="lom-muted">
              Sigue nuestras conferencias, publicaciones y conversaciones sobre libertad, seguridad,
              democracia e ideas publicas.
            </p>
            <div className="lom-socials lom-socials-footer">
              <a href="https://www.facebook.com/laotramirada" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com/laotramirada" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://www.youtube.com/@LaOtraMirada" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="lom-shell-wide lom-footer-bottom">
          <span>© {new Date().getFullYear()} La Otra Mirada</span>
          <span>Libertad, cultura civica y debate publico.</span>
        </div>
      </footer>
    </div>
  );
}
