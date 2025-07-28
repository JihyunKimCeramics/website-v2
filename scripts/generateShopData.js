import { generateSlug } from "../components/generateSlug";

const fs = require("fs-extra");
const matter = require("gray-matter");

async function generate() {
  const mdx = await fs.readFile("content/index.mdx", "utf8");
  const { data } = matter(mdx);
  const rawItems = data.shopPage?.shopItems || [];
  const items = rawItems.map((i) => ({
    id: i.id,
    title: i.title,
    name: i.name,
    price: i.price,
    showItem: i.showItem,
    link: `${generateSlug(i.title)}_${generateSlug(i.name)}`,
  }));
  await fs.ensureDir("public");
  await fs.writeJson("public/shopData.json", items, { spaces: 2 });
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
