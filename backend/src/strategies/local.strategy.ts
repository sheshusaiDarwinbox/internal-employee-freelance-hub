import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/userAuth.model";
import { comparePassword } from "../utils/password.util";

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser(async (user: Express.User, done) => {
  try {
    const findUser = User.findOne({ EID: user.EID });
    if (!findUser) {
      throw new Error("User not found");
    } else {
      done(null, user);
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(async (EID, password, done) => {
    try {
      const user = await User.findOne({ EID });
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);
