// pages/api/checkout_sessions.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Your Shipping Rate IDs (Stripe Dashboard → Shipping rates)
// Just edit these IDs; the code will use whatever you put here.
const SHIPPING_RATES = {
  pickup: "shr_1SMT7gB6Xc806YyHfVmncn64",
  uk: "shr_1SMT8EB6Xc806YyHX1WkwMpr",
  international: "shr_1SMT8aB6Xc806YyHxhrLogB2",
  free: "shr_1SMTC6B6Xc806YyHZQGg9fGy", // must be a 0-amount rate
};

// Build the site's origin robustly behind proxies (Vercel, Netlify, etc.)
const getOrigin = (req) => {
  const proto = (req.headers["x-forwarded-proto"] || "http").split(",")[0];
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
};

const toAbsoluteUrl = (req, u) => {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u; // already absolute
  if (u.startsWith("/")) return `${getOrigin(req)}${u}`; // make absolute
  return undefined; // ignore blobs/data URIs/etc.
};

// £300.00 → 30000 (minor units)
const FREE_THRESHOLD_MINOR = 30000;

// Convert a major-unit price (e.g., 12.34) to minor units (e.g., 1234)
const toMinor = (val) => {
  const n =
    typeof val === "number" ? val : Number(String(val).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) throw new Error(`Invalid price value '${val}'`);
  return Math.round(n * 100);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { cart } = req.body || {};
    if (!Array.isArray(cart) || cart.length === 0) {
      return res
        .status(400)
        .json({ error: { message: "Cart is empty or invalid" } });
    }

    const DEFAULT_CURRENCY = "gbp";

    const line_items = cart.map((item) => {
      const quantity = item?.quantity > 0 ? item.quantity : 1;
      if (item?.price == null) {
        throw new Error(
          `Item '${item?.title || "Unnamed"}' is missing a price`
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
            ...(imageUrl ? { images: [imageUrl] } : {}),
            metadata: { slug: item?.slug || "" },
          },
        },
        quantity,
      };
    });

    // Subtotal in minor units
    const subtotalMinor = line_items.reduce(
      (sum, li) => sum + (li.price_data.unit_amount || 0) * (li.quantity || 1),
      0
    );

    // Build shipping_options automatically from SHIPPING_RATES
    const entries = Object.entries(SHIPPING_RATES);

    // Everything except "free"
    const baseRates = entries
      .filter(([key, id]) => key !== "free" && typeof id === "string" && id)
      .map(([, id]) => ({ shipping_rate: id }));

    // Add "free" first if threshold met
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

    const origin = req.headers.origin ?? `http://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      shipping_address_collection: { allowed_countries: ["GB", "US", "CA"] },
      shipping_options,
      allow_promotion_codes: true,
      // automatic_tax: { enabled: true },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
