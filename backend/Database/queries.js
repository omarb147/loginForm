const db = require("./db");

const findLoginOrInsert = async (identifier, credentials = {}, callback) => {
  try {
    const existingUser = await db("login")
      .where("identifier", identifier)
      .first();

    if (!existingUser && Object.keys(credentials) > 0) {
      try {
        const newUser = await db("login").insert(credentials);
        return cb((data = newUser), (error = null));
      } catch (error) {
        return cb((data = null), error);
      }
    }

    if (!existingUser) return callback((data = null), (error = null));

    return callback((data = existingUser), (error = null));
  } catch (error) {
    return callback((data = null), error);
  }
};

module.exports = findLoginOrInsert;