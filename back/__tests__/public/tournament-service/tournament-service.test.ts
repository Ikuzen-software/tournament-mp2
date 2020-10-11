import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { mockTournament } from '../../mockData'

const app = require('../../../src/index') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
let mongoServer;
let mockTournamentData;
describe('tournament-service public', () => {

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, (err) => {
      if (err) console.error(err);
    });
    await request.post('/tournament',mockTournament).send(mockTournament);
    mockTournamentData = await request.get('/tournament',mockTournament);
    mockTournamentData = mockTournamentData.body[0]
  });


  afterAll(async () => {
    await mongoose.stop();
    await mongoose.disconnect();
  });

  fit('should get list of tournaments with pagination', async done => {
    const res = await request.get('/tournament')
    const result = res.body
    console.log(result)
    expect(result.pages).toEqual(1)
    // expect(result[0].tournamentname).toEqual("tournoi");
    // expect(result[0].size).toEqual(16);
    // expect(result[0].game).toEqual("game");
    // ...
    done()
  })

  it('should get tournament by id excluding password', async done => {
    const res = await request.get(`/tournament/${mockTournamentData._id}`)
    const result = res.body
    expect(result.tournamentname).toEqual("Ikuzen");
    expect(result.email).toEqual("blabla@bla.bla");
    expect(result.birthdate).toEqual("1970-01-01T00:00:00.001Z");
    expect(result.role).toEqual("tournament");
    expect(result.password).toBeUndefined();
    // ...
    done()
  })

  it('should get tournament by tournamentname excluding password', async done => {
    const res = await request.get(`/tournament/tournamentname/Ikuzen`)
    const result = res.body[0]
    expect(result.tournamentname).toEqual("Ikuzen");
    expect(result.email).toEqual("blabla@bla.bla");
    expect(result.birthdate).toEqual("1970-01-01T00:00:00.001Z");
    expect(result.role).toEqual("tournament");
    expect(result.password).toBeUndefined();
    // ...
    done()
  })

  it('should create tournament', async done =>{
    await request.post('/tournament',mockTournament).send({tournamentname:"test",password:"12345",email:"test@test.test",birthdate:Date.now()});
    const res = await request.get('/tournament')
    const result = res.body
    expect(result.length).toEqual(2)
    // ...
    done()
  })
});
