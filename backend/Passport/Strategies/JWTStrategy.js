const dotenv = require("dotenv");
const db = require("../../db");
const findLoginOrInsert = require("../../Models/users");
dotenv.config();

//JWT STRATEGY IMPLEMENTATION
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtAuthStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async function(jwtPayload, done) {
    done(null, jwtPayload);
  }
);

module.exports = jwtAuthStrategy;
