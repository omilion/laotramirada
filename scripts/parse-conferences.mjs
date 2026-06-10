import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const inputPath = path.join(rootDir, "conferencias", "inventario_conferencias.md");
const outputPath = path.join(rootDir, "src", "data", "conferences.json");
const metadataPath = path.join(rootDir, "metadata.json");

const SPANISH_MONTHS = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  setiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
};

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripMarkdown(value) {
  return normalizeWhitespace(value.replace(/^\s*#+\s*/, ""));
}

function extractYoutubeId(url) {
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function parseSpanishDate(value) {
  const normalized = normalizeWhitespace(value).toLowerCase();
  if (!normalized || normalized === "n/a") return null;

  const match = normalized.match(/^(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})$/i);
  if (!match) return null;

  const [, day, monthName, year] = match;
  const month = SPANISH_MONTHS[monthName.normalize("NFD").replace(/\p{Diacritic}/gu, "")];
  if (!month) return null;

  return `${year}-${month}-${day.padStart(2, "0")}`;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseParticipants(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized || normalized.toLowerCase() === "n/a") return [];

  return normalized
    .split(",")
    .map((participant) => normalizeWhitespace(participant))
    .filter(Boolean);
}

function loadMetadata() {
  if (!fs.existsSync(metadataPath)) return new Map();

  const items = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  return new Map(
    items
      .map((item) => [extractYoutubeId(item.url), item])
      .filter(([youtubeId]) => Boolean(youtubeId)),
  );
}

function getField(block, fieldName) {
  const label = fieldName.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const lines = block.split(/\r?\n/);
  const values = [];
  let collecting = false;

  for (const line of lines) {
    const fieldMatch = line.match(/^\*\*([^:*]+):\*\*\s*(.*)$/);

    if (fieldMatch) {
      const currentLabel = fieldMatch[1].normalize("NFD").replace(/\p{Diacritic}/gu, "");
      collecting = currentLabel.toLowerCase() === label.toLowerCase();
      if (collecting) values.push(fieldMatch[2]);
      continue;
    }

    if (collecting) {
      if (/^\s*(---|#{1,6}\s+)/.test(line)) break;
      values.push(line);
    }
  }

  return normalizeWhitespace(values.join(" "));
}

function getEditorialMarkdown(block) {
  const lines = block.split(/\r?\n/);
  let skippedTitle = false;

  return lines
    .filter((line) => {
      if (/^##\s+https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/\S+/.test(line)) return false;
      if (!skippedTitle && /^#\s+(?!#)/.test(line)) {
        skippedTitle = true;
        return false;
      }
      return true;
    })
    .join("\n")
    .replace(/^\s+|\s+$/g, "");
}

function parseBlock(block, metadataById = new Map()) {
  const urlMatch = block.match(/^##\s+(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/\S+)/m);
  if (!urlMatch) return null;

  const url = urlMatch[1].trim();
  const youtubeId = extractYoutubeId(url);
  if (!youtubeId) return null;

  const rawTitle =
    block
      .split(/\r?\n/)
      .find((line) => /^#\s+(?!#)/.test(line)) ?? "";
  const markdownTitle = stripMarkdown(rawTitle).replace(/^Conferencia Internacional:\s*/i, "");
  const metadataTitle = metadataById.get(youtubeId)?.title;
  const title = metadataTitle && !/placeholder|video no disponible/i.test(metadataTitle) ? metadataTitle : markdownTitle;
  const rawDate = getField(block, "Fecha");
  const participants = parseParticipants(getField(block, "Participantes"));
  const biography = getField(block, "Biografia");
  const summary = getField(block, "Resumen");
  const placeholder =
    /\bplaceholder\b/i.test(title) ||
    /video no disponible/i.test(title) ||
    /contenido del video inaccesible/i.test(summary);

  const baseSlug = slugify(title) || youtubeId;

  return {
    youtubeId,
    url,
    title,
    slug: baseSlug,
    date: parseSpanishDate(rawDate),
    participants,
    biography,
    summary,
    editorialMarkdown: getEditorialMarkdown(block),
    placeholder,
    thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}

function ensureUniqueSlugs(items) {
  const seen = new Map();

  return items.map((item) => {
    const count = seen.get(item.slug) ?? 0;
    seen.set(item.slug, count + 1);

    if (count === 0) return item;

    return {
      ...item,
      slug: `${item.slug}-${slugify(item.youtubeId)}`,
    };
  });
}

export function parseConferences(markdown) {
  const metadataById = loadMetadata();
  const blocks = markdown
    .split(/(?=^##\s+https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/\S+)/gm)
    .map((block) => block.trim())
    .filter(Boolean);

  return ensureUniqueSlugs(blocks.map((block) => parseBlock(block, metadataById)).filter(Boolean));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const markdown = fs.readFileSync(inputPath, "utf8");
  const conferences = parseConferences(markdown);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(conferences, null, 2)}\n`, "utf8");

  const placeholders = conferences.filter((item) => item.placeholder).length;
  console.log(`Parsed ${conferences.length} conferences (${placeholders} placeholders).`);
  console.log(`Wrote ${path.relative(rootDir, outputPath)}`);
}
