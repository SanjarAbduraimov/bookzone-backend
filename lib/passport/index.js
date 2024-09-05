import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../../models/users.js";
import { SECRET_KEY } from "../../config/keys.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { nanoid } from "nanoid";
export default (config) => {
  passport.use(new LocalStrategy({ usernameField: "email" }, async function verify(email, password, done) {
    try {
      const user = await User.findOne({ email }, "+password")
      if (!user) return done(null, false, { message: 'Incorrect email or password.' })
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      return done(null, user)
    } catch (err) {
      done(err);
    }
  }))

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
    passReqToCallback: true,
  }, async (req, jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload._id);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }))

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    // scope: ["profile", "email"],
    passReqToCallback: true
  }, async function (req, accessToken, refreshToken, profile, cb) {
    let user = await User.findOne({ email: profile._json.email });
    if (!user) {
      user = new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile._json.email,
        // Set default or placeholder values for required fields
        phone: nanoid(12),
        password: nanoid(8), // You might store a placeholder or generate a random password
        role: 'reader', // or prompt the user later to choose their role
        verified: true,
        google: profile._json,
        completed: false
      });
      await user.save();
    } else {
      if (!user?.google?.email) {
        user.google = profile._json
        user.verified = true
        await user.save()
      }
    }
    return cb(null, user);
  }))
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  return passport
}