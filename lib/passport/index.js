import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../../models/users.js";
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
  // passport.use(new JWTStrategy({
  //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //   secretOrKey: process.env.JWTSECRET,
  // }, async (jwtPayload, done) => {
  //   try {
  //     const user = await User.findById(jwtPayload._id);
  //     return done(null, user);
  //   } catch (err) {
  //     return done(err);
  //   }
  // }))
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