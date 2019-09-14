const knex = require("knex");
const environment = "development";
config = require("./knexfile");

exports.db = knex(config[environment]);

exports.TABLES = {
  USERS: "users",
  PROFILE: "profile"
};
