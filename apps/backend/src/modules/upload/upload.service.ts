import { Injectable, Inject } from '@nestjs/common';
import { StorageProvider, UploadedFile } from './providers/storage-provider.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject('STORAGE_PROVIDER')
    private storageProvider: StorageProvider,
  ) {}

  /**
   * Faz upload de múltiplos arquivos.
   * @param files - Arquivos recebidos pelo Multer
   * @param folder - Pasta destino (ex: "products", "avatars")
   */
  async uploadMultiple(files: Express.Multer.File[], folder: string): Promise<UploadedFile[]> {
    const results: UploadedFile[] = [];
    for (const file of files) {
      const uploaded = await this.storageProvider.save(file, folder);
      results.push(uploaded);
    }
    return results;
  }

  /**
   * Remove um arquivo pela key.
   */
  async deleteFile(key: string): Promise<void> {
    await this.storageProvider.delete(key);
  }

  /**
   * Retorna URL de um arquivo.
   */
  getFileUrl(key: string): string {
    return this.storageProvider.getUrl(key);
  }
}
