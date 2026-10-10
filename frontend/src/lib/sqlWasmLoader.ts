// WebAssembly SQLite (sql.js) dynamic loader and schema inspector
// Guarantees 100% in-browser, client-side database processing.

declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<any>;
    __mskCachedSqlJs?: any;
  }
}

export interface DatabaseColumnMeta {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: string | null;
  pk: boolean;
}

export interface DatabaseForeignKeyMeta {
  fromColumn: string;
  targetTable: string;
  targetColumn: string;
}

export interface DatabaseTableMeta {
  name: string;
  type: 'table' | 'view';
  sql: string;
  rowCount: number;
  columns: DatabaseColumnMeta[];
  foreignKeys?: DatabaseForeignKeyMeta[];
}

export interface DatabaseStats {
  fileName: string;
  fileSizeBytes: number;
  tableCount: number;
  viewCount: number;
  totalRowCount: number;
}

let loadingPromise: Promise<any> | null = null;

/**
 * Loads and initializes the sql.js WebAssembly engine
 */
export async function getSqlWasmEngine(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('WebAssembly SQLite can only run in a browser client environment.');
  }

  if (window.__mskCachedSqlJs) {
    return window.__mskCachedSqlJs;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    if (!window.initSqlJs) {
      await new Promise<void>((resolve, reject) => {
        // Check if script element already exists
        const existingScript = document.querySelector('script[src*="sql-wasm.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject(new Error('Failed to load sql.js CDN script')));
          // If already loaded
          if (window.initSqlJs) {
            resolve();
            return;
          }
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load sql.js from CDN'));
          document.head.appendChild(script);
        }
      });
    }

    if (!window.initSqlJs) {
      throw new Error('sql.js initialization function not found on window.');
    }

    const SQL = await window.initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
    });

    window.__mskCachedSqlJs = SQL;
    return SQL;
  })();

  return loadingPromise;
}

/**
 * Creates an in-memory database instance from an ArrayBuffer or Uint8Array
 */
export async function createDatabaseFromBytes(bytes?: Uint8Array | ArrayBuffer): Promise<any> {
  const SQL = await getSqlWasmEngine();
  if (bytes) {
    const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    return new SQL.Database(uint8);
  }
  return new SQL.Database();
}

/**
 * Inspects all tables, views, and schemas inside a SQLite database instance
 */
export function inspectDatabaseTables(db: any): DatabaseTableMeta[] {
  if (!db) return [];

  const tables: DatabaseTableMeta[] = [];

  try {
    const masterQuery = `
      SELECT name, type, sql 
      FROM sqlite_master 
      WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'
      ORDER BY name ASC;
    `;

    const res = db.exec(masterQuery);
    if (!res || res.length === 0 || !res[0].values) {
      return [];
    }

    for (const row of res[0].values) {
      const name = String(row[0]);
      const type = (row[1] === 'view' ? 'view' : 'table') as 'table' | 'view';
      const sql = String(row[2] || '');

      // Get columns using PRAGMA table_info
      const columns: DatabaseColumnMeta[] = [];
      try {
        const pragmaRes = db.exec(`PRAGMA table_info("${name.replace(/"/g, '""')}");`);
        if (pragmaRes && pragmaRes.length > 0 && pragmaRes[0].values) {
          for (const col of pragmaRes[0].values) {
            columns.push({
              cid: Number(col[0]),
              name: String(col[1]),
              type: String(col[2] || 'TEXT'),
              notnull: Boolean(col[3]),
              dflt_value: col[4] !== null ? String(col[4]) : null,
              pk: Boolean(col[5]),
            });
          }
        }
      } catch (err) {
        console.warn(`Could not fetch PRAGMA for table ${name}:`, err);
      }

      // Count rows
      let rowCount = 0;
      try {
        const countRes = db.exec(`SELECT COUNT(*) FROM "${name.replace(/"/g, '""')}";`);
        if (countRes && countRes[0]?.values?.[0]?.[0] !== undefined) {
          rowCount = Number(countRes[0].values[0][0]);
        }
      } catch {
        rowCount = 0;
      }

      // Get foreign keys using PRAGMA foreign_key_list
      const foreignKeys: DatabaseForeignKeyMeta[] = [];
      try {
        const fkRes = db.exec(`PRAGMA foreign_key_list("${name.replace(/"/g, '""')}");`);
        if (fkRes && fkRes.length > 0 && fkRes[0].values) {
          for (const fkRow of fkRes[0].values) {
            foreignKeys.push({
              targetTable: String(fkRow[2]),
              fromColumn: String(fkRow[3]),
              targetColumn: String(fkRow[4]),
            });
          }
        }
      } catch (err) {
        console.warn(`Could not fetch foreign keys for table ${name}:`, err);
      }

      tables.push({
        name,
        type,
        sql,
        rowCount,
        columns,
        foreignKeys,
      });
    }
  } catch (err) {
    console.error('Error inspecting database tables:', err);
  }

  return tables;
}
