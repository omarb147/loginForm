const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

//GOOGLE STRATEGY IMPLEMENTATION
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await db("login")
          .where("identifier", profile.emails[0].value)
          .first();

        if (!existingUser) {
          await db("login")
            .insert({ identifier: profile.emails[0].value, service: profile.provider })
            .returning()
            .then(user => {
              return done(null, user);
            })
            .catch(err => console.log(err));
        }
        done(null, existingUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
