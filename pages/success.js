// pages/success.js
import { client } from "../tina/__generated__/client";
import React, { useEffect, useRef } from "react";
import { useCart } from "../pages/_app";
import { tinaField, useTina } from "tinacms/dist/react";
import Open from "../public/images/open.svg";
import NoPageMessage from "/components/noPageMessage";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import posthog from "posthog-js";

// ---------- helpers ----------
const fmtMoney = (amount, currency = "GBP", locale = "en-GB") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    (amount || 0) / 100,
  );

const regionShort = (iso2) => {
  if (!iso2) return "";
  if (iso2 === "GB") return "UK";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(iso2) || iso2;
  } catch {
    return iso2;
  }
};

const formatDateTime = (unix, locale = "en-GB") => {
  if (!unix) return "";
  return new Date(unix * 1000).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getPaymentId = (session, charge) => {
  const fromSession =
    typeof session?.payment_intent === "string"
      ? session.payment_intent
      : session?.payment_intent?.id;
  if (fromSession) return fromSession;

  const fromCharge =
    typeof charge?.payment_intent === "string"
      ? charge.payment_intent
      : charge?.payment_intent?.id;

  return fromCharge || null;
};

// Pull the purchased shop item IDs from multiple possible places
function extractPurchasedIds(session) {
  const ids = new Set();

  // 1) Session metadata (prefer JSON array; fall back to CSV)
  const metaCandidates = [
    session?.metadata?.in_stock_ids,
    session?.metadata?.cart_ids,
    session?.metadata?.item_ids,
  ];
  for (const candidate of metaCandidates) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) parsed.forEach((x) => ids.add(String(x)));
    } catch {
      // not JSON, try CSV
      String(candidate)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((x) => ids.add(String(x)));
    }
  }

  // 2) Line item product/price metadata (if you attached Tina IDs there)
  const lines = session?.line_items?.data || [];
  for (const li of lines) {
    const pid =
      typeof li?.price?.product === "object"
        ? li.price.product?.metadata?.id || li.price.product?.metadata?.tina_id
        : null;
    const mid =
      li?.price?.metadata?.id ||
      li?.price?.metadata?.tina_id ||
      li?.metadata?.id ||
      li?.metadata?.tina_id;

    if (pid) ids.add(String(pid));
    if (mid) ids.add(String(mid));
  }

  return Array.from(ids);
}

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { session_id } = context.query;

  let tina = null;
  try {
    tina = await client.queries.data({ relativePath: "index.mdx" });
  } catch {
    tina = { data: null, query: null, variables: null };
  }

  let session = null;
  let shippingRate = null;
  let charge = null;
  let discountCode = null; // the code customer entered, e.g. TESTCOUPON
  let d1Update = { attempted: false, updated: 0, ids: [], error: null };

  if (session_id) {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    try {
      const s = await stripe.checkout.sessions.retrieve(session_id, {
        expand: [
          "discounts.promotion_code", // so we can read .code
          "discounts.coupon",
          "shipping_cost.shipping_rate",
        ],
      });

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session_id,
        { expand: ["data.price.product"] },
      );

      discountCode =
        s?.discounts?.find(
          (d) => d?.promotion_code && typeof d.promotion_code === "object",
        )?.promotion_code?.code ?? null;

      shippingRate = s?.shipping_cost?.shipping_rate || null;

      if (s?.payment_intent) {
        try {
          const pi = await stripe.paymentIntents.retrieve(s.payment_intent, {
            expand: ["latest_charge"],
          });
          if (pi?.latest_charge) {
            charge =
              typeof pi.latest_charge === "string"
                ? await stripe.charges.retrieve(pi.latest_charge)
                : pi.latest_charge;
          }
        } catch {
          charge = null;
        }
      }

      session = { ...s, line_items: lineItems };

      // ---------- D1: mark purchased items as SOLD ----------
      const isPaid =
        session?.payment_status === "paid" ||
        session?.payment_status === "no_payment_required";
      const isComplete = session?.status === "complete";

      if (isPaid && isComplete) {
        const purchasedIds = extractPurchasedIds(session);
        d1Update.attempted = true;
        d1Update.ids = purchasedIds;

        try {
          let env;
          try {
            ({ env } = getCloudflareContext());
          } catch {
            env = undefined;
          }
          const shop_items = env?.shop_items;

          if (shop_items && purchasedIds.length > 0) {
            // Idempotent update: only flip rows that are currently in_stock
            for (const id of purchasedIds) {
              const result = await shop_items
                .prepare(
                  "UPDATE shop_items SET state = 'sold' WHERE id = ? AND state = 'in_stock'",
                )
                .bind(String(id))
                .run();

              const changes = result?.meta?.changes || 0;
              d1Update.updated += changes;
            }
          } else if (!shop_items) {
            d1Update.error = "D1 binding 'shop_items' not available";
          }
        } catch (e) {
          d1Update.error = String(e?.message || e);
        }
      }
      // ------------------------------------------------------
    } catch (err) {
      console.error("Error retrieving Stripe session:", err);
      session = null;
    }
  }

  return {
    props: {
      data: tina?.data || null,
      query: tina?.query || null,
      variables: tina?.variables || null,
      session,
      shippingRate: shippingRate || null,
      charge: charge || null,
      discountCode: discountCode || null,
      d1Update, // optional: visible to help debug once
    },
  };
}

