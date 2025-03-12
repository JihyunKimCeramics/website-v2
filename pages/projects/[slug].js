import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "../../tina/__generated__/client";
import Image from "../../components/Image";
import React, { useEffect, useState } from "react";

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
    skip: true,
  });

  const [project, setProject] = useState("");

  useEffect(() => {
    if (data.data.project != project && data.data.project != null) {
      setProject(data.data.project);
    }
  });

  return (
    <div>
      {project && (
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
          <div
            className="mt-4"
            data-tina-field={tinaField(project, "description")}
          >
            <TinaMarkdown content={project.description} />
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const { data } = await client.queries.data({
    relativePath: "index.mdx",
  });

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
  const { data, query, variables } = await client.queries.data({
    relativePath: "index.mdx",
  });

  const globalData = data.data;

  const project = globalData.projectsPage.projects.find((p) => {
    const slug = p.slug || generateSlug(p.title);
    return slug === params.slug;
  });

  if (!project) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: { data: { ...globalData, project } },
      query,
      variables,
    },
  };
}
