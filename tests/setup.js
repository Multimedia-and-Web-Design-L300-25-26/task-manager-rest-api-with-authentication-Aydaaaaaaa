import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  try {
    // Newer mongoose/mongodb drivers no longer accept the old connection options
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
});