const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

//FACEBOOK STRATEGY IMPLEMENTATION
const FacebookStrategy = require("passport-facebook");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:4000/auth/facebook/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await db("login")
          .where("identifier", profile.id)
          .first();

        if (!existingUser) {
          await db("login")
            .insert({ identifier: profile.id, service: profile.provider })
            .returning()
            .then(user => done(null, user))
            .catch(err => console.log(err));
        }
        return done(null, existingUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
