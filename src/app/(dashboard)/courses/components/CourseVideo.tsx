"use client";

import styles from "../courses.module.scss";

const YOUTUBE_EMBED_URL =
  "https://www.youtube.com/embed/983bBbJx0Mk?autoplay=0&rel=0";

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/) ?? null;
  const id = match?.[1];
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

interface CourseVideoProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
}

export function CourseVideo({ videoUrl, posterUrl, title }: CourseVideoProps) {
  const embedUrl =
    getYoutubeEmbedUrl(videoUrl ?? "") ?? YOUTUBE_EMBED_URL;

  return (
    <div className={styles.videoWrap}>
      <iframe
        src={embedUrl}
        title={title ?? "Video bài giảng"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={styles.videoIframe}
      />
    </div>
  );
}
