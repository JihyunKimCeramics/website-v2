import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import Image from "../../components/Image";
import DynamicSvg from "../../components/DynamicSvg";
import right_arrow from "../../public/images/right_arrow.svg";

export default function ProjectsPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const gap = data?.data?.projectsPage?.spacing || 0;
  const minWidth = 270;

  return (
    <div>
      <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
        <div className="mt-12 lg:mt-24">
          <div
            className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
            data-tina-field={tinaField(data.data.projectsPage, "title")}
          >
            {data.data.projectsPage.title}
          </div>
          {data.data.projectsPage.showLine && (
            <div
              className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-3"
              style={{ backgroundColor: data.data.theme.lineColour }}
              data-tina-field={tinaField(data.data.theme, "lineColour")}
            ></div>
          )}
        </div>
        <div className="mt-16 lg:mt-24">
          {data.data.homePage.imageGallery.mobileImageGallery && (
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
              {data.data.projectsPage.projects.map((item, index) => {
                return (
                  <div key={item.id} className="relative">
                    <Image
                      item={item}
                      height={5}
                      image={item.image}
                      tinaName="image"
                      index={index}
                    />
                    <div className="w-full flex flex-row justify-center">
                      <div
                        className="mb-5 py-3.5 w-auto rounded-full flex flex-row justify-center gap-3 cursor-pointer"
                        style={{ backdropFilter: "blur(20.299999237060547px)" }}
                      >
                        <div className="text-center">{item.title}</div>
                        <DynamicSvg
                          src={right_arrow.src}
                          color={data.data.theme.textColour}
                          className="mx-auto my-auto"
                        />
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
