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

  //trending movie
  async getTrendingContent() {
    try {
      const res = await this.api.get("/trending/all/day", {
        params: { page: 1, include_adult: false },
      });

      return res.data.results
        .map((item) => {
          if (item.media_type === "movie") {
            return this.transformMovie(item);
          } else if (item.media_type === "tv") {
            return this.transformTVShow(item);
          }
          return null;
        })
        .filter(Boolean); // Remove null values
    } catch (error) {
      console.error("TMDB Trending Content Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return [];
    }
  }

  // Fetch popular movies
  async getPopularMovies(page = 1, region = "US") {
    try {
      const res = await this.api.get("/movie/popular", {
        params: { page, include_adult: false, region },
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

  async getMovieById(movieId) {
    try {
      const res = await this.api.get(`/movie/${movieId}`, {
        params: { append_to_response: "credits,videos" },
      });

      return this.transformMovie(res.data);
    } catch (error) {
      console.error(`Error fetching movie ${movieId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return null;
    }
  }

  async getTVShowById(tvId) {
    try {
      const res = await this.api.get(`/tv/${tvId}`, {
        params: { append_to_response: "credits,videos" },
      });

      return this.transformTVShow(res.data);
    } catch (error) {
      console.error(`Error fetching TV show ${tvId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return null;
    }
  }

  // Transform TMDB movie data into our schema
  transformMovie(tmdbMovie) {
    return {
      __typename: "Movie",
      id: tmdbMovie.id,
      title: tmdbMovie.title || "Untitled",
      overview: tmdbMovie.overview || "No description available",
      type: "movie",
      releaseDate: tmdbMovie.release_date || "Unknown",
      rating: tmdbMovie.vote_average || 0,
      posterPath: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "/placeholder.jpg",
      backdropPath: tmdbMovie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`
        : "/placeholder-horizontal.jpg",
      genres:
        tmdbMovie.genre_ids ||
        (tmdbMovie.genres ? tmdbMovie.genres.map((g) => g.id.toString()) : []),
      runtime: tmdbMovie.runtime || 0,
      cast:
        tmdbMovie.credits?.cast?.slice(0, 5).map((member) => ({
          name: member.name,
        })) || [],
      trailerUrl: tmdbMovie.videos?.results?.find(
        (video) => video.type === "Trailer"
      )?.key
        ? `https://www.youtube.com/watch?v=${
            tmdbMovie.videos.results.find((video) => video.type === "Trailer")
              .key
          }`
        : null,
      languages: tmdbMovie.spoken_languages?.map((l) => l.name) || [],
      countries: tmdbMovie.production_countries?.map((c) => c.name) || [],
    };
  }

  transformTVShow(tmdbShow) {
    return {
      __typename: "TVShow",
      id: tmdbShow.id,
      title: tmdbShow.name || "Untitled",
      overview: tmdbShow.overview || "No description available",
      type: "tvShow",
      releaseDate: tmdbShow.first_air_date || "Unknown",
      rating: tmdbShow.vote_average || 0,
      posterPath: tmdbShow.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbShow.poster_path}`
        : "/placeholder.jpg",
      backdropPath: tmdbShow.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbShow.backdrop_path}`
        : "/placeholder-horizontal.jpg",
      genres: tmdbShow.genre_ids || [],
      numberOfSeasons: tmdbShow.number_of_seasons || 0,
      numberOfEpisodes: tmdbShow.number_of_episodes || 0,
      cast:
        tmdbShow.credits?.cast?.slice(0, 5).map((member) => ({
          name: member.name,
        })) || [],
      trailerUrl: tmdbShow.videos?.results?.find(
        (video) => video.type === "Trailer"
      )?.key
        ? `https://www.youtube.com/watch?v=${
            tmdbShow.videos.results.find((video) => video.type === "Trailer")
              .key
          }`
        : null,
      languages: tmdbShow.spoken_languages?.map((l) => l.name) || [],
      countries: tmdbShow.production_countries?.map((c) => c.name) || [],
    };
  }
}

const tmdbService = new TMDBService();

export default tmdbService;
