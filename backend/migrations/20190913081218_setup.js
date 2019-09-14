exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable("users", function(table) {
      table
        .increments("id")
        .primary()
        .index();
      table
        .string("identifier", 100)
        .unique()
        .index();
      table.string("password_hash", 100);
      table.string("provider");
      table.integer("profile_id").references("profile.id");
    }),
    knex.schema.createTable("profile", function(table) {
      table
        .increments("id")
        .primary()
        .index();
      table.string("name");
      table.string("image");
      table.string("bio");
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([knex.schema.dropTable("users"), knex.schema.dropTable("profile")]);
};
