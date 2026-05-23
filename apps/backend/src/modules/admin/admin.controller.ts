import { Controller, Get, Patch, Param, Query, UseGuards, Req, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ProductStatus } from '../products/entities/product.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(+page, +limit, search);
  }

  @Patch('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: UserRole, @Req() req) {
    return this.adminService.updateUserRole(id, role, req.user.userId);
  }

  @Patch('users/:id/ban')
  async banUser(@Param('id') id: string, @Req() req) {
    return this.adminService.banUser(id, req.user.userId);
  }

  @Get('products')
  async getProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: ProductStatus,
  ) {
    return this.adminService.getProducts(+page, +limit, status);
  }

  @Patch('products/:id/status')
  async updateProductStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
    @Req() req,
  ) {
    return this.adminService.updateProductStatus(id, status, req.user.userId);
  }

  @Get('orders')
  async getOrders(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getOrders(+page, +limit);
  }

  @Get('logs')
  async getLogs(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.adminService.getLogs(+page, +limit);
  }
}
