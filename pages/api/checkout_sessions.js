// pages/api/checkout_sessions.js
import Stripe from "stripe";

// --- Your shipping rates ---
const SHIPPING_RATES = {
  pickup: "shr_1SMT7gB6Xc806YyHfVmncn64",
  uk: "shr_1SMT8EB6Xc806YyHX1WkwMpr",
  international: "shr_1SMT8aB6Xc806YyHxhrLogB2",
  free: "shr_1SMTC6B6Xc806YyHZQGg9fGy",
};

// £300.00 → 30000 (minor units)
const FREE_THRESHOLD_MINOR = 30000;

// Reuse a single Stripe instance per Worker
let _stripe = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key)
    throw new Error("Missing STRIPE_SECRET_KEY (set it as a Worker secret)");
  if (_stripe) return _stripe;
  _stripe = new Stripe(key, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });
  return _stripe;
}

function toMinor(val) {
  const n =
    typeof val === "number"
      ? val
      : Number(String(val ?? "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) throw new Error(`Invalid price value '${val}'`);
  return Math.round(n * 100);
}

function getOrigin(req) {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (base) return base.replace(/\/$/, "");

  const xfProtoRaw = req.headers["x-forwarded-proto"];
  const xfProto = Array.isArray(xfProtoRaw) ? xfProtoRaw[0] : xfProtoRaw;
  const proto = (xfProto && xfProto.split(",")[0]) || "https";

  const xfHostRaw = req.headers["x-forwarded-host"];
  const xfHost = Array.isArray(xfHostRaw) ? xfHostRaw[0] : xfHostRaw;
  const host = xfHost || req.headers.host || "localhost:3000";

  return `${proto}://${host}`;
}

function toAbsoluteUrl(req, u) {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return `${getOrigin(req)}${u}`;
  return undefined;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const cart = Array.isArray(body?.cart) ? body.cart : [];
    if (cart.length === 0) {
      return res
        .status(400)
        .json({ error: { message: "Cart is empty or invalid" } });
    }

    // ✅ Collect item IDs (prefer explicit cart_ids from client; otherwise derive from cart)
    const explicitIds = Array.isArray(body?.cart_ids) ? body.cart_ids : [];
    const derivedIds = cart.map((i) => i?.id).filter(Boolean);
    const cartIds = Array.from(new Set([...explicitIds, ...derivedIds])).map(
      String,
    );

    const DEFAULT_CURRENCY = "gbp";

    const line_items = cart.map((item) => {
      const quantity = item?.quantity > 0 ? item.quantity : 1;
      if (item?.price == null) {
        throw new Error(
          `Item '${item?.title || "Unnamed"}' is missing a price`,
        );
      }
      const unit_amount = toMinor(item.price);

      const rawImg =
        (typeof item?.image === "string" && item.image) ||
        item?.image?.src ||
        item?.image?.url ||
        item?.image?.path;
      const imageUrl = toAbsoluteUrl(req, rawImg);
      const currency = (item?.currency || DEFAULT_CURRENCY).toLowerCase();

      return {
        price_data: {
          currency,
          unit_amount,
          product_data: {
            name: `${item?.title || "Item"}${
              item?.name ? `, ${item.name}` : ""
            }`,
            metadata: {
              id: item?.id ? String(item.id) : "",
              slug: item?.slug || "",
            },
          },
        },
        quantity,
      };
    });

    const subtotalMinor = line_items.reduce(
      (sum, li) => sum + (li.price_data.unit_amount || 0) * (li.quantity || 1),
      0,
    );

    const baseRates = Object.entries(SHIPPING_RATES)
      .filter(([key, id]) => key !== "free" && typeof id === "string" && id)
      .map(([, id]) => ({ shipping_rate: id }));

    const shipping_options =
      SHIPPING_RATES.free && subtotalMinor >= FREE_THRESHOLD_MINOR
        ? [{ shipping_rate: SHIPPING_RATES.free }, ...baseRates]
        : baseRates;

    if (shipping_options.length === 0) {
      return res.status(400).json({
        error: {
          message:
            "No shipping methods available. Please review your configuration.",
        },
      });
    }

    const origin = getOrigin(req);
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/basket`,
      shipping_address_collection: { allowed_countries: ["GB", "US", "CA"] },
      shipping_options,
      allow_promotion_codes: true,
      // automatic_tax: { enabled: true },

      // ✅ Put your IDs on the session so success page can flip D1 deterministically
      metadata: {
        in_stock_ids: JSON.stringify(cartIds),
      },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("checkout_sessions error:", err);
    return res
      .status(500)
      .json({ error: { message: err?.message || "Unexpected error" } });
  }
}
