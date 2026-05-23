import { AppDataSource } from '../data-source';
import { seedCategories } from './categories.seed';
import { seedAdmin } from './admin.seed';

async function run() {
  await AppDataSource.initialize();
  await seedCategories();
  await seedAdmin();
  await AppDataSource.destroy();
  process.exit(0);
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
