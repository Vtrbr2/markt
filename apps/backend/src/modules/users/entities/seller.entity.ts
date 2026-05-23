import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ length: 100 })
  storeName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ type: 'enum', enum: ['active', 'suspended'], default: 'active' })
  status: string;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalSales: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
