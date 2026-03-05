"use client";

import { useMemo } from "react";
import Image from "next/image";
import { MovieProps } from "../lib/types";
import Wrapper from "./ui/Wrapper";
import { InfoIcon, PlayIcon } from "./icons/Icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { formatRuntime } from "../utils/timeUtils";

interface HeroSectionProps {
  movie: MovieProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isSeries = movie.type === "tv" || movie.type === "tvShow";
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  const runtimeOrSeries = useMemo(() => {
    if (isSeries) {
      if (movie.numberOfSeasons && movie.numberOfSeasons > 0) {
        const seasonLabel = movie.numberOfSeasons === 1 ? "Season" : "Seasons";
        return `${movie.numberOfSeasons} ${seasonLabel}`;
      }
      return "Series";
    }
    return formatRuntime(movie.runtime);
  }, [isSeries, movie.numberOfSeasons, movie.runtime]);

  const metaItems = [
    releaseYear ? String(releaseYear) : null,
    movie.rating ? `${movie.rating.toFixed(1)}/10` : null,
    runtimeOrSeries || null,
  ].filter(Boolean) as string[];

  const descriptionText = (movie.overview || movie.description || "").trim();
  const trimmedDescription =
    descriptionText.length > 140
      ? `${descriptionText.slice(0, 137).trim()}...`
      : descriptionText;

  const handleOpenMovie = () => {
    const jbv = movie.id;
    router.push(`${pathname}/?jbv=${jbv}&type=${movie.type}`, {
      scroll: false,
    });
  };

  return (
    <>
      <div className="relative aspect-[16/7] w-full min-w-[300px] overflow-hidden">
        <Image
          priority
          src={movie.backdropPath}
          alt={movie.title}
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-overlay via-brand-overlaySubtle to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-overlay to-transparent"></div>
        <Wrapper>
          <div className="absolute bottom-6 max-w-[min(92vw,42rem)] md:bottom-10">
            <h1 className="text-h1">{movie.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-meta md:gap-3">
              {metaItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
              <span className="rounded-sm border border-brand-textMuted px-1.5 py-0.5 text-[0.72rem] leading-none text-brand-text">
                HD
              </span>
            </div>

            {trimmedDescription && (
              <p className="text-p mt-3 max-w-[52ch]">{trimmedDescription}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
              <Link
                href={`/watch/${movie.id}?&type=${movie.type}`}
                className="rounded flex gap-2 items-center justify-center transition-colors bg-brand-text text-brand-inverse hover:bg-brand-textSecondary px-4 py-2 md:px-5"
              >
                <PlayIcon dark />
                <span className="text-button">Play</span>
              </Link>
              <button
                onClick={handleOpenMovie}
                className="rounded bg-brand-overlaySoft flex gap-2 items-center justify-center hover:bg-brand-overlay text-brand-text px-4 py-2 md:px-5"
              >
                <InfoIcon />
                <span className="text-button">More Info</span>
              </button>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default HeroSection;
