import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Obtém ou cria um carrinho para o usuário.
   */
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.images'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      cart = await this.cartRepository.save(cart);
      cart.items = [];
    }

    return cart;
  }

  /**
   * Retorna o carrinho do usuário logado.
   */
  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    // Calcula totais
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          stock: item.product.stock,
          images: item.product.images,
        },
        quantity: item.quantity,
        variation: item.variation,
        subtotal: Number(item.product.price) * item.quantity,
      })),
      totalItems,
      subtotal,
    };
  }

  /**
   * Adiciona um item ao carrinho.
   */
  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Estoque insuficiente. Disponível: ${product.stock}`);
    }

    // Verifica se o produto já está no carrinho com a mesma variação
    const existingItem = cart.items.find(
      (item) =>
        item.product.id === dto.productId &&
        JSON.stringify(item.variation) === JSON.stringify(dto.variation || {}),
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException(`Estoque insuficiente para a quantidade total. Disponível: ${product.stock}`);
      }
      existingItem.quantity = newQuantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: dto.quantity,
        variation: dto.variation,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  /**
   * Atualiza a quantidade de um item do carrinho.
   */
  async updateItemQuantity(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cart.id } },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    if (cartItem.product.stock < dto.quantity) {
      throw new BadRequestException(`Estoque insuficiente. Disponível: ${cartItem.product.stock}`);
    }

    cartItem.quantity = dto.quantity;
    await this.cartItemRepository.save(cartItem);

    return this.getCart(userId);
  }

  /**
   * Remove um item do carrinho.
   */
  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cart.id } },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getCart(userId);
  }

  /**
   * Esvazia o carrinho (chamado após criar pedido).
   */
  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });
    if (cart) {
      await this.cartItemRepository.remove(cart.items);
    }
  }
}
