import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoriesRepository.findOneBy({ slug: dto.slug });
    if (existing) throw new ConflictException('Slug já existe');

    const category = this.categoriesRepository.create({
      name: dto.name,
      slug: dto.slug,
      iconUrl: dto.iconUrl,
    });

    if (dto.parentId) {
      const parent = await this.categoriesRepository.findOneBy({ id: dto.parentId });
      if (!parent) throw new NotFoundException('Categoria pai não encontrada');
      category.parent = parent;
    }

    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['children'],
      where: { parent: null }, // retorna apenas categorias raiz (com filhos aninhados)
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['children', 'parent'],
    });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoriesRepository.findOneBy({ slug: dto.slug });
      if (existing) throw new ConflictException('Slug já existe');
    }
    Object.assign(category, dto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}
