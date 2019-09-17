const dotenv = require("dotenv");
const { db, TABLES } = require("../../db");
const bcrypt = require("bcrypt");
dotenv.config();

//SERIALISE USER FUNCTION

// LOCAL STRATEGY IMPLEMENTATION
const LocalStrategy = require("passport-local").Strategy;

const localAuthStrategy = new LocalStrategy({ usernameField: "identifier" }, async (username, password, done) => {
  try {
    const user = await db(TABLES.USERS)
      .where("identifier", username)
      .first();

    if (!user) return done(null, false, { message: "Incorrect Email" });
    const passwordAuth = await bcrypt.compare(password, user.password_hash);

    if (!passwordAuth) return done(null, false, { message: "Incorrect Password" });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = { localAuthStrategy };
