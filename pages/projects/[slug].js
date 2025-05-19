import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "../../tina/__generated__/client";
import React, { useEffect, useState } from "react";
import Image from "../../components/Image";
import { ImageGallery } from "../../components/generateImageGallery";
import generateSlug from "../../components/generateSlug";
import NoPageMessage from "../../components/noPageMessage";

export default function ProjectPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
    // skip: true,
  });

  const [project, setProject] = useState("");

  useEffect(() => {
    if (data.data.project != project && data.data.project != null) {
      setProject(data.data.project);
    }
  }, [data, project]);

  const projectIndex = data.data.projectsPage.projects.findIndex(
    (p) => p.title === project.title
  );

  const gap = data?.data?.projectsPage?.imageSpacing || 0;

  const galleryItems =
    data?.data?.projectsPage?.projects[projectIndex]?.imageGallery || [];

  return (
    <div>
      {data.data.projectsPage?.showProjectsPage &&
      data.data.projectsPage?.projects[projectIndex]?.showProject ? (
        <div>
          <div className="flex flex-col md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto">
            <div className="mt-12 lg:mt-24">
              {data.data.projectsPage.projects[projectIndex]?.title && (
                <div
                  className="text-2xl lg:text-3xl text-center font-normal w-auto mx-8 sm:mx-28 lg:mx-40 xl:mx-64 leading-normal lg:leading-relaxed"
                  data-tina-field={tinaField(
                    data.data.projectsPage.projects[projectIndex],
                    "title"
                  )}
                >
                  {data.data.projectsPage.projects[projectIndex].title}
                </div>
              )}
              {data.data.projectsPage.projects[projectIndex]?.details && (
                <div
                  className="mt-3 text-center text-xs font-extralight italic mx-8 sm:mx-28 lg:mx-40 xl:mx-64"
                  data-tina-field={tinaField(
                    data.data.projectsPage.projects[projectIndex],
                    "details"
                  )}
                >
                  {data.data.projectsPage.projects[projectIndex].details}
                </div>
              )}
              {data.data.projectsPage.projects[projectIndex]?.description
                ?.children?.length > 0 && (
                <div
                  className="mt-12 md:mx-20 text-center text-sm font-light"
                  data-tina-field={tinaField(
                    data.data.projectsPage.projects[projectIndex],
                    "description"
                  )}
                >
                  <TinaMarkdown
                    content={
                      data.data.projectsPage.projects[projectIndex].description
                    }
                    components={{
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                    }}
                  />
                </div>
              )}
              {data.data.projectsPage.showLine && (
                <div
                  className="h-0.08 md:h-0.1 w-20 sm:w-28 mx-auto mt-5"
                  style={{ backgroundColor: data.data.theme.lineColour }}
                ></div>
              )}
            </div>
          </div>
          <div className="w-full md:w-200 lg:w-300 xl:w-400 md:mx-auto mt-16 lg:mt-24">
            <Image
              item={data.data.projectsPage.projects[projectIndex]}
              height={5}
              image={data.data.projectsPage.projects[projectIndex]?.image}
              tinaName="image"
              index={data.data.projectsPage.projects[projectIndex]}
            />
          </div>

          {data.data.projectsPage.projects[projectIndex]?.showGallery && (
            <div className="mt-16 lg:mt-24" style={{ marginTop: `${gap}px` }}>
              {data.data.projectsPage.projects[projectIndex].imageGallery && (
                <ImageGallery galleryItems={galleryItems} gap={gap} />
              )}
            </div>
          )}
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

export async function getStaticPaths() {
  const { data } = await client.queries.data({
    relativePath: "index.mdx",
  });

  const projects = data.data.projectsPage.projects;

  const paths = projects.map((project) => {
    if (project.title != null) {
      const slug = project.slug || generateSlug(project.title);
      return { params: { slug } };
    }
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
    if (p.title != null) {
      const slug = p.slug || generateSlug(p.title);
      return slug === params.slug;
    }
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
