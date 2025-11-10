// pages/api/inventory.js
// Pages Router API route for OpenNext + Cloudflare Workers.
// Returns ONLY in-stock IDs. Uses @opennextjs/cloudflare to access bindings.

import { getCloudflareContext } from "@opennextjs/cloudflare";

export default async function handler(req, res) {
  try {
    const method = req.method || "GET";

    // ✅ OpenNext way to access bindings in any server file
    let env;
    try {
      ({ env } = getCloudflareContext());
    } catch {
      env = undefined;
    }
    const shop_items = env?.shop_items;

    if (method === "GET") {
      // Local dev or missing binding -> don't crash; just return empty
      if (!shop_items) {
        return res
          .status(200)
          .json({ in_stock_ids: [], _hint: "no D1 binding" });
      }

      // Optional debug to inspect what the DB actually returns
      if (req.query?.debug === "1") {
        const sample = await shop_items
          .prepare("SELECT id, state FROM shop_items LIMIT 10")
          .all();
        const counts = await shop_items
          .prepare("SELECT state, COUNT(*) AS n FROM shop_items GROUP BY state")
          .all();
        return res.status(200).json({
          in_stock_ids: [],
          _debug_sample: sample?.results ?? [],
          _debug_counts: counts?.results ?? [],
        });
      }

      // Option B: tight query that only returns IDs you need
      const result = await shop_items
        .prepare("SELECT id FROM shop_items WHERE state = 'in_stock'")
        .all();

      const ids = (result?.results || []).map((r) => String(r.id));
      return res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ in_stock_ids: ids });
    }

    if (method === "POST") {
      if (!shop_items) {
        return res
          .status(503)
          .json({ error: "D1 binding 'shop_items' unavailable in this env" });
      }
      const body = parseJSON(req.body);
      const { id, state } = body || {};
      if (!id || !state) {
        return res
          .status(400)
          .json({ error: "Missing 'id' or 'state' in body" });
      }
      if (!["in_stock", "no_stock", "sold"].includes(state)) {
        return res
          .status(400)
          .json({ error: "state must be one of: in_stock | no_stock | sold" });
      }

      const result = await shop_items
        .prepare("UPDATE shop_items SET state = ? WHERE id = ?")
        .bind(state, id)
        .run();

      return res.status(200).json({ success: true, result });
    }

    return res.status(405).send("Method not allowed");
  } catch (err) {
    // Keep UI stable; return empty list on error
    return res
      .status(200)
      .json({ in_stock_ids: [], _error: String(err?.message || err) });
  }
}

function parseJSON(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}
