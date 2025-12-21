// pages/shop/index.js
import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import Image from "../../components/Image";
import Link from "next/link";
import { NoPageMessage } from "../../components/noPageMessage";
import { useEffect, useMemo, useState } from "react";

export default function ShopPage(props) {
  // Safe Tina usage: tolerate missing props during local dev
  const { data: tina } = useTina({
    query: props?.query,
    variables: props?.variables,
    data: props?.data,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const inIframe = window.self !== window.top;

    if (inIframe) {
      try {
        const parentUrl = document.referrer;
        const isTinaAdmin = parentUrl.includes("/admin");
        setIsEditing(isTinaAdmin);
      } catch (e) {
        setIsEditing(false);
      }
    }
  }, []);

  const shopPage = tina?.data?.shopPage ?? {};
  const theme = tina?.data?.theme ?? {};
  const items = Array.isArray(shopPage.shopItems) ? shopPage.shopItems : [];

  const [inStockIds, setInStockIds] = useState(null);
  const [invError, setInvError] = useState(null);

  // NEW: minimum reveal delay to avoid flicker
  const [loading, setLoading] = useState(true);
  const MIN_DELAY_MS = 400;

  useEffect(() => {
    let cancelled = false;

    async function loadInventory() {
      const started = Date.now();
      try {
        const res = await fetch("/api/inventory", { cache: "no-store" }).catch(
          (e) => {
            console.error("[Shop] /api/inventory network error:", e);
            return null; // swallow error; treat as unavailable
          }
        );

        if (!res || !res.ok) {
          if (!cancelled) {
            setInvError(res ? `HTTP ${res.status}` : "No response");
            // Leave inStockIds as null so we render nothing
          }
        } else {
          let json = null;
          try {
            json = await res.json();
          } catch (e) {
            console.error("[Shop] /api/inventory JSON parse error:", e);
            if (!cancelled) setInvError("Bad JSON");
          }

          if (!cancelled && json) {
            // Option B: API returns only IDs under `in_stock_ids`
            const ids = new Set(
              (json?.in_stock_ids || []).map((id) => String(id))
            );
            setInStockIds(ids);
          }
        }
      } catch (err) {
        console.error("[Shop] Inventory fetch unexpected error:", err);
        if (!cancelled) setInvError("Unknown error");
      } finally {
        const elapsed = Date.now() - started;
        const wait = Math.max(0, MIN_DELAY_MS - elapsed);
        const t = setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, wait);
        // clear any pending timer if unmounting early
        return () => clearTimeout(t);
      }
    }

    const cleanup = loadInventory();
    return () => {
      cancelled = true;
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  const gap = Number(shopPage.spacing) || 0;
  const minWidth = 270;

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      if (
        // !item?.showItem ||
        !item?.name ||
        !item?.title ||
        !Array.isArray(item?.images) ||
        item.images.length === 0
      ) {
        return false;
      }
      // Show nothing until inventory loaded successfully
      if (!(inStockIds instanceof Set)) return false;
      // uncomment to see shop items in dev
      if (isEditing) {
        return items;
      } else {
        return inStockIds.has(String(item.id));
      }
    });
  }, [items, inStockIds]);

  const showShop = Boolean(shopPage?.showShopPage);

  const skeletonTint = (percent = 100) => ({
    backgroundColor: `color-mix(in srgb, ${
      theme?.buttonColour || "#999"
    } ${percent}%, transparent)`,
  });

  const SkeletonCard = () => (
    <div className="relative cursor-default mb-8 animate-pulse">
      <div className="w-full aspect-[4/5] rounded" style={skeletonTint(70)} />
      <div className="pt-3 w-full px-12 sm:px-8 md:px-0">
        <div
          className="h-4 rounded w-2/3 mx-auto sm:mx-0"
          style={skeletonTint(80)}
        />
        <div
          className="h-3 rounded w-1/2 mx-auto sm:mx-0 mt-2"
          style={skeletonTint(70)}
        />
        <div
          className="h-4 rounded w-16 mx-auto sm:mx-0 mt-3"
          style={skeletonTint(80)}
        />
      </div>
    </div>
  );

  // How many skeletons to show while loading
  const SKELETON_COUNT = 3;

  return (
    <div>
      {showShop ? (
        <div>
          <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
            <div className="mt-12 lg:mt-24">
              <div
                className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
                data-tina-field={tinaField(shopPage, "title")}
              >
                {shopPage.title ?? ""}
              </div>

              {shopPage.showLine && (
                <div
                  className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-3"
                  style={{ backgroundColor: theme?.lineColour ?? "#000000" }}
                  data-tina-field={tinaField(theme, "lineColour")}
                ></div>
              )}

              {/* Only show error after we reveal content to avoid flicker */}
              {!loading && invError && (
                <p className="text-center text-sm text-amber-600 mt-2">
                  Live stock unavailable ({invError}); showing no items.
                </p>
              )}
            </div>

            <div className="mt-16 lg:mt-24 -mb-8">
              <div
                className="grid w-full mx-auto"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fit, minmax(max(${minWidth}px, calc((100% - ${
                    gap * 2
                  }px) / 3)), 1fr))`,
                  gap: `${gap}px`,
                }}
              >
                {loading &&
                  Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <SkeletonCard key={`sk-${i}`} />
                  ))}

                {!loading &&
                  visibleItems.map((item, index) => (
                    <Link
                      key={item?.id ?? index}
                      href={`/shop/${item?.id}`}
                      className="hover:opacity-85 transition-opacity duration-200 ease-in-out"
                    >
                      <div className="relative cursor-pointer mb-8">
                        <Image
                          item={item.images[0]}
                          height={5}
                          image={item.images[0].image}
                          tinaName="image"
                          index={index}
                        />
                        <div className="pt-3 px-auto w-full flex flex-col px-12 sm:px-8 md:px-0 text-center sm:text-left">
                          <div className="font-medium">{item.title}</div>
                          <div className="font-extralight">{item.name}</div>
                          {item.price != null && item.price !== "" && (
                            <div className="font-semibold pt-1.5">
                              £{item.price}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              {/* Sold-out / empty — only after loading */}
              {!loading &&
                Array.isArray(visibleItems) &&
                visibleItems.length === 0 && (
                  <div className="w-full pb-6">
                    <div className="px-16 sm:px-28 lg:px-40 xl:px-64">
                      <div className="mx-auto text-center max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px]">
                        <h1 className="text-3xl font-semibold">
                          Currently sold out
                        </h1>
                        <p className="mt-2 text-base font-light">
                          New pieces are in the kiln, check back soon!
                        </p>
                        <a
                          href="/"
                          className="mt-8 inline-flex h-10 px-6 items-center justify-center rounded-full cursor-pointer"
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
                          <span className="text-sm xl:text-base font-semibold">
                            Go Back Home
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </ul>
        </div>
      ) : (
        <NoPageMessage
          buttonColour={theme?.buttonColour ?? "#000000"}
          buttonHoverColour={theme?.buttonHoverColour ?? "#333333"}
        />
      )}
    </div>
  );
}

export const getStaticProps = async () => {
  try {
    const { data, query, variables } = await client.queries.data({
      relativePath: "index.mdx",
    });
    return { props: { data, query, variables } };
  } catch (err) {
    console.error("[Shop] getStaticProps failed (safe fallback):", err);
    return {
      props: {
        data: { data: { shopPage: {}, theme: {} } },
        query: "",
        variables: {},
      },
    };
  }
};
