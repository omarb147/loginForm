const dotenv = require("dotenv");
const db = require("../../Database/db");
const bcrypt = require("bcrypt");
dotenv.config();

//SERIALISE USER FUNCTION

// LOCAL STRATEGY IMPLEMENTATION
const LocalStrategy = require("passport-local").Strategy;

const locaAuthStrategy = new LocalStrategy({ usernameField: "identifier" }, async (username, password, done) => {
  try {
    const user = await db("login")
      .where("identifier", username)
      .first();

    if (!user) return done(null, false, { message: "Incorrect Email" });
    const passwordAuth = await bcrypt.compare(password, user.hash);

    if (!passwordAuth) return done(null, false, { message: "Incorrect Password" });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = { locaAuthStrategy };
