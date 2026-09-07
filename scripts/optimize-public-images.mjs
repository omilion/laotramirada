import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const sourceExtensions = new Set([".jpg", ".jpeg", ".png"]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
]);
const referenceRoots = [path.join(rootDir, "src"), path.join(rootDir, "index.html")];
const galleryDataFile = path.join(rootDir, "src", "data", "galleryImages.json");
const webpQuality = 0.82;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return walk(fullPath);
      }

      if (entry.isFile() && sourceExtensions.has(path.extname(entry.name).toLowerCase())) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function toPublicUrl(filePath) {
  return `/${path.relative(publicDir, filePath).replaceAll(path.sep, "/")}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function walkTextFiles(targetPath) {
  const entry = await fs.stat(targetPath);

  if (entry.isFile()) {
    return textExtensions.has(path.extname(targetPath).toLowerCase()) ? [targetPath] : [];
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((child) => {
      const fullPath = path.join(targetPath, child.name);
      return child.isDirectory() ? walkTextFiles(fullPath) : walkTextFiles(fullPath);
    }),
  );

  return files.flat();
}

async function updateReferences(results) {
  const replacements = results.map(({ sourcePath, outputPath }) => ({
    sourceUrl: toPublicUrl(sourcePath),
    outputUrl: toPublicUrl(outputPath),
  }));
  const textFiles = (await Promise.all(referenceRoots.map((targetPath) => walkTextFiles(targetPath)))).flat();
  let updatedFiles = 0;
  let updatedReferences = 0;

  for (const filePath of textFiles) {
    let content = await fs.readFile(filePath, "utf8");
    let nextContent = content;

    for (const { sourceUrl, outputUrl } of replacements) {
      const pattern = new RegExp(escapeRegExp(sourceUrl), "g");
      nextContent = nextContent.replace(pattern, outputUrl);
    }

    if (nextContent !== content) {
      const matchesBefore = content.match(/\.(?:jpe?g|png)/gi)?.length ?? 0;
      const matchesAfter = nextContent.match(/\.(?:jpe?g|png)/gi)?.length ?? 0;
      updatedReferences += Math.max(0, matchesBefore - matchesAfter);
      updatedFiles += 1;
      await fs.writeFile(filePath, nextContent, "utf8");
    }
  }

  return { updatedFiles, updatedReferences };
}

async function updateGalleryMimeTypes() {
  const content = await fs.readFile(galleryDataFile, "utf8");
  const galleryItems = JSON.parse(content);
  let updatedItems = 0;

  const nextGalleryItems = galleryItems.map((item) => {
    if (item.src?.endsWith(".webp") && item.mimeType !== "image/webp") {
      updatedItems += 1;
      return {
        ...item,
        mimeType: "image/webp",
      };
    }

    return item;
  });

  if (updatedItems > 0) {
    await fs.writeFile(galleryDataFile, `${JSON.stringify(nextGalleryItems, null, 2)}\n`, "utf8");
  }

  return updatedItems;
}

const browser = await chromium.launch();
const page = await browser.newPage();

const sourceFiles = await walk(publicDir);
const results = [];

for (const sourcePath of sourceFiles) {
  const outputPath = sourcePath.replace(/\.(jpe?g|png)$/i, ".webp");
  const [sourceStat, existingOutputStat] = await Promise.all([
    fs.stat(sourcePath),
    fileExists(outputPath).then((exists) => (exists ? fs.stat(outputPath) : null)),
  ]);

  if (existingOutputStat && existingOutputStat.mtimeMs >= sourceStat.mtimeMs) {
    results.push({
      sourcePath,
      outputPath,
      sourceSize: sourceStat.size,
      outputSize: existingOutputStat.size,
      skipped: true,
    });
    continue;
  }

  const sourceBuffer = await fs.readFile(sourcePath);
  const sourceType = path.extname(sourcePath).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
  const dataUrl = `data:${sourceType};base64,${sourceBuffer.toString("base64")}`;

  const webpBase64 = await page.evaluate(
    async ({ dataUrl: imageDataUrl, quality }) => {
      const image = new Image();
      image.decoding = "sync";
      image.src = imageDataUrl;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { alpha: true });
      context.drawImage(image, 0, 0);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (!blob) {
        throw new Error("The browser could not encode WebP.");
      }

      const buffer = await blob.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000;

      for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
      }

      return btoa(binary);
    },
    { dataUrl, quality: webpQuality },
  );

  const outputBuffer = Buffer.from(webpBase64, "base64");
  await fs.writeFile(outputPath, outputBuffer);

  results.push({
    sourcePath,
    outputPath,
    sourceSize: sourceStat.size,
    outputSize: outputBuffer.length,
    skipped: false,
  });
}

await browser.close();

const generated = results.filter((result) => !result.skipped);
const sourceBytes = results.reduce((total, result) => total + result.sourceSize, 0);
const outputBytes = results.reduce((total, result) => total + result.outputSize, 0);
const savedBytes = sourceBytes - outputBytes;
const referenceUpdate = await updateReferences(results);
const galleryMimeTypesUpdated = await updateGalleryMimeTypes();

console.log(`Processed ${results.length} image(s).`);
console.log(`Generated ${generated.length} WebP file(s).`);
console.log(`Updated ${referenceUpdate.updatedReferences} local reference(s) in ${referenceUpdate.updatedFiles} file(s).`);
console.log(`Updated ${galleryMimeTypesUpdated} gallery MIME type(s).`);
console.log(`Original total: ${formatBytes(sourceBytes)}`);
console.log(`WebP total: ${formatBytes(outputBytes)}`);
console.log(`Estimated saving: ${formatBytes(savedBytes)} (${((savedBytes / sourceBytes) * 100).toFixed(1)}%)`);

const largestSavings = results
  .map((result) => ({
    ...result,
    savedBytes: result.sourceSize - result.outputSize,
  }))
  .sort((a, b) => b.savedBytes - a.savedBytes)
  .slice(0, 10);

if (largestSavings.length > 0) {
  console.log("Largest savings:");
  for (const result of largestSavings) {
    const relativePath = path.relative(rootDir, result.sourcePath);
    console.log(`- ${relativePath}: ${formatBytes(result.savedBytes)}`);
  }
}
