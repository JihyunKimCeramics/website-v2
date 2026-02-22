// pages/basket.js
import { tinaField, useTina } from "tinacms/dist/react";
import React, { useEffect, useMemo, useState } from "react";
import { client } from "../tina/__generated__/client";
import NoPageMessage from "/components/noPageMessage";
import { useCart } from "../pages/_app";
import bin from "../public/images/bin.svg";
import Image from "/components/Image";
import DynamicSvg from "/components/DynamicSvg";

export default function CartPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  // Mount guard for useCart (avoids SSR mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { cart, removeFromCart, checkout } = mounted
    ? useCart()
    : { cart: [], removeFromCart: () => {}, checkout: () => {} };

  console.log("[Basket] Raw cart from useCart:", cart);

  // Live inventory gating (Option B: API returns { in_stock_ids: string[] })
  const [inStockIds, setInStockIds] = useState(null); // null = not loaded / failed

  // Minimum reveal delay to avoid flicker
  const [loading, setLoading] = useState(true);
  const MIN_DELAY_MS = 400;

  useEffect(() => {
    let cancelled = false;

    async function loadInventory() {
      const started = Date.now();
      try {
        const res = await fetch("/api/inventory", { cache: "no-store" }).catch(
          (e) => {
            console.error("[Basket] /api/inventory network error:", e);
            return null;
          }
        );

        console.log("[Basket] Inventory response:", {
          ok: res?.ok,
          status: res?.status,
        });

        if (res && res.ok) {
          let json = null;
          try {
            json = await res.json();
            console.log("[Basket] Inventory JSON:", json);
          } catch (e) {
            console.error("[Basket] /api/inventory JSON parse error:", e);
          }
          if (!cancelled && json) {
            const ids = new Set(
              (json?.in_stock_ids || []).map((id) => String(id))
            );
            console.log("[Basket] Setting inStockIds:", Array.from(ids));
            setInStockIds(ids);
          }
        }
      } catch (err) {
        console.error("[Basket] Inventory fetch unexpected error:", err);
      } finally {
        const elapsed = Date.now() - started;
        const wait = Math.max(0, MIN_DELAY_MS - elapsed);
        const t = setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, wait);
        return () => clearTimeout(t);
      }
    }

    const cleanup = loadInventory();
    return () => {
      cancelled = true;
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  // Only keep items that are currently in stock (once inventory is loaded)
  const visibleCart = useMemo(() => {
    console.log(
      "[Basket] Computing visibleCart. inStockIds:",
      inStockIds instanceof Set ? Array.from(inStockIds) : inStockIds
    );
    console.log("[Basket] Cart items to filter:", cart);

    if (!(inStockIds instanceof Set)) {
      console.log("[Basket] inStockIds not loaded yet, returning empty array");
      return [];
    }

    const filtered = cart.filter((item) => {
      const itemId = String(item.id);
      const isInStock = inStockIds.has(itemId);
      console.log(
        `[Basket] Item ${itemId} (${item.title}): inStock=${isInStock}`
      );
      return isInStock;
    });

    console.log("[Basket] Visible cart after filtering:", filtered);
    return filtered;
  }, [cart, inStockIds]);

  const itemCount = visibleCart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  console.log("[Basket] Final itemCount:", itemCount);

  if (!mounted) return null;

  const theme = data?.data?.theme ?? {};
  const shopPage = data?.data?.shopPage ?? {};

  // One-row skeleton tinted by theme.buttonColour
  const tint = (pct = 70) => ({
    backgroundColor: `color-mix(in srgb, ${
      theme?.buttonColour || "#999"
    } ${pct}%, transparent)`,
  });

  const SkeletonRow = () => (
    <div className="text-center mt-16 mb-16 lg:mt-24 lg:mb-12 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
      <div className="flex flex-row w-fit sm:min-w-[24rem] md:min-w-[34rem] lg:min-w-[38rem] 2xl:min-w-[44rem] justify-between gap-10 sm:gap-8 mx-auto">
        {/* left column: one item skeleton */}
        <div className="flex flex-col gap-6 sm:gap-8 animate-pulse">
          <div className="flex items-start gap-4 sm:gap-7 text-left">
            <div className="min-w-20 sm:min-w-36">
              <div
                className="w-20 sm:w-36 aspect-[4/5] rounded"
                style={tint(60)}
              />
            </div>
            <div className="flex-1 pt-1">
              <div className="h-4 w-48 rounded" style={tint(70)} />
              <div className="h-3 w-40 rounded mt-2" style={tint(60)} />
              <div className="h-4 w-16 rounded mt-3" style={tint(70)} />
            </div>
          </div>
        </div>
        {/* right column: delete bubble skeleton */}
        <div className="flex flex-col gap-16 sm:gap-34 animate-pulse">
          <div
            className="min-w-9 h-9 rounded-full"
            style={tint(70)}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {shopPage?.showShopPage ? (
        <div>
          <div className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
            <div className="mt-12 lg:mt-24">
              <div
                className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
                data-tina-field={tinaField(data.data.shopPage, "basketTitle")}
              >
                {shopPage.basketTitle}
              </div>
              {shopPage.showLine && (
                <div
                  className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-3"
                  style={{ backgroundColor: theme?.lineColour }}
                  data-tina-field={tinaField(theme, "lineColour")}
                ></div>
              )}
            </div>
          </div>

          {/* While loading: show one skeleton row */}
          {loading ? (
            <SkeletonRow />
          ) : itemCount === 0 ? (
            // After loading: empty state
            <div className="mt-16 mb-6 lg:mt-24 lg:mb-9 text-xl lg:text-2xl text-center font-thin w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed">
              Your basket is empty!
            </div>
          ) : (
            // After loading: real items
            <div className="text-center mt-16 mb-16 lg:mt-24 lg:mb-12 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
              <div className="flex flex-row w-fit sm:min-w-[24rem] md:min-w-[34rem] lg:min-w-[38rem] 2xl:min-w-[44rem] justify-between gap-10 sm:gap-8 mx-auto">
                <div className="flex flex-col gap-6 sm:gap-8">
                  {visibleCart.map((item, index) => (
                    <a
                      key={index}
                      href={`/shop/${item.id}`}
                      className="flex items-start gap-4 sm:gap-7 hover:opacity-85 transition-opacity duration-200 ease-in-out text-left"
                    >
                      <div className="min-w-20 sm:min-w-36">
                        <Image
                          item={item}
                          height={5}
                          image={item.image}
                          tinaName="image"
                          index={index}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="font-extralight">{item.name}</div>
                        {item.price && (
                          <div className="font-semibold pt-1.5">
                            £{item.price}
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>

                <div className="flex flex-col gap-16 sm:gap-34">
                  {visibleCart.map((item, index) => (
                    <div
                      key={index}
                      className="min-w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
                      style={{ backgroundColor: theme?.buttonColour }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          theme?.buttonHoverColour)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          theme?.buttonColour)
                      }
                      onClick={() => removeFromCart(item, cart)}
                    >
                      <DynamicSvg
                        src={bin.src}
                        color={theme?.textColour}
                        className="mx-auto my-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-row justify-center mt-8">
                <div
                  className="flex flex-col justify-center rounded-full cursor-pointer transition-all duration-300"
                  style={{ backgroundColor: theme?.buttonColour }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      theme?.buttonHoverColour)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      theme?.buttonColour)
                  }
                >
                  <div
                    className="h-10 px-6 text-sm xl:text-base font-semibold cursor-pointer flex items-center"
                    onClick={() =>
                      checkout(JSON.parse(JSON.stringify(visibleCart)))
                    }
                  >
                    Checkout
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <NoPageMessage
          buttonColour={theme?.buttonColour}
          buttonHoverColour={theme?.buttonHoverColour}
        />
      )}
    </div>
  );
}

export const getStaticProps = async () => {
  const { data, query, variables } = await client.queries.data({
    relativePath: "index.mdx",
  });

  return {
    props: {
      data,
      query,
      variables,
    },
  };
};
