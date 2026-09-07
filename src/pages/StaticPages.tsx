import {
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Handshake,
  Images,
  Mail,
  MapPin,
  Maximize2,
  Newspaper,
  Radio,
  Search,
  Send,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";
import galleryImageData from "../data/galleryImages.json";
import { editorialPosts, getEditorialPostMeta, getEditorialPostPublishedAt, getEditorialPostYear } from "../lib/content";

type GalleryImage = {
  id: number;
  title: string;
  alt: string;
  src: string;
  thumbSrc: string;
  width: number | null;
  height: number | null;
  date: string;
};

const galleryImages = galleryImageData as GalleryImage[];
const galleryBannerImage = "/galeria/banner-galeria-spotlights.webp";
const contactHeroImage = "/contacto/banner-contacto-smartphone.webp";

const contactTopics = [
  {
    title: "Conferencias y agenda",
    copy: "Propuestas de invitados, alianzas academicas, sedes, streaming y conversaciones publicas.",
    Icon: CalendarDays,
  },
  {
    title: "Prensa y contenidos",
    copy: "Consultas editoriales, entrevistas, archivo audiovisual y solicitudes vinculadas a publicaciones.",
    Icon: Newspaper,
  },
  {
    title: "Comunidad y colaboraciones",
    copy: "Ideas, instituciones afines y proyectos que amplien el debate civico desde Chile y la region.",
    Icon: Handshake,
  },
];

const contactSocialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/laotramirada", Icon: Facebook },
  { label: "Twitter", href: "https://twitter.com/laotramirada", Icon: Twitter },
  { label: "YouTube", href: "https://www.youtube.com/@LaOtraMirada", Icon: Youtube },
];

function getGalleryLabel(image: GalleryImage) {
  const normalized = image.title.replace(/[-_]+/g, " ").replace(/\bscaled\b/gi, "").replace(/\s+/g, " ").trim();

  if (/vargas/i.test(normalized)) return "Mario Vargas Llosa";
  if (/yoani/i.test(normalized)) return "Yoani Sanchez";
  if (/ferguson/i.test(normalized)) return "Niall Ferguson";
  if (/tomasi/i.test(normalized)) return "John Tomasi";
  if (/deidre/i.test(normalized)) return "Deirdre McCloskey";
  if (/ayaan/i.test(normalized)) return "Ayaan Hirsi Ali";
  if (/zingales/i.test(normalized)) return "Luigi Zingales";
  if (/giuliani/i.test(normalized)) return "Rudy Giuliani";
  if (/haidt/i.test(normalized)) return "Jonathan Haidt";

  return normalized || "La Otra Mirada";
}

function useRevealOnScroll() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-lom-reveal]"));

    if (!revealItems.length) return;

    const showAll = () => {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);
}

