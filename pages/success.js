import React from "react";
import Stripe from "stripe";
import { useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";

export async function getServerSideProps() {
  let tina = null;
  try {
    tina = await client.queries.data({ relativePath: "index.mdx" });
  } catch (e) {
    tina = { data: null, query: null, variables: null };
  }

  return {
    props: {
      data: tina?.data || null,
      query: tina?.query || null,
      variables: tina?.variables || null,
      session,
    },
  };
}

export default function Success(props) {
  useTina({ data: props.data, query: props.query, variables: props.variables });

  const session = props.session;
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
