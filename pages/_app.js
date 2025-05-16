import "../styles.css";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTina } from "tinacms/dist/react";
import Head from "next/head";
import Layout from "../components/Layout";
import addToCart from "../components/addToCart";
import removeFromCart from "../components/removeFromCart";
import checkout from "../components/checkout";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export default function App({ Component, pageProps }) {
  const tinaResult = useTina({
    query: pageProps.query,
    variables: pageProps.variables,
    data: pageProps.data,
  });

  const data = tinaResult.data?.data || pageProps.data?.data;

  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("cart")) || [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  console.log("cart", cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: (item) => setCart(addToCart(item, cart)),
        removeFromCart: (item) => setCart(removeFromCart(item, cart)),
        checkout: () => {
          checkout(cart);
          setCart([]);
        },
      }}
    >
      <Head>
        <title>Jihyun Kim Ceramic</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {data ? (
        <Layout data={{ data }}>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </CartContext.Provider>
  );
}
