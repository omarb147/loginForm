const passport = require("passport");
const Passport = passport.initialize();

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  let user = await db("login")
    .where("id", id)
    .first();
  done(null, user);
});

//AUTH STRATEGIES
const { locaAuthStrategy } = require("./Strategies/LocalStrategy");
const { facebookAuthStrategy } = require("./Strategies/FacebookStrategy");
const { googleAuthStrategy } = require("./Strategies/GoogleStrategy");
const jwtAuthStrategy = require("./Strategies/JWTStrategy");
console.log(jwtAuthStrategy);
passport.use(jwtAuthStrategy);
passport.use(locaAuthStrategy);
passport.use(facebookAuthStrategy);
passport.use(googleAuthStrategy);

module.exports = Passport;
