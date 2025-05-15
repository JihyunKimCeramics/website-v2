import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "../../tina/__generated__/client";
import React, { useEffect, useState, useRef } from "react";
import Image from "../../components/Image";
import DynamicSvg from "../../components/DynamicSvg";
import downArrow from "../../public/images/down.svg";

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ShopItemPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const [shopItem, setShopItem] = useState("");

  useEffect(() => {
    if (data.data.shopItem != shopItem && data.data.shopItem != null) {
      setShopItem(data.data.shopItem);
    }
  }, [data, shopItem]);

  const shopItemIndex = data.data.shopPage.shopItems.findIndex(
    (p) => p.title === shopItem.title
  );

  const gap = data?.data?.shopPage?.imageSpacing || 0;

  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggleOpen = (index) => {
    setOpenIndex((cur) => (cur === index ? null : index));
  };

  useEffect(() => {
    contentRefs.current.forEach((content, i) => {
      if (!content) return;
      if (i === openIndex) {
        content.style.height = content.scrollHeight + "px";
      } else {
        content.style.height = "0px";
      }
    });
  }, [openIndex]);

  return (
    <div>
      <div className="md:hidden">
        <div className="flex flex-col md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
          <div className="mt-12 lg:mt-24">
            {data.data.shopPage.shopItems[shopItemIndex]?.title && (
              <div
                className="text-2xl lg:text-3xl text-center font-normal w-auto mx-8 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
                data-tina-field={tinaField(
                  data.data.shopPage.shopItems[shopItemIndex],
                  "title"
                )}
              >
                {data.data.shopPage.shopItems[shopItemIndex].title}
              </div>
            )}
            {data.data.shopPage.shopItems[shopItemIndex]?.name && (
              <div
                className="text-center text-lg font-extralight mx-8 sm:mx-28 lg:mx-40 xl:mx-64"
                data-tina-field={tinaField(
                  data.data.shopPage.shopItems[shopItemIndex],
                  "name"
                )}
              >
                {data.data.shopPage.shopItems[shopItemIndex]?.name}
              </div>
            )}
            {data.data.shopPage.shopItems[shopItemIndex]?.price && (
              <div
                className="mt-3 text-center text-lg font-semibold mx-8 sm:mx-28 lg:mx-40 xl:mx-64"
                data-tina-field={tinaField(
                  data.data.shopPage.shopItems[shopItemIndex],
                  "price"
                )}
              >
                £{data.data.shopPage.shopItems[shopItemIndex]?.price}
              </div>
            )}
            <div className="flex flex-row justify-center mt-5">
              <div
                className="h-10 px-6 flex flex-col justify-center rounded-full cursor-pointer"
                style={{ backgroundColor: data.data.theme.buttonColour }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    data.data.theme.buttonHoverColour)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    data.data.theme.buttonColour)
                }
              >
                <div className="text-sm xl:text-base font-semibold">
                  Add to cart
                </div>
              </div>
            </div>
            {((data.data.shopPage.shopItems[shopItemIndex]?.details &&
              data.data.shopPage.shopItems[shopItemIndex]?.details.length >
                0) ||
              (data.data.shopPage.shopItems[shopItemIndex]?.description &&
                data.data.shopPage.shopItems[shopItemIndex]?.description
                  ?.children?.length > 0)) && (
              <div className="mt-11 flex flex-col gap-5">
                {data.data.shopPage.shopItems[shopItemIndex]?.details &&
                  data.data.shopPage.shopItems[shopItemIndex]?.details.length >
                    0 && (
                    <div
                      className="text-center text-xs font-extralight mx-8 sm:mx-28 lg:mx-40 xl:mx-64"
                      data-tina-field={tinaField(
                        data.data.shopPage.shopItems[shopItemIndex],
                        "details"
                      )}
                    >
                      {data.data.shopPage.shopItems[shopItemIndex].details}
                    </div>
                  )}
                {data.data.shopPage.shopItems[shopItemIndex]?.description &&
                  data.data.shopPage.shopItems[shopItemIndex]?.description
                    ?.children?.length > 0 && (
                    <div
                      data-tina-field={tinaField(
                        data.data.shopPage.shopItems[shopItemIndex],
                        "description"
                      )}
                    >
                      <TinaMarkdown
                        content={
                          data.data.shopPage.shopItems[shopItemIndex]
                            ?.description
                        }
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
            item={data.data.shopPage.shopItems[shopItemIndex]?.images[0]}
            height={5}
            image={
              data.data.shopPage.shopItems[shopItemIndex]?.images[0]?.image
            }
            tinaName="image"
            index={data.data.shopPage?.shopItems[shopItemIndex]}
          />
          {data.data.shopPage?.shopItems[shopItemIndex]?.images.map(
            (image, index) => {
              if (index === 0) return null;
              return (
                <div style={{ marginTop: `${gap}px` }}>
                  <Image
                    item={image}
                    height={image.height}
                    image={image.image}
                    tinaName="image"
                    index={index}
                  />
                </div>
              );
            }
          )}
        </div>
        {data.data.shopPage.showFAQs &&
          data.data.footer.faqs.faqs.length > 0 && (
            <div className="mt-16 flex flex-col md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto gap-3">
              {data.data.footer.faqs.faqs.map((faq, index) => {
                if (!faq.question || !faq.answer) return null;
                return (
                  <div
                    key={index}
                    className="rounded-xl cursor-pointer"
                    style={{ backgroundColor: data.data.theme.buttonColour }}
                    onClick={() => toggleOpen(index)}
                  >
                    <button
                      className={`w-full text-left flex justify-between items-start p-4 transition-all duration-300 ${
                        openIndex === index ? "pb-2.5" : "pb-4"
                      }`}
                      style={{ color: data.data.theme.textColour }}
                    >
                      <span
                        className="text-base sm:text-lg"
                        data-tina-field={tinaField(faq, "question")}
                      >
                        {faq.question}
                      </span>
                      <DynamicSvg
                        src={downArrow.src}
                        color={data.data.theme.textColour}
                        className={`transition-transform duration-300 my-auto
              ${openIndex === index ? "rotate-180" : "rotate-0"}`}
                        style={{
                          transformOrigin: "center",
                          transformBox: "fill-box",
                        }}
                      />
                    </button>
                    <div
                      ref={(el) => (contentRefs.current[index] = el)}
                      className="overflow-hidden transition-[height] duration-300 ease-out"
                      style={{ height: 0 }}
                    >
                      <div
                        className="px-4 pb-4 text-sm sm:text-base font-light prose max-w-none"
                        style={{ color: data.data.theme.textColour }}
                      >
                        <div data-tina-field={tinaField(faq, "answer")}>
                          <TinaMarkdown
                            content={faq.answer}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2">{children}</p>
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
      <div className="hidden md:flex flex-row md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto mt-12 lg:mt-24 gap-8 lg:gap-12 justify-between">
        <div className="w-full">
          <Image
            item={data.data.shopPage.shopItems[shopItemIndex]?.images[0]}
            height={5}
            image={
              data.data.shopPage.shopItems[shopItemIndex]?.images[0]?.image
            }
            tinaName="image"
            index={data.data.shopPage?.shopItems[shopItemIndex]}
          />
          {data.data.shopPage?.shopItems[shopItemIndex]?.images.map(
            (image, index) => {
              if (index === 0) return null;
              return (
                <div style={{ marginTop: `${gap}px` }}>
                  <Image
                    item={image}
                    height={image.height}
                    image={image.image}
                    tinaName="image"
                    index={index}
                  />
                </div>
              );
            }
          )}
        </div>
        <div className="w-96 lg:w-150">
          {data.data.shopPage.shopItems[shopItemIndex]?.title && (
            <div
              className="text-2xl lg:text-3xl text-left font-normal w-auto leading-normal lg:leading-relaxed"
              data-tina-field={tinaField(
                data.data.shopPage.shopItems[shopItemIndex],
                "title"
              )}
            >
              {data.data.shopPage.shopItems[shopItemIndex].title}
            </div>
          )}
          {data.data.shopPage.shopItems[shopItemIndex]?.name && (
            <div
              className="text-left text-lg font-extralight"
              data-tina-field={tinaField(
                data.data.shopPage.shopItems[shopItemIndex],
                "name"
              )}
            >
              {data.data.shopPage.shopItems[shopItemIndex]?.name}
            </div>
          )}
          {data.data.shopPage.shopItems[shopItemIndex]?.price && (
            <div
              className="mt-3 text-left text-lg font-semibold"
              data-tina-field={tinaField(
                data.data.shopPage.shopItems[shopItemIndex],
                "price"
              )}
            >
              £{data.data.shopPage.shopItems[shopItemIndex]?.price}
            </div>
          )}
          <div className="flex flex-row justify-start mt-5">
            <div
              className="h-10 px-6 flex flex-col justify-center rounded-full cursor-pointer"
              style={{ backgroundColor: data.data.theme.buttonColour }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  data.data.theme.buttonHoverColour)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  data.data.theme.buttonColour)
              }
            >
              <div className="text-sm xl:text-base font-semibold">
                Add to cart
              </div>
            </div>
          </div>
          {((data.data.shopPage.shopItems[shopItemIndex]?.details &&
            data.data.shopPage.shopItems[shopItemIndex]?.details.length > 0) ||
            (data.data.shopPage.shopItems[shopItemIndex]?.description &&
              data.data.shopPage.shopItems[shopItemIndex]?.description?.children
                ?.length > 0)) && (
            <div className="mt-11 flex flex-col gap-5">
              {data.data.shopPage.shopItems[shopItemIndex]?.details &&
                data.data.shopPage.shopItems[shopItemIndex]?.details.length >
                  0 && (
                  <div
                    className="text-left text-xs font-extralight"
                    data-tina-field={tinaField(
                      data.data.shopPage.shopItems[shopItemIndex],
                      "details"
                    )}
                  >
                    {data.data.shopPage.shopItems[shopItemIndex].details}
                  </div>
                )}
              {data.data.shopPage.shopItems[shopItemIndex]?.description &&
                data.data.shopPage.shopItems[shopItemIndex]?.description
                  ?.children?.length > 0 && (
                  <div
                    data-tina-field={tinaField(
                      data.data.shopPage.shopItems[shopItemIndex],
                      "description"
                    )}
                  >
                    <TinaMarkdown
                      content={
                        data.data.shopPage.shopItems[shopItemIndex]?.description
                      }
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
            data.data.footer.faqs.faqs.length > 0 && (
              <div className="mt-10 flex flex-col gap-3">
                {data.data.footer.faqs.faqs.map((faq, index) => {
                  if (!faq.question || !faq.answer) return null;
                  return (
                    <div
                      key={index}
                      className="rounded-xl cursor-pointer"
                      style={{ backgroundColor: data.data.theme.buttonColour }}
                      onClick={() => toggleOpen(index)}
                    >
                      <button
                        className={`w-full text-left flex justify-between items-start p-4 transition-all duration-300 ${
                          openIndex === index ? "pb-2.5" : "pb-4"
                        }`}
                        style={{ color: data.data.theme.textColour }}
                      >
                        <span
                          className="text-base sm:text-lg"
                          data-tina-field={tinaField(faq, "question")}
                        >
                          {faq.question}
                        </span>
                        <DynamicSvg
                          src={downArrow.src}
                          color={data.data.theme.textColour}
                          className={`transition-transform duration-300 my-auto
              ${openIndex === index ? "rotate-180" : "rotate-0"}`}
                          style={{
                            transformOrigin: "center",
                            transformBox: "fill-box",
                          }}
                        />
                      </button>
                      <div
                        ref={(el) => (contentRefs.current[index] = el)}
                        className="overflow-hidden transition-[height] duration-300 ease-out"
                        style={{ height: 0 }}
                      >
                        <div
                          className="px-4 pb-4 text-sm sm:text-base font-light prose max-w-none"
                          style={{ color: data.data.theme.textColour }}
                        >
                          <div data-tina-field={tinaField(faq, "answer")}>
                            <TinaMarkdown
                              content={faq.answer}
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-2">{children}</p>
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const { data } = await client.queries.data({
    relativePath: "index.mdx",
  });

  const shopItems = data.data.shopPage.shopItems;

  const paths = shopItems.map((shopItem) => {
    if (shopItem.title != null) {
      const slug = shopItem.slug || generateSlug(shopItem.title);
      return { params: { slug } };
    }
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { data, query, variables } = await client.queries.data({
    relativePath: "index.mdx",
  });

  const globalData = data.data;

  const shopItem = globalData.shopPage.shopItems.find((p) => {
    if (p.title != null) {
      const slug = p.slug || generateSlug(p.title);
      return slug === params.slug;
    }
  });

  if (!shopItem) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: { data: { ...globalData, shopItem } },
      query,
      variables,
    },
  };
}
