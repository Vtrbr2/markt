import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from './product-image.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  SOLD = 'sold',
  UNDER_REVIEW = 'under_review',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Seller, (seller) => seller.products, { nullable: false })
  seller: Seller;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.UNDER_REVIEW })
  status: ProductStatus;

  // Exemplo de variações: {"color": ["red","blue"], "size": ["P","M","G"]}
  @Column({ type: 'jsonb', nullable: true })
  variations?: Record<string, string[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
