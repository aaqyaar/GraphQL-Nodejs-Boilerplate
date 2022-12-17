'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const apollo_1 = require('./graphql/apollo');
const PORT = Number(process.env.PORT);
(0, apollo_1.startApolloServer)(PORT);
