import { ArrowLeft, ExternalLink, PlayCircle, Share2 } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MarkdownContent } from "../components/MarkdownContent";
import { Seo } from "../components/Seo";
import { getConferenceImage, getSpeakerImage } from "../data/speakerImages";
import {
  conferences,
  formatDate,
  getConferenceBySlug,
  getConferenceTopics,
  getYoutubeThumbnail,
} from "../lib/content";
import { keepTitleWordsTogether } from "../lib/text";

function getField(markdown: string, label: string) {
  const normalizedLabel = label.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const line = markdown
    .split(/\r?\n/)
    .find((item) => {
      const match = item.match(/^\*\*([^:*]+):\*\*\s*(.*)$/);
      if (!match) return false;
      return match[1].normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase() === normalizedLabel;
    });

  return line?.replace(/^\*\*[^:*]+:\*\*\s*/, "").trim() ?? "";
}

function getSection(markdown: string, titlePattern: RegExp) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => titlePattern.test(line));
  if (start === -1) return "";

  const next = lines.findIndex((line, index) => index > start && /^##\s+/.test(line));
  return lines
    .slice(start + 1, next === -1 ? undefined : next)
    .join("\n")
    .trim();
}

function removeFieldLines(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .filter((line) => !/^\*\*(Fecha|Participantes|Biograf[ií]a|Resumen):\*\*/i.test(line.trim()))
    .join("\n")
    .trim();
}

const conferenceProfileFallbacks: Record<string, { name: string; bio: string }> = {
  BI2jcDcGq6g: {
    name: "Panel geopolítica y seguridad",
    bio: "Encuentro institucional de La Otra Mirada junto a UAI y Athena Lab sobre seguridad, crimen organizado, tecnología, semiconductores y nuevos equilibrios estratégicos.",
  },
};

const summarySourceByYoutubeId: Record<string, string> = {
  nB0YeCZMg1E: "9gTf8H3Ya9k",
};

const videoFallbackByYoutubeId: Record<string, string> = {
  nB0YeCZMg1E: "9gTf8H3Ya9k",
};

type ShareStatus = "idle" | "copied" | "error";

type TimestampSummaryItem = {
  body: string;
  label: string;
  time: string;
};

type TimestampSummaryContent = {
  intro: string;
  items: TimestampSummaryItem[];
};

function cleanSummaryText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function parseTimestampSummary(markdown: string): TimestampSummaryContent | null {
  const source = cleanSummaryText(markdown);
  const markerPattern = /([^.!?\n]*?)\s*\[((?:\d{1,2}:)?\d{2}:\d{2}(?:\s*\/\s*(?:\d{1,2}:)?\d{2}:\d{2})*)\]:/g;
  const matches = Array.from(source.matchAll(markerPattern));

  if (!matches.length) return null;

  const items = matches
    .map((match, index) => {
      const start = match.index ?? 0;
      const nextStart = matches[index + 1]?.index ?? source.length;
      const bodyStart = start + match[0].length;

      return {
        body: source.slice(bodyStart, nextStart).trim(),
        label: match[1].replace(/^[\s.:;,]+/, "").trim(),
        time: match[2].replace(/\s+/g, " ").trim(),
      };
    })
    .filter((item) => item.label && item.body);

  if (!items.length) return null;

  return {
    intro: source.slice(0, matches[0].index ?? 0).trim(),
    items,
  };
}

