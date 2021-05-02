const express = require('express'),
  path = require('path')
  xss = require('xss'),
  restaurantService = require('./restaurant-service'),
  restaurantRouter = express.Router(),
  jsonParser = express.json();

const serializeRestaurant = restaurant => ({
  id: restaurant.id,
  the_restaurant: xss(restaurant.the_restaurant),
  type: xss(restaurant.type)
});

//home page route
restaurantRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    restaurantService.getAllRestaurants(knexInstance)
      .then(restaurants => {
        res.json(restaurants.map(serializeRestaurant));
      })
      .catch(next);
  }) 
  .post(jsonParser, (req, res, next) => {
    const { the_restaurant, type } = req.body,
      newRestaurant = { the_restaurant, type };

    for (const [key, value] of Object.entries(newRestaurant)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }
 
    restaurantService.insertRestaurant(req.app.get('db'), newRestaurant)
      .then(restaurant => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${restaurant.id}`))
          .json(serializeRestaurant(restaurant));
      })
      .catch(next);
  });

// individual restaurants
restaurantRouter
  .route('/:restaurantid')
  .all((req, res, next) => {
    restaurantService.getById(req.app.get('db'), req.params.restaurantid)
      .then(restaurant => {
        if (!restaurant) {
          return res.status(404).json({
            error: { message: 'No matching restaurant' }
          });
        }
        res.restaurant = restaurant;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeRestaurant(res.restaurant));
  })
  // edit selected restaurant
  .patch(jsonParser, (req, res, next) => {
    console.log('patch')
    const { the_restaurant, type } = req.body,
    restaurantToEdit = { the_restaurant, type };
    
    const numberOfValues = Object.values(restaurantToEdit).filter(Boolean).length;
    if (numberOfValues === 0)
    return res.status(400).json({
      error: { message: 'Body must contain a restaurant/type.' }
    });
    
    restaurantService.editRestaurant(
      req.app.get('db'),
      req.params.restaurantid,
      restaurantToEdit
      )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
    })
    // delete selected restaurant
    .delete((req, res, next) => {
      restaurantService.deleteRestaurant(req.app.get('db'), req.params.restaurantid)
        .then(() => {
          res.status(204).end();
        })
        .catch(next);
    })
    
module.exports = restaurantRouter