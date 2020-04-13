exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.integer('balance').defaultTo(0);
      table.string('firstName', 255).notNullable();
      table.string('lastName', 255).notNullable();
    })
    .createTable('transactions', (table) => {
      table.increments('id');
      table.float('amount').notNullable();
      table
        .integer('donorId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('receiverId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('transactions');
};
