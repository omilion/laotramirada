import rawConferences from "../data/conferences.json";
import { conferenceVideoIdSet } from "../data/conferenceScope";
import rawEditorialPosts from "../data/editorialPosts.json";
import rawHistoricalPosts from "../data/historicalPosts.json";
import type { Conference, EditorialPost, NewsItem } from "../types";

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

export const editorialPosts = [
  ...(rawEditorialPosts as EditorialPost[]),
  ...(rawHistoricalPosts as EditorialPost[]),
]
  .sort((a, b) => b.date.localeCompare(a.date));

export const editorialPostAuthor = "La Otra Mirada";

export function getEditorialPostBySlug(slug: string | undefined) {
  return editorialPosts.find((post) => post.slug === slug);
}

export function getEditorialPostYear(post: EditorialPost) {
  return post.date.slice(0, 4);
}

export function getEditorialPostAuthor(post: EditorialPost) {
  return post.author?.trim() || editorialPostAuthor;
}

export function getEditorialPostTime(post: EditorialPost) {
  if (post.time) return post.time;
  const day = Number(post.date.slice(8, 10));
  return day >= 20 ? "18:00" : "09:00";
}

export function getEditorialPostPublishedAt(post: EditorialPost) {
  return `${post.date}T${getEditorialPostTime(post)}:00`;
}

export function getEditorialPostMeta(post: EditorialPost) {
  return `${getEditorialPostAuthor(post)} · ${formatDate(post.date)} · ${getEditorialPostTime(post)} hrs`;
}

export function getEditorialPostMarkdown(post: EditorialPost) {
  const body = post.body?.map((paragraph) => paragraph.trim()).filter(Boolean);
  if (body?.length) return body.join("\n\n");

  return [post.excerpt, post.angle, post.thesis, post.whyNow, post.close]
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function getRelatedConferencesForPost(post: EditorialPost) {
  return post.relatedConferenceSlugs
    .map((slug) => getConferenceBySlug(slug))
    .filter((conference): conference is Conference => Boolean(conference))
    .slice(0, 3);
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

export const newsItems: NewsItem[] = editorialPosts.slice(0, 3).map((post) => ({
  title: post.title,
  excerpt: post.excerpt,
  slug: post.slug,
  category: post.category,
}));
