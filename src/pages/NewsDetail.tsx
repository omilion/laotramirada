import { ArrowLeft, ArrowRight, CalendarDays, Clock3, PenLine, Tag } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MarkdownContent } from "../components/MarkdownContent";
import { Seo } from "../components/Seo";
import {
  editorialPosts,
  formatDate,
  getEditorialPostAuthor,
  getEditorialPostBySlug,
  getEditorialPostMarkdown,
  getEditorialPostPublishedAt,
  getEditorialPostTime,
  getRelatedConferencesForPost,
} from "../lib/content";
import { keepTitleWordsTogether } from "../lib/text";

export function NewsDetail() {
  const { slug } = useParams();
  const post = getEditorialPostBySlug(slug);

  if (!post) return <Navigate to="/noticias" replace />;

  const relatedConferences = getRelatedConferencesForPost(post);
  const relatedPosts = editorialPosts
    .filter((item) => item.slug !== post.slug)
    .filter((item) => item.tags.some((tag) => post.tags.includes(tag)) || item.category === post.category)
    .slice(0, 3);
  const canonical = `https://laotramirada.cl/noticias/${post.slug}`;

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        canonical={canonical}
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: getEditorialPostPublishedAt(post),
          dateModified: getEditorialPostPublishedAt(post),
          author: {
            "@type": "Organization",
            name: getEditorialPostAuthor(post),
          },
          publisher: {
            "@type": "Organization",
            name: "La Otra Mirada",
            url: "https://laotramirada.cl/",
          },
          mainEntityOfPage: canonical,
          keywords: post.tags.join(", "),
        }}
      />
      <article className="news-detail">
        <section className="news-detail-hero lom-shell-wide">
          <Link className="lom-text-link" to="/noticias">
            <ArrowLeft size={17} /> Volver a noticias
          </Link>
          <div className="news-detail-copy">
            <p className="lom-eyebrow">{post.category}</p>
            <h1>{keepTitleWordsTogether(post.title)}</h1>
            <p>{post.excerpt}</p>
            <div className="news-detail-meta">
              <span>
                <CalendarDays size={16} />
                {formatDate(post.date)}
              </span>
              <span>
                <Clock3 size={16} />
                {getEditorialPostTime(post)} hrs
              </span>
              <span>
                <PenLine size={16} />
                {getEditorialPostAuthor(post)}
              </span>
              <span>
                <Tag size={16} />
                {post.tags.slice(0, 2).join(" / ")}
              </span>
            </div>
          </div>
        </section>

        <section className="news-detail-body lom-shell-wide">
          <div className="news-detail-main">
            <MarkdownContent markdown={getEditorialPostMarkdown(post)} />
            <div className="news-detail-tags" aria-label="Etiquetas del post">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/noticias?q=${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <aside className="news-detail-aside">
            <div className="news-related-block">
              <p className="lom-eyebrow">Conferencias relacionadas</p>
              <div className="news-related-list">
                {relatedConferences.map((conference) => (
                  <Link key={conference.slug} to={`/conferencias/${conference.slug}`}>
                    <span>{conference.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div className="news-related-block">
                <p className="lom-eyebrow">Seguir leyendo</p>
                <div className="news-related-posts">
                  {relatedPosts.map((item) => (
                    <Link key={item.slug} to={`/noticias/${item.slug}`}>
                      <span>{formatDate(item.date)}</span>
                      <strong>{item.title}</strong>
                      <ArrowRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
      </article>
    </>
  );
}
