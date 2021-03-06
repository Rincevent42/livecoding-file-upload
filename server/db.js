require('dotenv').config();
const mysql = require('mysql');

class Database {
  init () {
    let config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3307',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'post_api_database',
      connectionLimit: 10
    };

    if (process.env.NODE_ENV === 'test') {
      config = {
        host: process.env.DB_HOST_TEST || 'localhost',
        port: process.env.DB_PORT_TEST || '3308',
        user: process.env.DB_USER_TEST || 'root',
        password: process.env.DB_PASS_TEST || 'root',
        database: process.env.DB_NAME_TEST || 'post_api_database_test',
        connectionLimit: 10
      };
    }

    this.connection = mysql.createPool(config);

    return this;
  }

  async query (...args) {
    return new Promise((resolve, reject) => {
      this.connection.query(...args, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    })
  }

  async closeConnection () {
    return new Promise((resolve, reject) => {
      if (this.connection) {
        this.connection.end((err, res) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        return resolve();
      }
    });
  }

  async deleteAllData () {
    return this.query(`
      TRUNCATE posts;
    `);
  }
}

module.exports = (new Database()).init();
