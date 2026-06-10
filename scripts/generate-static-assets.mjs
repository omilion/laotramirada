import fs from "node:fs";
import path from "node:path";
import conferences from "../src/data/conferences.json" with { type: "json" };

const distDir = path.resolve("dist");
const baseUrl = "https://laotramirada.cl";
const conferenceVideoIds = [
  "2pGObT6T-XE",
  "9gTf8H3Ya9k",
  "A0mRUTTPt30",
  "BI2jcDcGq6g",
  "cQ1BB0tOMI0",
  "EDCqWK8h5AE",
  "EeKw2kfwFYA",
  "erbqSsUBK0k",
  "Ey4XuixqdKQ",
  "hL0883CI0BQ",
  "J6plxDBnz5A",
  "jCKWiwdpuuY",
  "l1DbR3EQZtI",
  "Ld8dkr_pnGY",
  "mm8bDMegZik",
  "nB0YeCZMg1E",
  "PiEk7zcpL7I",
  "tlGY6s-ZJug",
  "tm2jCUGG-Lo",
  "TmG5OizxSAo",
  "uGrPdngMZ7A",
  "VN6S-csF8Gk",
  "WDH8JoVU6aU",
];
const conferenceSet = new Set(conferenceVideoIds);
const scoped = conferences.filter((item) => conferenceSet.has(item.youtubeId));

const routes = [
  "",
  "conferencias",
  "nuestra-mirada",
  "galeria",
  "noticias",
  "contacto",
  "streaming",
  ...scoped.map((item) => `conferencias/${item.slug}`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}/${route}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf8");
