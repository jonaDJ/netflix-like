import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class TMDBService {
  constructor() {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is missing in .env");
    }

    this.api = axios.create({
      baseURL: process.env.TMDB_BASE_URL,
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: "en-US",
      },
    });
  }

  // Fetch popular movies
  async getPopularMovies() {
    try {
      const res = await this.api.get("/movie/popular", {
        params: { page: 1, include_adult: false },
      });
      return res.data.results.map(this.transformMovie);
    } catch (error) {
      console.error("TMDB Popular Movies Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return [];
    }
  }

  // Fetch popular TV shows
  async getPopularShows() {
    try {
      const res = await this.api.get("/tv/popular", {
        params: { page: 1, include_adult: false },
      });
      return res.data.results.map(this.transformTVShow);
    } catch (error) {
      console.error("TMDB Popular Shows Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return [];
    }
  }

  // Fetch movies by genre
  async getMoviesByGenre(genreId) {
    try {
      console.log("Fetching movies by genre ID:", genreId);
      const res = await this.api.get("/discover/movie", {
        params: { with_genres: genreId, page: 1, include_adult: false },
      });

      return res.data.results.map(this.transformMovie);
    } catch (error) {
      console.error("TMDB Movies by Genre Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return [];
    }
  }

  // Fetch TV shows by genre
  async getShowsByGenre(genreId) {
    try {
      console.log("Fetching TV shows by genre ID:", genreId);
      const res = await this.api.get("/discover/tv", {
        params: { with_genres: genreId, page: 1, include_adult: false },
      });
      return res.data.results.map(this.transformTVShow);
    } catch (error) {
      console.error("TMDB Shows by Genre Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return [];
    }
  }

  // Search for movies
  async searchMovies(query) {
    try {
      const res = await this.api.get("/search/movie", {
        params: { query, page: 1, include_adult: false },
      });
      return res.data.results.map(this.transformMovie);
    } catch (error) {
      console.error("TMDB Search Movies Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return [];
    }
  }

  // Search for TV shows
  async searchShows(query) {
    try {
      const res = await this.api.get("/search/tv", {
        params: { query, page: 1, include_adult: false },
      });
      return res.data.results.map(this.transformTVShow);
    } catch (error) {
      console.error("TMDB Search Shows Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return [];
    }
  }

  // Transform TMDB movie data into our schema
  transformMovie(tmdbMovie) {
    return {
      __typename: "Movie",
      id: tmdbMovie.id,
      title: tmdbMovie.title || "Untitled",
      overview: tmdbMovie.overview || "No description available",
      releaseDate: tmdbMovie.release_date || "Unknown",
      rating: tmdbMovie.vote_average || 0,
      posterPath: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "/placeholder.jpg",
      backdropPath: tmdbMovie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`
        : "/placeholder-horizontal.jpg",
      slug:
        tmdbMovie.title
          ?.toLowerCase()
          ?.replace(/[^a-z0-9]/g, "-")
          ?.replace(/-+/g, "-") || `movie-${tmdbMovie.id}`,
      genres: tmdbMovie.genre_ids || [],
    };
  }

  transformTVShow(tmdbShow) {
    return {
      __typename: "TVShow",
      id: tmdbShow.id,
      title: tmdbShow.name || "Untitled",
      overview: tmdbShow.overview || "No description available",
      releaseDate: tmdbShow.first_air_date || "Unknown",
      rating: tmdbShow.vote_average || 0,
      posterPath: tmdbShow.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbShow.poster_path}`
        : "/placeholder.jpg",
      backdropPath: tmdbShow.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbShow.backdrop_path}`
        : "/placeholder-horizontal.jpg",
      slug:
        tmdbShow.name
          ?.toLowerCase()
          ?.replace(/[^a-z0-9]/g, "-")
          ?.replace(/-+/g, "-") || `tvshow-${tmdbShow.id}`,
      genres: tmdbShow.genre_ids || [],
      seasons: tmdbShow.seasons || [],
    };
  }
}

const tmdbService = new TMDBService();

export default tmdbService;
