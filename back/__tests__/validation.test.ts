
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { uri } from '../src/config';
import { UserModel } from '../src/models/users/user-model';
import { mockUser } from './mockData'
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
        const user = new UserModel(mockUser);
        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(mockUser.username);
        expect(savedUser.email).toBe(mockUser.email);
        expect(savedUser.birthdate).toBe(mockUser.birthdate);
  });
});