import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, FindOptionsWhere } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto, SortBy } from './dto/product-query.dto';
import { Seller } from '../sellers/entities/seller.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private imagesRepository: Repository<ProductImage>,
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
  ) {}

  async create(dto: CreateProductDto, userId: string): Promise<Product> {
    const seller = await this.sellersRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!seller) throw new NotFoundException('Perfil de vendedor não encontrado');

    const product = this.productsRepository.create({
      title: dto.title,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      variations: dto.variations,
      status: dto.status || ProductStatus.ACTIVE,
      seller,
    });

    if (dto.categoryId) {
      product.category = { id: dto.categoryId } as any;
    }

    const saved = await this.productsRepository.save(product);

    if (dto.images?.length) {
      const images = dto.images.map((img) =>
        this.imagesRepository.create({
          url: img.url,
          isPrimary: img.isPrimary || false,
          order: img.order || 0,
          product: saved,
        }),
      );
      await this.imagesRepository.save(images);
    }

    return this.findOne(saved.id);
  }

  async findAll(query: ProductQueryDto) {
    const { search, categoryId, minPrice, maxPrice, sort, page = 1, limit = 20 } = query;

    const where: FindOptionsWhere<Product> = {
      status: ProductStatus.ACTIVE,
    };

    if (categoryId) where.category = { id: categoryId };
    if (search) where.title = ILike(`%${search}%`);
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(minPrice || 0, maxPrice || 999999999);
    }

    let orderBy: any = { createdAt: 'DESC' };
    if (sort === SortBy.PRICE_ASC) orderBy = { price: 'ASC' };
    if (sort === SortBy.PRICE_DESC) orderBy = { price: 'DESC' };
    if (sort === SortBy.RECENT) orderBy = { createdAt: 'DESC' };

    const [products, total] = await this.productsRepository.findAndCount({
      where,
      relations: ['images', 'category', 'seller'],
      order: orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['images', 'category', 'seller', 'seller.user', 'reviews'],
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async update(id: string, dto: UpdateProductDto, userId: string, userRole: UserRole): Promise<Product> {
    const product = await this.findOne(id);

    // Apenas dono ou admin podem editar
    if (userRole !== UserRole.ADMIN && product.seller?.user?.id !== userId) {
      throw new ForbiddenException('Você não pode editar este produto');
    }

    if (dto.categoryId) {
      product.category = { id: dto.categoryId } as any;
    }

    Object.assign(product, dto);
    await this.productsRepository.save(product);

    if (dto.images) {
      await this.imagesRepository.delete({ product: { id } });
      const images = dto.images.map((img) =>
        this.imagesRepository.create({
          url: img.url,
          isPrimary: img.isPrimary || false,
          order: img.order || 0,
          product,
        }),
      );
      await this.imagesRepository.save(images);
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const product = await this.findOne(id);
    if (userRole !== UserRole.ADMIN && product.seller?.user?.id !== userId) {
      throw new ForbiddenException('Você não pode excluir este produto');
    }
    await this.productsRepository.remove(product);
  }

  async updateStatus(id: string, status: ProductStatus, userRole: UserRole): Promise<Product> {
    if (userRole !== UserRole.ADMIN) throw new ForbiddenException('Apenas administradores podem alterar o status');
    const product = await this.findOne(id);
    product.status = status;
    return this.productsRepository.save(product);
  }
}
