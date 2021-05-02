const restaurantService = {
  //display all restaurant
  getAllRestaurants(knex) {
    return knex.select('*').from('restaurants');
  },
  //add new restaurant
  insertRestaurant(knex, newRestaurant) {
    return knex
      .insert(newRestaurant)
      .into('restaurants')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  //getting into selected restaurant
  getById(knex, id) {
    return knex
      .from('restaurants')
      .select('*')
      .where({ id })
      .first();
  },

  //delete selected restaurant
  deleteRestaurant(knex, id) {
    console.log(id)
    return knex('restaurants').where({ id }).delete();
  },

  //edit selected restaurant
  editRestaurant(knex, id, editedRestaurant) {
    return knex('restaurants')
      .where({ id })
      .update(editedRestaurant);
  }
};

module.exports = restaurantService;