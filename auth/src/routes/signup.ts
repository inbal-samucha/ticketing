import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError, validateRequset } from '@inbaltickets/common';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20})
    .withMessage('Password must be between 4 and 20 characters')
], 
validateRequset,  
async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser){
    throw new BadRequestError('Email in used');
  }

  const newUser = User.build({ email, password });
  await newUser.save();

  // Generate JWT
  const userJwt = jwt.sign(
    {
    id: newUser.id,
    email: newUser.email
    }, 
    process.env.JWT_KEY! //The exclamation mark (!) tells typescript that we have already performed the test that all our environment variables are set
  );

  // Store it on session object
  req.session = {
    jwt: userJwt
  };

  res.status(201).send(newUser);
});

export { router as signupRouter };