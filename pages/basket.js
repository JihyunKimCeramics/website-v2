import { tinaField, useTina } from "tinacms/dist/react";
import React, { useEffect, useState } from "react";
import { client } from "../tina/__generated__/client";
import NoPageMessage from "/components/noPageMessage";
import { useCart } from "../pages/_app";
import bin from "../public/images/bin.svg";
import generateSlug from "/components/generateSlug";
import Image from "/components/Image";
import DynamicSvg from "/components/DynamicSvg";

export default function CartPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { cart, removeFromCart, checkout } = mounted
    ? useCart()
    : { cart: [], removeFromCart: () => {}, checkout: () => {} };

  if (!mounted) return null;

  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div>
      {data.data.shopPage?.showShopPage ? (
        <div>
          <div className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
            <div className="mt-12 lg:mt-24">
              <div
                className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
                data-tina-field={tinaField(data.data.shopPage, "basketTitle")}
              >
                {data.data.shopPage.basketTitle}
              </div>
              {data.data.shopPage.showLine && (
                <div
                  className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-3"
                  style={{ backgroundColor: data.data.theme.lineColour }}
                  data-tina-field={tinaField(data.data.theme, "lineColour")}
                ></div>
              )}
            </div>
          </div>
          {itemCount === 0 ? (
            <div className="mt-16 mb-6 lg:mt-24 lg:mb-9 text-xl lg:text-2xl text-center font-thin w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed">
              Your basket is empty!
            </div>
          ) : (
            <div className="text-center mt-16 mb-16 lg:mt-24 lg:mb-12 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
              <div className="flex flex-row w-fit sm:min-w-[24rem] md:min-w-[34rem] lg:min-w-[38rem] 2xl:min-w-[44rem] justify-between gap-10 sm:gap-8 mx-auto">
                <div className="flex flex-col gap-6 sm:gap-8">
                  {cart.map((item, index) => {
                    const slug = `${generateSlug(item.title)}_${generateSlug(
                      item.name
                    )}`;
                    return (
                      <a
                        key={index}
                        href={`/shop/${slug}`}
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
                    );
                  })}
                </div>
                <div className="flex flex-col gap-16 sm:gap-34">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="min-w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: data.data.theme.buttonColour }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          data.data.theme.buttonHoverColour)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          data.data.theme.buttonColour)
                      }
                      onClick={() => removeFromCart(item, cart)}
                    >
                      <DynamicSvg
                        src={bin.src}
                        color={data.data.theme.textColour}
                        className="mx-auto my-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-row justify-center">
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
              {itemCount === 0 ? (
                <a className="text-sm xl:text-base font-semibold" href="/shop">
                  Visit shop
                </a>
              ) : (
                <div
                  className="text-sm xl:text-base font-semibold cursor-pointer"
                  onClick={() => checkout(cart)}
                >
                  Checkout
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
