import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import NoPageMessage from "/components/NoPageMessage";

export default function Custom404(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <div>
      <NoPageMessage
        buttonColour={data.data.theme.buttonColour}
        buttonHoverColour={data.data.theme.buttonHoverColour}
      />
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
