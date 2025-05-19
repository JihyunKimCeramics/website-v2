import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import { ImageGallery } from "../components/generateImageGallery";

export default function CartPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return <div>Hi</div>;
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
