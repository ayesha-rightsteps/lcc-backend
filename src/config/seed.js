import Category from '../models/category.model.js';

const SEED_CATEGORIES = [
  { name: 'Pak Army', slug: 'pak-army' },
  { name: 'Pak Air Force', slug: 'pak-air-force' },
  { name: 'Pak Navy', slug: 'pak-navy' },
];

const seedCategories = async () => {
  for (const cat of SEED_CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $setOnInsert: { ...cat, isActive: true } },
      { upsert: true, new: true }
    );
  }
};

export { seedCategories };
