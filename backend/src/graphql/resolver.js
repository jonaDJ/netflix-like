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
    top10Movies: async () => {
      try {
        const popularMovies = await tmdbService.getPopularMovies(1, "US");
        console.log("top 10 Fetched movies:", popularMovies.length);
        return popularMovies.slice(0, 10);
      } catch (error) {
        console.error("Error fetching top 10 movies in the US:", error);
        return null;
      }
    },
    // Get movies/shows by genre
    contentByGenre: async (_, { genre }) => {
      try {
        console.log("Fetching content by genre name:", genre);

        const movieGenreId = genreNameToId(genre, "movie");
        const tvShowGenreId = genreNameToId(genre, "tv");

        if (!movieGenreId && !tvShowGenreId) {
          throw new Error(`Invalid genre name: ${genre}`);
        }

        const moviesByGenre = movieGenreId
          ? await tmdbService.getMoviesByGenre(movieGenreId)
          : [];
        const showsByGenre = tvShowGenreId
          ? await tmdbService.getShowsByGenre(tvShowGenreId)
          : [];

        return [...moviesByGenre, ...showsByGenre];
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
  },
};
