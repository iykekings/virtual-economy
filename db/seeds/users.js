exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { firstName: 'Jon', lastName: 'Doe', email: 'john@doe.com' },
        { firstName: 'Sam', lastName: 'Smith', email: 'sam@smith.com' },
        { firstName: 'Geralt', lastName: 'Rivia', email: 'geralt@rivia.com' },
      ]);
    });
};
