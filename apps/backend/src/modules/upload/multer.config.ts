import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB por arquivo
    files: 10,                  // máximo de 10 arquivos por upload
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException(`Formato não permitido: ${file.mimetype}. Use JPG, PNG, WebP ou GIF.`), false);
    }
  },
};
