import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { UserModel } from "../../../src/models/users/user-model";
import { mockUser } from '../../mockData'

const app = require('../../../src/index') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
let mongoServer;
let mockUserData;
describe('user-service public', () => {

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, (err) => {
      if (err) console.error(err);
    });
    await UserModel(mockUser).save()
    mockUserData = await request.get('/user',mockUser);
    mockUserData = mockUserData.body[0]
  });


  afterAll(async () => {
    await mongoose.stop();
    await mongoose.disconnect();
  });

  it('should get list of users excluding password', async done => {
    const res = await request.get('/user')
    const result = res.body
    expect(result.length).toEqual(1)
    expect(result[0].username).toEqual("Ikuzen");
    expect(result[0].email).toEqual("blabla@bla.bla");
    expect(result[0].birthdate).toEqual("1970-01-01T00:00:00.001Z");
    expect(result[0].role).toEqual("user");
    expect(result[0].password).toBeUndefined();
    // ...
    done()
  })

  it('should get user by id excluding password', async done => {
    const res = await request.get(`/user/${mockUserData._id}`)
    const result = res.body
    expect(result.username).toEqual("Ikuzen");
    expect(result.email).toEqual("blabla@bla.bla");
    expect(result.birthdate).toEqual("1970-01-01T00:00:00.001Z");
    expect(result.role).toEqual("user");
    expect(result.password).toBeUndefined();
    // ...
    done()
  })

  it('should get user by username excluding password', async done => {
    const res = await request.get(`/user/username/Ikuzen`)
    const result = res.body[0]
    expect(result.username).toEqual("Ikuzen");
    expect(result.email).toEqual("blabla@bla.bla");
    expect(result.birthdate).toEqual("1970-01-01T00:00:00.001Z");
    expect(result.role).toEqual("user");
    expect(result.password).toBeUndefined();
    // ...
    done()
  })

  it('should create user', async done =>{
    await request.post('/user',mockUser).send({username:"test",password:"12345",email:"test@test.test",birthdate:Date.now()});
    const res = await request.get('/user')
    const result = res.body
    expect(result.length).toEqual(2)
    // ...
    done()
  })
});
