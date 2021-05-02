const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "Dietitian Restaurant Locator Server Running"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Dietitian Restaurant Locator Server Running')
  })
})