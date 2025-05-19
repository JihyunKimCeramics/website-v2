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

export default function Custom404() {
  return (
    <div className="container">
      <h1>404 – Page Not Found</h1>
      <p>Sorry, the page you’re looking for does not exist.</p>
    </div>
  );
}

// import React from "react";
// import { useTina } from "tinacms/dist/react";
// import Head from "next/head";
// import Layout from "../components/Layout";
// import { client } from "../tina/__generated__/client";

// export default function Custom404({ query, variables, data }) {
//   // Initialize Tina with the fetched props
//   const tinaResult = useTina({ query, variables, data });
//   const cmsData = tinaResult.data?.data || data?.data;

//   return (
//     <Layout data={{ data: cmsData }}>
//       <Head>
//         <title>404 – Page Not Found</title>
//       </Head>
//       <div className="container">
//         <h1>404 – Page Not Found</h1>
//         <p>Sorry, the page you're looking for does not exist.</p>
//       </div>
//     </Layout>
//   );
// }

// export async function getStaticProps() {
//   // Fetch your global CMS document so Layout has its site-wide data
//   const tinaProps = await client.queries.globalDocument({
//     relativePath: "global.json",
//   });
//   return {
//     props: {
//       query: tinaProps.query,
//       variables: tinaProps.variables,
//       data: tinaProps.data,
//     },
//   };
// }
