/**
 * IndexedDB Persistence for MSK SQL Studio & Database Viewer
 * 
 * Rules:
 * - SQL Studio: Query files and Databases persist and are automatically removed after 12 hours of inactivity/modification.
 * - Database Viewer: Loaded Databases persist and are automatically removed after 6 hours of inactivity/modification.
 */

export const SQL_STUDIO_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
export const DB_VIEWER_TTL_MS = 6 * 60 * 60 * 1000;   // 6 hours

export interface PersistedQueryFile {
  id: string;
  title: string;
  sql: string;
  updatedAt?: number; // timestamp in ms
  isModified?: boolean;
}

export interface PersistedDatabaseRecord {
  id: string;
  name: string;
  fileName: string;
  fileSizeBytes: number;
  data: Uint8Array;
  updatedAt?: number; // timestamp in ms
}

export interface PersistedStudioMeta {
  openTabIds: string[];
  activeTabId: string | null;
  activeDbId: string | null;
}

export interface PersistedViewerMeta {
  activeDbId: string | null;
  selectedTable: string | null;
}

const DB_NAME = 'MSK_DATABASE_STUDIO_STORE';
const DB_VERSION = 2;

function openStudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this browser environment.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('sql_studio_files')) {
        db.createObjectStore('sql_studio_files', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('sql_studio_databases')) {
        db.createObjectStore('sql_studio_databases', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('sql_studio_meta')) {
        db.createObjectStore('sql_studio_meta');
      }
      if (!db.objectStoreNames.contains('db_viewer_databases')) {
        db.createObjectStore('db_viewer_databases', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('db_viewer_meta')) {
        db.createObjectStore('db_viewer_meta');
      }
      if (!db.objectStoreNames.contains('playground_workspaces')) {
        db.createObjectStore('playground_workspaces', { keyPath: 'language' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

// ==========================================
// SQL STUDIO METHODS (12 HOUR TTL)
// ==========================================

export async function loadSqlStudioFiles(): Promise<PersistedQueryFile[]> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('sql_studio_files', 'readwrite');
      const store = tx.objectStore('sql_studio_files');
      const req = store.getAll();

      req.onsuccess = () => {
        const records: PersistedQueryFile[] = req.result || [];
        const now = Date.now();
        const valid: PersistedQueryFile[] = [];

        for (const file of records) {
          const age = now - (file.updatedAt || 0);
          if (age > SQL_STUDIO_TTL_MS) {
            // Expired after 12 hours: silently purge
            store.delete(file.id);
          } else {
            valid.push(file);
          }
        }
        resolve(valid);
      };

      req.onerror = () => {
        console.warn('Error fetching sql studio files from IndexedDB:', req.error);
        resolve([]);
      };
    });
  } catch (err) {
    console.warn('Could not load sql studio files:', err);
    return [];
  }
}

export async function saveSqlStudioFile(file: PersistedQueryFile): Promise<void> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('sql_studio_files', 'readwrite');
      const store = tx.objectStore('sql_studio_files');
      store.put({
        ...file,
        updatedAt: file.updatedAt || Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not save sql studio file:', err);
  }
}

export async function deleteSqlStudioFile(fileId: string): Promise<void> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('sql_studio_files', 'readwrite');
      const store = tx.objectStore('sql_studio_files');
      store.delete(fileId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not delete sql studio file:', err);
  }
}

export async function loadSqlStudioDatabases(): Promise<PersistedDatabaseRecord[]> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('sql_studio_databases', 'readwrite');
      const store = tx.objectStore('sql_studio_databases');
      const req = store.getAll();

      req.onsuccess = () => {
        const records: PersistedDatabaseRecord[] = req.result || [];
        const now = Date.now();
        const valid: PersistedDatabaseRecord[] = [];

        for (const item of records) {
          const age = now - (item.updatedAt || 0);
          if (age > SQL_STUDIO_TTL_MS) {
            // Expired after 12 hours: purge
            store.delete(item.id);
          } else {
            valid.push(item);
          }
        }
        resolve(valid);
      };

      req.onerror = () => {
        console.warn('Error fetching sql studio databases from IndexedDB:', req.error);
        resolve([]);
      };
    });
  } catch (err) {
    console.warn('Could not load sql studio databases:', err);
    return [];
  }
}

