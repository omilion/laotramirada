import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, getConferenceTopics, getYoutubeThumbnail } from "../lib/content";
import { keepTitleWordsTogether } from "../lib/text";
import type { Conference } from "../types";

type Props = {
  conference: Conference;
  variant?: "feature" | "large" | "standard";
};

export function ConferenceCard({ conference, variant = "standard" }: Props) {
  const topics = getConferenceTopics(conference);

  return (
    <Link
      className={`conference-card conference-card-${variant}`}
      to={`/conferencias/${conference.slug}`}
      aria-label={`Ver conferencia: ${conference.title}`}
    >
      <img
        src={getYoutubeThumbnail(conference.youtubeId)}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.classList.add("is-error");
        }}
      />
      <span className="conference-card-shade" />
      <span className="conference-play" aria-hidden="true">
        <Play size={22} fill="currentColor" />
      </span>
      <span className="conference-card-copy">
        <span className="conference-kicker">{formatDate(conference.date)}</span>
        <span className="conference-card-title">{keepTitleWordsTogether(conference.title)}</span>
        <span className="conference-tags">
          {topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
          {conference.placeholder && <span>Pendiente</span>}
        </span>
      </span>
    </Link>
  );
}
