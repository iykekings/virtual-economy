exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.integer('balance').defaultTo(0);
      table.string('firstName', 255).notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('lastName', 255).notNullable();
    })
    .createTable('transactions', (table) => {
      table.increments('id');
      table.float('amount').notNullable();
      // pass precision to now() fn only with postgres - throws in sqlite
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.string('reference').notNullable();
      table
        .integer('donorId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users');
      table
        .integer('receiverId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('transactions');
};
