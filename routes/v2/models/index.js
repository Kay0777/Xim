const { DB } = require('../../../config')
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  host: DB.host,
  port: DB.port,
  username: DB.username,
  password: DB.password,
  database: DB.name,
  pool: {
    max: DB.poolLimit,
    idle: 20000,
    acquire: 50000,
  },
  logging: (message) => {
    if (message.startsWith('Executing')) {      
    } else if (message.startsWith('Error')) {
      console.log('<>     SEQUELIZE ERROR MESSAGE     <>');
      console.log('Error: ', message);
      console.log('<>     SEQUELIZE ERROR MESSAGE     <>');
    } else {
      console.log('<>     SEQUELIZE INFO MESSAGE     <>');
      console.log('Message:', message);
      console.log('<>     SEQUELIZE INFO MESSAGE     <>');
    }
  },
  dialect: DB.type,
});

function syncModels() {
  sequelize.sync({ force: false })
    .then(() => {
      console.log('Database models synchronized.');
    })
    .catch((err) => {
      console.log('Database models synchronized.');
      console.error(err);
    });
}

setImmediate(() => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Database is connected....');
      // THEN SYNCHRONIZE MODEL
      syncModels()
    })
    .catch(() => {
      console.log('Database is not connected...');
    })
});

module.exports = {
  User: require('./user')(sequelize),
  File: require('./file')(sequelize),
};
