const db = require("../config/connectdb");

class Category {
  static getAll(callback) {
    db.query("SELECT * FROM categories", (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static create(name, callback) {
    db.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  }

  static update(name, id, callback) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      return callback(new Error("Invalid ID"));
    }
    db.query(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name, idNum],
      (err, result) => {
        if (err) return callback(err);
        if (result.affectedRows === 0) {
          return callback(new Error("Category not found"));
        }
        callback(null, result);
      }
    );
  }

  static delete(id, callback) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      return callback(new Error("Invalid ID"));
    }
    db.query("DELETE FROM categories WHERE id = ?", [idNum], (err, result) => {
      if (err) return callback(err);
      if (result.affectedRows === 0) {
        return callback(new Error("Category not found"));
      }
      callback(null, result);
    });
  }

  static findByName(name, callback) {
    db.query(
      "SELECT * FROM categories WHERE name = ?",
      [name],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]); // Trả về danh mục đầu tiên (nếu có)
      }
    );
  }
}

module.exports = Category;