function TimestampSummary({ markdown }: { markdown: string }) {
  const parsed = parseTimestampSummary(markdown);

  if (!parsed) return <MarkdownContent markdown={markdown} />;

  return (
    <div className="timestamp-summary">
      {parsed.intro && <p className="timestamp-summary-intro">{parsed.intro}</p>}
      <ul className="timestamp-summary-list" aria-label="Resumen con marcadores de tiempo">
        {parsed.items.map((item) => (
          <li className="timestamp-summary-item" key={`${item.time}-${item.label}`}>
            <span className="timestamp-summary-time">[{item.time}]</span>
            <div className="timestamp-summary-copy">
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useRevealOnScroll(dependency?: string) {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-lom-reveal]"));

    if (!revealItems.length) return;

    const showAll = () => {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    };

    revealItems.forEach((item) => item.classList.remove("is-visible"));

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
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.14,
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [dependency]);
}

export function ConferenceDetail() {
  const { slug } = useParams();
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const shareResetTimeout = useRef<number | null>(null);
  useRevealOnScroll(slug);

  useEffect(() => {
    return () => {
      if (shareResetTimeout.current) window.clearTimeout(shareResetTimeout.current);
    };
  }, []);

  const conference = getConferenceBySlug(slug);

  if (!conference) return <Navigate to="/conferencias" replace />;

  const related = conferences
    .filter((item) => item.youtubeId !== conference.youtubeId)
    .filter((item) => {
      const topics = getConferenceTopics(conference);
      return getConferenceTopics(item).some((topic) => topics.includes(topic));
    })
    .slice(0, 3);
  const editorialMarkdown = conference.editorialMarkdown ?? "";
  const profileFallback = conferenceProfileFallbacks[conference.youtubeId];
  const speakerName =
    getField(editorialMarkdown, "Invitado") ||
    getField(editorialMarkdown, "Invitada") ||
    conference.participants[0] ||
    profileFallback?.name ||
    "Expositor";
  const speakerBio =
    getField(editorialMarkdown, "Biografia resumida") ||
    conference.biography ||
    profileFallback?.bio ||
    "Biografia pendiente.";
  const speakerImage =
    getSpeakerImage(speakerName) ?? getConferenceImage(conference.youtubeId) ?? getYoutubeThumbnail(conference.youtubeId);
  const format = getField(editorialMarkdown, "Formato") || "Conferencia";
  const language = getField(editorialMarkdown, "Idioma original");
  const platform = getField(editorialMarkdown, "Ubicacion / Plataforma");
  const summarySection = getSection(editorialMarkdown, /^##\s+3\.\s+Resumen Contundente/i);
  const summarySourceConference = conferences.find((item) => item.youtubeId === summarySourceByYoutubeId[conference.youtubeId]);
  const summarySourceSection = getSection(summarySourceConference?.editorialMarkdown ?? "", /^##\s+3\.\s+Resumen Contundente/i);
  const readableSummary = removeFieldLines(summarySourceSection || summarySection) || conference.summary;
  const playbackYoutubeId = videoFallbackByYoutubeId[conference.youtubeId] ?? conference.youtubeId;
  const playbackUrl =
    playbackYoutubeId === conference.youtubeId ? conference.url : `https://www.youtube.com/watch?v=${playbackYoutubeId}`;
  const metaBadges = [
    formatDate(conference.date),
    format,
    language,
    platform,
    conference.placeholder ? "Pendiente editorial" : "Archivo editorial",
  ].filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: conference.title,
    description: conference.summary,
    thumbnailUrl: [getYoutubeThumbnail(playbackYoutubeId)],
    uploadDate: conference.date,
    embedUrl: `https://www.youtube.com/embed/${playbackYoutubeId}`,
  };

  const setTransientShareStatus = (nextStatus: ShareStatus) => {
    setShareStatus(nextStatus);

    if (shareResetTimeout.current) window.clearTimeout(shareResetTimeout.current);
    shareResetTimeout.current = window.setTimeout(() => {
      setShareStatus("idle");
      shareResetTimeout.current = null;
    }, 2200);
  };

  const copyCurrentUrl = async () => {
    const url = window.location.href;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        return;
      } catch {
        // Some browsers expose the Clipboard API but reject writes without a permission prompt.
      }
    }

    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "-1000px";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    const copied = document.execCommand("copy");
    textArea.remove();

    if (!copied) throw new Error("No se pudo copiar el enlace");
  };

  const shareConference = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: conference.title,
          text: conference.summary || "Conferencia de La Otra Mirada",
          url: window.location.href,
        });
        setTransientShareStatus("copied");
        return;
      }

      await copyCurrentUrl();
      setTransientShareStatus("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setTransientShareStatus("error");
    }
  };

  const scrollToVideo = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const videoSection = document.getElementById("video-conferencia");
    if (!videoSection) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videoSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Seo
        title={conference.title}
        description={conference.summary}
        image={getYoutubeThumbnail(playbackYoutubeId)}
        schema={schema}
      />
      <article className="conference-detail">
        <section className="detail-hero detail-hero-editorial lom-shell-wide">
          <div className="detail-hero-copy" data-lom-reveal="lift">
            <Link className="lom-text-link" to="/conferencias">
              <ArrowLeft size={17} /> Volver a conferencias
            </Link>
            <p className="lom-eyebrow">Abstract</p>
            <div className="detail-title-row">
              <h1>{keepTitleWordsTogether(conference.title)}</h1>
              <a className="lom-button lom-button-red detail-watch-button" href="#video-conferencia" onClick={scrollToVideo}>
                Ver conferencia <PlayCircle size={18} />
              </a>
            </div>
            <div className="detail-badges" aria-label="Detalles de la conferencia" data-lom-reveal="fade" style={{ transitionDelay: "120ms" }}>
              {metaBadges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
              {getConferenceTopics(conference).map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="detail-content detail-content-editorial lom-shell-wide">
          <aside className="speaker-profile" data-lom-reveal="lift">
            <div className="speaker-photo">
              <img
                src={speakerImage}
                alt=""
                loading="lazy"
                onError={(event) => event.currentTarget.classList.add("is-error")}
              />
            </div>
            <p className="lom-eyebrow">Voz invitada</p>
            <h2>{keepTitleWordsTogether(speakerName)}</h2>
            <p>{speakerBio}</p>
            <div className="speaker-actions">
              <a className="lom-button" href={playbackUrl} target="_blank" rel="noreferrer">
                Ver en YouTube <ExternalLink size={17} />
              </a>
              <button
                className="lom-button lom-button-red"
                type="button"
                onClick={() => void shareConference()}
                aria-live="polite"
              >
                {shareStatus === "copied" ? "Enlace copiado" : shareStatus === "error" ? "No se pudo copiar" : "Compartir"}{" "}
                <Share2 size={17} />
              </button>
            </div>
          </aside>

          <div className="detail-main">
            <section className="editorial-intro editorial-summary" data-lom-reveal="lift" style={{ transitionDelay: "80ms" }}>
              <p className="lom-eyebrow">Lectura editorial</p>
              <h2>Resumen</h2>
              <div className="editorial-summary-scroll">
                <TimestampSummary markdown={readableSummary} />
              </div>
            </section>

            <section
              id="video-conferencia"
              className="detail-video-section"
              data-lom-reveal="zoom"
              style={{ transitionDelay: "120ms" }}
            >
              <div className="detail-video-heading">
                <p className="lom-eyebrow">Conferencia</p>
                <h2>Video completo</h2>
              </div>
              <div className="video-stage detail-hero-video">
                <iframe
                  src={`https://www.youtube.com/embed/${playbackYoutubeId}`}
                  title={conference.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>

            {!summarySection && conference.editorialMarkdown && (
              <section className="editorial-document" data-lom-reveal="lift">
                <p className="lom-eyebrow">Lectura completa</p>
                <h2>Documento</h2>
                <MarkdownContent markdown={conference.editorialMarkdown} />
              </section>
            )}

            {conference.participants.length > 1 && (
              <section className="editorial-speakers" data-lom-reveal="lift">
                <p className="lom-eyebrow">Tambien participan</p>
                <h2>Panel</h2>
                <ul className="speaker-list">
                  {conference.participants.slice(1).map((speaker) => (
                    <li key={speaker}>{speaker}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="lom-section lom-shell">
            <div className="section-heading">
              <p className="lom-eyebrow">Relacionadas</p>
              <h2>Seguir explorando</h2>
            </div>
            <div className="related-grid">
              {related.map((item) => (
                <Link to={`/conferencias/${item.slug}`} key={item.youtubeId}>
                  <img
                    src={getYoutubeThumbnail(item.youtubeId)}
                    alt=""
                    loading="lazy"
                    onError={(event) => event.currentTarget.classList.add("is-error")}
                  />
                  <strong>{keepTitleWordsTogether(item.title)}</strong>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
