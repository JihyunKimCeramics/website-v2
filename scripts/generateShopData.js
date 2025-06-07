# scripts/generateShopData.js
const fs = require('fs-extra');
const matter = require('gray-matter');

async function generate() {
  // 1. Read MDX
  const mdx = await fs.readFile('content/index.mdx', 'utf8');
  // 2. Parse front-matter
  const { data } = matter(mdx);
  const rawItems = data.shopPage?.shopItems || [];
  // 3. Normalize items
  const items = rawItems.map(i => ({
    title: i.title,
    name: i.name,
    price: i.price
  }));
  // 4. Write JSON
  await fs.ensureDir('public');
  await fs.writeJson('public/shopData.json', items, { spaces: 2 });
  console.log(`✅ Wrote ${items.length} items to public/shopData.json`);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
