import express from 'express';
import debug from 'debug';
import { uri } from './config';
const Sequelize = require('sequelize');
const cors = require('cors')

const connectionURI = uri;
const app = express();
const PORT = 3000;
const BodyParser = require("body-parser");
const log = debug('tn:express');

const sequelize = new Sequelize(connectionURI, {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define:{
    timestamps: false
  }

});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Model = Sequelize.Model;
class Participant extends Model { }
Participant.init({
  // attributes
  id_participant:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pseudo: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  prenom: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'participant'
});

class Question extends Model { }
Question.init({
  // attributes
  id_question:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  libelle: {
    type: Sequelize.STRING(90),
    allowNull: false
  },
  numero_ordre: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
  ,
  id_quiz: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'questions'
});

class Quizz extends Model { }
Quizz.init({
  // attributes
  id_quiz:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  libelle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date_creation: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'quizzes'
});

class PossibleResponses extends Model { }
PossibleResponses.init({
  // attributes
  id_reponse_possible:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: Sequelize.STRING(5),
    allowNull: false
  },
  libelle: {
    type: Sequelize.STRING(90),
    allowNull: false
  },
  correcte: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  id_question: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'responses_possible'
});
sequelize.sync()

// Relations
Question.hasMany(PossibleResponses)
PossibleResponses.belongsTo(Question)
Quizz.hasMany(Question)
Question.belongsTo(Quizz)







app.use(cors())
app.use(BodyParser.json());

app.get('/', (req, res) => {
  res.send(`<h1>quizz API</h1>`);
});
// GET ALL PARTICIPANT
app.get('/participants', async(req, res) => {
    let result = await Participant.findAll()
    res.send(result);
});
// GET PARTICIPANT BY ID
app.get('/participant/:id', async(req, res) => {
    let result = await Participant.findOne({
      where:{
        id_participant: req.params.id
      }
    })
    res.send(result);
});
// GET ALL quizzes
app.get('/quizzes', async(req, res) => {
    let result = await Quizz.findAll()
    res.send(result);
});
// GET quizz BY ID
app.get('/quizz/:id', async(req, res) => {
    let result = await Quizz.findOne({
      where:{
        id_quiz: req.params.id
      }
    })
    res.send(result);
});
// GET ALL questions
app.get('/questions', async(req, res) => {
    let result = await Question.findAll()
    res.send(result);
});
// GET question BY ID
app.get('/question/:id', async(req, res) => {
    let result = await Question.findOne({
      where:{
        id_question: req.params.id
      }
    })
    res.send(result);
});
// GET ALL PossibleResponses
app.get('/possible-responses', async(req, res) => {
    let result = await PossibleResponses.findAll()
    res.send(result);
});
// GET PossibleResponse BY ID
app.get('/possible-responses/:id', async(req, res) => {
    let result = await PossibleResponses.findOne({
      where:{
        id_reponse_possible: req.params.id
      }
    })
    res.send(result);
});

// GET QUIZZ DTO
app.get('/dto/quizz/:id', async(req, res) => {
  let result = await PossibleResponses.findOne({
    where:{
      id_reponse_possible: req.params.id
    }
  })
  res.send(result);
});
app.listen(PORT, () => log('Listening on port', PORT));
