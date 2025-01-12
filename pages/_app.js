import "../styles.css";
import React from "react";
import { useTina } from "tinacms/dist/react";
import Head from "next/head";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }) {
  const { data } = useTina({
    query: pageProps.query,
    variables: pageProps.variables,
    data: pageProps.data,
  });

  if (!data?.home) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Jihyun Kim Ceramic</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Layout data={data}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
