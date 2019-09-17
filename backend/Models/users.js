const { db, TABLES } = require("../db");

exports.findUserOrInsert = async (identifier, credentials = {}, callback) => {
  try {
    const existingUser = await db(TABLES.USERS)
      .where("identifier", identifier)
      .first();

    if (!existingUser && Object.keys(credentials).length > 0) {
      try {
        const newUser = await db(TABLES.USERS).insert(credentials);

        return callback((data = newUser), (error = null));
      } catch (error) {
        return callback((data = null), error);
      }
    }

    if (!existingUser) return callback((data = null), (error = null));

    return callback((data = existingUser), (error = null));
  } catch (error) {
    return callback((data = null), error);
  }
};
