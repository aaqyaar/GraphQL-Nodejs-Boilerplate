'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.startApolloServer = void 0;
// npm install @apollo/server express graphql cors body-parser
const server_1 = require('@apollo/server');
const express4_1 = require('@apollo/server/express4');
const drainHttpServer_1 = require('@apollo/server/plugin/drainHttpServer');
const express_1 = __importDefault(require('express'));
const http_1 = __importDefault(require('http'));
const cors_1 = __importDefault(require('cors'));
const body_parser_1 = require('body-parser');
const schema_1 = __importDefault(require('./schema'));
console.log(schema_1.default);
const startApolloServer = (PORT) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const server = new server_1.ApolloServer({
      typeDefs: schema_1.default,
      plugins: [
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({
          httpServer,
        }),
      ],
    });
    yield server.start();
    app.use(
      '/graphql',
      (0, cors_1.default)(),
      (0, body_parser_1.json)(),
      (0, express4_1.expressMiddleware)(server, {
        context: ({ req }) =>
          __awaiter(void 0, void 0, void 0, function* () {
            return { token: req.headers.token };
          }),
      })
    );
    yield new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
exports.startApolloServer = startApolloServer;
