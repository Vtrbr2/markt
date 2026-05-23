import { Injectable } from '@nestjs/common';
import { StorageProvider, UploadedFile } from './storage-provider.interface';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private basePath: string;

  constructor() {
    this.basePath = process.env.UPLOAD_PATH || './uploads';
  }

  async save(file: Express.Multer.File, folder: string): Promise<UploadedFile> {
    const uploadDir = path.join(this.basePath, folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, file.buffer);

    const key = `${folder}/${filename}`;
    const url = `${process.env.API_URL || 'http://localhost:3001'}/uploads/${key}`;

    return {
      url,
      key,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // Arquivo já foi removido ou não existe
      if (err.code !== 'ENOENT') throw err;
    }
  }

  getUrl(key: string): string {
    return `${process.env.API_URL || 'http://localhost:3001'}/uploads/${key}`;
  }
}
