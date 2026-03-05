import tmdbService from "../services/tmdb.js";
import { genreNameToId } from "../utils/genreMapping.js";

const MAX_LIMIT = 40;

const sanitizePositiveInt = (value, fallback, max = MAX_LIMIT) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;

  const normalized = Math.floor(parsed);
  if (normalized < 1) return fallback;

  return Math.min(normalized, max);
};

const buildPageInfo = (page, limit, totalResults, totalPages) => ({
  page,
  limit,
  totalResults: Math.max(0, totalResults),
  totalPages: Math.max(0, totalPages),
  hasNextPage: totalPages > 0 && page < totalPages,
  hasPreviousPage: totalPages > 0 && page > 1,
});

export const resolvers = {
  Content: {
    __resolveType(obj) {
      return obj.__typename;
    },
  },
  Query: {
    popularContentOfTheDay: async () => {
      try {
        const trendingContent = await tmdbService.getTrendingContent();

        return trendingContent[0];
      } catch (error) {
        console.error("Error fetching popular content:", error);
        return null;
      }
    },
    top10: async () => {
      try {
        const popularMovies = await tmdbService.getPopularMovies(1, "US");
        const popularShow = await tmdbService.getPopularShows(1, "US");

        return [...popularMovies.slice(0, 10), ...popularShow.slice(0, 10)];
      } catch (error) {
        console.error("Error fetching top 10 movies in the US:", error);
        return null;
      }
    },
    // Get movies/shows by genre
    contentByGenre: async (_, { genre, contentType = "all", page = 1, limit = 20 }) => {
      const safePage = sanitizePositiveInt(page, 1);
      const safeLimit = sanitizePositiveInt(limit, 20);

      try {
        const movieGenreId = genreNameToId(genre, "movie");
        const tvShowGenreId = genreNameToId(genre, "tv");

        if (!movieGenreId && !tvShowGenreId) {
          throw new Error(`Invalid genre name: ${genre}`);
        }

        if (contentType === "movie") {
          if (!movieGenreId) {
            return {
              items: [],
              pageInfo: buildPageInfo(safePage, safeLimit, 0, 0),
            };
          }

          const moviePage = await tmdbService.getMoviesByGenre(movieGenreId, {
            page: safePage,
            includeMeta: true,
          });

          return {
            items: moviePage.items.slice(0, safeLimit),
            pageInfo: buildPageInfo(
              safePage,
              safeLimit,
              moviePage.totalResults,
              moviePage.totalPages
            ),
          };
        }

        if (contentType === "tv") {
          if (!tvShowGenreId) {
            return {
              items: [],
              pageInfo: buildPageInfo(safePage, safeLimit, 0, 0),
            };
          }

          const tvPage = await tmdbService.getShowsByGenre(tvShowGenreId, {
            page: safePage,
            includeMeta: true,
          });

          return {
            items: tvPage.items.slice(0, safeLimit),
            pageInfo: buildPageInfo(
              safePage,
              safeLimit,
              tvPage.totalResults,
              tvPage.totalPages
            ),
          };
        }

        const [moviesPage, showsPage] = await Promise.all([
          movieGenreId
            ? tmdbService.getMoviesByGenre(movieGenreId, {
                page: safePage,
                includeMeta: true,
              })
            : Promise.resolve({
                items: [],
                page: safePage,
                totalPages: 0,
                totalResults: 0,
              }),
          tvShowGenreId
            ? tmdbService.getShowsByGenre(tvShowGenreId, {
                page: safePage,
                includeMeta: true,
              })
            : Promise.resolve({
                items: [],
                page: safePage,
                totalPages: 0,
                totalResults: 0,
              }),
        ]);

        const items = [...moviesPage.items, ...showsPage.items].sort(
          (a, b) =>
            (b.rating ?? b.vote_average ?? 0) -
            (a.rating ?? a.vote_average ?? 0)
        );

        return {
          items: items.slice(0, safeLimit),
          pageInfo: buildPageInfo(
            safePage,
            safeLimit,
            moviesPage.totalResults + showsPage.totalResults,
            Math.max(moviesPage.totalPages, showsPage.totalPages)
          ),
        };
      } catch (error) {
        console.error("Error fetching content by genre:", error);
        return {
          items: [],
          pageInfo: buildPageInfo(safePage, safeLimit, 0, 0),
        };
      }
    },
    // Search for movies/shows
    search: async (_, { query, page = 1, limit = 20 }) => {
      const safePage = sanitizePositiveInt(page, 1);
      const safeLimit = sanitizePositiveInt(limit, 20);

      try {
        const [moviesPage, showsPage] = await Promise.all([
          tmdbService.searchMovies(query, { page: safePage, includeMeta: true }),
          tmdbService.searchShows(query, { page: safePage, includeMeta: true }),
        ]);

        return {
          items: [...moviesPage.items, ...showsPage.items].slice(0, safeLimit),
          pageInfo: buildPageInfo(
            safePage,
            safeLimit,
            moviesPage.totalResults + showsPage.totalResults,
            Math.max(moviesPage.totalPages, showsPage.totalPages)
          ),
        };
      } catch (error) {
        console.error("Error searching content:", error);
        return {
          items: [],
          pageInfo: buildPageInfo(safePage, safeLimit, 0, 0),
        };
      }
    },
    moviesByIds: async (_, { ids }) => {
      try {
        const contentDetails = await Promise.allSettled(
          ids.map(async (id) => {
            const movie = await tmdbService.getMovieById(id);
            if (movie) return movie;

            return await tmdbService.getTVShowById(id);
          })
        );

        return contentDetails
          .filter(
            (result) =>
              result.status === "fulfilled" && result.value !== null
          )
          .map((result) => result.value);
      } catch (error) {
        console.error("Error fetching content by IDs:", error);
        throw new Error("Failed to fetch content by IDs");
      }
    },
    contentPreview: async (_, { id, type }) => {
      try {
        if (type === "movie") {
          return await tmdbService.getMovieById(id);
        } else if (type === "tv" || type === "tvShow") {
          return await tmdbService.getTVShowById(id);
        } else {
          throw new Error(
            "Invalid content type. Use 'movie', 'tv', or legacy 'tvShow'."
          );
        }
      } catch (error) {
        console.error("Error fetching content preview:", error);
        return null;
      }
    },

    comingThisWeek: async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        const endOfWeekFormatted = endOfWeek.toISOString().split("T")[0];

        // Fetch movies releasing this week
        const movies = await tmdbService.getMoviesByReleaseDateRange(
          currentDate,
          endOfWeekFormatted
        );

        // Fetch TV shows releasing this week
        const shows = await tmdbService.getShowsByReleaseDateRange(
          currentDate,
          endOfWeekFormatted
        );

        const filtered = [...movies, ...shows].filter(
          (item) => item.backdropPath !== "/placeholder-horizontal.jpg"
        );

        const sorted = filtered.sort(
          (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
        );

        return sorted.slice(0, 20);
      } catch (error) {
        console.error("Error fetching content coming this week:", error);
        return [];
      }
    },

    comingNextWeek: async () => {
      try {
        const nextWeekStart = new Date();
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        const nextWeekStartFormatted = nextWeekStart
          .toISOString()
          .split("T")[0];

        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
        const nextWeekEndFormatted = nextWeekEnd.toISOString().split("T")[0];

        // Fetch movies releasing next week
        const movies = await tmdbService.getMoviesByReleaseDateRange(
          nextWeekStartFormatted,
          nextWeekEndFormatted
        );

        // Fetch TV shows releasing next week
        const shows = await tmdbService.getShowsByReleaseDateRange(
          nextWeekStartFormatted,
          nextWeekEndFormatted
        );

        const filtered = [...movies, ...shows].filter(
          (item) => item.backdropPath !== "/placeholder-horizontal.jpg"
        );

        const sorted = filtered.sort(
          (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
        );

        return sorted.slice(0, 20);
      } catch (error) {
        console.error("Error fetching content coming next week:", error);
        return [];
      }
    },

    newContent: async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoFormatted = thirtyDaysAgo
          .toISOString()
          .split("T")[0];

        const currentDate = new Date().toISOString().split("T")[0];

        // Fetch movies released in the last 30 days
        const movies = await tmdbService.getMoviesByReleaseDateRange(
          thirtyDaysAgoFormatted,
          currentDate
        );

        // Fetch TV shows released in the last 30 days
        const shows = await tmdbService.getShowsByReleaseDateRange(
          thirtyDaysAgoFormatted,
          currentDate
        );

        const filtered = [...movies, ...shows].filter(
          (item) => item.backdropPath !== "/placeholder-horizontal.jpg"
        );

        const sorted = filtered.sort(
          (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
        );

        return sorted.slice(0, 20);
      } catch (error) {
        console.error("Error fetching new content:", error);
        return [];
      }
    },
  },
};
