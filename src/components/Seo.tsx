import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  schema?: unknown;
};

export function Seo({ title, description, image, canonical, schema }: SeoProps) {
  useEffect(() => {
    document.title = `${title} | La Otra Mirada`;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("twitter:card", image ? "summary_large_image" : "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (image) setMeta("og:image", image, "property");
    if (image) setMeta("twitter:image", image);
    setCanonical(canonical);

    const existing = document.querySelector<HTMLScriptElement>("script[data-schema='page']");
    existing?.remove();
    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.schema = "page";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, image, canonical, schema]);

  return null;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string | undefined) {
  let el = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}
