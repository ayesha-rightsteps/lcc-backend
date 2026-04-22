import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const users = await mongoose.connection.collection('users').find({ role: 'admin' }).toArray();
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
});
