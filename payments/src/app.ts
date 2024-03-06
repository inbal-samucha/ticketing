import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser  } from '@inbaltickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);// because i use ingress ingnix

app.use(express.json());
app.use(
  cookieSession({
    signed: false, //In order not to encrypt the content of the cookie (JWT is encrypted)
    secure: process.env.NODE_ENV !=='test' //Use only https exclude test environment
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }