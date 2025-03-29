const db = require("../config/connectdb");

class User {
  static create(username, password, role, callback) {
    db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  }

  static findByUsername(username, callback) {
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
      }
    );
  }
  static getAll(callback) {
    db.query("SELECT * FROM users", (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }
}

module.exports = User;
