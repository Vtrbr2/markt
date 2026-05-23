import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { LocalStorageProvider } from './providers/local-storage.provider';

// Para trocar de provider, basta alterar este import e o useClass.
// Exemplo futuro:
// import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'STORAGE_PROVIDER',
      useClass: LocalStorageProvider,   // ← troque aqui por CloudinaryProvider, S3Provider etc.
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
