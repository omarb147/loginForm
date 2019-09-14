const db = require("../../db");
const findLoginOrInsert = require("../../Models/users");
const dotenv = require("dotenv");
dotenv.config();

//FACEBOOK STRATEGY IMPLEMENTATION
const FacebookStrategy = require("passport-facebook");

const facebookAuthStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4000/auth/facebook/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    await findLoginOrInsert(
      profile.id,
      { identifier: profile.id, service: profile.provider },

      (user, error) => {
        if (user) return done(null, user);
        if (error) {
          console.log(error);
          return done(error);
        }
      }
    );
  }
);

module.exports = { facebookAuthStrategy };
