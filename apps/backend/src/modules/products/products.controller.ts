import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, UseGuards, Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductStatus } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async create(@Body() dto: CreateProductDto, @Req() req) {
    return this.productsService.create(dto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req) {
    return this.productsService.update(id, dto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    await this.productsService.remove(id, req.user.userId, req.user.role);
    return { message: 'Produto removido' };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: ProductStatus, @Req() req) {
    return this.productsService.updateStatus(id, status, req.user.role);
  }
}
