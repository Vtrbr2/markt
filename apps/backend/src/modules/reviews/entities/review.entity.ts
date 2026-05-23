import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Order, { nullable: true })
  order?: Order;

  @ManyToOne(() => User, (user) => user.reviews)
  reviewer: User;

  @Column({ type: 'uuid', nullable: true })
  sellerId?: string; // referência ao seller avaliado, facilita queries

  @Column({ type: 'int', width: 1 })
  rating: number; // 1 a 5

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;
}
