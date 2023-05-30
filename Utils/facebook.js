import express from "express";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import SocialStudent from "../Model/UserSocialModel/studentModel.js";
import SocialTeacher from "../Model/UserSocialModel/teacherModel.js";

const FACEBOOK_CLIENT_ID = "604599814951933";
const FACEBOOK_CLIENT_SECRET = "0280aba3cf4bf6e61867d2d71f6bf9bc";

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/facebook/callback",
      profileFields: ["name", "email", "picture"], // ["emails", "displayName", "name", "picture"],
    },
    async (request, accessToken, refreshToken, profile, done) => {
      //  (await SocialTeacher.findOne({ email: req.body.email }))
      // ? await SocialTeacher.findOne({ email: profile.emails[0].value })
      const user = await SocialStudent.findOne({
        email: profile.emails[0].value,
      });

      if (user) {
        return done(null, user);
      } else {
        const newUser = new SocialStudent({
          // type: request.body.type,
          // isIndividual: request.body.isIndividual,
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

const facebookRouter = express.Router();

facebookRouter.get(
  "/",
  passport.authenticate("facebook", { scope: ["email"] })
);

facebookRouter.get(
  "/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect("/");
  }
);

facebookRouter.get("/logout", async (req, res, next) => {
  console.log("1");
  req.logout((err) => {
    console.log("2");
    if (err) return next(err);
    console.log("3");
    res.redirect("/");
    console.log("4");
  });
});

export default facebookRouter;
