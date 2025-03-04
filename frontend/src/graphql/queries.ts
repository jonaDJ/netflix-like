export const POPULAR_CONTENT_QUERY = `
  query {
    popularContentOfTheDay {
      ... on Movie {
        id
        title
        backdropPath
        genres
        overview
        releaseDate
        type
      }
      ... on TVShow {
        id
        title
        backdropPath
        genres
        overview
        releaseDate
        type
      }
    }
  }
`;

export const TOP_10_QUERY = `
  query {
    top10 {
     ... on Movie {
      id
      title
      backdropPath
      genres
      overview
      releaseDate
      type
      rating
      posterPath
      }
    ... on TVShow {
      id
      title
      backdropPath
      genres
      overview
      releaseDate
      type
      rating
      posterPath
      }
    }
  }
`;

export const GENRE_CONTENT_QUERY = (genre: string) => `
  query {
    contentByGenre(genre: "${genre}") {
      ... on Movie {
        id
        title
        backdropPath
        genres
        overview
        releaseDate
        type
      }
      ... on TVShow {
        id
        title
        backdropPath
        genres
        overview
        releaseDate
        type
      }
    }
  }
`;

export const CONTENT_VIDEO_QUERY = (id: string, type: string) => `
  query {
    contentPreview(id: "${id}", type: "${type}") {
      trailerUrl
    }
  }
`;

export const CONTENT_PREVIEW_QUERY = (jbv: string, type: string) => `
  query {
    contentPreview(id: "${jbv}", type: "${type}") {
      ... on Movie {
        id
        title
        backdropPath
        posterPath
        genres
        overview
        releaseDate
        rating
        runtime
        cast {
          name
        }
        trailerUrl
        languages
        countries
        type
      }
      ... on TVShow {
        id
        title
        backdropPath
        posterPath
        genres
        overview
        releaseDate
        rating
        numberOfSeasons
        numberOfEpisodes
        cast {
          name
        }
        trailerUrl
        languages
        countries
        type
      }
    }
  }
`;

export const MOVIES_BY_IDS_QUERY = `
  query GetMoviesByIds($ids: [ID!]!) {
    moviesByIds(ids: $ids) {
      id
      title
      overview
      releaseDate
      rating
      posterPath
      backdropPath
      genres
      type
    }
  }
`;

export const COMING_THIS_WEEEK = `
  query {
    comingThisWeek {
      ... on Movie {
      id
      title
      backdropPath
      genres
      overview
      releaseDate
      type
      rating
     }
      ... on TVShow {
      id
      title
      backdropPath
      genres
      overview
      releaseDate
      type
      rating
     }
    }
  }
`;

export const COMING_NEXT_WEEEK = `
 query {
    comingNextWeek {
      ... on Movie {
      id
      title
      backdropPath
      genres
      overview
      releaseDate
      type
      rating
     }
      ... on TVShow {
      id
      title
      backdropPath
      genres
      overview
      releaseDate
      type
      rating
     }
    }
  }
`;

export const NEW_CONTENT = `
  query {
    newContent   {
      ... on Movie {
      id
      title
      backdropPath
      genres
      overview
      releaseDate
      type
      rating
     }
      ... on TVShow {
      id
      title
      backdropPath
      genres
      overview
      releaseDate
      type
      rating
     }
    }
  }
`;
