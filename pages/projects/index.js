import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";

export default function ProjectsPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <div className="">
      {/* print jsonify of the const data */}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export const getStaticProps = async () => {
  const homeResult = await client.queries.home({
    relativePath: "index.mdx",
  });

  const projectsResult = await client.queries.projects({
    relativePath: "projects.mdx",
  });

  return {
    props: {
      data: {
        home: homeResult.data.home,
        projects: projectsResult.data.projects,
      },
      query: projectsResult.query,
      variables: projectsResult.variables,
    },
  };
};
