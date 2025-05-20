import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "/tina/__generated__/client";
import Image from "/components/Image";
import NoPageMessage from "/components/noPageMessage";

export default function ExhibitionsPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const gap = data?.data?.exhibitionsPage?.spacing || 0;
  const minWidth = 330;

  return (
    <div>
      {data.data.exhibitionsPage?.showExhibitionsPage ? (
        <div>
          <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
            <div className="mt-12 lg:mt-24">
              <div
                className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
                data-tina-field={tinaField(data.data.exhibitionsPage, "title")}
              >
                {data.data.exhibitionsPage.title}
              </div>
              {data.data.exhibitionsPage.showLine && (
                <div
                  className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-3"
                  style={{ backgroundColor: data.data.theme.lineColour }}
                  data-tina-field={tinaField(data.data.theme, "lineColour")}
                ></div>
              )}
            </div>
            <div className="mt-16 lg:mt-24 -mb-10">
              {data.data.exhibitionsPage.exhibitions && (
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
                  {data.data.exhibitionsPage.exhibitions.map((item, index) => {
                    return (
                      <div key={item.id} className="relative mb-10">
                        <Image
                          item={item}
                          height={5}
                          image={item.image}
                          tinaName="image"
                          index={index}
                        />
                        <div className="w-full flex flex-row justify-center">
                          <div className="pt-4 px-12 sm:px-8 md:px-0 w-full flex flex-col justify-start gap-3">
                            <div
                              className="text-left text-base font-semibold"
                              data-tina-field={tinaField(item, "title")}
                            >
                              {item.title}
                            </div>
                            {(item.dates || item.location) && (
                              <div className="flex flex-col gap-1">
                                {" "}
                                {item.dates && (
                                  <div
                                    className="text-left text-sm font-normal italic"
                                    data-tina-field={tinaField(item, "dates")}
                                  >
                                    {item.dates}
                                  </div>
                                )}
                                {item.location && (
                                  <div
                                    className="text-left text-sm font-normal italic"
                                    data-tina-field={tinaField(
                                      item,
                                      "location"
                                    )}
                                  >
                                    {item.location}
                                  </div>
                                )}
                              </div>
                            )}
                            {item.description &&
                              item.description?.children?.length > 0 && (
                                <div
                                  className="text-left text-sm font-extralight leading-relaxed"
                                  data-tina-field={tinaField(item, "location")}
                                >
                                  <TinaMarkdown
                                    content={item.description}
                                    components={{
                                      p: ({ children }) => (
                                        <p className="mb-2">{children}</p>
                                      ),
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ul>
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
