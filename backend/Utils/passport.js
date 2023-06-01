// import express from "express";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth2";
// import { Strategy as FacebookStrategy } from "passport-facebook";
// import SocialUser from "../Model/userSocialModel.js";

// const GOOGLE_CLIENT_ID =
//   "628055254233-93mib7ha2871m853f1u14hqhps5f5cia.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";
// const FACEBOOK_CLIENT_ID = "604599814951933";
// const FACEBOOK_CLIENT_SECRET = "0280aba3cf4bf6e61867d2d71f6bf9bc";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/api/google/callback",
//       passReqToCallback: true,
//     },
//     async (request, accessToken, refreshToken, profile, done) => {
//       const user = await SocialUser.findOne({ email: profile.emails[0].value });
//       if (user) {
//         return done(null, user);
//       } else {
//         const newUser = new SocialUser({
//           type: "student",
//           isIndividual: true,
//           name: profile.name.givenName + " " + profile.name.familyName,
//           email: profile.emails[0].value,
//           avatar: profile.photos[0].value,
//         });
//         newUser.save();
//         return done(null, accessToken);
//         // return done(null, accessToken);
//       }
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_CLIENT_ID,
//       clientSecret: FACEBOOK_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/api/facebook/callback",
//       profileFields: ["name", "email", "picture"], // ["emails", "displayName", "name", "picture"],
//     },
//     async (request, accessToken, refreshToken, profile, done) => {
//       const user = await SocialUser.findOne({ email: profile.emails[0].value });
//       if (user) {
//         return done(null, user);
//       } else {
//         const newUser = new SocialUser({
//           type: req.body.type,
//           isIndividual: req.body.isIndividual,
//           name: profile.name.givenName + " " + profile.name.familyName,
//           email: profile.emails[0].value,
//           avatar: profile.photos[0].value,
//         });
//         newUser.save();
//         return done(null, accessToken);
//         // return done(null, accessToken);
//       }
//     }
//   )
// );

// passport.serializeUser(async (user, done) => {
//   console.log("SERIALIZE USER ID", user);
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await SocialUser.findById(id);
//     console.log(user);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });
