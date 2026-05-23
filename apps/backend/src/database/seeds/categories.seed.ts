import { AppDataSource } from '../data-source';
import { Category } from '../../modules/categories/entities/category.entity';

export async function seedCategories() {
  const repo = AppDataSource.getRepository(Category);
  const categories = [
    { name: 'Eletrônicos', slug: 'eletronicos' },
    { name: 'Moda', slug: 'moda' },
    { name: 'Casa e Decoração', slug: 'casa-decoracao' },
    { name: 'Esportes', slug: 'esportes' },
    { name: 'Brinquedos', slug: 'brinquedos' },
  ];

  for (const cat of categories) {
    const exists = await repo.findOneBy({ slug: cat.slug });
    if (!exists) {
      await repo.save(repo.create(cat));
    }
  }
  console.log('Categorias padrão inseridas.');
}
