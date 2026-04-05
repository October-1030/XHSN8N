import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "findmystuff.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '其他',
    location TEXT NOT NULL,
    detail_location TEXT DEFAULT '',
    photo TEXT DEFAULT '',
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  )
`);

export default db;

export interface Item {
  id: string;
  name: string;
  category: string;
  location: string;
  detail_location: string;
  photo: string;
  note: string;
  created_at: string;
  updated_at: string;
}
