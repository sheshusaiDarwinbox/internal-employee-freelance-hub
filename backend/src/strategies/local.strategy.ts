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
  new LocalStrategy(
    {
      usernameField: "EID",
      passwordField: "password",
    },
    async (EID, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ EID: EID }, { email: EID }],
        });

        if (!user) {
          throw new Error("User not found");
        }
        const isMatch = await comparePassword(password, user.get("password"));
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        if (!user.get("verified")) throw new Error("User Not verified");
        const sessionUser: Express.User = {
          EID: user.get("EID"),
          role: user.get("role"),
        };

        done(null, sessionUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
