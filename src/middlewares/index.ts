import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users'

export const isOwner = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {    
    const { id } = req.params;
    const currentUserId = get(req, 'identity') as unknown as string;

    if (!currentUserId) {
      console.log('no current user');
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      console.log('current user id is different');
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const isAuthenticated = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken = req.cookies['DOG-AUTH'];

    if (!sessionToken) {      
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    
    if (!existingUser) {      
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser._id });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}