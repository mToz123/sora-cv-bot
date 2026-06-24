const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../data/cv_data.db'), (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('✅ Database connected');
        this.initTables();
      }
    });
  }

  initTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id INTEGER PRIMARY KEY,
        profile_name TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS cv_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        template TEXT,
        font TEXT,
        color_scheme TEXT,
        generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  saveProfile(userId, profileName, data) {
    return new Promise((resolve, reject) => {
      const dataJson = JSON.stringify(data);
      this.db.run(
        `INSERT OR REPLACE INTO profiles (user_id, profile_name, data, updated_at) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [userId, profileName, dataJson],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  loadProfile(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT data FROM profiles WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? JSON.parse(row.data) : null);
        }
      );
    });
  }

  saveHistory(userId, template, font, colorScheme) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO cv_history (user_id, template, font, color_scheme) VALUES (?, ?, ?, ?)',
        [userId, template, font, colorScheme],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  getHistory(userId, limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM cv_history WHERE user_id = ? ORDER BY generated_at DESC LIMIT ?',
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = Database;
