import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import Image from "../../components/Image";
import Link from "next/link";
import NoPageMessage from "../../components/noPageMessage";

function generateSlug(title) {
  if (title != null) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

export default function ProjectsPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const gap = data.data.projectsPage.spacing || 0;
  const minWidth = 270;

  return (
    <div>
      {data.data.projectsPage?.showProjectsPage ? (
        <div>
          <div className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
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
              {data.data.projectsPage.projects && (
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
                    if (!item.showProject) return null;
                    const slug = item.slug || generateSlug(item.title);
                    return (
                      <Link key={index} href={`/projects/${slug}`}>
                        <div className="relative cursor-pointer mb-8">
                          <Image
                            item={item}
                            height={5}
                            image={item.image}
                            tinaName="image"
                            index={index}
                          />
                          <div className="w-full flex flex-row justify-center">
                            <div className="pt-3 px-auto w-full flex flex-row justify-center gap-2">
                              <div className="text-center text-base font-semibold hover:opacity-70">
                                {item.title}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
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
