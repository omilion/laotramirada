import type { ReactNode } from "react";

type Props = {
  markdown: string;
};

type ListMode = "ul" | "ol";

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    const strong = part.match(/^\*\*([^*]+)\*\*$/);
    if (strong) return <strong key={`${part}-${index}`}>{strong[1]}</strong>;
    return part;
  });
}

export function MarkdownContent({ markdown }: Props) {
  const nodes: ReactNode[] = [];
  let listItems: ReactNode[] = [];
  let listMode: ListMode | null = null;

  const flushList = () => {
    if (!listMode || listItems.length === 0) return;
    const Tag = listMode;
    nodes.push(
      <Tag className="markdown-list" key={`list-${nodes.length}`}>
        {listItems}
      </Tag>,
    );
    listItems = [];
    listMode = null;
  };

  markdown.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line || line === "---") {
      flushList();
      return;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const Tag = level === 2 ? "h2" : level === 3 ? "h3" : "h4";
      nodes.push(<Tag key={`heading-${index}`}>{formatInline(heading[2])}</Tag>);
      return;
    }

    const quote = line.match(/^>\s*(.+)$/);
    if (quote) {
      flushList();
      nodes.push(<blockquote key={`quote-${index}`}>{formatInline(quote[1])}</blockquote>);
      return;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      if (listMode !== "ul") flushList();
      listMode = "ul";
      listItems.push(<li key={`bullet-${index}`}>{formatInline(bullet[1])}</li>);
      return;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      if (listMode !== "ol") flushList();
      listMode = "ol";
      listItems.push(<li key={`ordered-${index}`}>{formatInline(ordered[1])}</li>);
      return;
    }

    flushList();
    nodes.push(<p key={`paragraph-${index}`}>{formatInline(line)}</p>);
  });

  flushList();

  return <div className="markdown-content">{nodes}</div>;
}
