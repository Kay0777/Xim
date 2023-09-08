const { createPool } = require('mysql2');
const { DB } = require('./config');

class DataBase {
  #pool;

  constructor() {
    this.#pool = createPool({
      host: DB.host,
      user: DB.username,
      password: DB.password,
      database: DB.name,
      connectionLimit: DB.poolLimit,
    });
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.#pool.getConnection((err, conn) => {
        if (err) reject(err);

        conn.query(sql, params, (error, results) => {
          conn.release();

          if (error) reject(error);
          resolve(results);
        });
      });
    });
  }
}

module.exports = {
  db: new DataBase(),
};