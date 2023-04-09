import express, { Request, Response } from 'express';
import path from 'path';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import session from 'express-session';
import morganBody from 'morgan-body';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// import './global';
import { LoggedInUser } from './model/loggedInUse';
import { google } from 'googleapis';

const state = {
  userProfile: {},
  calendars: {},
};

declare global {
  namespace Express {
    interface User {
      id?: string;
    }
  }
}

const isAuthenticated = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const createApp = (db: PrismaClient) => {
  const app = express();

  app.use(express.json());
  morganBody(app);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.get('/success', (req, res) =>
    res.render('pages/success', { user: state.userProfile })
  );
  app.get('/error', (req, res) => res.send('error logging in'));

  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: 'SECRET',
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj: any, cb) => {
    cb(null, obj);
  });

  passport.use(
    new OAuth2Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile,
        done: any
      ) {
        const loggedInUser: LoggedInUser = profile._json;
        console.log({ refreshToken });
        await db.user.upsert({
          where: { id: loggedInUser.sub },
          update: {
            email: loggedInUser.email,
            accessToken,
            refreshToken,
            name: loggedInUser.name,
          },
          create: {
            id: loggedInUser.sub,
            email: loggedInUser.email,
            accessToken,
            refreshToken,
            name: loggedInUser.name,
          },
        });
        state.userProfile = profile;
        return done(null, profile);
      }
    )
  );

  app.get('/', function (req, res) {
    res.render('pages/auth');
  });

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      accessType: 'offline',
      prompt: 'consent',
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/error',
    }),
    function (req, res) {
      // Successful authentication, redirect success.
      res.redirect('/success');
    }
  );

  app.post('/status', (req, res) => {
    res.status(200).json({ message: 'OK' });
  });

  app.get('/profile', isAuthenticated, (req, res) => {
    res.json({ user: req.user });
  });

  app.get('/users', isAuthenticated, async (req, res) => {
    const allUsers = await db.user.findMany();
    res.status(200).json(allUsers);
  });

  app.get('/calendars', isAuthenticated, async (req, res) => {
    const user = await db.user.findUnique({
      where: { id: req.user?.id },
    });
    const accessToken = user?.accessToken || '';
    const gCal = google.calendar({ version: 'v3', auth: accessToken });
    console.log(gCal.calendarList.list());
    res.status(200).json({});
  });
  return app;
};

export { createApp };
