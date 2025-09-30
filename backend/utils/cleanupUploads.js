import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

const uploadsDir = path.resolve('uploads');

/**
 * Returns true if file removed, false if file didn't exist.
 */
export async function deleteFile(filePath) {
  try {
    const abs = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    if (!abs.startsWith(uploadsDir)) {
      // Safety: avoid removing files outside uploads directory
      throw new Error('Refusing to delete files outside uploads directory');
    }

    await unlink(abs);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false; // file doesn't exist
    }
    throw err;
  }
}

/**
 * Returns array of deleted filenames.
 */
export async function clearOldUploads(ageMs = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  const deleted = [];

  try {
    const files = await readdir(uploadsDir);
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      try {
        const s = await stat(filePath);
        const mtime = s.mtimeMs || s.mtime.getTime();
        if (now - mtime > ageMs) {
          await unlink(filePath);
          deleted.push(file);
        }
      } catch (innerErr) {
        // If a file disappears in the meantime, ignore and continue
        if (innerErr.code !== 'ENOENT') {
          console.error('Error checking/deleting file', filePath, innerErr);
        }
      }
    }
  } catch (err) {
    // If uploads directory doesn't exist, nothing to do
    if (err.code === 'ENOENT') return deleted;
    throw err;
  }

  return deleted;
}

/**
 * delete uploaded file (used after DB save)
 */
export async function safeRemove(filePath) {
  try {
    await deleteFile(filePath);
  } catch (err) {
    console.error('safeRemove error for', filePath, err);
  }
}
