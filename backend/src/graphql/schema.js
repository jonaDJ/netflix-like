import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    overview: String
    type: String
    releaseDate: String
    rating: Float
    posterPath: String
    backdropPath: String
    genres: [String!]!
    runtime: Int
    cast: [CastMember!]!
    trailerUrl: String
    languages: [String!]!
    countries: [String!]!
  }

  type TVShow {
    id: ID!
    title: String!
    overview: String
    type: String
    releaseDate: String
    rating: Float
    posterPath: String
    backdropPath: String
    genres: [String!]!
    numberOfSeasons: Int
    numberOfEpisodes: Int
    cast: [CastMember!]!
    trailerUrl: String
    languages: [String!]!
    countries: [String!]!
  }

  type CastMember {
    name: String!
  }

  union Content = Movie | TVShow

  type Query {
    popularContentOfTheDay: Content!
    contentByGenre(genre: String!, contentType: String): [Content!]!
    search(query: String!): [Content!]!
    moviesByIds(ids: [ID!]!): [Movie!]!
    contentPreview(id: ID!, type: String!): Content!
    top10: [Content!]!

    # New queries
    comingThisWeek: [Content!]! # Content releasing this week
    comingNextWeek: [Content!]! # Content releasing next week
    newContent: [Content!]! # Recently released content (e.g., within the last 30 days)
  }
`;
