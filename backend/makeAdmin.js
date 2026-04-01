import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/userModel.js';

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommercedb');
    const user = await User.findOne({});
    if (user) {
      user.isAdmin = true;
      await user.save();
      console.log(`Successfully elevated ${user.email} to Admin!`);
    } else {
      console.log('No user found to elevate.');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

makeAdmin();
