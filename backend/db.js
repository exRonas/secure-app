const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const util = require('util');

const dbPath = path.join(__dirname, 'security_course.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('CRITICAL: Could not open database.', err);
  } else {
    console.log('✅ Database connected:', dbPath);
    initSchema();
  }
});

// Wrapper to use async/await
const dbRun = util.promisify(db.run.bind(db));
const dbGet = util.promisify(db.get.bind(db));
const dbAll = util.promisify(db.all.bind(db));

// Custom Insert helper to return ID
const dbInsert = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const initSchema = async () => {
  try {
    // Users Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lab Notes (for XSS demo)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // --- NEW: ACADEMY TABLES ---

    // Mission Progress
    await dbRun(`
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id INTEGER,
        mission_id TEXT,
        status TEXT DEFAULT 'locked', -- locked, unlocked, completed
        completed_at DATETIME,
        PRIMARY KEY (user_id, mission_id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('✅ Database schema initialized');
  } catch (err) {
    console.error('Schema initialization failed:', err);
  }
};

module.exports = {
  db,
  run: dbRun,
  get: dbGet,
  all: dbAll,
  insert: dbInsert
};
