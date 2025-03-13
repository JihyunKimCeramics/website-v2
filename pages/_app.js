import "../styles.css";
import React from "react";
import { useTina } from "tinacms/dist/react";
import Head from "next/head";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }) {
  const tinaResult = useTina({
    query: pageProps.query,
    variables: pageProps.variables,
    data: pageProps.data,
  });

  const data = tinaResult.data?.data || pageProps.data?.data;

  return (
    <>
      <Head>
        <title>Jihyun Kim Ceramic</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      {data ? (
        <Layout data={{ data }}>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
