import { connectDB } from './Database/db.js';
import { User } from './models/userModel.js';
import dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });

async function checkUsers() {
  await connectDB();
  const u = await User.create({name:'t',email:'t'+Date.now()+'@t.com',password:'password',role:'Customer',isEmailVerified:false});
  console.log(u);
  process.exit();
}
checkUsers();
