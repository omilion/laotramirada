import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ConferenceCard } from "../components/ConferenceCard";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";
import { conferences, featuredConference, getConferenceTopics, getYoutubeThumbnail } from "../lib/content";

const conferencesHeroImage = "/conferencistas/banner-conferencias-ferguson.jpg";

export function Conferences() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [topic, setTopic] = useState(searchParams.get("tema") ?? "Todos");

  useEffect(() => {
    const routeClass = "is-conferences-archive-route";
    const toolbarActiveClass = "is-conferences-toolbar-active";
    let frame = 0;

    const updateHeaderZone = () => {
      frame = 0;

      const toolbar = document.querySelector<HTMLElement>(".archive-toolbar");
      const footer = document.querySelector<HTMLElement>(".lom-footer");

      if (!toolbar || !footer) {
        document.body.classList.remove(toolbarActiveClass);
        return;
      }

      const toolbarRect = toolbar.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const toolbarOwnsHeaderSpace = toolbarRect.top <= 1 && toolbarRect.bottom > 0;
      const footerIsApproaching = footerRect.top <= viewportHeight + 96;

      document.body.classList.toggle(toolbarActiveClass, toolbarOwnsHeaderSpace && !footerIsApproaching);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateHeaderZone);
    };

    document.body.classList.add(routeClass);
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      document.body.classList.remove(routeClass, toolbarActiveClass);
    };
  }, []);

  const topics = useMemo(() => {
    const values = new Set<string>();
    conferences.forEach((conference) => getConferenceTopics(conference).forEach((item) => values.add(item)));
    return ["Todos", ...Array.from(values).sort()];
  }, []);

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    const nextTopic = searchParams.get("tema") ?? "Todos";
    setQuery(nextQuery);
    setTopic(topics.includes(nextTopic) ? nextTopic : "Todos");
  }, [searchParams, topics]);

  const updateFilters = (nextQuery: string, nextTopic: string) => {
    setQuery(nextQuery);
    setTopic(nextTopic);

    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextTopic !== "Todos") params.set("tema", nextTopic);
    setSearchParams(params, { replace: true });
  };

  const visible = conferences.filter((conference) => {
    const haystack = `${conference.title} ${conference.summary} ${conference.participants.join(" ")}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const matchesTopic = topic === "Todos" || getConferenceTopics(conference).includes(topic);
    return matchesQuery && matchesTopic;
  });

  return (
    <>
      <Seo
        title="Conferencias"
        description="Archivo de conferencias de La Otra Mirada con videos, participantes, resumen editorial y landings individuales."
        image={getYoutubeThumbnail(featuredConference.youtubeId)}
      />
      <PageHero
        title="Conferencias"
        eyebrow="Archivo audiovisual"
        description="Una grilla editorial para explorar ideas, expositores y conversaciones que siguen definiendo el debate publico."
        image={conferencesHeroImage}
      />
      <section className="lom-section lom-shell-wide conferences-archive-section">
        <div className="archive-toolbar">
          <label className="search-box">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por expositor, tema o titulo"
              value={query}
              onChange={(event) => updateFilters(event.target.value, topic)}
            />
          </label>
          <div className="topic-tabs" role="tablist" aria-label="Filtrar por tema">
            {topics.map((item) => (
              <button
                className={topic === item ? "is-active" : ""}
                key={item}
                type="button"
                onClick={() => updateFilters(query, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="conference-mosaic archive-mosaic">
          {visible.map((conference) => (
            <ConferenceCard
              key={conference.youtubeId}
              conference={conference}
            />
          ))}
        </div>
      </section>
    </>
  );
}
