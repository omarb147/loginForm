const db = require("../../db");
const { findUserOrInsert } = require("../../Models/users");
const dotenv = require("dotenv");
dotenv.config();

//FACEBOOK STRATEGY IMPLEMENTATION
const FacebookStrategy = require("passport-facebook");
const facebookAuthStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    await findUserOrInsert(
      profile.id,
      { identifier: profile.id, provider: profile.provider },

      (user, error) => {
        if (user) return done(null, user);
        if (error) {
          return done(error);
        }
      }
    );
  }
);

module.exports = { facebookAuthStrategy };
