const db = require("../../db");
const findLoginOrInsert = require("../../Models/users");
const dotenv = require("dotenv");
dotenv.config();

//GOOGLE STRATEGY IMPLEMENTATION
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const googleAuthStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;

    findLoginOrInsert(email, { identifier: email, service: profile.provider }, (user, error) => {
      if (user) return done(null, user);
      if (error) {
        console.log(error);
        return done(error);
      }
    });
  }
);

module.exports = { googleAuthStrategy };
