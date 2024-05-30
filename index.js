import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./schema.js";
import db from "./_db.js";

const resolvers = {
  Query: {
    games: function () {
      return db.games;
    },
    game: function (_, args) {
      return db.games.find((game) => {
        return game.id === args.id;
      });
    },
    reviews: function () {
      return db.reviews;
    },
    review: function (_, args) {
      return db.reviews.find((review) => {
        return review.id === args.id;
      });
    },
    authors: function () {
      return db.authors;
    },
    author: function () {
      return db.authors.find((author) => {
        return author.id === args.id;
      });
    },
  },
  Game: {
    reviews: function (parent) {
      return db.reviews.filter((review) => {
        return review.game_id === parent.id;
      });
    },
  },
  Author: {
    reviews: function (parent) {
      return db.reviews.filter((review) => {
        return review.author_id === parent.id;
      });
    },
  },
  Review: {
    game: function (parent) {
      return db.games.find((game) => {
        return game.id === parent.game_id;
      });
    },
    author: function (parent) {
      return db.authors.find((author) => {
        return author.id === parent.author_id;
      });
    },
  },
  Mutation: {
    deleteGame: function (_, args) {
      return db.games.filter((game) => {
        return game.id !== args.id;
      });
    },
    addGame: function (_, args) {
      let gameToAdd = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.games.push(gameToAdd);
      return gameToAdd;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`Server ready at: ${url}`);
