import { client } from "../tina/__generated__/client";
import React, { useEffect, useRef } from "react";
import { useCart } from "../pages/_app";
import { tinaField, useTina } from "tinacms/dist/react";
import open from "../public/images/open.svg";
import DynamicSvg from "/components/DynamicSvg";
import NoPageMessage from "/components/noPageMessage";

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
  let discountCode = null; // <- the code customer entered, e.g. TESTCOUPON

  if (session_id) {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    try {
      // Option A: expand on the session so we get the code & the chosen shipping rate
      const s = await stripe.checkout.sessions.retrieve(session_id, {
        expand: [
          "discounts.promotion_code", // so we can read .code
          "discounts.coupon", // fallback info if a raw coupon (no code) was applied
          "shipping_cost.shipping_rate", // chosen shipping option object with .display_name
        ],
      });

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session_id,
        { expand: ["data.price.product"] }
      );

      // Pull out the discount code string, if present
      // (If multiple discounts, prefer the first with a promotion_code)
      discountCode =
        s?.discounts?.find(
          (d) => d?.promotion_code && typeof d.promotion_code === "object"
        )?.promotion_code?.code ?? null;

      // With expand, this is already the full object
      shippingRate = s?.shipping_cost?.shipping_rate || null;

      // If you still want the latest charge details:
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
    },
  };
}

const fmtMoney = (amount, currency = "GBP", locale = "en-GB") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    (amount || 0) / 100
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

export default function Success(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const { session, shippingRate, charge, discountCode } = props;
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

  const shipLabel = (() => {
    return shippingRate?.display_name || "Shipping";
  })();

  const discountAmount = session?.total_details?.amount_discount || 0;

  console.log("session:", session);

  return (
    <div>
      {data.data.aboutPage?.showAboutPage ? (
        <div>
          <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
            <div className="mt-12 lg:mt-24">
              <div className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed">
                Thank you for your purchase!
              </div>
              <div className="mx-auto flex flex-col justify-center items-center mt-4">
                <a
                  className="h-9 px-4 flex flex-row justify-center rounded-full cursor-pointer gap-2"
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
                  <DynamicSvg
                    src={open.src}
                    color={data.data.theme.textColour}
                    className="mx-auto my-auto"
                  />
                </a>
              </div>
              <div className="mt-4 text-xs font-extralight text-center w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed">
                Order ID #{receiptNo || "—"}
              </div>

              <div className="text-center mt-10 lg:mt-12 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
                <div
                  className="flex flex-col w-fit sm:min-w-[24rem] md:min-w-[34rem] lg:min-w-[38rem] 2xl:min-w-[44rem] justify-between gap-5 mx-auto px-7 py-6 rounded-xl"
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
