import express from 'express';
import { currentUser } from '@inbaltickets/common';


const router = express.Router();

router.get('/api/users/currentuser', currentUser,  (req, res) => {
  res.send({currentUser: req.currentUser || null}); //If there isn't current user in req send null
});

export { router as currentUserRouter };