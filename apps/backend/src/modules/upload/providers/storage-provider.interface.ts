export interface UploadedFile {
  url: string;          // URL pública (ou local)
  key: string;          // identificador único (caminho relativo ou id no cloud)
  filename: string;     // nome original
  mimetype: string;
  size: number;
}

export interface StorageProvider {
  /**
   * Salva um arquivo e retorna seus metadados.
   * @param file - Buffer e informações do arquivo
   * @param folder - Pasta de destino (ex: "products", "avatars")
   */
  save(file: Express.Multer.File, folder: string): Promise<UploadedFile>;

  /**
   * Remove um arquivo pelo identificador (key).
   */
  delete(key: string): Promise<void>;

  /**
   * (Opcional) Retorna URL pública a partir da key.
   */
  getUrl(key: string): string;
}
