import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import Image from "../components/Image";

export default function HomePage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const gap = data?.data?.homePage?.imageGallery?.imageSpacing || 0;

  return (
    <div>
      <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
        {data.data.homePage.quote.showQuote && (
          <div className="mt-12 lg:mt-24">
            <div
              className="text-xl lg:text-2xl text-center italic font-thin w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
              data-tina-field={tinaField(data.data.homePage, "quote.text")}
            >
              {data.data.homePage.quote.text}
            </div>
            {data.data.homePage.quote.showLine && (
              <div
                className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-5 lg:mt-7"
                style={{ backgroundColor: data.data.theme.lineColour }}
                data-tina-field={tinaField(data.data.theme, "lineColour")}
              ></div>
            )}
          </div>
        )}

        {data.data.homePage.imageGallery.showGallery && (
          <div className="mt-16 lg:mt-24">
            {data.data.homePage.imageGallery.mobileImageGallery && (
              <div
                className="flex flex-col sm:hidden"
                style={{ gap: `${gap}px` }}
              >
                {data.data.homePage.imageGallery.mobileImageGallery.map(
                  (item, index) => {
                    if (
                      item.__typename ===
                      "DataHomePageImageGalleryMobileImageGalleryOneImage"
                    ) {
                      return (
                        <Image
                          key={item.id}
                          item={item}
                          height={item.height}
                          image={item.image}
                          tinaName={"image"}
                        />
                      );
                    } else if (
                      item.__typename ===
                      "DataHomePageImageGalleryMobileImageGalleryTwoImages"
                    ) {
                      return (
                        <div
                          className="flex flex-row"
                          style={{ gap: `${gap}px` }}
                        >
                          <Image
                            key={item.id}
                            item={item}
                            height={item.height}
                            image={item.image1}
                            tinaName={"image1"}
                          />
                          <Image
                            key={item.id}
                            item={item}
                            height={item.height}
                            image={item.image2}
                            tinaName={"image2"}
                          />
                        </div>
                      );
                    }
                  }
                )}
              </div>
            )}
            {data.data.homePage.imageGallery.desktopImageGallery && (
              <div
                className="sm:flex flex-col hidden"
                style={{ gap: `${gap}px` }}
              >
                {data.data.homePage.imageGallery.desktopImageGallery.map(
                  (item, index) => {
                    if (
                      item.__typename ===
                      "DataHomePageImageGalleryDesktopImageGalleryOneImage"
                    ) {
                      return (
                        <Image
                          key={item.id}
                          item={item}
                          height={item.height}
                          image={item.image}
                          tinaName={"image"}
                        />
                      );
                    } else if (
                      item.__typename ===
                      "DataHomePageImageGalleryDesktopImageGalleryTwoImagesOneWide"
                    ) {
                      const isWideRight = item.wideImage === "right";
                      return (
                        <div
                          key={item.id}
                          className="flex" // Changed from grid grid-cols-12 to flex
                          style={{ gap: `${gap}px` }}
                        >
                          <div
                            className={`${isWideRight ? "w-1/3" : "w-2/3"}`} // Changed from col-span to w-1/3 or w-2/3
                          >
                            <Image
                              item={item}
                              height={item.height}
                              image={item.image1}
                              tinaName="image1"
                              widthFraction={isWideRight ? 1 / 3 : 2 / 3}
                            />
                          </div>
                          <div
                            className={`${isWideRight ? "w-2/3" : "w-1/3"}`} // Changed from col-span to w-2/3 or w-1/3
                          >
                            <Image
                              item={item}
                              height={item.height}
                              image={item.image2}
                              tinaName="image2"
                              widthFraction={isWideRight ? 2 / 3 : 1 / 3}
                            />
                          </div>
                        </div>
                      );
                    } else if (
                      item.__typename ===
                      "DataHomePageImageGalleryDesktopImageGalleryTwoImagesEqualWidth"
                    ) {
                      return (
                        <div
                          key={item.id}
                          className="flex flex-row"
                          style={{ gap: `${gap}px` }}
                        >
                          <Image
                            item={item}
                            height={item.height}
                            image={item.image1}
                            tinaName="image1"
                          />
                          <Image
                            item={item}
                            height={item.height}
                            image={item.image2}
                            tinaName="image2"
                          />
                        </div>
                      );
                    } else if (
                      item.__typename ===
                      "DataHomePageImageGalleryDesktopImageGalleryThreeImages"
                    ) {
                      return (
                        <div
                          key={item.id}
                          className="grid grid-cols-12"
                          style={{ gap: `${gap}px` }}
                        >
                          <div className="col-span-4">
                            <Image
                              item={item}
                              height={item.height}
                              image={item.image1}
                              tinaName="image1"
                              widthFraction={1 / 3}
                            />
                          </div>
                          <div className="col-span-4">
                            <Image
                              item={item}
                              height={item.height}
                              image={item.image2}
                              tinaName="image2"
                              widthFraction={1 / 3}
                            />
                          </div>
                          <div className="col-span-4">
                            <Image
                              item={item}
                              height={item.height}
                              image={item.image3}
                              tinaName="image3"
                              widthFraction={1 / 3}
                            />
                          </div>
                        </div>
                      );
                    }
                  }
                )}
              </div>
            )}
          </div>
        )}
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
