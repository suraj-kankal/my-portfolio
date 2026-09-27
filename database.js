const Database = require('better-sqlite3');
const path = require('path');

// Create database file in project root
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new Database(dbPath);

console.log(`📦 Database initialized at: ${dbPath}`);

// Create tables if they don't exist
function initializeDatabase() {
  // Contact submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    )
  `);

  // Admin users table (for future authentication)
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Page analytics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT NOT NULL,
      visitor_ip TEXT,
      user_agent TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✓ Database tables initialized');
}

// Initialize on startup
initializeDatabase();

// Helper functions
const database = {
  // Contact submissions
  saveContact: (name, email, subject, message, ip_address = null) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO contact_submissions (name, email, subject, message, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, email, subject, message, ip_address);
      console.log(`✓ Contact saved with ID: ${result.lastInsertRowid}`);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('✗ Error saving contact:', error.message);
      return { success: false, error: error.message };
    }
  },

  getAllContacts: () => {
    try {
      const stmt = db.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC');
      return stmt.all();
    } catch (error) {
      console.error('✗ Error fetching contacts:', error.message);
      return [];
    }
  },

  getContactById: (id) => {
    try {
      const stmt = db.prepare('SELECT * FROM contact_submissions WHERE id = ?');
      return stmt.get(id);
    } catch (error) {
      console.error('✗ Error fetching contact:', error.message);
      return null;
    }
  },

  getNewContacts: () => {
    try {
      const stmt = db.prepare("SELECT * FROM contact_submissions WHERE status = 'new' ORDER BY created_at DESC");
      return stmt.all();
    } catch (error) {
      console.error('✗ Error fetching new contacts:', error.message);
      return [];
    }
  },

  updateContactStatus: (id, status) => {
    try {
      const stmt = db.prepare('UPDATE contact_submissions SET status = ? WHERE id = ?');
      stmt.run(status, id);
      console.log(`✓ Contact ${id} status updated to: ${status}`);
      return true;
    } catch (error) {
      console.error('✗ Error updating contact:', error.message);
      return false;
    }
  },

  deleteContact: (id) => {
    try {
      const stmt = db.prepare('DELETE FROM contact_submissions WHERE id = ?');
      stmt.run(id);
      console.log(`✓ Contact ${id} deleted`);
      return true;
    } catch (error) {
      console.error('✗ Error deleting contact:', error.message);
      return false;
    }
  },

  // Analytics
  recordPageView: (page, ip_address, user_agent) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO analytics (page, visitor_ip, user_agent)
        VALUES (?, ?, ?)
      `);
      stmt.run(page, ip_address, user_agent);
    } catch (error) {
      console.error('✗ Error recording analytics:', error.message);
    }
  },

  getAnalytics: () => {
    try {
      const stmt = db.prepare('SELECT * FROM analytics ORDER BY timestamp DESC LIMIT 100');
      return stmt.all();
    } catch (error) {
      console.error('✗ Error fetching analytics:', error.message);
      return [];
    }
  },

  // Statistics
  getContactStats: () => {
    try {
      const total = db.prepare('SELECT COUNT(*) as count FROM contact_submissions').get().count;
      const newCount = db.prepare("SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'new'").get().count;
      const todayCount = db.prepare(`
        SELECT COUNT(*) as count FROM contact_submissions 
        WHERE DATE(created_at) = DATE('now')
      `).get().count;
      
      return { total, new: newCount, today: todayCount };
    } catch (error) {
      console.error('✗ Error fetching stats:', error.message);
      return { total: 0, new: 0, today: 0 };
    }
  },

  // Close database
  close: () => {
    db.close();
    console.log('✓ Database closed');
  }
};

module.exports = database;
