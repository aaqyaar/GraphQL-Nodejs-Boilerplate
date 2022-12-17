import 'dotenv/config';
import { startApolloServer } from './graphql/apollo';
import { connectDB } from './config/connectDB';

const PORT = Number(process.env.PORT) || 8000;
connectDB();
startApolloServer(PORT);
