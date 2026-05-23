import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('admin_logs')
export class AdminLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  admin?: User;

  @Column()
  action: string;

  @Column()
  targetType: string; // ex: 'user', 'product', 'order'

  @Column({ type: 'uuid', nullable: true })
  targetId?: string;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
