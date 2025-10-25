// pages/api/checkout_sessions.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

/** Convert a major-unit price (e.g., 12.34) to minor units (e.g., 1234) safely */
const toMinor = (val) => {
  const n =
    typeof val === "number" ? val : Number(String(val).replace(/[^\d.]/g, "")); // remove £, commas, etc.
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

    // Set your default currency here ("gbp" since your UI uses £; change to "usd" if needed)
    const DEFAULT_CURRENCY = "gbp";

    const line_items = cart.map((item) => {
      const quantity = item?.quantity > 0 ? item.quantity : 1;

      if (item?.price == null) {
        throw new Error(
          `Item '${
            item?.title || "Unnamed"
          }' is missing a price for inline price_data`
        );
      }

      const unit_amount = toMinor(item.price);

      // Only pass an image if it's an absolute URL; Stripe rejects relative paths
      const imageUrl =
        (item?.image?.src &&
          /^https?:\/\//i.test(item.image.src) &&
          item.image.src) ||
        undefined;

      // Allow per-item currency override (e.g., item.currency), else fall back
      const currency = (item?.currency || DEFAULT_CURRENCY).toLowerCase();

      return {
        price_data: {
          currency,
          unit_amount, // integer in minor units
          product_data: {
            name: `${item?.title || "Item"}${
              item?.name ? `, ${item.name}` : ""
            }`,
            ...(imageUrl ? { images: [imageUrl] } : {}),
            // Optional: keep identifiers for later reconciliation
            metadata: {
              slug: item?.slug || "",
            },
          },
        },
        quantity,
      };
    });

    const origin = req.headers.origin ?? `http://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,

      // Optional niceties you can toggle on:
      // allow_promotion_codes: true,
      // automatic_tax: { enabled: true },
      // shipping_address_collection: { allowed_countries: ["GB", "US", "CA"] },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: { message: err.message } });
  }
}
