const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const {
  makeRestaurantsArray,
  makeMaliciousRestaurant
  //dateParse //If date parsing necessary
} = require('./restaurant.fixtures');

describe('Restaurants Endpoints', function() {
  let db;
  before('make knex instance to simulate server', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean tables before each test', () => {
    return db.raw('TRUNCATE restaurants RESTART IDENTITY CASCADE');
  });

  afterEach('clean tables after each test', () => {
    return db.raw('TRUNCATE restaurants RESTART IDENTITY CASCADE');
  });

  //test home page
  describe('GET /api/restaurant', () => {
    context('restaurant table has no contents', () => {
      it('Responds with a 200 status and an empty array', () => {
        return supertest(app)
          .get('/api/restaurant')
          .expect(200, []);
      });
    });

    context('restaurant table has some restaurant', () => {
      const testRestaurants = makeRestaurantsArray();

      beforeEach('populate table with restaurant', () => {
        return db.into('restaurants').insert(testRestaurants);
      });

      afterEach('clean restaurants table', () => {
        return db.raw(
          'TRUNCATE restaurants RESTART IDENTITY CASCADE'
        );
      });

      //test if table could receive all testing data
      it('responds with an array containing all test restaurant', () => {
        return supertest(app)
          .get('/api/restaurant')
          .expect(200, testRestaurants);
      });

      context('given an XSS attack restaurant in name', () => {
        const { maliciousRestaurant, expectedRestaurant } = makeMaliciousRestaurant();
        beforeEach('insert malicious restaurant', () => {
          return db.into('restaurants').insert([maliciousRestaurant]);
        });
        afterEach('clean restaurant table', () => {
          return db.raw(
            'TRUNCATE restaurants RESTART IDENTITY CASCADE'
          );
        });

        it('removes XSS attack content (<script> to &lt;script&gt)', () => {
          let expectedRestaurants = testRestaurants;
          expectedRestaurants.splice(3, 1, expectedRestaurant);
          return supertest(app)
            .get('/api/restaurant')
            .expect(200)
            .expect(res => {
              expect(res.body[3].name).to.eql(expectedRestaurant.name);
            });
        });
      });
    });
  });

  //test selected restaurants
  describe('GET /api/restaurant/id', () => {
    context(
      'given restaurant table has no contents or no restaurant ids match given id',
      () => {
        it('Responds with a 404', () => {
          const id = 1000;
          return supertest(app)
            .get(`/api/restaurant/${id}`)
            .expect(404, { error: { message: 'No matching restaurant' } });
        });
      }
    );

    context('restaurant table has some restaurant', () => {
      const testRestaurants = makeRestaurantsArray();

      beforeEach('populate table with restaurant', () => {
        return db.into('restaurants').insert(testRestaurants);
      });

      afterEach('clean restaurant table', () => {
        return db.raw(
          'TRUNCATE restaurants RESTART IDENTITY CASCADE'
        );
      });

      it('given valid id, responds with a restaurant with matching id.', () => {
        const expectedId = testRestaurants[1].id,
          expectedRestaurant = testRestaurants[1];

        return supertest(app)
          .get(`/api/restaurant/${expectedId}`)
          .expect(res => {
            expect(res.body.name).to.eql(expectedRestaurant.name);
          });
      });
    });

    context('given an XSS attack restaurant in name (<script>)', () => {
      const { maliciousRestaurant, expectedRestaurant } = makeMaliciousRestaurant();
      beforeEach('insert malicious restaurant', () => {
        return db.into('restaurants').insert([maliciousRestaurant]);
      });

      afterEach('clean restaurant table', () => {
        return db.raw(
          'TRUNCATE restaurants RESTART IDENTITY CASCADE'
        );
      });

      it('removes XSS attack in name (<script> becomes &lt;script&gt)', () => {
        return supertest(app)
          .get(`/api/restaurant/${maliciousRestaurant.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedRestaurant.name);
          });
      });
    });
  });
});