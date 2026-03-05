"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CloseIcon } from "../icons/Icons";
import GridCards from "../ui/GridCards";
import { MovieProps } from "../../lib/types";

interface RowExploreModalProps {
  title: string;
  movies: MovieProps[];
  onClose: () => void;
}

const RowExploreModal: React.FC<RowExploreModalProps> = ({
  title,
  movies,
  onClose,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleOpenMovie = (movie: MovieProps) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("jbv", String(movie.id));
    params.set("type", movie.type);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-brand-overlay px-4 py-20 md:px-10"
      onClick={onClose}
    >
      <div
        className="mx-auto flex w-full max-w-7xl flex-col rounded-md bg-brand-surface"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h3 className="text-h2">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close explore all"
            className="rounded-full bg-brand-overlaySoft p-2 hover:bg-brand-overlaySubtle"
          >
            <CloseIcon className="h-5 w-5 text-brand-text" />
          </button>
        </div>
        <div className="px-4 pb-8 pt-6 md:px-8">
          <GridCards
            movies={movies}
            onCardClick={handleOpenMovie}
            showPreview={false}
          />
        </div>
      </div>
    </div>
  );
};

export default RowExploreModal;
