const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../logger');

class Contact {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'contacts.db'), (err) => {
      if (err) {
        logger.error('Error opening database', err.message);
      } else {
        logger.info('Connected to the contacts database.');
        this.createTable();
      }
    });
  }

  createTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;
    this.db.run(createTableSQL, (err) => {
      if (err) {
        logger.error('Error creating contacts table', err.message);
      } else {
        logger.info('Contacts table created or already exists.');
      }
    });
  }

  getAllContacts() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM contacts', [], (err, rows) => {
        if (err) {
          logger.error('Error getting all contacts:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  addContact(name, phone) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO contacts (name, phone) VALUES (?, ?)', [name, phone], function(err) {
        if (err) {
            logger.error('Error adding contact:', err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  updateContact(id, name, phone){
    return new Promise((resolve, reject) => {
        this.db.run('UPDATE contacts SET name = ?, phone = ? WHERE id = ?', [name, phone, id], (err) => {
            if (err) {
                logger.error('Error updating contact:', err.message);
                reject(err);
            } else {
                resolve({});
            }
        });
    });
  }

  deleteContact(id){
    return new Promise((resolve, reject) => {
        this.db.run('DELETE FROM contacts WHERE id = ?', [id], (err) => {
            if (err) {
                logger.error('Error deleting contact:', err.message);
                reject(err);
            } else {
                resolve({});
            }
        });
    });
  }

  close() {
    this.db.close((err) => {
        if (err) {
            logger.error(err.message);
        }
        logger.info('Close the database connection.');
      });
  }
}

module.exports = Contact;
