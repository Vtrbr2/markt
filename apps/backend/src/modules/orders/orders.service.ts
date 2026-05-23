import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cartService: CartService,
  ) {}

  /**
   * Cria um pedido a partir do carrinho do usuário.
   */
  async createFromCart(userId: string, dto: CreateOrderDto) {
    const cart = await this.cartService.getOrCreateCart(userId);

    if (!cart.items.length) {
      throw new BadRequestException('Carrinho vazio');
    }

    // Validar endereço
    if (!dto.shippingAddress && !dto.addressId) {
      throw new BadRequestException('Informe um endereço de entrega');
    }

    // Se usou addressId, buscar endereço (implementaremos no módulo de addresses futuramente)
    const shippingAddress = dto.shippingAddress || {
      street: 'Endereço temporário',
      number: '0',
      city: 'Cidade',
      state: 'SP',
      zipCode: '00000-000',
    };

    // Validar estoque de todos os itens
    const orderItems: Partial<OrderItem>[] = [];
    let total = 0;
    const sellers = new Set<string>();

    for (const item of cart.items) {
      const product = await this.productRepository.findOneBy({ id: item.product.id });
      if (!product) {
        throw new NotFoundException(`Produto ${item.product.title} não encontrado`);
      }
      if (product.status !== ProductStatus.ACTIVE) {
        throw new BadRequestException(`Produto ${product.title} não está disponível`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para ${product.title}. Disponível: ${product.stock}`);
      }

      // Debitar estoque
      product.stock -= item.quantity;
      await this.productRepository.save(product);

      const unitPrice = Number(product.price);
      orderItems.push({
        product,
        productSnapshot: {
          title: product.title,
          price: unitPrice,
          imageUrl: product.images?.[0]?.url,
        },
        quantity: item.quantity,
        unitPrice,
      });
      total += unitPrice * item.quantity;

      if (product.seller) {
        sellers.add(product.seller.id);
      }
    }

    // Criar pedido
    const order = this.orderRepository.create({
      buyer: { id: userId },
      sellerId: sellers.size === 1 ? Array.from(sellers)[0] : undefined, // marketplace: múltiplos sellers
      status: OrderStatus.PENDING,
      total,
      shippingAddress,
    });
    const savedOrder = await this.orderRepository.save(order);

    // Criar order items
    for (const item of orderItems) {
      const orderItem = this.orderItemRepository.create({
        ...item,
        order: savedOrder,
      });
      await this.orderItemRepository.save(orderItem);
    }

    // Limpar carrinho
    await this.cartService.clearCart(userId);

    // Retornar pedido completo
    return this.findOne(savedOrder.id);
  }

  /**
   * Lista pedidos do comprador.
   */
  async findByBuyer(userId: string) {
    return this.orderRepository.find({
      where: { buyer: { id: userId } },
      relations: ['items', 'items.product', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Lista vendas do vendedor.
   */
  async findBySeller(sellerId: string) {
    return this.orderRepository.find({
      where: { sellerId },
      relations: ['items', 'items.product', 'payment', 'buyer'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca um pedido por ID.
   */
  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'payment', 'buyer'],
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  /**
   * Atualiza status do pedido (vendedor ou admin).
   */
  async updateStatus(orderId: string, newStatus: OrderStatus, userId: string, userRole: UserRole) {
    const order = await this.findOne(orderId);

    // Regras de transição
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELED],
      [OrderStatus.PAID]: [OrderStatus.PREPARING, OrderStatus.CANCELED],
      [OrderStatus.PREPARING]: [OrderStatus.SHIPPED, OrderStatus.CANCELED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELED]: [],
    };

    if (!validTransitions[order.status].includes(newStatus)) {
      throw new BadRequestException(
        `Transição inválida: de ${order.status} para ${newStatus}`,
      );
    }

    // Permissões
    if (userRole === UserRole.SELLER) {
      if (order.sellerId !== userId) {
        throw new ForbiddenException('Este pedido não pertence à sua loja');
      }
      // Vendedor só pode mover para PREPARING ou SHIPPED
      if (![OrderStatus.PREPARING, OrderStatus.SHIPPED].includes(newStatus)) {
        throw new ForbiddenException('Você não pode alterar para este status');
      }
    }

    // Se cancelar, devolver estoque
    if (newStatus === OrderStatus.CANCELED && order.status !== OrderStatus.CANCELED) {
      for (const item of order.items) {
        const product = await this.productRepository.findOneBy({ id: item.product.id });
        if (product) {
          product.stock += item.quantity;
          await this.productRepository.save(product);
        }
      }
    }

    order.status = newStatus;
    return this.orderRepository.save(order);
  }
}
