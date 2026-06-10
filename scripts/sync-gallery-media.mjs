import fs from "node:fs/promises";
import path from "node:path";

const API_URL = "https://laotramirada.cl/wp-json/wp/v2/media";
const GALLERY_PAGE_URL = "https://laotramirada.cl/wp-json/wp/v2/pages?slug=galeria&_fields=content";
const PUBLIC_DIR = path.resolve("public/galeria");
const THUMB_DIR = path.join(PUBLIC_DIR, "thumbs");
const DATA_FILE = path.resolve("src/data/galleryImages.json");
const PER_PAGE = 100;

const textDecoder = {
  "&amp;": "&",
  "&quot;": "\"",
  "&#039;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:amp|quot|#039|apos|lt|gt);/g, (match) => textDecoder[match] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}

function humanizeSlug(slug = "") {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function safeFilename(media, variant = "full", url = media.source_url) {
  const sourceUrl = new URL(url);
  const ext = path.extname(sourceUrl.pathname) || ".jpg";
  const base = (media.slug || `imagen-${media.id}`)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  const suffix = variant === "full" ? "" : `-${variant}`;
  return `${media.id}-${base}${suffix}${ext.toLowerCase()}`;
}

function getImageUrlsFromHtml(html = "") {
  const imageUrlPattern = /https:\/\/laotramirada\.cl\/wp-content\/uploads\/[^"'<>\s)]+/gi;
  const dimensionSuffixPattern = /-\d+x\d+(?=\.(?:jpe?g|png|webp|gif|svg)(?:\?|$))/i;
  const imageExtensionPattern = /\.(?:jpe?g|png|webp|gif|svg)(?:\?|$)/i;

  return Array.from(html.matchAll(imageUrlPattern))
    .map((match) => match[0].replace(/\\\//g, "/"))
    .filter((url) => imageExtensionPattern.test(url))
    .filter((url) => !dimensionSuffixPattern.test(url))
    .filter((url) => !url.includes("/elementor/"));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WordPress respondio ${response.status} para ${url}`);
  }

  return {
    headers: response.headers,
    data: await response.json(),
  };
}

async function downloadFile(url, destination) {
  try {
    const existing = await fs.stat(destination);
    if (existing.size > 0) return;
  } catch {
    // File is missing; continue with download.
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo descargar ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(destination, buffer);
}

async function fetchGalleryPageUrls() {
  try {
    const { data } = await fetchJson(GALLERY_PAGE_URL);
    const html = data?.[0]?.content?.rendered ?? "";
    return Array.from(new Set(getImageUrlsFromHtml(html)));
  } catch (error) {
    console.warn(`No se pudo leer la pagina Galeria. Se usara el media library completo. ${error.message}`);
    return [];
  }
}

function toGalleryItem(media) {
  const filename = safeFilename(media);
  const thumbnailUrl = selectThumbnailUrl(media);
  const thumbnailFilename = safeFilename(media, "thumb", thumbnailUrl);
  const title = stripHtml(media.title?.rendered) || stripHtml(media.caption?.rendered) || humanizeSlug(media.slug);
  const width = Number(media.media_details?.width) || null;
  const height = Number(media.media_details?.height) || null;

  return {
    id: media.id,
    title,
    alt: media.alt_text || title,
    src: `/galeria/${filename}`,
    thumbSrc: `/galeria/thumbs/${thumbnailFilename}`,
    originalUrl: media.source_url,
    width,
    height,
    date: media.date,
    mimeType: media.mime_type,
  };
}

function selectThumbnailUrl(media) {
  const sizes = media.media_details?.sizes ?? {};
  const preferredSizes = ["large", "medium_large", "medium"];

  for (const size of preferredSizes) {
    if (sizes[size]?.source_url) return sizes[size].source_url;
  }

  return media.source_url;
}

async function main() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  await fs.mkdir(THUMB_DIR, { recursive: true });

  const fields = [
    "id",
    "date",
    "slug",
    "source_url",
    "media_type",
    "mime_type",
    "alt_text",
    "caption",
    "title",
    "media_details",
  ].join(",");

  const firstUrl = `${API_URL}?per_page=${PER_PAGE}&page=1&_fields=${fields}`;
  const firstPage = await fetchJson(firstUrl);
  const totalPages = Number(firstPage.headers.get("x-wp-totalpages")) || 1;
  const pages = [firstPage.data];

  for (let page = 2; page <= totalPages; page += 1) {
    const url = `${API_URL}?per_page=${PER_PAGE}&page=${page}&_fields=${fields}`;
    pages.push((await fetchJson(url)).data);
  }

  const mediaItems = pages
    .flat()
    .filter((item) => item.media_type === "image" && item.mime_type?.startsWith("image/") && item.source_url);

  const pageGalleryUrls = await fetchGalleryPageUrls();
  const pageGalleryOrder = new Map(pageGalleryUrls.map((url, index) => [url, index]));
  const selectedMediaItems = pageGalleryUrls.length
    ? mediaItems
        .filter((item) => pageGalleryOrder.has(item.source_url))
        .sort((a, b) => pageGalleryOrder.get(a.source_url) - pageGalleryOrder.get(b.source_url))
    : mediaItems;

  const galleryItems = selectedMediaItems.map(toGalleryItem);

  for (const item of selectedMediaItems) {
    const destination = path.join(PUBLIC_DIR, safeFilename(item));
    const thumbnailUrl = selectThumbnailUrl(item);
    const thumbnailDestination = path.join(THUMB_DIR, safeFilename(item, "thumb", thumbnailUrl));
    await downloadFile(item.source_url, destination);
    await downloadFile(thumbnailUrl, thumbnailDestination);
  }

  if (!pageGalleryUrls.length) {
    galleryItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  await fs.writeFile(DATA_FILE, `${JSON.stringify(galleryItems, null, 2)}\n`, "utf8");

  console.log(`Sincronizadas ${galleryItems.length} imagenes en ${PUBLIC_DIR}`);
  console.log(`Metadata escrita en ${DATA_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