export async function saveSqlStudioDatabase(dbRecord: PersistedDatabaseRecord): Promise<void> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('sql_studio_databases', 'readwrite');
      const store = tx.objectStore('sql_studio_databases');
      store.put({
        ...dbRecord,
        updatedAt: dbRecord.updatedAt || Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not save sql studio database:', err);
  }
}

export async function deleteSqlStudioDatabase(dbId: string): Promise<void> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('sql_studio_databases', 'readwrite');
      const store = tx.objectStore('sql_studio_databases');
      store.delete(dbId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not delete sql studio database:', err);
  }
}

export async function loadSqlStudioMeta(): Promise<PersistedStudioMeta | null> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('sql_studio_meta', 'readonly');
      const store = tx.objectStore('sql_studio_meta');
      const req = store.get('studio_meta');
      req.onsuccess = () => resolve((req.result as PersistedStudioMeta) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function saveSqlStudioMeta(meta: PersistedStudioMeta): Promise<void> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('sql_studio_meta', 'readwrite');
      const store = tx.objectStore('sql_studio_meta');
      store.put(meta, 'studio_meta');
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}

// ==========================================
// DATABASE VIEWER METHODS (6 HOUR TTL)
// ==========================================

export async function loadDbViewerDatabases(): Promise<PersistedDatabaseRecord[]> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('db_viewer_databases', 'readwrite');
      const store = tx.objectStore('db_viewer_databases');
      const req = store.getAll();

      req.onsuccess = () => {
        const records: PersistedDatabaseRecord[] = req.result || [];
        const now = Date.now();
        const valid: PersistedDatabaseRecord[] = [];

        for (const item of records) {
          const age = now - (item.updatedAt || 0);
          if (age > DB_VIEWER_TTL_MS) {
            // Expired after 6 hours: purge
            store.delete(item.id);
          } else {
            valid.push(item);
          }
        }
        resolve(valid);
      };

      req.onerror = () => {
        console.warn('Error fetching db viewer databases from IndexedDB:', req.error);
        resolve([]);
      };
    });
  } catch (err) {
    console.warn('Could not load db viewer databases:', err);
    return [];
  }
}

export async function saveDbViewerDatabase(dbRecord: PersistedDatabaseRecord): Promise<void> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('db_viewer_databases', 'readwrite');
      const store = tx.objectStore('db_viewer_databases');
      store.put({
        ...dbRecord,
        updatedAt: dbRecord.updatedAt || Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not save db viewer database:', err);
  }
}

export async function deleteDbViewerDatabase(dbId: string): Promise<void> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('db_viewer_databases', 'readwrite');
      const store = tx.objectStore('db_viewer_databases');
      store.delete(dbId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not delete db viewer database:', err);
  }
}

