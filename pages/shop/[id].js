import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "../../tina/__generated__/client";
import React, { useEffect, useState } from "react";
import Image from "../../components/Image";
import downArrow from "../../public/images/down_small.svg";
import { useCart } from "../_app";
import FaqTree from "../../components/faqTree";
import NoPageMessage from "../../components/noPageMessage";

export default function ShopItemPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const { addToCart, cart } = useCart();

  const [shopItem, setShopItem] = useState(null);

  const isInCart = Boolean(
    shopItem && cart.some((c) => String(c.id) === String(shopItem.id))
  );

  useEffect(() => {
    if (data?.data?.shopItem && data.data.shopItem !== shopItem) {
      setShopItem(data.data.shopItem);
    }
  }, [data, shopItem]);

  const shopItems = data?.data?.shopPage?.shopItems ?? [];
  const shopItemIndex = shopItem
    ? shopItems.findIndex((p) => String(p?.id) === String(shopItem.id))
    : -1;

  const gap = data?.data?.shopPage?.imageSpacing || 0;

  const [faqIndex, setFaqIndex] = useState(-1);
  const [faqOpen, setFaqOpen] = useState(false);

  const handleFAQClick = (index) => {
    const isSame = faqIndex === index;
    setFaqIndex(index);
    setFaqOpen(isSame ? !faqOpen : true);
  };

  const pageVisible =
    data?.data?.shopPage?.showShopPage && shopItems?.[shopItemIndex]?.showItem;

  return (
    <div>
      {pageVisible ? (
        <div>
          {/* Mobile */}
          <div className="md:hidden">
            <div className="flex flex-col md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
              <div className="mt-12 lg:mt-24">
                {shopItems?.[shopItemIndex]?.title && (
                  <div
                    className="text-2xl lg:text-3xl text-center font-normal w-auto mx-8 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
                    data-tina-field={tinaField(
                      shopItems[shopItemIndex],
                      "title"
                    )}
                  >
                    {shopItems[shopItemIndex].title}
                  </div>
                )}
                {shopItems?.[shopItemIndex]?.name && (
                  <div
                    className="text-center text-lg font-extralight mx-8 sm:mx-28 lg:mx-40 xl:mx-64"
                    data-tina-field={tinaField(
                      shopItems[shopItemIndex],
                      "name"
                    )}
                  >
                    {shopItems?.[shopItemIndex]?.name}
                  </div>
                )}
                {shopItems?.[shopItemIndex]?.price && (
                  <div
                    className="mt-3 text-center text-lg font-semibold mx-8 sm:mx-28 lg:mx-40 xl:mx-64"
                    data-tina-field={tinaField(
                      shopItems[shopItemIndex],
                      "price"
                    )}
                  >
                    £{shopItems?.[shopItemIndex]?.price}
                  </div>
                )}
                <div className="flex flex-row justify-center mt-5">
                  <div
                    className="flex flex-col justify-center rounded-full"
                    style={{
                      backgroundColor: data.data.theme.buttonColour,
                      opacity: isInCart ? 0.5 : 1,
                      cursor: isInCart ? "default" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isInCart) {
                        e.currentTarget.style.backgroundColor =
                          data.data.theme.buttonHoverColour;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isInCart) {
                        e.currentTarget.style.backgroundColor =
                          data.data.theme.buttonColour;
                      }
                    }}
                  >
                    <a
                      className="text-sm xl:text-base font-semibold h-10 px-6 flex items-center"
                      href="/basket"
                      onClick={() =>
                        shopItem &&
                        addToCart({
                          id: shopItem.id, // ensure id goes into cart
                          title: shopItem.title,
                          name: shopItem.name,
                          image: shopItem.images?.[0]?.image,
                          price: shopItem.price,
                        })
                      }
                    >
                      {isInCart ? "In Cart" : "Add to cart"}
                    </a>
                  </div>
                </div>

                {((shopItems?.[shopItemIndex]?.details &&
                  shopItems?.[shopItemIndex]?.details.length > 0) ||
                  (shopItems?.[shopItemIndex]?.description &&
                    shopItems?.[shopItemIndex]?.description?.children?.length >
                      0)) && (
                  <div className="mt-11 flex flex-col gap-5">
                    {shopItems?.[shopItemIndex]?.details &&
                      shopItems?.[shopItemIndex]?.details.length > 0 && (
                        <div
                          className="text-center text-xs font-extralight mx-8 sm:mx-28 lg:mx-40 xl:mx-64"
                          data-tina-field={tinaField(
                            shopItems[shopItemIndex],
                            "details"
                          )}
                        >
                          {shopItems[shopItemIndex].details}
                        </div>
                      )}
                    {shopItems?.[shopItemIndex]?.description &&
                      shopItems?.[shopItemIndex]?.description?.children
                        ?.length > 0 && (
                        <div
                          data-tina-field={tinaField(
                            shopItems[shopItemIndex],
                            "description"
                          )}
                        >
                          <TinaMarkdown
                            content={shopItems?.[shopItemIndex]?.description}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 text-center font-light text-sm">
                                  {children}
                                </p>
                              ),
                            }}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-200 lg:w-300 xl:w-400 md:mx-auto mt-16 lg:mt-24">
              <Image
                item={shopItems?.[shopItemIndex]?.images?.[0]}
                height={5}
                image={shopItems?.[shopItemIndex]?.images?.[0]?.image}
                tinaName="image"
                index={shopItems?.[shopItemIndex]}
              />
              {shopItems?.[shopItemIndex]?.images?.map((image, index) => {
                if (index === 0) return null;
                return (
                  <div key={index} style={{ marginTop: `${gap}px` }}>
                    <Image
                      item={image}
                      height={image.height}
                      image={image.image}
                      tinaName="image"
                      index={index}
                    />
                  </div>
                );
              })}
            </div>

            {data.data.shopPage.showFAQs &&
              data.data.footer?.faqs?.faqs?.length > 0 && (
                <div className="mt-16 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
                  <FaqTree
                    faqs={data.data.footer.faqs.faqs}
                    backgroundColour={data.data.theme.buttonColour}
                    textColour={data.data.theme.textColour}
                    downArrow={downArrow}
                    px="px-5"
                    pt="pt-3"
                    pbOpen="pb-2.5"
                    pbClosed="pb-3"
                    titleFont="text-sm xl:text-base"
                    answerFont="text-xs sm:text-sm"
                    onToggle={handleFAQClick}
                    openIndex={faqIndex}
                    open={faqOpen}
                  />
                </div>
              )}
          </div>

          {/* Desktop */}
          <div className="hidden md:flex flex-row md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto mt-12 lg:mt-24 gap-8 lg:gap-12 justify-between">
            <div className="w-full">
              <Image
                item={shopItems?.[shopItemIndex]?.images?.[0]}
                height={5}
                image={shopItems?.[shopItemIndex]?.images?.[0]?.image}
                tinaName="image"
                index={shopItems?.[shopItemIndex]}
              />
              {shopItems?.[shopItemIndex]?.images?.map((image, index) => {
                if (index === 0) return null;
                return (
                  <div key={index} style={{ marginTop: `${gap}px` }}>
                    <Image
                      item={image}
                      height={image.height}
                      image={image.image}
                      tinaName="image"
                      index={index}
                    />
                  </div>
                );
              })}
            </div>

            <div className="w-96 lg:w-150">
              {shopItems?.[shopItemIndex]?.title && (
                <div
                  className="text-2xl lg:text-3xl text-left font-normal w-auto leading-normal lg:leading-relaxed"
                  data-tina-field={tinaField(shopItems[shopItemIndex], "title")}
                >
                  {shopItems[shopItemIndex].title}
                </div>
              )}
              {shopItems?.[shopItemIndex]?.name && (
                <div
                  className="text-left text-lg font-extralight"
                  data-tina-field={tinaField(shopItems[shopItemIndex], "name")}
                >
                  {shopItems?.[shopItemIndex]?.name}
                </div>
              )}
              {shopItems?.[shopItemIndex]?.price && (
                <div
                  className="mt-3 text-left text-lg font-semibold"
                  data-tina-field={tinaField(shopItems[shopItemIndex], "price")}
                >
                  £{shopItems?.[shopItemIndex]?.price}
                </div>
              )}

              <div className="flex flex-row justify-start mt-5">
                <div
                  className="h-10 px-6 flex flex-col justify-center rounded-full"
                  style={{
                    backgroundColor: data.data.theme.buttonColour,
                    opacity: isInCart ? 0.5 : 1,
                    cursor: isInCart ? "default" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isInCart) {
                      e.currentTarget.style.backgroundColor =
                        data.data.theme.buttonHoverColour;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isInCart) {
                      e.currentTarget.style.backgroundColor =
                        data.data.theme.buttonColour;
                    }
                  }}
                >
                  <a
                    className="text-sm xl:text-base font-semibold"
                    href="/basket"
                    onClick={() =>
                      shopItem &&
                      addToCart({
                        id: shopItem.id, // ensure id goes into cart
                        title: shopItem.title,
                        name: shopItem.name,
                        image: shopItem.images?.[0]?.image,
                        price: shopItem.price,
                      })
                    }
                  >
                    {isInCart ? "In Cart" : "Add to cart"}
                  </a>
                </div>
              </div>

              {((shopItems?.[shopItemIndex]?.details &&
                shopItems?.[shopItemIndex]?.details.length > 0) ||
                (shopItems?.[shopItemIndex]?.description &&
                  shopItems?.[shopItemIndex]?.description?.children?.length >
                    0)) && (
                <div className="mt-11 flex flex-col gap-5">
                  {shopItems?.[shopItemIndex]?.details &&
                    shopItems?.[shopItemIndex]?.details.length > 0 && (
                      <div
                        className="text-left text-xs font-extralight"
                        data-tina-field={tinaField(
                          shopItems[shopItemIndex],
                          "details"
                        )}
                      >
                        {shopItems[shopItemIndex].details}
                      </div>
                    )}
                  {shopItems?.[shopItemIndex]?.description &&
                    shopItems?.[shopItemIndex]?.description?.children?.length >
                      0 && (
                      <div
                        data-tina-field={tinaField(
                          shopItems[shopItemIndex],
                          "description"
                        )}
                      >
                        <TinaMarkdown
                          content={shopItems?.[shopItemIndex]?.description}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 text-left font-light text-sm">
                                {children}
                              </p>
                            ),
                          }}
                        />
                      </div>
                    )}
                </div>
              )}

              {data.data.shopPage.showFAQs &&
                data.data.footer?.faqs?.faqs?.length > 0 && (
                  <div className="mt-10">
                    <FaqTree
                      faqs={data.data.footer.faqs.faqs}
                      backgroundColour={data.data.theme.buttonColour}
                      textColour={data.data.theme.textColour}
                      downArrow={downArrow}
                      px="px-5"
                      pt="pt-3"
                      pbOpen="pb-2.5"
                      pbClosed="pb-3"
                      titleFont="text-sm xl:text-base"
                      answerFont="text-xs sm:text-sm"
                      onToggle={handleFAQClick}
                      openIndex={faqIndex}
                      open={faqOpen}
                    />
                  </div>
                )}
            </div>
          </div>
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

export async function getStaticPaths() {
  const { data } = await client.queries.data({
    relativePath: "index.mdx",
  });

  const shopItems = data?.data?.shopPage?.shopItems ?? [];

  const paths =
    shopItems
      .filter((p) => p?.id != null)
      .map((p) => ({ params: { id: String(p.id) } })) ?? [];

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  if (!params?.id) {
    return { notFound: true };
  }

  const { data, query, variables } = await client.queries.data({
    relativePath: "index.mdx",
  });

  const globalData = data.data;

  const shopItem =
    globalData?.shopPage?.shopItems?.find(
      (p) => String(p?.id) === String(params.id)
    ) ?? null;

  if (!shopItem) return { notFound: true };

  return {
    props: {
      data: { data: { ...globalData, shopItem } },
      query,
      variables,
    },
    revalidate: 60,
  };
}
