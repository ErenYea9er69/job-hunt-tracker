import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "job-hunt.db");

let db = globalThis.__jobHuntDb;

if (!db) {
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      website TEXT,
      what_building TEXT,
      industry TEXT,
      hiring_status TEXT NOT NULL DEFAULT 'unknown',
      application_status TEXT NOT NULL DEFAULT 'not_applied',
      application_link TEXT,
      contact_email TEXT,
      stipend_mentioned INTEGER NOT NULL DEFAULT 0,
      stipend_details TEXT,
      location TEXT,
      remote_type TEXT,
      source TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      date_applied TEXT,
      rejection_reason TEXT,
      follow_up_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      link TEXT,
      stipend_mentioned INTEGER NOT NULL DEFAULT 0,
      stipend_details TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_roles_company_id ON roles(company_id);
  `);

  globalThis.__jobHuntDb = db;
}

export default db;
