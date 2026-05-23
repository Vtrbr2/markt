import {
  Controller, Post, Delete, Param, UseGuards, UseInterceptors,
  UploadedFiles, Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { multerConfig } from './multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  /**
   * Upload de múltiplas imagens.
   * Exemplo de uso: POST /api/upload/images?folder=products
   * FormData: campo "files" com os arquivos.
   */
  @Post('images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    // Pasta pode vir por query, body ou definida por contexto
    const folder = req.query.folder || req.body?.folder || 'products';
    const results = await this.uploadService.uploadMultiple(files, folder);
    return {
      message: `${results.length} imagem(ns) enviada(s)`,
      images: results,
    };
  }

  /**
   * Remove uma imagem.
   * Exemplo: DELETE /api/upload/images/products/abc123.jpg
   */
  @Delete('images/*')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async deleteImage(@Param('0') key: string) {
    await this.uploadService.deleteFile(key);
    return { message: 'Imagem removida' };
  }
}
