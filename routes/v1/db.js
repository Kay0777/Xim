const { db } = require('../../db')

class User {
  static #getResults(promise) {
    return promise
      .then((data) => {
        return data
      })
      .catch((err) => {
        return []
      })
  }

  static async getUser(params) {
    const sql = `
      SELECT
        *
      FROM
        xim.user
      WHERE
        id = ?`

    return this.#getResults(
      db.query(sql, params)
    )
  }

  static async getUserByRefreshToken(params) {
    const sql = `
      SELECT
        id,
        password
      FROM
        xim.user
      WHERE
        refresh_token = ?`

    return this.#getResults(
      db.query(sql, params)
    )
  }

  static async updateRefreshToken(params) {
    const sql = `
      UPDATE
        xim.user
      SET
        refresh_token = ?
      WHERE
        id = ?`

    this.#getResults(
      db.query(sql, params)
    )
  }

  static async createUser(params) {
    const sql = `
      INSERT INTO xim.user
        (id, password, refresh_token)
      VALUES
        (?, ?, ?);`

    this.#getResults(
      db.query(sql, params)
    )
  }
};

class File {
  static #getResults(promise) {
    return promise
      .then((data) => {
        return data
      })
      .catch((err) => {
        return []
      })
  }

  static async uploadFile(params) {
    const sql = `
      INSERT INTO xim.file(
        name,
        format,
        type,
        size
      ) VALUES (
        ?, ?, ?, ?
      );`;

    this.#getResults(
      db.query(sql, params)
    );
  }

  static async getFiles(params) {
    const sql = `
      SELECT 
        id,
        name,
        format,
        type,
        size
      FROM
        xim.file
      WHERE
        is_active
      ORDER BY
        id
      LIMIT
        ?
      OFFSET
        ?`;

    console.log(sql);
    console.log(params);
    return this.#getResults(
      db.query(sql, params)
    )
  }

  static async getFileByID(params) {
    const sql = `
      SELECT 
        name,
        format,
        type,
        size
      FROM
        xim.file
      WHERE
        id = ?;`;

    return this.#getResults(
      db.query(sql, params)
    )
  }

  static async deleteFile(params) {
    const sql = `
      UPDATE
        xim.file 
      SET
        is_active = false
      WHERE
        id = ?`;

    this.#getResults(
      db.query(sql, params)
    )
  }

  static async updateFile(params) {
    const sql = `
      UPDATE
        xim.file
      SET
        name = ?,
        format = ?,
        type = ?,
        size = ?,
        uploaded_at = now()
      WHERE
        id = ?`

    this.#getResults(
      db.query(sql, params)
    )
  }

}

module.exports = { User, File };