// ---------- Page ----------
export default function Success(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const { session, shippingRate, charge, discountCode, d1Update } = props;
  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  const isPaid =
    session?.payment_status === "paid" ||
    session?.payment_status === "no_payment_required";
  const isComplete = session?.status === "complete";

  useEffect(() => {
    if (clearedRef.current) return;
    if (isPaid && isComplete) {
      clearCart();
      clearedRef.current = true;
      posthog.capture("checkout_completed", {
        order_id: receiptNo,
        amount_total: session?.amount_total,
        currency: currency,
        item_count: session?.line_items?.data?.length,
        discount_code: discountCode,
      });
    }
  }, [isPaid, isComplete, clearCart]);

  const currency = (session?.currency || "gbp").toUpperCase();
  const receiptNo = getPaymentId(session, charge);

  const amountPaid = fmtMoney(session?.amount_total, currency);
  const subTotal = fmtMoney(session?.amount_subtotal, currency);
  const shipAmount =
    session?.total_details?.amount_shipping ??
    session?.shipping_cost?.amount_total ??
    0;

  const shipLabel = shippingRate?.display_name || "Shipping";
  const discountAmount = session?.total_details?.amount_discount || 0;

  return (
    <div>
      {data?.data?.aboutPage?.showAboutPage ? (
        <div>
          <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
            <div className="mt-12 lg:mt-24">
              <div className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed">
                Thank you for your purchase!
              </div>

              <div className="mx-auto flex flex-col justify-center items-center mt-4">
                <a
                  className="h-9 px-4 flex flex-row justify-center rounded-full cursor-pointer gap-1.5 transition-all duration-300"
                  style={{ backgroundColor: data.data.theme.buttonColour }}
                  target="_blank"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      data.data.theme.buttonHoverColour)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      data.data.theme.buttonColour)
                  }
                  href={charge?.receipt_url}
                >
                  <div className="text-xs xl:text-sm font-medium my-auto">
                    View receipt
                  </div>
                  <Open className="h-2.5 w-2.5 block shrink-0 cursor-pointer my-auto" />
                </a>
              </div>

              <div className="mt-4 text-xs font-extralight text-center w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed">
                Order ID #{receiptNo || "—"}
              </div>

              {/* Optional: tiny debug hint; remove once you're happy */}
              {d1Update?.attempted && (
                <div className="mt-2 text-[10px] text-center text-neutral-500">
                  {d1Update.error
                    ? `Inventory update: ${d1Update.error}`
                    : `Inventory update: marked ${d1Update.updated} item(s) as sold`}
                </div>
              )}

              <div className="text-center mt-10 lg:mt-12 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
                <div
                  className="flex flex-col w-fit sm:min-w-[24rem] md:min-w-136 lg:min-w-152 2xl:min-w-176 justify-between gap-5 mx-auto px-7 py-6 rounded-xl"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${data.data.theme.buttonColour} 70%, transparent)`,
                  }}
                >
                  <div className="flex flex-col gap-5">
                    {session?.line_items?.data?.map((li) => {
                      const title =
                        typeof li.price?.product === "object"
                          ? li.price.product?.name || li.description
                          : li.description;
                      return (
                        <div
                          key={li.id}
                          className="flex items-start justify-between w-full"
                        >
                          <div className="text-left text-sm font-light">
                            {title} × {li.quantity}
                          </div>
                          <div className="ml-5 text-left text-sm font-light">
                            {fmtMoney(li.amount_total, currency)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className="h-0.08 md:h-0.1 w-full mx-auto"
                    style={{ backgroundColor: data.data.theme.lineColour }}
                    data-tina-field={tinaField(data.data.theme, "lineColour")}
                  ></div>

                  <div className="flex justify-between">
                    <div className="text-left text-sm font-light">Subtotal</div>
                    <div className="text-left text-sm font-light">
                      {subTotal}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="text-left text-sm font-light">
                      Shipping - {shipLabel}
                    </div>
                    <div className="text-left text-sm font-light">
                      {shipAmount > 0 ? fmtMoney(shipAmount, currency) : "Free"}
                    </div>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <div className="text-left text-sm font-light">
                        Discount ({discountCode})
                      </div>
                      <div className="text-left text-sm font-light">
                        {`-${fmtMoney(discountAmount, currency)}`}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div className="text-left text-sm font-semibold">
                      Amount paid
                    </div>
                    <div className="text-left text-sm font-semibold">
                      {amountPaid}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ul>
        </div>
      ) : (
        <NoPageMessage
          buttonColour={data.data.theme.buttonColour}
          buttonHoverColour={data.data.theme.buttonHoverColour}
        />
      )}
    </div>
  );
}
