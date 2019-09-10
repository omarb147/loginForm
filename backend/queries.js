const knex = require("knex");

const getAllUsers = async () => {
  try {
    return data;
  } catch (err) {
    console.log(err);
    return "hello";
  }
};

module.exports = { getAllUsers };
