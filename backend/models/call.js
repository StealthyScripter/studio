const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Call {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'calls.db'), (err) => {
      if (err) {
        console.error('Error opening database', err.message);
      } else {
        console.log('Connected to the calls database.');
        this.createTable();
      }
    });
  }

  createTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS calls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from TEXT NOT NULL,
        to TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL
      )
    `;
    this.db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating calls table', err.message);
      } else {
        console.log('Calls table created or already exists.');
      }
    });
  }

  getAllCalls() {
    return new Promise((resolve, reject) => {
      const tableCheckSQL = `SELECT name FROM sqlite_master WHERE type='table' AND name='calls'`;
      this.db.get(tableCheckSQL, (err, row) => {
        if (err) {
          console.error('Error checking if table exists:', err.message);
          reject(err);
          return;
        }
        if (!row) {
          this.createTable();
          console.log("Table 'calls' does not exist, it will be created.");
          resolve([]);
          return;
        }
        this.db.all('SELECT * FROM calls', [], (err, rows) => {
          if (err) {
            console.error('Error getting all calls:', err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }

  addCall(from, to, date, status) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO calls (from, to, date, status) VALUES (?, ?, ?, ?)',
        [from, to, date, status],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Closed the database connection.');
      }
    });
  }
}

module.exports = Call;
