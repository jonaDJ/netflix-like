import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./src/graphql/schema.js";
import { resolvers } from "./src/graphql/resolver.js";

const app = express();
const PORT = process.env.PORT || 5000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  formatError: (error) => {
    console.error(error);
    return new Error("Internal server error");
  },
});

await apolloServer.start();

apolloServer.applyMiddleware({ app, path: "/graphql" });

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
