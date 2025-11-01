export const runtime = "edge";

import Stripe from "stripe";

// Make sure STRIPE_SECRET_KEY is available at build time for Edge.
// Throw early if it's missing so you see a clear error.
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  // Ensure the SDK uses fetch in Edge/Workers
  // (safe if you're on a version that already defaults to fetch).
  httpClient: Stripe.createFetchHttpClient?.(),
});

// Your Shipping Rate IDs
const SHIPPING_RATES = {
  pickup: "shr_1SMT7gB6Xc806YyHfVmncn64",
  uk: "shr_1SMT8EB6Xc806YyHX1WkwMpr",
  international: "shr_1SMT8aB6Xc806YyHxhrLogB2",
  free: "shr_1SMTC6B6Xc806YyHZQGg9fGy",
};

// Build origin from standard proxy headers (works on Vercel/Netlify/Cloudflare)
const getOrigin = (req) => {
  const headers = req.headers;
  const proto = (headers.get("x-forwarded-proto") || "https").split(",")[0];
  const host =
    headers.get("x-forwarded-host") || headers.get("host") || "localhost:3000";
  return `${proto}://${host}`;
};

const toAbsoluteUrl = (req, u) => {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return `${getOrigin(req)}${u}`;
  return undefined;
};

// £300.00 → 30000 (minor units)
const FREE_THRESHOLD_MINOR = 30000;

const toMinor = (val) => {
  const n =
    typeof val === "number" ? val : Number(String(val).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) throw new Error(`Invalid price value '${val}'`);
  return Math.round(n * 100);
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  try {
    // Edge: parse JSON body via the Web API
    const { cart } = (await req.json()) || {};
    if (!Array.isArray(cart) || cart.length === 0) {
      return Response.json(
        { error: { message: "Cart is empty or invalid" } },
        { status: 400 }
      );
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

    const subtotalMinor = line_items.reduce(
      (sum, li) => sum + (li.price_data.unit_amount || 0) * (li.quantity || 1),
      0
    );

    const entries = Object.entries(SHIPPING_RATES);
    const baseRates = entries
      .filter(([key, id]) => key !== "free" && typeof id === "string" && id)
      .map(([, id]) => ({ shipping_rate: id }));

    const shipping_options =
      SHIPPING_RATES.free && subtotalMinor >= FREE_THRESHOLD_MINOR
        ? [{ shipping_rate: SHIPPING_RATES.free }, ...baseRates]
        : baseRates;

    if (shipping_options.length === 0) {
      return Response.json(
        {
          error: {
            message:
              "No shipping methods available. Please review your configuration.",
          },
        },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") ?? getOrigin(req);

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

    return Response.json({ id: session.id, url: session.url });
  } catch (err) {
    return Response.json(
      { error: { message: err?.message || "Unexpected error" } },
      { status: 500 }
    );
  }
}
