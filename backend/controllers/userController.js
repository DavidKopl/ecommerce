import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import bcrypt from 'bcryptjs';

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  //console.log(username, email, password);

  if (!username || !email || !password) {
    throw new Error('Please fill all the inputs');
  }

  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send('User already exists');
  //Encripting
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create User
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ _id: newUser.id, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin, password: newUser.password });
  } catch (err) {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export { createUser };
