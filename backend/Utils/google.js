import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import SocialStudent from "../Model/UserSocialModel/studentModel.js";
import SocialTeacher from "../Model/UserSocialModel/teacherModel.js";
import { defineSocialUser, getSocialUser } from "../Middleware/log.js";

const GOOGLE_CLIENT_ID =
  "628055254233-93mib7ha2871m853f1u14hqhps5f5cia.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const user = await getSocialUser(profile.emails[0].value);

      if (user) {
        return done(null, user);
      } else {
        const isType = defineSocialUser(request.body.type);
        const newUser = new isType({
          type: request.body.type,
          isIndividual: request.body.isIndividual,
          name: profile.name.givenName + " " + profile.name.familyName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        newUser.save();
        return done(null, accessToken, refreshToken);
      }
    }
  )
);

passport.serializeUser(async (user, done) => {
  console.log("SERIALIZE USER ID", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await SocialUser.findById(id);
    console.log(user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const googleRouter = express.Router();

googleRouter.get(
  "/",
  passport.authenticate("google", { scope: ["profile email"] })
);

googleRouter.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

googleRouter.get("/logout", async (req, res, next) => {
  console.log("1");
  req.logout((err) => {
    console.log("2");
    if (err) return next(err);
    console.log("3");
    res.redirect("/");
    console.log("4");
  });
});

export default googleRouter;
