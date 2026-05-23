import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column({ nullable: true })
  iconUrl?: string;
}
