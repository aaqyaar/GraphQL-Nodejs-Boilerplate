import { startApolloServer } from './graphql/apollo';

const PORT = Number(process.env.PORT);

startApolloServer(PORT);
