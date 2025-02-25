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
        const popularMovies = await tmdbService.getPopularMovies();

        return popularMovies[0];
      } catch (error) {
        console.error("Error fetching popular content:", error);
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
    // Get the watchlist
    watchList: () => {
      const watchList = JSON.parse(
        localStorage.getItem("watchList") || { movies: [], tvShows: [] }
      );
      return watchList;
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
  },
  Mutation: {
    // Add a movie/show to the watchlist
    addToWatchList: (_, { movieId, tvShowId }) => {
      const watchList = JSON.parse(
        localStorage.getItem("watchList") || { movies: [], tvShows: [] }
      );

      if (movieId) {
        watchList.movies.push(movieId);
      }
      if (tvShowId) {
        watchList.tvShows.push(tvShowId);
      }

      localStorage.setItem("watchList", JSON.stringify(watchList));
      return watchList;
    },
    // Remove a movie/show from the watchlist
    removeFromWatchList: (_, { movieId, tvShowId }) => {
      const watchList = JSON.parse(
        localStorage.getItem("watchList") || { movies: [], tvShows: [] }
      );

      if (movieId) {
        watchList.movies = watchList.movies.filter((id) => id !== movieId);
      }
      if (tvShowId) {
        watchList.tvShows = watchList.tvShows.filter((id) => id !== tvShowId);
      }

      localStorage.setItem("watchList", JSON.stringify(watchList));
      return watchList;
    },
  },
};
