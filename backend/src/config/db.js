import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.log('Unable to connect to Database');
    console.log('Error: ', error);
    process.exit(1);
  }
};

export default connectDB;