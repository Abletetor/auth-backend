import { connect } from 'mongoose';
import { config } from 'dotenv';

config();

const connectDB = async () => {
   try {
      await connect(process.env.MONGODB_URI);
      console.log('DB connection established');

   } catch (error) {
      console.error('DB connection failed', error);
      process.exit(1);
   }
};

export default connectDB;