const request = require('supertest');
const app = require('../src/app');
const { connect, closeDatabase, clearDatabase } = require('./setup');

let userToken;
let adminToken;

async function registerAndLogin(email, role) {
  await request(app).post('/api/auth/register').send({name:'Test User',email, password: 'password123', role });
  const res = await request(app).post('/api/auth/login').send({name:'Test User',email, password: 'password123' });
  return res.body.token;
}

beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  userToken = await registerAndLogin('user@example.com', 'user');
  adminToken = await registerAndLogin('admin@example.com', 'admin');
});

afterEach(async () => clearDatabase());
afterAll(async () => closeDatabase());

describe('Vehicle CRUD', () => {
  it('should reject requests without a token', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.statusCode).toBe(401);
  });

  it('should create a vehicle when authenticated', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });

    expect(res.statusCode).toBe(201);
    expect(res.body.make).toBe('Toyota');
    expect(res.body.quantity).toBe(5);
  });

  it('should list all vehicles', async () => {
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 });

    const res = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should search vehicles by make and price range', async () => {
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Ford', model: 'Focus', category: 'Hatchback', price: 18000, quantity: 2 });
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Ford', model: 'Mustang', category: 'Sports', price: 45000, quantity: 1 });

    const res = await request(app)
      .get('/api/vehicles/search?make=Ford&maxPrice=20000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe('Focus');
  });

  it('should allow a regular user to update a vehicle', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Mazda', model: '3', category: 'Sedan', price: 21000, quantity: 4 });

    const res = await request(app)
      .put(`/api/vehicles/${create.body._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 19999 });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(19999);
  });

  it('should reject vehicle deletion by a non-admin user', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Kia', model: 'Rio', category: 'Sedan', price: 17000, quantity: 2 });

    const res = await request(app)
      .delete(`/api/vehicles/${create.body._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('should allow an admin to delete a vehicle', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Kia', model: 'Rio', category: 'Sedan', price: 17000, quantity: 2 });

    const res = await request(app)
      .delete(`/api/vehicles/${create.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});

describe('Purchase & restock', () => {
  it('should decrement quantity on purchase', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Nissan', model: 'Altima', category: 'Sedan', price: 23000, quantity: 1 });

    const res = await request(app)
      .post(`/api/vehicles/${create.body._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(0);
  });

});
