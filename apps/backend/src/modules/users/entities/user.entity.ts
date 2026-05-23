import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Address } from './address.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviews: Review[];
}
