#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import yaml from "js-yaml";

function sqlEscape(str = "") {
  return String(str).replace(/'/g, "''");
}

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", stdio: "pipe", ...opts });
}

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

  // ——— Upsert current items ———
  for (const item of shopItems) {
    const id = sqlEscape(item.id);
    const title = sqlEscape(item.title);
    const name = sqlEscape(item.name);
    const price = Number(item.price);

    const checkCmd = `wrangler d1 execute shop-items --remote --command "SELECT id FROM shop_items WHERE id = '${id}'" --json`;

    let exists = false;
    try {
      const result = run(checkCmd);
      const parsed = JSON.parse(result);
      exists = parsed?.[0]?.results?.length > 0;
    } catch {
      console.log(`⚠️  Could not check ${item.id}, assuming new`);
    }

    if (exists) {
      const updateCmd = `wrangler d1 execute shop-items --remote --command "UPDATE shop_items SET title='${title}', name='${name}', price=${price}, updated_at=CURRENT_TIMESTAMP WHERE id='${id}'"`;
      execSync(updateCmd, { stdio: "inherit" });
      console.log(`✅ Updated: ${item.title}`);
    } else {
      const insertCmd = `wrangler d1 execute shop-items --remote --command "INSERT INTO shop_items (id, title, name, price, state) VALUES ('${id}', '${title}', '${name}', ${price}, 'no_stock')"`;
      execSync(insertCmd, { stdio: "inherit" });
      console.log(`✅ Created: ${item.title}`);
    }
  }

  // ——— Remove items that no longer exist in MDX ———
  console.log("🧹 Reconciling: removing rows not present in MDX…");

  // Get all existing ids from D1
  const existingRaw = run(
    `wrangler d1 execute shop-items --remote --command "SELECT id FROM shop_items" --json`
  );
  const existingIds =
    JSON.parse(existingRaw)?.[0]?.results?.map((r) => r.id) ?? [];

  const currentIds = new Set(shopItems.map((i) => String(i.id)));
  const toDelete = existingIds.filter((id) => !currentIds.has(String(id)));

  if (toDelete.length === 0) {
    console.log("🫧 Nothing to delete — D1 is in sync.");
  } else {
    // Delete in chunks to avoid overly long SQL
    const chunkSize = 200;
    for (let i = 0; i < toDelete.length; i += chunkSize) {
      const chunk = toDelete.slice(i, i + chunkSize);
      const idList = chunk.map((id) => `'${sqlEscape(id)}'`).join(",");
      const deleteCmd = `wrangler d1 execute shop-items --remote --command "DELETE FROM shop_items WHERE id IN (${idList})"`;
      execSync(deleteCmd, { stdio: "inherit" });
    }
    console.log(`🗑️  Deleted ${toDelete.length} item(s) no longer in MDX`);
  }

  console.log("✅ D1 sync complete!");
} catch (error) {
  console.error("❌ Sync failed:", error.message);
  process.exit(1);
}
