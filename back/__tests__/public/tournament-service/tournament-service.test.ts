import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { TournamentModel } from "../../../src/models/tournaments/tournament-model";
import { mockTournaments } from '../../mockData'

const app = require('../../index-test') // Link to your server file
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
    await TournamentModel(mockTournaments[0]).save()
    await TournamentModel(mockTournaments[1]).save()
    await TournamentModel(mockTournaments[2]).save()
    mockTournamentData = await request.get('/tournament');
    mockTournamentData = mockTournamentData.body
  });


  afterAll(async () => {
    await mongoose.stop();
    await mongoose.disconnect();
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  it('should get list of tournaments with pagination', async done => {
    const res = await request.get('/tournament')
    const result = res.body
    expect(result.totalDocs).toEqual(3)
    expect(result.docs[0]?.name).toEqual("tournoi");
    expect(result.docs[0]?.size).toEqual(16);
    expect(result.docs[0]?.game).toEqual("game");
    expect(result.docs[0]?.organizer?.username).toEqual("Rikkel");
    // ...
    done()
  })
  // getAll by organizer
  it('should get list of tournaments with pagination', async done => {
    const res = await request.get('/tournament?organizer=Rikkel')
    const result = res.body
    expect(result.totalDocs).toEqual(2)
    // ...
    done()
  })

  it('should get tournament by id', async done => {
    const res = await request.get(`/tournament/${mockTournamentData.docs[0]._id}`)
    const result = res.body
    expect(result.name).toEqual("tournoi");
    expect(result.game).toEqual("game");
    expect(result.size).toEqual(16);

    // ...
    done()
  })

  it('should get tournament by tournamentname', async done => {
    const res = await request.get(`/tournament/name/tournoi2`)
    const result = res.body
    expect(result.name).toEqual("tournoi2");
    expect(result.game).toEqual("game1");
    expect(result.size).toEqual(32);
    // ...
    done()
  })

  it('should get list of different games', async done =>{
    const res = await request.get('/tournament/other/games').send();
    const result = res.body
    expect(result).toEqual(['game','game1','game2'])
    // ...
    done()
  })

  // it('should return not full', async done =>{
  //   const res = await request.get(`/tournament/other/size/${mockTournamentData.docs[0]._id}`).send();
  //   console.log(res)
  //   const result = res.body
  //   expect(result).toEqual('not full')
  //   // ...
  //   done()
  // })

  // it('should return full', async done =>{
  //   const res = await request.get(`/tournament/other/size/${mockTournamentData.docs[2]._id}`).send();
  //   console.log(res)
  //   const result = res.body
  //   expect(result).toEqual('full')
  //   // ...
  //   done()
  // })
});
