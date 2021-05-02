module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://yliang1462@localhost/dietitians-restaurant-locator-server',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://yliang1462@localhost/dietitians-restaurant-locator-server-test'
}

// https://desolate-refuge-01917.herokuapp.com/

// postgresql-polished-03173