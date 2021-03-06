const passport = require("passport");
const PassportSession = passport.session();
const Passport = passport.initialize();
const { db, TABLES } = require("../db");

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  let user = await db(TABLES.USERS)
    .where("id", id)
    .first();
  done(null, user);
});

//AUTH STRATEGIES
const { localAuthStrategy } = require("./Strategies/LocalStrategy");
const { facebookAuthStrategy } = require("./Strategies/FacebookStrategy");
const { googleAuthStrategy } = require("./Strategies/GoogleStrategy");
// const jwtAuthStrategy = require("./Strategies/JWTStrategy");
// passport.use(jwtAuthStrategy);
passport.use(localAuthStrategy);
passport.use(facebookAuthStrategy);
passport.use(googleAuthStrategy);

module.exports = { Passport, PassportSession };
