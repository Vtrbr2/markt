import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedAdmin() {
  const repo = AppDataSource.getRepository(User);
  const adminEmail = 'admin@marketplace.com';
  const existing = await repo.findOneBy({ email: adminEmail });
  if (!existing) {
    const admin = repo.create({
      name: 'Administrador',
      email: adminEmail,
      passwordHash: await bcrypt.hash('Admin123!', 12),
      role: UserRole.ADMIN,
    });
    await repo.save(admin);
    console.log('Usuário admin criado: admin@marketplace.com / Admin123!');
  } else {
    console.log('Admin já existe.');
  }
}
