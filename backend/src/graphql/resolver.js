import tmdbService from "../services/tmdb.js";
import { genreNameToId } from "../utils/genreMapping.js";

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
    contentByGenre: async (_, { genre, contentType = "all" }) => {
      try {
        const movieGenreId = genreNameToId(genre, "movie");
        const tvShowGenreId = genreNameToId(genre, "tv");

        if (!movieGenreId && !tvShowGenreId) {
          throw new Error(`Invalid genre name: ${genre}`);
        }

        let data = [];
        if (contentType === "movie" || contentType === "all") {
          if (movieGenreId) {
            const movies = await tmdbService.getMoviesByGenre(movieGenreId);
            data = [...data, ...movies];
          }
        }

        if (contentType === "tv" || contentType === "all") {
          if (tvShowGenreId) {
            const tvShows = await tmdbService.getShowsByGenre(tvShowGenreId);
            data = [...data, ...tvShows];
          }
        }

        data.sort((a, b) => b.vote_average - a.vote_average);

        return data.slice(0, 20);
      } catch (error) {
        console.error("Error fetching content by genre:", error);
        return [];
      }
    },
    // Search for movies/shows
    search: async (_, { query }) => {
      try {
        const movies = await tmdbService.searchMovies(query);
        const shows = await tmdbService.searchShows(query);

        return [...movies, ...shows];
      } catch (error) {
        console.error("Error searching content:", error);
        return [];
      }
    },
    moviesByIds: async (_, { ids }) => {
      try {
        const movieDetails = await Promise.all(
          ids.map(async (id) => {
            const movie = await tmdbService.getMovieById(id);
            return movie;
          })
        );

        return movieDetails.filter((movie) => movie !== null); // Remove any failed requests
      } catch (error) {
        console.error("Error fetching movies by IDs:", error);
        throw new Error("Failed to fetch movies by IDs");
      }
    },
    contentPreview: async (_, { id, type }) => {
      try {
        if (type === "movie") {
          return await tmdbService.getMovieById(id);
        } else if (type === "tv") {
          return await tmdbService.getTVShowById(id);
        } else {
          throw new Error("Invalid content type. Use 'movie' or 'tv'.");
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

        return [...movies, ...shows];
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

        return [...movies, ...shows];
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

        return [...movies, ...shows];
      } catch (error) {
        console.error("Error fetching new content:", error);
        return [];
      }
    },
  },
};