export async function loadDbViewerMeta(): Promise<PersistedViewerMeta | null> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('db_viewer_meta', 'readonly');
      const store = tx.objectStore('db_viewer_meta');
      const req = store.get('viewer_meta');
      req.onsuccess = () => resolve((req.result as PersistedViewerMeta) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function saveDbViewerMeta(meta: PersistedViewerMeta): Promise<void> {
  try {
    const db = await openStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction('db_viewer_meta', 'readwrite');
      const store = tx.objectStore('db_viewer_meta');
      store.put(meta, 'viewer_meta');
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}

// ==========================================
// EXPIRATION UTILITY HELPERS
// ==========================================

/**
 * Returns human-readable time remaining before expiration based on TTL
 */
export function formatTtlRemaining(updatedAt: number, ttlMs: number): string {
  const elapsed = Date.now() - (updatedAt || Date.now());
  const remaining = Math.max(0, ttlMs - elapsed);
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${Math.max(1, minutes)}m left`;
}

/**
 * Periodically purge expired records across all stores
 */
export async function purgeAllExpiredRecords(): Promise<{
  purgedStudioFiles: number;
  purgedStudioDbs: number;
  purgedViewerDbs: number;
}> {
  let purgedStudioFiles = 0;
  let purgedStudioDbs = 0;
  let purgedViewerDbs = 0;

  try {
    const db = await openStudioDB();
    const now = Date.now();

    // 1. Purge SQL studio files (>12h)
    await new Promise<void>((resolve) => {
      const tx = db.transaction('sql_studio_files', 'readwrite');
      const store = tx.objectStore('sql_studio_files');
      const req = store.getAll();
      req.onsuccess = () => {
        const records: PersistedQueryFile[] = req.result || [];
        for (const r of records) {
          if (now - (r.updatedAt || 0) > SQL_STUDIO_TTL_MS) {
            store.delete(r.id);
            purgedStudioFiles++;
          }
        }
        resolve();
      };
      req.onerror = () => resolve();
    });

    // 2. Purge SQL studio databases (>12h)
    await new Promise<void>((resolve) => {
      const tx = db.transaction('sql_studio_databases', 'readwrite');
      const store = tx.objectStore('sql_studio_databases');
      const req = store.getAll();
      req.onsuccess = () => {
        const records: PersistedDatabaseRecord[] = req.result || [];
        for (const r of records) {
          if (now - (r.updatedAt || 0) > SQL_STUDIO_TTL_MS) {
            store.delete(r.id);
            purgedStudioDbs++;
          }
        }
        resolve();
      };
      req.onerror = () => resolve();
    });

    // 3. Purge DB viewer databases (>6h)
    await new Promise<void>((resolve) => {
      const tx = db.transaction('db_viewer_databases', 'readwrite');
      const store = tx.objectStore('db_viewer_databases');
      const req = store.getAll();
      req.onsuccess = () => {
        const records: PersistedDatabaseRecord[] = req.result || [];
        for (const r of records) {
          if (now - (r.updatedAt || 0) > DB_VIEWER_TTL_MS) {
            store.delete(r.id);
            purgedViewerDbs++;
          }
        }
        resolve();
      };
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Error during purgeAllExpiredRecords:', err);
  }

  return { purgedStudioFiles, purgedStudioDbs, purgedViewerDbs };
}

// ==========================================
// PLAYGROUND METHODS (12 HOUR TTL)
// ==========================================

export const PLAYGROUND_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export interface PersistedPlaygroundFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isRemovable: boolean;
  folderId?: string | null;
  updatedAt?: number;
}

export interface PersistedPlaygroundFolder {
  id: string;
  name: string;
  parentId?: string | null;
  isOpen?: boolean;
}

export interface PersistedPlaygroundWorkspace {
  language: string;
  files: PersistedPlaygroundFile[];
  folders: PersistedPlaygroundFolder[];
  activeFileId: string;
  openTabIds: string[];
  updatedAt: number; // timestamp in ms
}

const PLAYGROUND_FILES_PREFIX = 'msk_playground_saved_files_';
const PLAYGROUND_FOLDERS_PREFIX = 'msk_playground_saved_folders_';
const PLAYGROUND_META_PREFIX = 'msk_playground_saved_meta_';

export async function loadPlaygroundWorkspace(
  language: string
): Promise<PersistedPlaygroundWorkspace | null> {
  const now = Date.now();

  try {
    const db = await openStudioDB();
    const result = await new Promise<PersistedPlaygroundWorkspace | null>((resolve) => {
      const tx = db.transaction('playground_workspaces', 'readwrite');
      const store = tx.objectStore('playground_workspaces');
      const req = store.get(language);

      req.onsuccess = () => {
        const item = req.result as PersistedPlaygroundWorkspace | undefined;
        if (!item) {
          resolve(null);
          return;
        }
        const age = now - (item.updatedAt || 0);
        if (age > PLAYGROUND_TTL_MS) {
          // Expired after 12 hours: purge
          store.delete(language);
          try {
            localStorage.removeItem(`${PLAYGROUND_FILES_PREFIX}${language}`);
            localStorage.removeItem(`${PLAYGROUND_FOLDERS_PREFIX}${language}`);
            localStorage.removeItem(`${PLAYGROUND_META_PREFIX}${language}`);
          } catch {}
          resolve(null);
        } else {
          resolve(item);
        }
      };

      req.onerror = () => resolve(null);
    });

    if (result) return result;
  } catch (err) {
    console.warn('Could not read playground workspace from IndexedDB:', err);
  }

  // Fallback to localStorage with 12h TTL check
  try {
    const savedMetaStr = localStorage.getItem(`${PLAYGROUND_META_PREFIX}${language}`);
    const savedFilesStr = localStorage.getItem(`${PLAYGROUND_FILES_PREFIX}${language}`);
    const savedFoldersStr = localStorage.getItem(`${PLAYGROUND_FOLDERS_PREFIX}${language}`);

    if (savedFilesStr) {
      const files = JSON.parse(savedFilesStr);
      const folders = savedFoldersStr ? JSON.parse(savedFoldersStr) : [];
      let updatedAt = now;
      let activeFileId = files[0]?.id || '';
      let openTabIds = files.map((f: any) => f.id);

      if (savedMetaStr) {
        const meta = JSON.parse(savedMetaStr);
        if (meta.updatedAt) {
          updatedAt = meta.updatedAt;
          if (now - updatedAt > PLAYGROUND_TTL_MS) {
            // Expired in localStorage
            localStorage.removeItem(`${PLAYGROUND_FILES_PREFIX}${language}`);
            localStorage.removeItem(`${PLAYGROUND_FOLDERS_PREFIX}${language}`);
            localStorage.removeItem(`${PLAYGROUND_META_PREFIX}${language}`);
            return null;
          }
        }
        if (meta.activeFileId) activeFileId = meta.activeFileId;
        if (Array.isArray(meta.openTabIds)) openTabIds = meta.openTabIds;
      }

      const workspace: PersistedPlaygroundWorkspace = {
        language,
        files,
        folders,
        activeFileId,
        openTabIds,
        updatedAt,
      };

      // Migrate to IndexedDB
      savePlaygroundWorkspace(workspace).catch(() => {});
      return workspace;
    }
  } catch {}

  return null;
}

export async function savePlaygroundWorkspace(
  workspace: PersistedPlaygroundWorkspace
): Promise<void> {
  const recordWithTimestamp = {
    ...workspace,
    updatedAt: workspace.updatedAt || Date.now(),
  };

  // 1. IndexedDB primary store
  try {
    const db = await openStudioDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction('playground_workspaces', 'readwrite');
      const store = tx.objectStore('playground_workspaces');
      store.put(recordWithTimestamp);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not save playground workspace to IndexedDB:', err);
  }

  // 2. localStorage backup
  try {
    localStorage.setItem(
      `${PLAYGROUND_FILES_PREFIX}${workspace.language}`,
      JSON.stringify(workspace.files)
    );
    localStorage.setItem(
      `${PLAYGROUND_FOLDERS_PREFIX}${workspace.language}`,
      JSON.stringify(workspace.folders)
    );
    localStorage.setItem(
      `${PLAYGROUND_META_PREFIX}${workspace.language}`,
      JSON.stringify({
        activeFileId: workspace.activeFileId,
        openTabIds: workspace.openTabIds,
        updatedAt: recordWithTimestamp.updatedAt,
      })
    );
  } catch {}
}

export async function deletePlaygroundWorkspace(language: string): Promise<void> {
  try {
    const db = await openStudioDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction('playground_workspaces', 'readwrite');
      const store = tx.objectStore('playground_workspaces');
      store.delete(language);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}

  try {
    localStorage.removeItem(`${PLAYGROUND_FILES_PREFIX}${language}`);
    localStorage.removeItem(`${PLAYGROUND_FOLDERS_PREFIX}${language}`);
    localStorage.removeItem(`${PLAYGROUND_META_PREFIX}${language}`);
  } catch {}
}

export async function purgeAllExpiredPlaygroundWorkspaces(): Promise<number> {
  let purged = 0;
  const now = Date.now();

  try {
    const db = await openStudioDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction('playground_workspaces', 'readwrite');
      const store = tx.objectStore('playground_workspaces');
      const req = store.getAll();

      req.onsuccess = () => {
        const list: PersistedPlaygroundWorkspace[] = req.result || [];
        for (const item of list) {
          if (now - (item.updatedAt || 0) > PLAYGROUND_TTL_MS) {
            store.delete(item.language);
            try {
              localStorage.removeItem(`${PLAYGROUND_FILES_PREFIX}${item.language}`);
              localStorage.removeItem(`${PLAYGROUND_FOLDERS_PREFIX}${item.language}`);
              localStorage.removeItem(`${PLAYGROUND_META_PREFIX}${item.language}`);
            } catch {}
            purged++;
          }
        }
        resolve();
      };

      req.onerror = () => resolve();
    });
  } catch {}

  return purged;
}
