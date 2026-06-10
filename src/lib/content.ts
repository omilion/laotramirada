import rawConferences from "../data/conferences.json";
import { conferenceVideoIdSet } from "../data/conferenceScope";
import type { Conference, NewsItem } from "../types";

export const allParsedConferences = rawConferences as Conference[];

export const conferences = allParsedConferences
  .filter((conference) => conferenceVideoIdSet.has(conference.youtubeId))
  .sort((a, b) => {
    if (a.placeholder !== b.placeholder) return Number(a.placeholder) - Number(b.placeholder);
    return (b.date ?? "").localeCompare(a.date ?? "");
  });

export const featuredConference =
  conferences.find((conference) => conference.youtubeId === "BI2jcDcGq6g") ?? conferences[0];

export function getConferenceBySlug(slug: string | undefined) {
  return conferences.find((conference) => conference.slug === slug);
}

export function getYoutubeThumbnail(youtubeId: string, quality: "max" | "high" = "high") {
  const file = quality === "max" ? "maxresdefault.jpg" : "hqdefault.jpg";
  return `https://i.ytimg.com/vi/${youtubeId}/${file}`;
}

export function formatDate(date: string | null) {
  if (!date) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function getConferenceTopics(conference: Conference) {
  const title = conference.title.toLowerCase();
  const summary = conference.summary.toLowerCase();
  const joined = `${title} ${summary}`;

  const topics = [
    ["Seguridad", /seguridad|narcotr|crimen|geopol/],
    ["Libertad", /libertad|liberal|autoritar|democracia/],
    ["Economia", /econom|mercado|capitalismo|empresa|recesion/],
    ["America Latina", /latinoam|colombia|argentina|cuba|chile/],
    ["Ideas", /filosof|ideas|sociedad|poder|justicia/],
  ] as const;

  return topics
    .filter(([, pattern]) => pattern.test(joined))
    .map(([label]) => label as string)
    .slice(0, 3);
}

export const newsItems: NewsItem[] = [
  {
    title: "Chile: Capitalismo, virtudes y musica electronica",
    excerpt:
      "Una lectura cultural y economica sobre el modo en que las ideas se transforman en instituciones, habitos y nuevas formas de prosperidad.",
    slug: "chile-capitalismo-virtudes-musica-electronica",
    category: "Opinion",
  },
  {
    title: "El discurso contra el capitalismo se vuelve peor despues de cada crisis",
    excerpt:
      "Deirdre McCloskey analiza como las narrativas publicas cambian cuando la economia enfrenta shocks y tensiones politicas.",
    slug: "discurso-contra-capitalismo-crisis",
    category: "Prensa",
  },
  {
    title: "McCloskey y las predicciones en economia",
    excerpt:
      "Una aproximacion critica al rol de los economistas, la incertidumbre y los limites de los modelos predictivos.",
    slug: "mccloskey-predicciones-economia",
    category: "Archivo",
  },
];
