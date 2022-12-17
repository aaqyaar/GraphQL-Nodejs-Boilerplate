import 'dotenv/config';
import { startApolloServer } from './graphql/apollo';

const PORT = Number(process.env.PORT) || 8000;

startApolloServer(PORT);
