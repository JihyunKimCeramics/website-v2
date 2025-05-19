import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import NoPageMessage from "/components/noPageMessage";

export default function CartPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

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
