const db = require("../config/connectdb");

class Product {
  static getAll(callback) {
    db.query("SELECT * FROM products", (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static getByCategory(category_name, callback) {
    db.query(
      "SELECT p.*, p.category_name AS category_name FROM products p WHERE p.category_name = ?",
      [category_name],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  }

  static create(name, price, category_name, callback) {
    db.query(
      "INSERT INTO products (name, price, category_name) VALUES (?, ?, ?)",
      [name, price, category_name],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  }

  static update(name, price, category_name, id, callback) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      return callback(new Error("Invalid ID"));
    }
    db.query(
      "UPDATE products SET name = ?, price = ?, category_name = ? WHERE id = ?",
      [name, price, category_name, idNum],
      (err, result) => {
        if (err) return callback(err);
        if (result.affectedRows === 0) {
          return callback(new Error("Product not found"));
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
    db.query("DELETE FROM products WHERE id = ?", [idNum], (err, result) => {
      if (err) return callback(err);
      if (result.affectedRows === 0) {
        return callback(new Error("Product not found"));
      }
      callback(null, result);
    });
  }
}

module.exports = Product;
