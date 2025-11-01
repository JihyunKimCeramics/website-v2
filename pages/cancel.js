import React from "react";
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
    },
  };
}

export default function Cancel(props) {
  useTina({ data: props.data, query: props.query, variables: props.variables });

  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Payment canceled</h1>
        <p>
          Your payment wasn’t completed. You can return to your basket and try
          again.
        </p>
        <a href="/basket">Back to basket</a>
      </div>
    </main>
  );
}
