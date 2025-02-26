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
    contentByGenre(genre: String!): [Content!]!
    search(query: String!): [Content!]!
    moviesByIds(ids: [ID!]!): [Movie!]!
    contentPreview(id: ID!, type: String!): Content!
    top10Movies: [Movie!]!
  }
`;
