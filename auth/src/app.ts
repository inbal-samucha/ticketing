import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@inbaltickets/common';

const app = express();
app.set('trust proxy', true);// because i use ingress ingnix

app.use(express.json());
app.use(
  cookieSession({
    signed: false, //In order not to encrypt the content of the cookie (JWT is encrypted)
    secure: process.env.NODE_ENV !=='test' //Use only https exclude test environment
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }