import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "../../tina/__generated__/client";
import Image from "../../components/Image";

// Utility function to generate a slug from a title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProjectPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  // NOTE: The global data is nested under "data.data"
  const project = data.data.project;

  return (
    <div className="container mx-auto py-8">
      <h1
        className="text-3xl font-bold mb-4"
        data-tina-field={tinaField(project, "title")}
      >
        {project.title}
      </h1>
      {project.image && (
        <Image item={project} image={project.image} tinaName="image" />
      )}
      <div className="mt-4" data-tina-field={tinaField(project, "description")}>
        <TinaMarkdown content={project.description} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch the full global data from index.mdx.
  const { data } = await client.queries.data({
    relativePath: "index.mdx",
  });

  // Data is nested under data.data
  const projects = data.data.projectsPage.projects;

  const paths = projects.map((project) => {
    const slug = project.slug || generateSlug(project.title);
    return { params: { slug } };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Fetch the full global data from index.mdx.
  const { data, query, variables } = await client.queries.data({
    relativePath: "index.mdx",
  });

  // Global data (includes theme, header, etc.)
  const globalData = data.data;

  // Find the project matching the slug.
  const project = globalData.projectsPage.projects.find((p) => {
    const slug = p.slug || generateSlug(p.title);
    return slug === params.slug;
  });

  if (!project) {
    return {
      notFound: true,
    };
  }

  // Merge the global data with the specific project data.
  // This way, _app.js and Layout receive the expected shape.
  return {
    props: {
      data: { data: { ...globalData, project } },
      query,
      variables,
    },
  };
}
