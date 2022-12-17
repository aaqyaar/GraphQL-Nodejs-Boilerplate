import mongoose from 'mongoose';

interface ConnectOptions extends mongoose.MongooseOptions {
  bufferCommands?: boolean;
  user?: string;
  pass?: string;
  autoIndex?: boolean;
  autoCreate?: boolean;
}
export const connectDB = async () => {
  try {
    const conn: any = await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log(`MongoDB Connected: ${conn.connection.host} 🌍`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
