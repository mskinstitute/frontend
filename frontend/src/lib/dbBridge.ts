// IndexedDB-based shared store to seamlessly transfer databases between /tools/db-viewer and /tools/sql-studio
// Native client-side storage supports large binary ArrayBuffers with zero server uploads and zero data limits.

const DB_NAME = 'MSK_DATABASE_TOOLS_STORE';
const STORE_NAME = 'transferred_databases';
const KEY = 'active_transfer';

export interface BridgeDatabaseRecord {
  name: string;
  data: Uint8Array;
  timestamp: number;
  source: 'db-viewer' | 'sql-studio';
  tableCount?: number;
  rowCount?: number;
}

function openBridgeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this browser environment.'));
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open bridge IndexedDB'));
  });
}

/**
 * Saves a database binary into IndexedDB for cross-tool transfer
 */
export async function saveDatabaseToBridge(
  name: string,
  data: Uint8Array,
  source: 'db-viewer' | 'sql-studio' = 'db-viewer',
  tableCount?: number,
  rowCount?: number
): Promise<void> {
  try {
    const db = await openBridgeDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: BridgeDatabaseRecord = {
        name,
        data,
        timestamp: Date.now(),
        source,
        tableCount,
        rowCount,
      };
      const req = store.put(record, KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error saving database to bridge store:', err);
    throw err;
  }
}

/**
 * Retrieves the pending transferred database, if available
 */
export async function getDatabaseFromBridge(): Promise<BridgeDatabaseRecord | null> {
  try {
    const db = await openBridgeDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY);
      req.onsuccess = () => resolve((req.result as BridgeDatabaseRecord) || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not read from bridge store:', err);
    return null;
  }
}

/**
 * Clears the bridge store
 */
export async function clearDatabaseBridge(): Promise<void> {
  try {
    const db = await openBridgeDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not clear bridge store:', err);
  }
}
