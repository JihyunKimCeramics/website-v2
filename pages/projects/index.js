import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";

export default function ProjectsPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <div>
      <ul className="flex flex-col md:w-200 lg:w-300 xl:w-400 md:mx-auto">
        {data.data.homePage.quote.showQuote && (
          <div className="mt-12 lg:mt-24">
            <div
              className="text-2xl lg:text-3xl text-center font-normal w-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
              data-tina-field={tinaField(data.data.homePage, "quote.text")}
            >
              Projects
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
