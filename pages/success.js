import { useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import React, { useEffect, useRef } from "react";
import { useCart } from "../pages/_app";

export async function getServerSideProps(context) {
  const { session_id } = context.query;

  // Load Tina data (optional)
  let tina = null;
  try {
    tina = await client.queries.data({ relativePath: "index.mdx" });
  } catch {
    tina = { data: null, query: null, variables: null };
  }

  // Fetch Stripe session on the server
  let session = null;
  if (session_id) {
    // Import Stripe only on the server to avoid bundling it for the client
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // Use your account's API version; this is an example
      apiVersion: "2024-06-20",
    });

    try {
      // Sessions don't include line items by default; get them separately
      const s = await stripe.checkout.sessions.retrieve(session_id);
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session_id,
        {
          expand: ["data.price.product"],
        }
      );
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
      session, // now actually defined
    },
  };
}

export default function Success(props) {
  useTina({ data: props.data, query: props.query, variables: props.variables });

  const session = props.session;
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

  const amount = ((session?.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session?.currency || "gbp").toUpperCase();
  const email = session?.customer_details?.email;

  return (
    <div className="mx-auto text-center">
      <h1>Payment successful 🎉</h1>
      {session ? (
        <>
          <p>
            Thanks{email ? `, ${email}` : ""}! Your payment of {amount}{" "}
            {currency} was processed.
          </p>
          {session.line_items?.data?.length > 0 && (
            <ul>
              {session.line_items.data.map((li) => {
                const product =
                  typeof li.price?.product === "object"
                    ? li.price.product
                    : null;
                return (
                  <li key={li.id}>
                    {li.quantity} × {product?.name || li.description} —{" "}
                    {(li.amount_total / 100).toFixed(2)} {currency}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <p>We couldn’t load the session details, but your payment succeeded.</p>
      )}
    </div>
  );
}
