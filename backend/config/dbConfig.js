const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');

const DEFAULT_DB_PATH = path.join(__dirname, '..', 'data', 'cashdesk.sqlite');

let dbPromise;

const isReadStatement = (sql) => /^\s*(SELECT|PRAGMA|WITH)\b/i.test(sql);

const mapWriteResult = (runResult = {}) => ({
  affectedRows: runResult.changes || 0,
  insertId: runResult.lastID || 0,
});

const INITIAL_ADMIN = {
  username: process.env.INITIAL_ADMIN_USER || 'admin',
  password: process.env.INITIAL_ADMIN_PASS || 'Admin1234!',
  name: process.env.INITIAL_ADMIN_NAME || 'Admin',
  surname: process.env.INITIAL_ADMIN_SURNAME || 'Inicial',
  branch: process.env.INITIAL_ADMIN_BRANCH || '01',
  role: process.env.INITIAL_ADMIN_ROLE || 'admin',
};

const seedInitialAdmin = async (db) => {
  const existingAdmin = await db.get(
    'SELECT id FROM users WHERE username = ? LIMIT 1',
    [INITIAL_ADMIN.username]
  );

  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(INITIAL_ADMIN.password, 10);

  await db.run(
    `
      INSERT INTO users (username, name, surname, branch, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      INITIAL_ADMIN.username,
      INITIAL_ADMIN.name,
      INITIAL_ADMIN.surname,
      INITIAL_ADMIN.branch,
      hashedPassword,
      INITIAL_ADMIN.role,
    ]
  );

  console.log(`[DB Seed] Usuario inicial "${INITIAL_ADMIN.username}" creado.`);
};

const initializeSchema = async (db) => {
  await db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      branch TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      last_login TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      method TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      branch_id INTEGER NOT NULL,
      user TEXT NOT NULL,
      shift TEXT NOT NULL,
      deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date);
    CREATE INDEX IF NOT EXISTS idx_payments_branch_date ON payments(branch_id, date);
  `);
};

const resolveDbPath = () => {
  if (!process.env.SQLITE_DB_PATH) {
    return DEFAULT_DB_PATH;
  }

  return path.resolve(process.env.SQLITE_DB_PATH);
};

const getDb = async () => {
  if (!dbPromise) {
    const dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    dbPromise = open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const db = await dbPromise;
    await initializeSchema(db);
    await seedInitialAdmin(db);
  }

  return dbPromise;
};

const executeSql = async (sql, params = []) => {
  const db = await getDb();

  if (isReadStatement(sql)) {
    const rows = await db.all(sql, params);
    return [rows, []];
  }

  const result = await db.run(sql, params);
  return [mapWriteResult(result), []];
};

const createConnection = async () => ({
  query: async (sql, params = []) => executeSql(sql, params),
  execute: async (sql, params = []) => executeSql(sql, params),
  release: () => {},
});

module.exports = {
  query: async (sql, params = []) => executeSql(sql, params),
  execute: async (sql, params = []) => executeSql(sql, params),
  getConnection: createConnection,
};
