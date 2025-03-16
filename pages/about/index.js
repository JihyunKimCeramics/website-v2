import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "../../tina/__generated__/client";
import React, { useEffect, useState } from "react";
import download from "../../public/images/download.svg";
import DynamicSvg from "../../components/DynamicSvg";
import Image from "../../components/Image";

export default function AboutPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const gap = data?.data?.aboutPage?.imageSpacing || 0;

  return (
    <div>
      <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
        <div className="mt-12 lg:mt-24">
          <div
            className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
            data-tina-field={tinaField(data.data.aboutPage, "title")}
          >
            {data.data.aboutPage.title}
          </div>
          {data.data.aboutPage.header?.showHeader && (
            <div
              className="mt-3 text-xl lg:text-2xl text-center italic font-thin w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
              data-tina-field={tinaField(data.data.aboutPage.header, "header")}
            >
              {data.data.aboutPage.header.header}
            </div>
          )}
          {data.data.aboutPage.cv.showCV && (
            <div className="mx-auto flex flex-col justify-center items-center mt-5">
              <a
                className="h-9 px-4 flex flex-row justify-center rounded-full cursor-pointer gap-2"
                data-tina-field={tinaField(data.data.aboutPage, "cv")}
                style={{ backgroundColor: data.data.theme.buttonColour }}
                target="_blank"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    data.data.theme.buttonHoverColour)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    data.data.theme.buttonColour)
                }
                href={data.data.aboutPage.cv.cv}
              >
                <div className="text-xs xl:text-sm font-medium my-auto">
                  {data.data.aboutPage.cv.text}
                </div>
                <DynamicSvg
                  src={download.src}
                  color={data.data.theme.textColour}
                  className="mx-auto my-auto"
                />
              </a>
            </div>
          )}
          {data.data.aboutPage.content && (
            <div className="mt-16 lg:mt-24 flex flex-col gap-16 lg:gap-24">
              {data.data.aboutPage.content.map((item, index) => {
                if (
                  item.__typename === "DataAboutPageContentImage" &&
                  (item.image1 || item.image2)
                ) {
                  return (
                    <div className="flex flex-row" style={{ gap: `${gap}px` }}>
                      {item.image1 && (
                        <Image
                          item={item}
                          height={item.height}
                          image={item.image1}
                          tinaName="image1"
                          index={index}
                        />
                      )}
                      {item.image2 && (
                        <Image
                          item={item}
                          height={item.height}
                          image={item.image2}
                          tinaName="image2"
                          index={index}
                        />
                      )}
                    </div>
                  );
                } else if (
                  item.__typename === "DataAboutPageContentParagraph" &&
                  item.text
                ) {
                  return (
                    <div className="w-auto mx-12 sm:mx-20">
                      <div
                        data-tina-field={tinaField(
                          data.data.aboutPage.content[index],
                          "text"
                        )}
                        className="text-center text-sm font-light"
                      >
                        <TinaMarkdown
                          content={item.text}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2">{children}</p>
                            ),
                          }}
                        />
                      </div>
                    </div>
                  );
                } else if (
                  item.__typename === "DataAboutPageContentVideo" &&
                  item.url
                ) {
                  return (
                    <div className="flex flex-col">
                      <div className="relative w-full pb-[56.25%] h-0">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`${item.url}?autoplay=0&modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      {item.caption && (
                        <div
                          className="mt-2 text-left text-xs font-extralight italic mx-12 md:mx-0"
                          data-tina-field={tinaField(item, "caption")}
                        >
                          {item.caption}
                        </div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </ul>
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
