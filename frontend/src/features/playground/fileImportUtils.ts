'use client';

import JSZip from 'jszip';
import { PlaygroundFile, PlaygroundFolder, SupportedLanguage } from './types';
import { detectLanguageFromExtension } from './FileExplorerSidebar';

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '__pycache__',
  'dist',
  'build',
  '.vscode',
  '.idea',
  'venv',
  '.venv',
  'env',
  '.env',
]);

const IGNORED_FILES = new Set([
  '.ds_store',
  'thumbs.db',
  'desktop.ini',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file max

/**
 * Check if a file looks like binary (contains null bytes or known binary ext)
 */
export function isBinaryFile(fileName: string, content?: string): boolean {
  const binaryExtensions = new Set([
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'svg', 'bmp',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'zip', 'tar', 'gz', 'rar', '7z',
    'exe', 'dll', 'so', 'dylib', 'bin', 'iso',
    'mp3', 'wav', 'ogg', 'mp4', 'webm', 'mov', 'avi',
    'pyc', 'class', 'o', 'obj',
  ]);
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (binaryExtensions.has(ext)) return true;

  if (content && content.slice(0, 1024).indexOf('\0') !== -1) {
    return true;
  }
  return false;
}

/**
 * Read multiple individual files uploaded via <input type="file" multiple />
 */
export async function readUploadedFiles(
  fileList: FileList | File[],
  targetFolderId?: string | null
): Promise<PlaygroundFile[]> {
  const result: PlaygroundFile[] = [];
  const files = Array.from(fileList);

  for (const file of files) {
    if (IGNORED_FILES.has(file.name.toLowerCase())) continue;
    if (file.name.startsWith('._')) continue;
    if (file.size > MAX_FILE_SIZE) continue;

    try {
      const text = await file.text();
      if (isBinaryFile(file.name, text)) continue;

      const lang = detectLanguageFromExtension(file.name);
      result.push({
        id: 'file-' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        language: lang,
        content: text,
        isRemovable: true,
        folderId: targetFolderId || null,
      });
    } catch (err) {
      console.warn(`Could not read uploaded file: ${file.name}`, err);
    }
  }

  return result;
}

export interface FolderParseResult {
  files: PlaygroundFile[];
  folders: PlaygroundFolder[];
  rootName: string;
}

/**
 * Parse an uploaded folder from <input webkitdirectory />
 */
export async function parseDirectoryFiles(fileList: FileList | File[]): Promise<FolderParseResult> {
  const files = Array.from(fileList);
  const folderMap = new Map<string, PlaygroundFolder>(); // relativePath -> PlaygroundFolder
  const parsedFiles: PlaygroundFile[] = [];
  let detectedRootName = 'project';

  // Step 1: Detect root folder name
  for (const file of files) {
    const relPath = file.webkitRelativePath || file.name;
    const parts = relPath.split(/[/\\]+/).filter(Boolean);
    if (parts.length > 1) {
      detectedRootName = parts[0];
      break;
    }
  }

  // Helper to ensure a folder hierarchy exists in folderMap
  const ensureFolder = (dirParts: string[]): string | null => {
    if (dirParts.length === 0) return null;

    let parentId: string | null = null;
    let accumulatedPath = '';

    for (let i = 0; i < dirParts.length; i++) {
      const folderName = dirParts[i];
      if (IGNORED_DIRS.has(folderName.toLowerCase()) || folderName.startsWith('.')) {
        return null; // Skip entire ignored folder branch
      }

      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${folderName}` : folderName;

      let folder = folderMap.get(accumulatedPath);
      if (!folder) {
        folder = {
          id: 'folder-' + Math.random().toString(36).substring(2, 9),
          name: folderName,
          parentId,
          isOpen: i === 0, // Open top-level folder by default
        };
        folderMap.set(accumulatedPath, folder);
      }
      parentId = folder.id;
    }

    return parentId;
  };

  // Step 2: Read each file and place into corresponding folder
  for (const file of files) {
    const relPath = file.webkitRelativePath || file.name;
    const parts = relPath.split(/[/\\]+/).filter(Boolean);

    const fileName = parts[parts.length - 1];
    if (IGNORED_FILES.has(fileName.toLowerCase()) || fileName.startsWith('._')) {
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      continue;
    }

    const dirParts = parts.slice(0, parts.length - 1);
    const parentFolderId = ensureFolder(dirParts);

    // If folder was ignored, skip file
    if (dirParts.length > 0 && parentFolderId === null) {
      continue;
    }

    try {
      const text = await file.text();
      if (isBinaryFile(fileName, text)) continue;

      const lang = detectLanguageFromExtension(fileName);
      parsedFiles.push({
        id: 'file-' + Math.random().toString(36).substring(2, 9),
        name: fileName,
        language: lang,
        content: text,
        isRemovable: true,
        folderId: parentFolderId,
      });
    } catch (err) {
      console.warn(`Could not read folder file: ${relPath}`, err);
    }
  }

  return {
    files: parsedFiles,
    folders: Array.from(folderMap.values()),
    rootName: detectedRootName,
  };
}

/**
 * Extract files and folders from a .zip archive using JSZip
 */
export async function extractZipArchive(zipFile: File): Promise<FolderParseResult> {
  const zip = await JSZip.loadAsync(zipFile);
  const folderMap = new Map<string, PlaygroundFolder>();
  const parsedFiles: PlaygroundFile[] = [];
  const rootName = zipFile.name.replace(/\.zip$/i, '') || 'project';

  // Ensure root folder for zip contents
  const rootFolderId = 'folder-' + Math.random().toString(36).substring(2, 9);
  const rootFolder: PlaygroundFolder = {
    id: rootFolderId,
    name: rootName,
    parentId: null,
    isOpen: true,
  };
  folderMap.set(rootName, rootFolder);

  const ensureFolderInZip = (dirParts: string[]): string | null => {
    let parentId: string | null = rootFolderId;
    let accumulatedPath = rootName;

    for (let i = 0; i < dirParts.length; i++) {
      const folderName = dirParts[i];
      if (IGNORED_DIRS.has(folderName.toLowerCase()) || folderName.startsWith('.')) {
        return null;
      }

      accumulatedPath = `${accumulatedPath}/${folderName}`;
      let folder = folderMap.get(accumulatedPath);
      if (!folder) {
        folder = {
          id: 'folder-' + Math.random().toString(36).substring(2, 9),
          name: folderName,
          parentId,
          isOpen: false,
        };
        folderMap.set(accumulatedPath, folder);
      }
      parentId = folder.id;
    }

    return parentId;
  };

  const filePromises: Promise<void>[] = [];

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;

    const parts = relativePath.split(/[/\\]+/).filter(Boolean);
    if (parts.length === 0) return;

    const fileName = parts[parts.length - 1];
    if (IGNORED_FILES.has(fileName.toLowerCase()) || fileName.startsWith('._')) return;

    const dirParts = parts.slice(0, parts.length - 1);
    const parentFolderId = ensureFolderInZip(dirParts);
    if (dirParts.length > 0 && parentFolderId === null) return;

    filePromises.push(
      (async () => {
        try {
          if (isBinaryFile(fileName)) return;
          const text = await zipEntry.async('string');
          if (isBinaryFile(fileName, text)) return;

          const lang = detectLanguageFromExtension(fileName);
          parsedFiles.push({
            id: 'file-' + Math.random().toString(36).substring(2, 9),
            name: fileName,
            language: lang,
            content: text,
            isRemovable: true,
            folderId: parentFolderId,
          });
        } catch (err) {
          console.warn(`Could not extract zip entry: ${relativePath}`, err);
        }
      })()
    );
  });

  await Promise.all(filePromises);

  return {
    files: parsedFiles,
    folders: Array.from(folderMap.values()),
    rootName,
  };
}

/**
 * Recursively read files and folders from a dropped DataTransferItemList
 */
export async function extractDroppedItems(
  dataTransfer: DataTransfer
): Promise<FolderParseResult> {
  const items = dataTransfer.items;
  const files: File[] = [];

  const entries: any[] = [];
  if (items && items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry?.();
      if (entry) {
        entries.push(entry);
      } else {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }
  }

  if (entries.length > 0) {
    const allFilesWithPaths: { file: File; path: string }[] = [];

    const traverseEntry = async (entry: any, path = ''): Promise<void> => {
      if (entry.isFile) {
        await new Promise<void>((resolve) => {
          entry.file((file: File) => {
            allFilesWithPaths.push({
              file,
              path: path ? `${path}/${file.name}` : file.name,
            });
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const entriesInDir: any[] = await new Promise((resolve) => {
          const resultEntries: any[] = [];
          const readNext = () => {
            dirReader.readEntries((batch: any[]) => {
              if (batch.length === 0) {
                resolve(resultEntries);
              } else {
                resultEntries.push(...batch);
                readNext();
              }
            });
          };
          readNext();
        });

        const newPath = path ? `${path}/${entry.name}` : entry.name;
        for (const child of entriesInDir) {
          await traverseEntry(child, newPath);
        }
      }
    };

    for (const entry of entries) {
      await traverseEntry(entry);
    }

    const pseudoFiles = allFilesWithPaths.map((item) => {
      Object.defineProperty(item.file, 'webkitRelativePath', {
        value: item.path,
        writable: true,
      });
      return item.file;
    });

    return parseDirectoryFiles(pseudoFiles);
  }

  const plainFiles = files.length > 0 ? files : Array.from(dataTransfer.files);
  const zipFile = plainFiles.find((f) => f.name.toLowerCase().endsWith('.zip'));
  if (zipFile) {
    return extractZipArchive(zipFile);
  }

  const uploaded = await readUploadedFiles(plainFiles);
  return {
    files: uploaded,
    folders: [],
    rootName: 'imported-files',
  };
}

/**
 * Detect primary language from a set of files
 */
export function detectPrimaryLanguage(files: PlaygroundFile[]): SupportedLanguage | null {
  const counts: Partial<Record<SupportedLanguage, number>> = {};

  for (const f of files) {
    counts[f.language] = (counts[f.language] || 0) + 1;
  }

  for (const f of files) {
    const lower = f.name.toLowerCase();
    if (lower === 'main.py' || lower === 'app.py') return 'python';
    if (lower === 'index.html') return 'html';
    if (lower === 'index.js' || lower === 'app.js' || lower === 'main.js') return 'javascript';
    if (lower === 'main.cpp') return 'cpp';
    if (lower === 'main.java') return 'java';
  }

  let maxCount = 0;
  let dominantLang: SupportedLanguage | null = null;
  for (const [lang, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantLang = lang as SupportedLanguage;
    }
  }

  return dominantLang;
}
