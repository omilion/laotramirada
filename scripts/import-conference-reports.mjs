import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const reportsPath = process.argv[2] ?? path.join(process.env.USERPROFILE ?? "", "Downloads", "todas las conferecias.txt");
const inventoryPath = path.join(rootDir, "conferencias", "inventario_conferencias.md");
const metadataPath = path.join(rootDir, "metadata.json");
const scopePath = path.join(rootDir, "src", "data", "conferenceScope.ts");

function repairMojibake(value) {
  if (!/[ÃÂâ]/.test(value)) return value;
  return Buffer.from(value, "latin1").toString("utf8");
}

function normalizeSpaces(value) {
  return value.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function compact(value) {
  return normalizeSpaces(value.replace(/\s+/g, " "));
}

function titleKey(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function wordSet(value) {
  return new Set(titleKey(value).split(/\s+/).filter((word) => word.length > 2));
}

function scoreText(a, b) {
  const wordsA = wordSet(a);
  const wordsB = wordSet(b);
  if (!wordsA.size || !wordsB.size) return 0;

  let overlap = 0;
  for (const word of wordsA) if (wordsB.has(word)) overlap += 1;
  return overlap / Math.max(wordsA.size, wordsB.size);
}

function splitReports(text) {
  const starts = [...text.matchAll(/1\.\s*Ficha T[eé]cnica de la Conferencia/g)].map((match) => match.index);
  return starts
    .map((start, index) => text.slice(start, starts[index + 1] ?? text.length).trim())
    .filter(Boolean);
}

function normalizeReportLayout(report) {
  const labels = [
    "Fecha de Realización / Publicación",
    "Fecha de Publicación / Transmisión",
    "Fecha de Publicación / Emisión",
    "Fecha de Emisión / Publicación",
    "Fecha de Publicación",
    "Ubicación / Plataforma",
    "Ubicación",
    "Título Original",
    "Título de la Conferencia",
    "Título",
    "Edición de la Conferencia",
    "Entrevistador / Conductor",
    "Entrevistador",
    "Conductor del Panel",
    "Moderadora del Panel",
    "Entidades colaboradoras",
    "Entidades Colaboradoras",
    "Organizan",
    "Formato",
    "Formatos",
    "Idioma original",
    "Idioma",
    "Invitado",
    "Invitada",
    "Biografía resumida",
    "Categorías Principales",
    "Etiquetas (Tags)",
  ];

  let output = report.replace(/\r\n/g, "\n");
  output = output.replace(/([^\n])([234]\.\s+(?:El |Resumen|Categorización))/g, "$1\n\n$2");
  output = output.replace(/(1\.\s*Ficha T[eé]cnica de la Conferencia)(?=\S)/g, "$1\n");
  output = output.replace(/(2\.\s*El(?:enco de)? Conferencista(?:s)?(?: \([^)]+\))?)(?=\S)/g, "$1\n");
  output = output.replace(/(2\.\s*El Conferencista)(?=\S)/g, "$1\n");
  output = output.replace(/(3\.\s*Resumen Contundente)(?=\S)/g, "$1\n");
  output = output.replace(/(4\.\s*Categorización Sugerida)(?=\S)/g, "$1\n");

  for (const label of labels.sort((a, b) => b.length - a.length)) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(new RegExp(`([^\\n])(${escaped}:)`, "g"), "$1\n$2");
  }

  output = output.replace(/([^.\n])(\s*(?:Quedo|URL registrada|Procedo|Ha sido|Aquí tienes|¡Tú me indicas))/g, "$1\n$2");
  return normalizeSpaces(output);
}

function getField(report, labels) {
  const text = compact(normalizeReportLayout(report));
  const stop =
    "(?:Fecha|Ubicación|Título|Formato|Formatos|Idioma|Invitado|Invitada|Biografía|Categorías|Etiquetas|Entrevistador|Entidades|Moderadora|Organizan|Edición|Conductor|2\\.|3\\.|4\\.|$)";

  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = text.match(new RegExp(`${escaped}:\\s*(.+?)(?=${stop})`, "i"));
    if (match) return match[1].trim().replace(/\.$/, "");
  }

  return "";
}

function getReportIdentity(report) {
  return {
    title: getField(report, ["Título Original", "Título de la Conferencia", "Título"]),
    guest: getField(report, ["Invitado", "Invitada"]),
    date: getField(report, ["Fecha de Publicación", "Fecha de Realización / Publicación", "Fecha de Publicación / Emisión", "Fecha de Publicación / Transmisión", "Fecha de Emisión / Publicación"]),
  };
}

function stripNoiseLine(line) {
  return /^(Quedo|URL registrada|Procedo|Ha sido|Aquí tienes|¡Tú me indicas|Excelente avance)/i.test(line.trim());
}

function toMarkdown(report) {
  const cleaned = normalizeReportLayout(report);
  const lines = cleaned.split(/\n/);
  const output = ["## Informe Editorial Completo para Landing Page"];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      output.push("");
      continue;
    }

    if (stripNoiseLine(line)) continue;

    if (/^\d+\.\s+Ficha T[eé]cnica de la Conferencia/i.test(line)) {
      output.push("## 1. Ficha Técnica de la Conferencia");
    } else if (/^\d+\.\s+El (?:Conferencista|Elenco de Conferencistas)/i.test(line)) {
      output.push("## 2. El Conferencista");
    } else if (/^\d+\.\s+Resumen Contundente/i.test(line)) {
      output.push("## 3. Resumen Contundente");
    } else if (/^\d+\.\s+Categorizaci[oó]n Sugerida/i.test(line)) {
      output.push("## 4. Categorización Sugerida");
    } else if (/^[A-ZÁÉÍÓÚÑ][^:]{2,120}:\s+/.test(line)) {
      const [label, ...rest] = line.split(":");
      output.push(`**${label.trim()}:** ${rest.join(":").trim()}`);
    } else {
      output.push(line);
    }
  }

  return normalizeSpaces(output.join("\n"));
}