export function NuestraMirada() {
  useRevealOnScroll();

  const pillarImages = [
    {
      title: "Libertad",
      image: "/nuestra-mirada/pilar-libertad-nina-cometa.webp",
    },
    {
      title: "Educacion",
      image: "/nuestra-mirada/pilar-educacion-conferencia-aula.webp",
    },
    {
      title: "Opinion",
      image: "/nuestra-mirada/pilar-opinion-presentacion-audiencia.webp",
    },
  ];

  return (
    <>
      <Seo
        title="Nuestra Mirada"
        description="La Otra Mirada es una plataforma para provocar reflexion, debate publico y pensamiento critico sobre libertad, instituciones, educacion y opinion."
      />
      <section
        className="mirada-hero"
        data-lom-reveal="fade"
        style={{ backgroundImage: "url(/nuestra-mirada/banner-nuestra-mirada-reunion-personas.webp)" }}
      >
        <div className="lom-shell-wide" data-lom-reveal="lift" style={{ transitionDelay: "120ms" }}>
          <p className="lom-eyebrow">Fundacion La Otra Mirada</p>
          <h1>Nuestra Mirada</h1>
        </div>
      </section>

      <section className="mirada-intro lom-shell-wide">
        <div className="mirada-copy" data-lom-reveal="lift">
          <p>
            <strong>LA OTRA MIRADA</strong> es una plataforma destinada a provocar una reflexion
            sana, abierta y en libertad. Un espacio para debatir distintas miradas y generar una
            instancia donde se promueva el pensamiento critico y el debate sobre temas de interes
            publico.
          </p>
          <p>
            Un lugar para discutir aquellas ideas que trascienden y que permean a una sociedad
            que, muchas veces, olvida el verdadero valor y el poder que tiene el mundo del
            pensamiento y la cultura.
          </p>
          <p>
            “Las que conducen y arrastran al mundo no son las maquinas, sino las ideas” decia hace
            siglos el novelista frances Victor Hugo. Desde esta perspectiva, queremos invitar a
            pensar, debatir, sonar, tuitear y abrirse a esas otras miradas del mundo y nuestra
            realidad.
          </p>
        </div>
        <div className="mirada-video-block" data-lom-reveal="lift" style={{ transitionDelay: "120ms" }}>
          <div className="video-stage">
            <iframe
              src="https://www.youtube.com/embed/CmJzHrg7ceM"
              title="La Otra Mirada"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p>
            <strong>LA OTRA MIRADA</strong> ofrece una mirada fresca, distinta, innovadora de la
            realidad actual de Chile, tambien sus perspectivas y oportunidades. Una mirada
            pertinente y actualizada que no se entrampa en la contingencia y no limita el horizonte
            de posibilidades ni se encadena a paradigmas inmutables.
          </p>
          <p>
            Una mirada desde lo alto para ayudar a mejorar los diagnosticos y propuestas. Una
            mirada desde lo bajo para no olvidarnos de nuestras raices. Tambien para ampliar la
            vision de futuro y, en lo posible, para ver bajo el agua.
          </p>
        </div>
      </section>

      <section className="mirada-values lom-shell-wide">
        <article data-lom-reveal="lift">
          <CheckCircle size={52} />
          <h2>Proposito</h2>
          <p>
            Provocar una reflexion sana, abierta y en libertad, elevando el debate publico con
            ideas que permitan interpretar Chile y el mundo desde una perspectiva amplia.
          </p>
        </article>
        <article data-lom-reveal="lift" style={{ transitionDelay: "120ms" }}>
          <CheckCircle size={52} />
          <h2>Valores</h2>
          <p>
            Libertad, pensamiento critico, cultura civica, responsabilidad publica y apertura a
            miradas que no se conforman con diagnosticos cerrados ni paradigmas inmutables.
          </p>
        </article>
      </section>

      <section className="mirada-pillars lom-shell-wide">
        <div className="section-heading" data-lom-reveal="lift">
          <p className="lom-eyebrow">Nuestros pilares</p>
          <h2>Libertad, educacion y opinion</h2>
        </div>
        <div className="mirada-pillar-grid">
          {pillarImages.map((pillar, index) => (
            <article
              className="mirada-pillar-card"
              data-lom-reveal="zoom"
              key={pillar.title}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <img src={pillar.image} alt="" loading="lazy" />
              <h3>{pillar.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="mirada-location lom-shell-wide">
        <div data-lom-reveal="lift">
          <MapPin size={28} />
          <p className="lom-eyebrow">Donde estamos</p>
          <h2>Chile como punto de partida</h2>
          <p>
            Desde Santiago, La Otra Mirada abre conversaciones con lideres, pensadores y
            especialistas internacionales para ampliar el debate publico de Chile y America Latina.
          </p>
        </div>
        <iframe
          data-lom-reveal="lift"
          title="Ubicacion referencial La Otra Mirada"
          src="https://www.google.com/maps?q=Santiago%20de%20Chile&output=embed"
          loading="lazy"
          style={{ transitionDelay: "120ms" }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : galleryImages[activeIndex];
  const activeDisplayIndex = activeIndex === null ? 0 : activeIndex + 1;
  const galleryCount = galleryImages.length;

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return (currentIndex - 1 + galleryCount) % galleryCount;
    });
  };

  const showNextImage = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return (currentIndex + 1) % galleryCount;
    });
  };

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, galleryCount]);

  return (
    <>
      <Seo title="Galeria" description="Archivo visual de encuentros, conferencias y expositores de La Otra Mirada." />
      <PageHero
        title="Galeria"
        eyebrow="Archivo fotografico"
        description={`${galleryCount} registros visuales de conferencias y encuentros de La Otra Mirada.`}
        image={galleryBannerImage}
      />
      <section className="gallery-section lom-shell-wide">
        <div className="gallery-toolbar">
          <div>
            <p className="lom-eyebrow">Registro visual</p>
            <h2>Conferencias y encuentros</h2>
          </div>
          <span>
            <Images size={18} />
            {galleryCount} imagenes
          </span>
        </div>

        <div className="gallery-grid" aria-label="Galeria fotografica">
          {galleryImages.map((image, index) => (
            <button
              aria-label={`Abrir imagen ${index + 1}: ${getGalleryLabel(image)}`}
              className="gallery-item"
              key={image.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <img
                alt={image.alt || getGalleryLabel(image)}
                decoding="async"
                height={image.height ?? undefined}
                loading={index < 8 ? "eager" : "lazy"}
                src={image.thumbSrc}
                width={image.width ?? undefined}
              />
              <span className="gallery-item-overlay" aria-hidden="true">
                <Maximize2 size={18} />
                <span>{getGalleryLabel(image)}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {activeImage && (
        <div
          aria-label={`Imagen ${activeDisplayIndex} de ${galleryCount}`}
          aria-modal="true"
          className="gallery-lightbox"
          onClick={() => setActiveIndex(null)}
          role="dialog"
        >
          <button
            aria-label="Cerrar galeria"
            className="gallery-lightbox-close"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(null);
            }}
            type="button"
          >
            <X size={24} />
          </button>
          <button
            aria-label="Imagen anterior"
            className="gallery-lightbox-nav gallery-lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
            }}
            type="button"
          >
            <ChevronLeft size={32} />
          </button>
          <figure className="gallery-lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <img alt={activeImage.alt || getGalleryLabel(activeImage)} src={activeImage.src} />
            <figcaption>
              <span>
                {activeDisplayIndex} / {galleryCount}
              </span>
              <strong>{getGalleryLabel(activeImage)}</strong>
            </figcaption>
          </figure>
          <button
            aria-label="Imagen siguiente"
            className="gallery-lightbox-nav gallery-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
            type="button"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}

export function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [year, setYear] = useState(searchParams.get("ano") ?? "Todos");
  const [category, setCategory] = useState(searchParams.get("categoria") ?? "Todas");
  const years = useMemo(
    () => ["Todos", ...Array.from(new Set(editorialPosts.map(getEditorialPostYear))).sort().reverse()],
    [],
  );
  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(editorialPosts.map((post) => post.category))).sort()],
    [],
  );

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    const nextYear = searchParams.get("ano") ?? "Todos";
    const nextCategory = searchParams.get("categoria") ?? "Todas";
    setQuery(nextQuery);
    setYear(years.includes(nextYear) ? nextYear : "Todos");
    setCategory(categories.includes(nextCategory) ? nextCategory : "Todas");
  }, [categories, searchParams, years]);

  const updateFilters = (nextQuery: string, nextYear: string, nextCategory: string) => {
    setQuery(nextQuery);
    setYear(nextYear);
    setCategory(nextCategory);

    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextYear !== "Todos") params.set("ano", nextYear);
    if (nextCategory !== "Todas") params.set("categoria", nextCategory);
    setSearchParams(params, { replace: true });
  };

  const normalizedQuery = normalizeNewsText(query);
  const visiblePosts = editorialPosts.filter((post) => {
    const haystack = normalizeNewsText(`${post.title} ${post.excerpt} ${post.category} ${post.tags.join(" ")}`);
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    const matchesYear = year === "Todos" || getEditorialPostYear(post) === year;
    const matchesCategory = category === "Todas" || post.category === category;
    return matchesQuery && matchesYear && matchesCategory;
  });

  return (
    <>
      <Seo
        title="Noticias"
        description="Archivo editorial de La Otra Mirada: columnas, prensa y lecturas sobre libertad, democracia, seguridad, economía y geopolítica."
        canonical="https://laotramirada.cl/noticias"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Noticias y archivo editorial",
          description:
            "Archivo editorial de La Otra Mirada con columnas, prensa y lecturas sobre ideas públicas.",
          hasPart: editorialPosts.slice(0, 12).map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: getEditorialPostPublishedAt(post),
            author: {
              "@type": "Organization",
              name: "La Otra Mirada",
            },
            url: `https://laotramirada.cl/noticias/${post.slug}`,
          })),
        }}
      />
      <PageHero
        title="Noticias"
        eyebrow="Archivo editorial"
        description={`${editorialPosts.length} lecturas de archivo y continuidad editorial sobre libertad, democracia, seguridad, economía y geopolítica.`}
      />
      <section className="lom-section lom-shell-wide news-archive-section">
        <div className="archive-toolbar news-toolbar">
          <label className="search-box">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por tema, expositor o concepto"
              value={query}
              onChange={(event) => updateFilters(event.target.value, year, category)}
            />
          </label>
          <div className="topic-tabs" role="tablist" aria-label="Filtrar noticias por año">
            {years.map((item) => (
              <button
                className={year === item ? "is-active" : ""}
                key={item}
                type="button"
                onClick={() => updateFilters(query, item, category)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="topic-tabs" role="tablist" aria-label="Filtrar noticias por categoría">
            {categories.map((item) => (
              <button
                className={category === item ? "is-active" : ""}
                key={item}
                type="button"
                onClick={() => updateFilters(query, year, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="news-count">
          {visiblePosts.length} publicaciones
          {year !== "Todos" ? ` · ${year}` : ""}
        </div>
        <div className="news-grid news-archive-grid">
          {visiblePosts.map((post) => (
            <Link className="news-card news-card-link" key={post.slug} to={`/noticias/${post.slug}`}>
              <span className="news-card-meta">{getEditorialPostMeta(post)} · {post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span className="news-tags" aria-label="Etiquetas">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </span>
              <span className="pillar-card-cta">
                Leer análisis <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function normalizeNewsText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function Contact() {
  useRevealOnScroll();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    setTimeout(() => {
      setFormState("success");
    }, 450);
  };

  return (
    <>
      <Seo
        title="Contacto"
        description="Contacta a La Otra Mirada para conferencias, prensa, colaboraciones y comunidad."
      />
      <PageHero
        title="Contacto"
        eyebrow="Queremos escucharte"
        description="Un punto de encuentro para propuestas, prensa, alianzas y conversaciones que merecen otra mirada."
        image={contactHeroImage}
      />

      <section className="contact-intro lom-shell-wide">
        <div className="contact-statement" data-lom-reveal="lift">
          <p className="lom-eyebrow">Punto de encuentro</p>
          <h2>Ideas, alianzas y conversaciones con sentido publico.</h2>
          <p>
            Si tienes una propuesta de conferencia, una consulta de prensa, una invitacion
            institucional o una idea para abrir debate, este es el lugar para iniciar la
            conversacion.
          </p>
        </div>
      </section>

      <section className="contact-main lom-shell-wide">
        <div className="contact-topics" data-lom-reveal="lift">
          <div className="contact-topic-grid">
            {contactTopics.map((topic, index) => (
              <article key={topic.title} style={{ transitionDelay: `${index * 90}ms` }} data-lom-reveal="zoom">
                <topic.Icon size={26} />
                <h3>{topic.title}</h3>
                <p>{topic.copy}</p>
              </article>
            ))}
          </div>
        </div>

        {formState === "success" ? (
          <div className="contact-form contact-form-panel" data-lom-reveal="lift" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <CheckCircle size={52} color="#dc2626" />
              <h2>¡Mensaje enviado con éxito!</h2>
              <p className="lom-muted" style={{ maxWidth: "460px", margin: "0 auto" }}>
                Muchas gracias por comunicarte con Fundación La Otra Mirada. Hemos recibido tu mensaje y nos pondremos en contacto contigo a la brevedad.
              </p>
              <button
                className="lom-button lom-button-red"
                onClick={() => setFormState("idle")}
                style={{ marginTop: "1rem" }}
                type="button"
              >
                Enviar otro mensaje
              </button>
            </div>
          </div>
        ) : (
          <form
            className="contact-form contact-form-panel"
            data-lom-reveal="lift"
            onSubmit={handleSubmit}
            style={{ transitionDelay: "120ms" }}
          >
            <div className="contact-form-heading">
              <Mail size={28} />
              <div>
                <p className="lom-eyebrow">Formulario</p>
                <h2>Dejanos tu mensaje</h2>
              </div>
            </div>
            <div className="contact-field-grid">
              <label>
                Nombre
                <input name="name" required placeholder="Tu nombre" />
              </label>
              <label>
                Email
                <input name="email" required type="email" placeholder="tu@email.cl" />
              </label>
            </div>
            <label>
              Asunto
              <select name="subject" required defaultValue="">
                <option value="" disabled>
                  Selecciona una categoria
                </option>
                <option>Conferencias y eventos</option>
                <option>Prensa y contenidos</option>
                <option>Colaboraciones institucionales</option>
                <option>Comunidad y redes</option>
              </select>
            </label>
            <label>
              Mensaje
              <textarea
                name="message"
                required
                rows={7}
                placeholder="Cuentanos brevemente quien eres, que necesitas y como podemos contactarte."
              />
            </label>
            <button className="lom-button lom-button-red" disabled={formState === "submitting"} type="submit">
              {formState === "submitting" ? (
                "Enviando..."
              ) : (
                <>
                  Enviar mensaje <Send size={17} />
                </>
              )}
            </button>
          </form>
        )}
      </section>

      <section className="contact-social-band lom-shell-wide" data-lom-reveal="lift">
        <div>
          <p className="lom-eyebrow">Comunidad</p>
          <h2>Sigue nuestras conferencias, publicaciones y conversaciones.</h2>
        </div>
        <nav className="contact-social-links" aria-label="Redes sociales de La Otra Mirada">
          {contactSocialLinks.map((link) => (
            <a href={link.href} key={link.label}>
              <link.Icon size={20} />
              {link.label}
              <ArrowUpRight size={17} />
            </a>
          ))}
        </nav>
      </section>
    </>
  );
}

export function Streaming() {
  return (
    <>
      <Seo title="Streaming" description="Transmision online de eventos y conferencias de La Otra Mirada." />
      <PageHero title="Streaming" eyebrow="En vivo" image="/galeria/535-banner-web-lom-2025-streaming.webp" />
      <section className="streaming-panel lom-shell">
        <Radio size={34} />
        <div>
          <h2>Modo live preparado</h2>
          <p>
            Esta seccion queda lista para activar una transmision con iframe del proveedor de
            streaming. Cuando no haya evento activo, muestra un estado limpio y estable.
          </p>
        </div>
      </section>
    </>
  );
}
