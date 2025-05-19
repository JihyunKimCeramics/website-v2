// import React from "react";
// import NoPageMessage from "../components/NoPageMessage";
// import Layout from "../components/Layout";
// import { useTina } from "tinacms/dist/react";

// export default function Custom404({ Component, pageProps }) {
//   const tinaResult = useTina({
//     query: pageProps.query,
//     variables: pageProps.variables,
//     data: pageProps.data,
//   });

//   const data = tinaResult.data?.data || pageProps.data?.data;

//   return (
//     <>
//       {data ? (
//         <Layout data={{ data }}>
//           <NoPageMessage buttonColour="#F7EFE2" buttonHoverColour="#EDE2CB" />;
//         </Layout>
//       ) : (
//         <Component {...pageProps} />
//       )}
//     </>
//     // {data ? (
//     //         <Layout data={{ data }}>
//     //           <Component {...pageProps} />
//     //         </Layout>
//     //       ) : (
//     //         <Component {...pageProps} />
//     //       )}
//   );
// }

import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import NoPageMessage from "../components/NoPageMessage";

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
