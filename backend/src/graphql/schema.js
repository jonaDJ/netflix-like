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

  type PageInfo {
    page: Int!
    limit: Int!
    totalResults: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type PaginatedContent {
    items: [Content!]!
    pageInfo: PageInfo!
  }

  union Content = Movie | TVShow

  type Query {
    popularContentOfTheDay: Content!
    contentByGenre(
      genre: String!
      contentType: String
      page: Int = 1
      limit: Int = 20
    ): PaginatedContent!
    search(query: String!, page: Int = 1, limit: Int = 20): PaginatedContent!
    moviesByIds(ids: [ID!]!): [Content!]!
    contentPreview(id: ID!, type: String!): Content!
    top10: [Content!]!

    # New queries
    comingThisWeek: [Content!]! # Content releasing this week
    comingNextWeek: [Content!]! # Content releasing next week
    newContent: [Content!]! # Recently released content (e.g., within the last 30 days)
  }
`;
