
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { uri } from '../src/config';
import { UserModel } from '../src/models/users/user-model';
import { mockUsers } from './mockData'
let mongoServer;


describe('insert', () => {

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
   await mongoose.connect(mongoUri, (err) => {
    if (err) console.error(err);
  });

  });

  afterAll(async () => {
    await mongoose.stop();
    await mongoose.disconnect();
  });

  it('should insert a doc into collection', async () => {
        const user = new UserModel(mockUsers[0]);
        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(mockUsers[0].username);
        expect(savedUser.email).toBe(mockUsers[0].email);
        expect(savedUser.birthdate).toBe(mockUsers[0].birthdate);
  });
});