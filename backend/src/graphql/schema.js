import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    overview: String
    releaseDate: String
    rating: Float
    posterPath: String
    backdropPath: String
    slug: String!
    genres: [String!]!
  }

  type TVShow {
    id: ID!
    title: String!
    overview: String
    releaseDate: String
    rating: Float
    posterPath: String
    backdropPath: String
    slug: String!
    genres: [String!]!
  }

  union Content = Movie | TVShow

  type WatchList {
    id: ID!
    movies: [Movie!]!
    tvShows: [TVShow!]!
  }

  type Query {
    popularContentOfTheDay: Content!
    contentByGenre(genre: String!): [Content!]!
    watchList: WatchList!
    search(query: String!): [Content!]!
  }

  type Mutation {
    # Add a movie/show to the watchlist
    addToWatchList(movieId: ID, tvShowId: ID): WatchList!

    # Remove a movie/show from the watchlist
    removeFromWatchList(movieId: ID, tvShowId: ID): WatchList!
  }
`;
