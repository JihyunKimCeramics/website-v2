import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import Image from "../../components/Image";
import Link from "next/link";
import { useState } from "react";

function generateSlug(title) {
  if (title != null) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

export default function ShopPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const gap = data.data.shopPage.spacing || 0;
  const minWidth = 270;

  return (
    <>
      {data.data.shopPage?.showShopPage && (
        <>
          <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
            <div className="mt-12 lg:mt-24">
              <div
                className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
                data-tina-field={tinaField(data.data.shopPage, "title")}
              >
                {data.data.shopPage.title}
              </div>
              {data.data.shopPage.showLine && (
                <div
                  className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-3"
                  style={{ backgroundColor: data.data.theme.lineColour }}
                  data-tina-field={tinaField(data.data.theme, "lineColour")}
                ></div>
              )}
            </div>

            <div className="mt-16 lg:mt-24">
              {data.data.shopPage.shopItems && (
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
                  {data.data.shopPage.shopItems?.map((item, index) => {
                    if (
                      !item.showItem ||
                      !item.name ||
                      !item.title ||
                      !item.images ||
                      item.images?.length === 0
                    )
                      return null;
                    const slug = `${generateSlug(item.title)}_${generateSlug(
                      item.name
                    )}`;
                    return (
                      <Link key={index} href={`/shop/${slug}`}>
                        <div className="relative cursor-pointer mb-8">
                          <Image
                            item={item.images[0]}
                            height={5}
                            image={item.images[0].image}
                            tinaName="image"
                            index={index}
                          />
                          <div className="pt-3 px-auto w-full flex flex-col  px-12 sm:px-8 md:px-0 text-center sm:text-left hover:opacity-70">
                            <div className="font-medium">{item.title}</div>
                            <div className="font-extralight">{item.name}</div>
                            {item.price && (
                              <div className="font-semibold pt-1.5">
                                £{item.price}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </ul>
        </>
      )}
    </>
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
