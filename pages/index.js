import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import { ImageGallery } from "../components/generateImageGallery";

export default function HomePage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const gap = data?.data?.homePage?.imageSpacing || 0;

  const galleryItems = data?.data?.homePage?.imageGallery || [];

  return (
    <div>
      <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
        {data.data.homePage.showQuote && (
          <div className="mt-12 lg:mt-24">
            <div
              className="text-xl lg:text-2xl text-center italic font-thin w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
              data-tina-field={tinaField(data.data.homePage, "text")}
            >
              {data.data.homePage.text}
            </div>
            {data.data.homePage.showLine && (
              <div
                className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-5 lg:mt-7"
                style={{ backgroundColor: data.data.theme.lineColour }}
                data-tina-field={tinaField(data.data.theme, "lineColour")}
              ></div>
            )}
          </div>
        )}

        {data.data.homePage.showGallery && (
          <div className="mt-16 lg:mt-24">
            {data.data.homePage.imageGallery && (
              <ImageGallery galleryItems={galleryItems} gap={gap} />
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
