import path from 'path';
import { unlink, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

/**
 * Menyimpan file ke dalam direktori yang ditentukan
 */
export async function saveFile(file, dir) {
  try {
    if (!file || !file.buffer || !file.originalname) {
      return { success: false, error: "File tidak valid" };
    }

    const uploadDir = path.resolve("img", dir);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, file.buffer);

    return {
      success: true,
      path: `/${path.posix.join(dir, fileName)}`,
      name: fileName
    };
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, error: "Gagal upload file" };
  }
}

/**
 * Menghapus file berdasarkan relative path
 */
export async function deleteFile(relativePath) {
  try {
    const fullPath = path.resolve("img", relativePath.replace(/^\/+/, ""));
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return { success: false, error: "Gagal menghapus file" };
  }
}

/**
 * Mengganti file lama dengan file baru
 */
export async function replaceFile(existingPath, newFile, dir) {
  try {
    if (!newFile || !newFile.name) {
      return { success: false, error: "File baru tidak valid" };
    }

    const uploadDir = path.resolve("img", dir);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const newFileName = `${Date.now()}-${newFile.name}`;
    const newFilePath = path.join(uploadDir, newFileName);
    const newRelativePath = path.posix.join(dir, newFileName);

    // Hapus file lama jika berbeda
    if (existingPath) {
      const normalizedOldPath = existingPath.replace(/\\/g, "/").replace(/^\/+/, "");
      if (normalizedOldPath !== newRelativePath) {
        const oldFilePath = path.resolve("img", normalizedOldPath);
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath);
          console.log(`Deleted old file: ${oldFilePath}`);
        }
      }
    }

    const buffer = await newFile.arrayBuffer();
    await writeFile(newFilePath, Buffer.from(buffer));

    console.log(`File uploaded successfully: ${newFilePath}`);
    return {
      success: true,
      path: `/${newRelativePath}`
    };
  } catch (err) {
    console.error("Replace error:", err);
    return { success: false, error: "Gagal mengganti file" };
  }
}