function findBestMatch(report, candidates, usedIds) {
  const identity = getReportIdentity(report);
  const combined = `${identity.title} ${identity.guest}`;
  const normalizedCombined = titleKey(combined);
  const normalizedDate = titleKey(identity.date);

  let manualYoutubeId = null;
  if (
    normalizedCombined.includes("seguridad y democracia en america latina") ||
    (normalizedCombined.includes("ivan duque") && normalizedDate.includes("25 de abril de 2024"))
  ) {
    manualYoutubeId = "PiEk7zcpL7I";
  }
  if (normalizedCombined.includes("capitalismo y desigualdad")) manualYoutubeId = "EDCqWK8h5AE";
  if (normalizedCombined.includes("moises naim") && normalizedDate.includes("4 de septiembre de 2023")) {
    manualYoutubeId = "VN6S-csF8Gk";
  }
  if (normalizedCombined.includes("moises naim") && normalizedDate.includes("27 de noviembre de 2020")) {
    manualYoutubeId = "mm8bDMegZik";
  }

  if (manualYoutubeId && !usedIds.has(manualYoutubeId)) {
    return {
      youtubeId: manualYoutubeId,
      score: 1,
      reason: "manual",
      identity,
    };
  }

  const ranked = candidates
    .filter((candidate) => !usedIds.has(candidate.youtubeId))
    .map((candidate) => {
      const titleScore = scoreText(identity.title, candidate.title);
      const guestScore = scoreText(identity.guest, candidate.title) * 0.75;
      const combinedScore = scoreText(combined, candidate.title);
      return {
        ...candidate,
        score: Math.max(titleScore, guestScore, combinedScore),
        reason: "score",
        identity,
      };
    })
    .sort((a, b) => b.score - a.score);

  return ranked[0] ?? null;
}

function replaceInventoryBlock(inventory, youtubeId, markdown, titleOverride = "") {
  const marker = `## https://www.youtube.com/watch?v=${youtubeId}`;
  const start = inventory.indexOf(marker);
  if (start === -1) return { inventory, replaced: false };

  const next = inventory.indexOf("\n## https://www.youtube.com/watch?v=", start + marker.length);
  const block = inventory.slice(start, next === -1 ? undefined : next);
  const existingTitleLine = block.split(/\r?\n/).find((line) => /^#\s+/.test(line)) ?? "# Conferencia Internacional";
  const titleLine = titleOverride
    ? `# Conferencia Internacional: ${titleOverride}`
    : existingTitleLine;
  const replacement = `${marker}\n\n${titleLine}\n${markdown}\n\n---\n`;

  return {
    inventory: `${inventory.slice(0, start)}${replacement}${next === -1 ? "" : inventory.slice(next + 1)}`,
    replaced: true,
  };
}

const raw = fs.readFileSync(reportsPath, "utf8");
const text = repairMojibake(raw);
const reports = splitReports(text);
const scopeIds = [...fs.readFileSync(scopePath, "utf8").matchAll(/"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1]);
const scopeSet = new Set(scopeIds);
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
const candidates = metadata
  .map((item) => ({
    youtubeId: new URL(item.url).searchParams.get("v"),
    title: item.title,
    url: item.url,
  }))
  .filter((item) => scopeSet.has(item.youtubeId));

let inventory = fs.readFileSync(inventoryPath, "utf8");
const usedIds = new Set();
const imported = [];
const skipped = [];

for (const report of reports) {
  const match = findBestMatch(report, candidates, usedIds);

  if (!match || match.score < 0.35) {
    skipped.push({ identity: getReportIdentity(report), reason: "low-score", score: match?.score ?? 0 });
    continue;
  }

  const titleOverride = match.youtubeId === "PiEk7zcpL7I" ? match.identity.title : "";
  const result = replaceInventoryBlock(inventory, match.youtubeId, toMarkdown(report), titleOverride);
  if (!result.replaced) {
    skipped.push({ identity: match.identity, reason: "inventory-block-not-found", score: match.score });
    continue;
  }

  inventory = result.inventory;
  usedIds.add(match.youtubeId);
  imported.push({ ...match, title: candidates.find((candidate) => candidate.youtubeId === match.youtubeId)?.title });
}

fs.writeFileSync(inventoryPath, inventory, "utf8");

const missing = scopeIds.filter((youtubeId) => !usedIds.has(youtubeId));

console.log(`Reports detected: ${reports.length}`);
console.log(`Imported: ${imported.length}`);
for (const item of imported) {
  console.log(`OK ${item.youtubeId} | ${item.title} | report="${item.identity.title || item.identity.guest}" | ${item.reason}`);
}

console.log(`Skipped: ${skipped.length}`);
for (const item of skipped) {
  console.log(`SKIP ${item.reason} score=${item.score.toFixed(2)} | report="${item.identity.title || item.identity.guest}"`);
}

console.log(`Missing scope videos: ${missing.length}`);
for (const youtubeId of missing) {
  const candidate = candidates.find((item) => item.youtubeId === youtubeId);
  console.log(`MISS ${youtubeId} | ${candidate?.title ?? "Sin titulo"}`);
}
