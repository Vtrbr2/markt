import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { AdminLog } from './entities/admin-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(AdminLog)
    private adminLogRepository: Repository<AdminLog>,
  ) {}

  // Dashboard
  async getDashboard() {
    const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
      this.usersRepository.count(),
      this.productsRepository.count(),
      this.ordersRepository.count(),
      this.ordersRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'sum')
        .where('order.status != :canceled', { canceled: 'canceled' })
        .getRawOne(),
    ]);

    const recentOrders = await this.ordersRepository.find({
      relations: ['buyer'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue?.sum || 0),
      recentOrders,
    };
  }

  // Usuários
  async getUsers(page = 1, limit = 20, search?: string) {
    const where: any = {};
    if (search) {
      where.email = search;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUserRole(userId: string, role: UserRole, adminId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    user.role = role;
    await this.usersRepository.save(user);

    await this.logAction(adminId, 'update_role', 'user', userId, { newRole: role });
    return { message: 'Role atualizada' };
  }

  async banUser(userId: string, adminId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    user.role = UserRole.BUYER; // Rebaixa para comprador como "banimento"
    await this.usersRepository.save(user);

    await this.logAction(adminId, 'ban_user', 'user', userId, {});
    return { message: 'Usuário banido' };
  }

  // Produtos
  async getProducts(page = 1, limit = 20, status?: ProductStatus) {
    const where: any = {};
    if (status) where.status = status;

    const [products, total] = await this.productsRepository.findAndCount({
      where,
      relations: ['seller', 'seller.user', 'images'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateProductStatus(productId: string, status: ProductStatus, adminId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('Produto não encontrado');
    product.status = status;
    await this.productsRepository.save(product);

    await this.logAction(adminId, 'update_product_status', 'product', productId, { newStatus: status });
    return { message: 'Status atualizado' };
  }

  // Pedidos
  async getOrders(page = 1, limit = 20) {
    const [orders, total] = await this.ordersRepository.findAndCount({
      relations: ['buyer', 'items'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Logs
  async logAction(adminId: string, action: string, targetType: string, targetId?: string, details?: Record<string, any>) {
    const log = this.adminLogRepository.create({
      admin: { id: adminId },
      action,
      targetType,
      targetId,
      details,
    });
    return this.adminLogRepository.save(log);
  }

  async getLogs(page = 1, limit = 50) {
    const [logs, total] = await this.adminLogRepository.findAndCount({
      relations: ['admin'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: logs.map((log) => ({
        id: log.id,
        adminName: log.admin?.name || 'Sistema',
        action: log.action,
        targetType: log.targetType,
        targetId: log.targetId,
        details: log.details,
        createdAt: log.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
