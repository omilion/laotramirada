import { ArrowRight, ArrowUpRight, Play, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { ConferenceCard } from "../components/ConferenceCard";
import { logoImage } from "../components/Logo";
import { Seo } from "../components/Seo";
import galleryImages from "../data/galleryImages.json";
import { getConferenceImage, getSpeakerImage } from "../data/speakerImages";
import { conferences, featuredConference, getConferenceTopics, getYoutubeThumbnail } from "../lib/content";

const homeSpeakers = [
  {
    name: "Mario Vargas Llosa",
    role: "Premio Nobel de Literatura",
    slug: "conferencia-completa-que-es-ser-liberal-mario-vargas-llosa",
  },
  {
    name: "Niall Ferguson",
    role: "Historiador, Stanford",
    slug: "conferencia-completa-niall-ferguson",
  },
  {
    name: "Ayaan Hirsi Ali",
    role: "Escritora y activista",
    slug: "conferencia-completa-ayaan-hirsi-ali",
  },
  {
    name: "Ivan Duque",
    role: "Expresidente de Colombia",
    slug: "presidente-de-colombia-ivan-duque-marquez",
  },
  {
    name: "Mauricio Macri",
    role: "Expresidente de Argentina",
    slug: "la-otra-mirada-de-latinoamerica-mauricio-macri",
  },
  {
    name: "Moises Naim",
    role: "Escritor y analista internacional",
    slug: "conferencia-completa-moises-naim",
  },
  {
    name: "Deirdre McCloskey",
    role: "Economista e historiadora",
    slug: "conferencia-online-deirdre-mccloskey",
  },
  {
    name: "Sergio Moro",
    role: "Exjuez del caso Lava Jato",
    slug: "la-otra-mirada-del-juez-sergio-moro",
  },
  {
    name: "Oscar Naranjo",
    role: "Exvicepresidente de Colombia",
    slug: "narcotrafico-la-otra-mirada-de-la-pandemia-y-la-recesion-oscar-naranjo",
  },
  {
    name: "John Tomasi",
    role: "Filosofo politico, Heterodox Academy",
    slug: "es-justo-el-libre-mercado-john-tomasi",
  },
  {
    name: "Yoani Sanchez",
    role: "Periodista cubana",
    slug: "extractos-conferencia-yoani-sanchez",
  },
  {
    name: "Cayetana Alvarez de Toledo",
    role: "Diputada y escritora espanola",
    slug: "conferencia-politicamente-indeseable-cayetana-alvarez-de-toledo",
  },
  {
    name: "Guy Sorman",
    role: "Economista y ensayista frances",
    slug: "ordenamiento-mundial-post-pandemia-guy-sorman",
  },
  {
    name: "Paul Polman",
    role: "Ex CEO global de Unilever",
    slug: "la-otra-mirada-de-las-empresas-post-pandemia-paul-polman",
  },
];

const topicCards = [
  {
    title: "Democracia liberal y libertad",
    text: "Vargas Llosa, Tomasi, Hirsi Ali y otras voces sobre instituciones, libertad de expresion y limites del poder.",
    href: "/conferencias?tema=Libertad",
    topic: "Libertad",
    image: "/conferencistas/conferencia-mario-vargas-llosa.webp",
  },
  {
    title: "Geopolitica, seguridad e IA",
    text: "Crimen organizado, defensa, inteligencia artificial y el nuevo orden mundial visto desde America Latina.",
    href: "/conferencias?tema=Seguridad",
    topic: "Seguridad",
    image: "/conferencistas/conferencia-oscar-naranjo-trujillo.webp",
  },
  {
    title: "Economia, empresa y sociedad",
    text: "Libre mercado, crecimiento y responsabilidad empresarial con McCloskey, Polman, Sorman y mas.",
    href: "/conferencias?tema=Economia",
    topic: "Economia",
    image: "/conferencistas/conferencia-deirdre-mccloskey.webp",
  },
];

const heroCarouselSlides = [
  {
    speaker: "Ivan Duque",
    src: "/home-hero/la-otra-mirada-ivan-duque-democracia-seguridad.webp",
  },
  {
    speaker: "John Tomasi",
    src: "/home-hero/la-otra-mirada-john-tomasi-liberalismo-democracia.webp",
  },
  {
    speaker: "Mario Vargas Llosa",
    src: "/home-hero/la-otra-mirada-mario-vargas-llosa-libertad-democracia.webp",
  },
  {
    speaker: "Deirdre McCloskey",
    src: "/home-hero/la-otra-mirada-deirdre-mccloskey-liberalismo-humanista.webp",
  },
  {
    speaker: "Sergio Moro",
    src: "/home-hero/la-otra-mirada-sergio-moro-justicia-instituciones.webp",
  },
  {
    speaker: "Moises Naim",
    src: "/home-hero/la-otra-mirada-moises-naim-democracia-populismo.webp",
  },
  {
    speaker: "Oscar Naranjo",
    src: "/home-hero/la-otra-mirada-oscar-naranjo-seguridad-narcotrafico.webp",
  },
];

export function Home() {
  const latest = conferences.slice(0, 3);
  const editorialConferences = conferences.filter((conference) => !conference.placeholder);
  const featuredImage =
    getConferenceImage(featuredConference.youtubeId) ??
    getYoutubeThumbnail(featuredConference.youtubeId, "max");
  const galleryPreview = galleryImages.slice(0, 6);
  const topicCounts = topicCards.map((card) => ({
    ...card,
    count: editorialConferences.filter((conference) =>
      getConferenceTopics(conference).includes(card.topic),
    ).length,
  }));
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://laotramirada.cl/#organization",
        name: "La Otra Mirada",
        url: "https://laotramirada.cl/",
        sameAs: [
          "https://www.youtube.com/@LaOtraMirada",
          "https://www.facebook.com/laotramirada",
          "https://twitter.com/laotramirada",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://laotramirada.cl/#website",
        name: "La Otra Mirada",
        url: "https://laotramirada.cl/",
        publisher: { "@id": "https://laotramirada.cl/#organization" },
        description:
          "Archivo de conferencias sobre libertad, democracia, seguridad, geopolitica, economia y pensamiento liberal en Chile.",
      },
      {
        "@type": "ItemList",
        name: "Conferencias destacadas de La Otra Mirada",
        itemListElement: latest.map((conference, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: conference.title,
          url: `https://laotramirada.cl/conferencias/${conference.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <Seo
        title="Conferencias sobre libertad, democracia y geopolitica"
        description="Archivo de conferencias sobre libertad, democracia, seguridad, geopolitica, economia y pensamiento liberal en Chile."
        image={featuredImage}
        canonical="https://laotramirada.cl/"
        schema={homeSchema}
      />
      <section className="home-hero">
        <div className="home-hero-carousel" aria-hidden="true">
          {heroCarouselSlides.map((slide, index) => (
            <img
              alt=""
              className="home-hero-slide"
              decoding="async"
              key={slide.src}
              loading={index === 0 ? "eager" : "lazy"}
              src={slide.src}
              style={{ animationDelay: `${index * 5.6}s` }}
            />
          ))}
        </div>
        <div className="home-hero-speaker-track" aria-hidden="true">
          {heroCarouselSlides.map((slide, index) => (
            <span
              className="home-hero-speaker-name"
              key={slide.speaker}
              style={{ animationDelay: `${index * 5.6}s` }}
            >
              {slide.speaker}
            </span>
          ))}
        </div>
        <div className="home-hero-copy lom-shell">
          <h1 className="home-hero-logo-title">
            <img src={logoImage} alt="" />
            <span className="sr-only">La Otra Mirada</span>
          </h1>
          <div className="home-hero-rest">
            <p className="lom-eyebrow">Conferencias y pensamiento publico en Chile</p>
            <p>
              Archivo audiovisual de conferencias sobre democracia liberal, seguridad,
              geopolitica, economia, libertad y los debates que definen el futuro de Chile
              y America Latina.
            </p>
            <div className="home-hero-actions">
              <Link className="lom-button lom-button-red" to="/conferencias">
                Ver conferencias <ArrowRight size={18} />
              </Link>
              <Link className="lom-button" to="/nuestra-mirada">
                Nuestra mirada
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lom-section lom-shell-wide home-featured">
        <Link
          className="home-featured-media"
          to={`/conferencias/${featuredConference.slug}`}
          aria-label={`Ver conferencia destacada: ${featuredConference.title}`}
        >
          <img src={featuredImage} alt={featuredConference.title} loading="lazy" />
          <span className="conference-play" aria-hidden="true">
            <Play size={22} fill="currentColor" />
          </span>
        </Link>
        <div className="home-featured-copy">
          <p className="lom-eyebrow">Conferencia destacada</p>
          <h2>{featuredConference.title}</h2>
          <p>
            La sesion inaugural sobre geopolitica y seguridad: el paso del poder
            industrial al poder tecnologico, la inteligencia artificial como nuevo campo
            de disputa global y las urgencias de orden publico que enfrenta America
            Latina, con panel moderado por Maria Jose Naudon.
          </p>
          <div className="detail-badges">
            <span>Panel y sesion inaugural</span>
            <span>Universidad Adolfo Ibanez</span>
            <span>Athena Lab</span>
          </div>
          <div>
            <Link className="lom-button lom-button-red" to={`/conferencias/${featuredConference.slug}`}>
              Ver conferencia <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="lom-section lom-shell-wide home-speakers">
        <div className="section-heading">
          <p className="lom-eyebrow">Expositores</p>
          <h2>Las voces que han pasado por La Otra Mirada</h2>
          <p className="section-deck">
            Premios Nobel, expresidentes, historiadores, periodistas y pensadores que
            estan dando los grandes debates de nuestro tiempo, en conferencias completas
            y en abierto.
          </p>
        </div>
        <div className="home-speakers-grid">
          {homeSpeakers.map((speaker) => {
            const image = getSpeakerImage(speaker.name);
            if (!image) return null;
            return (
              <Link
                className="home-speaker-card"
                key={speaker.name}
                to={`/conferencias/${speaker.slug}`}
              >
                <span className="home-speaker-photo">
                  <img src={image} alt={speaker.name} loading="lazy" />
                </span>
                <span className="home-speaker-name">{speaker.name}</span>
                <span className="home-speaker-role">{speaker.role}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="lom-section lom-shell">
        <div className="section-heading">
          <p className="lom-eyebrow">Temas</p>
          <h2>Tres conversaciones que definen la epoca</h2>
        </div>
        <div className="home-topic-grid">
          {topicCounts.map((card) => (
            <Link className="home-topic-card" key={card.title} to={card.href}>
              <img src={card.image} alt="" loading="lazy" />
              <span className="home-topic-copy">
                <span className="home-topic-count">{card.count} conferencias</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="pillar-card-cta">
                  Ver conferencias <ArrowRight size={16} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lom-section lom-shell-wide">
        <div className="section-heading section-heading-row">
          <div>
            <p className="lom-eyebrow">Archivo de conferencias</p>
            <h2>Conferencias completas, en abierto y para siempre</h2>
          </div>
          <Link className="lom-text-link" to="/conferencias">
            Archivo completo <ArrowRight size={17} />
          </Link>
        </div>
        <div className="conference-mosaic archive-mosaic">
          {latest.map((conference) => (
            <ConferenceCard key={conference.youtubeId} conference={conference} />
          ))}
        </div>
      </section>

      <section className="lom-section lom-shell home-seo-band">
        <div>
          <p className="lom-eyebrow">Por que lo hacemos</p>
          <h2>Las ideas de la libertad merecen ser escuchadas</h2>
        </div>
        <div className="home-seo-copy">
          <p>
            Creemos que los grandes debates sobre democracia, libertad y futuro no pueden
            quedar encerrados en circuitos academicos ni detras de entradas pagadas. Por
            eso traemos a Chile a los pensadores que estan dando esos debates en el mundo.
          </p>
          <p>
            Y dejamos cada conversacion disponible, completa y gratuita, para que
            cualquier persona pueda verla, citarla y discutirla cuando quiera.
          </p>
          <div className="home-seo-stats" aria-label="Resumen del archivo">
            <span>{editorialConferences.length} conferencias</span>
            <span>{homeSpeakers.length}+ expositores internacionales</span>
            <span>Desde 2018</span>
            <span>Acceso libre y gratuito</span>
          </div>
        </div>
      </section>

      <section className="lom-section lom-shell-wide home-gallery">
        <div className="section-heading section-heading-row">
          <div>
            <p className="lom-eyebrow">Galeria</p>
            <h2>Los encuentros, en imagenes</h2>
          </div>
          <Link className="lom-text-link" to="/galeria">
            Ver galeria completa <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-gallery-strip">
          {galleryPreview.map((image) => (
            <Link className="home-gallery-item" key={image.id} to="/galeria">
              <img src={image.thumbSrc} alt={image.alt} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

      <section className="lom-shell-wide home-cta-band">
        <p className="lom-eyebrow">No te pierdas la proxima</p>
        <h2>Cada conferencia queda en el canal. La proxima puedes verla en vivo.</h2>
        <div className="home-cta-actions">
          <a
            className="lom-button lom-button-red"
            href="https://www.youtube.com/@LaOtraMirada"
            rel="noreferrer"
            target="_blank"
          >
            <Youtube size={20} /> Suscribete al canal
          </a>
          <Link className="lom-button" to="/streaming">
            Ver streaming <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
