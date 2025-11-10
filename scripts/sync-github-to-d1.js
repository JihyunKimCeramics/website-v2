#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import yaml from "js-yaml";

try {
  console.log("🔄 Starting GitHub → D1 sync...");

  const content = fs.readFileSync("./content/index.mdx", "utf8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    console.log("⚠️  No frontmatter found, skipping sync");
    process.exit(0);
  }

  const data = yaml.load(frontmatterMatch[1]);
  const shopItems = (data.shopPage?.shopItems || []).filter((i) => i.showItem);

  console.log(`📦 Found ${shopItems.length} items to sync`);

  for (const item of shopItems) {
    // Escape single quotes for SQL
    const title = item.title.replace(/'/g, "''");
    const name = item.name.replace(/'/g, "''");

    const checkCmd = `wrangler d1 execute shop-items --remote --command "SELECT id FROM shop_items WHERE id = '${item.id}'" --json`;

    let exists = false;
    try {
      const result = execSync(checkCmd, { encoding: "utf8" });
      const parsed = JSON.parse(result);
      exists = parsed[0]?.results?.length > 0;
    } catch (err) {
      console.log(`⚠️  Could not check ${item.id}, assuming new`);
    }

    if (exists) {
      const updateCmd = `wrangler d1 execute shop-items --remote --command "UPDATE shop_items SET title = '${title}', name = '${name}', price = ${item.price}, updated_at = CURRENT_TIMESTAMP WHERE id = '${item.id}'"`;
      execSync(updateCmd, { stdio: "inherit" });
      console.log(`✅ Updated: ${item.title}`);
    } else {
      const insertCmd = `wrangler d1 execute shop-items --remote --command "INSERT INTO shop_items (id, title, name, price, state) VALUES ('${item.id}', '${title}', '${name}', ${item.price}, 'no_stock')"`;
      execSync(insertCmd, { stdio: "inherit" });
      console.log(`✅ Created: ${item.title}`);
    }
  }

  console.log("✅ D1 sync complete!");
} catch (error) {
  console.error("❌ Sync failed:", error.message);
  process.exit(1);
}
