import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "../../tina/__generated__/client";
import React, { useEffect, useState } from "react";
import arrow from "../../public/images/right_arrow.svg";
import Image from "../../components/Image";

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

  return (
    <div>
      <div className="flex flex-col md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto ">
        <div className="mt-12 lg:mt-24">
          {data.data.projectsPage.projects[projectIndex]?.title && (
            <div
              className="text-2xl lg:text-3xl text-center font-normal leading-normal lg:leading-relaxed"
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
              className="mt-3 text-center text-xs font-extralight italic"
              data-tina-field={tinaField(
                data.data.projectsPage.projects[projectIndex],
                "details"
              )}
            >
              {data.data.projectsPage.projects[projectIndex].details}
            </div>
          )}
          {data.data.projectsPage.projects[projectIndex]?.description && (
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
        {/* {data.data.projectsPage.projects[projectIndex]?.details && (
          <div
            className="mt-16 lg:mt-24"
            data-tina-field={tinaField(
              data.data.projectsPage.projects[projectIndex],
              "details"
            )}
          >
            {data.data.projectsPage.projects[projectIndex].details}
          </div>
        )} */}
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
          {data.data.projectsPage.projects[projectIndex].mobileImageGallery && (
            <div
              className="flex flex-col sm:hidden"
              style={{ gap: `${gap}px` }}
            >
              {data.data.projectsPage.projects[
                projectIndex
              ].mobileImageGallery.map((item) => {
                if (
                  item.__typename ===
                  "DataProjectsPageProjectsMobileImageGalleryOneImage"
                ) {
                  return (
                    <Image
                      key={item.id}
                      item={item}
                      height={item.height}
                      image={item.image}
                      tinaName={"image"}
                    />
                  );
                } else if (
                  item.__typename ===
                  "DataHomePageImageGalleryMobileImageGalleryTwoImages"
                ) {
                  return (
                    <div className="flex flex-row" style={{ gap: `${gap}px` }}>
                      <Image
                        key={item.id}
                        item={item}
                        height={item.height}
                        image={item.image1}
                        tinaName={"image1"}
                      />
                      <Image
                        key={item.id}
                        item={item}
                        height={item.height}
                        image={item.image2}
                        tinaName={"image2"}
                      />
                    </div>
                  );
                }
              })}
            </div>
          )}
          {data.data.projectsPage.projects[projectIndex]
            .desktopImageGallery && (
            <div
              className="sm:flex flex-col hidden md:w-200 lg:w-300 xl:w-400 md:mx-auto"
              style={{ gap: `${gap}px` }}
            >
              {data.data.projectsPage.projects[
                projectIndex
              ].desktopImageGallery.map((item, index) => {
                if (
                  item.__typename ===
                  "DataProjectsPageProjectsDesktopImageGalleryOneImage"
                ) {
                  return (
                    <Image
                      key={item.id}
                      item={item}
                      height={item.height}
                      image={item.image}
                      tinaName={"image"}
                    />
                  );
                } else if (
                  item.__typename ===
                  "DataProjectsPageProjectsDesktopImageGalleryTwoImagesOneWide"
                ) {
                  const isWideRight = item.wideImage === "right";
                  return (
                    <div
                      key={item.id}
                      className="flex" // Changed from grid grid-cols-12 to flex
                      style={{ gap: `${gap}px` }}
                    >
                      <div
                        className={`${isWideRight ? "w-1/3" : "w-2/3"}`} // Changed from col-span to w-1/3 or w-2/3
                      >
                        <Image
                          item={item}
                          height={item.height}
                          image={item.image1}
                          tinaName="image1"
                          widthFraction={isWideRight ? 1 / 3 : 2 / 3}
                        />
                      </div>
                      <div
                        className={`${isWideRight ? "w-2/3" : "w-1/3"}`} // Changed from col-span to w-2/3 or w-1/3
                      >
                        <Image
                          item={item}
                          height={item.height}
                          image={item.image2}
                          tinaName="image2"
                          widthFraction={isWideRight ? 2 / 3 : 1 / 3}
                        />
                      </div>
                    </div>
                  );
                } else if (
                  item.__typename ===
                  "DataProjectsPageProjectsDesktopImageGalleryTwoImagesEqualWidth"
                ) {
                  return (
                    <div
                      key={item.id}
                      className="flex flex-row"
                      style={{ gap: `${gap}px` }}
                    >
                      <Image
                        item={item}
                        height={item.height}
                        image={item.image1}
                        tinaName="image1"
                      />
                      <Image
                        item={item}
                        height={item.height}
                        image={item.image2}
                        tinaName="image2"
                      />
                    </div>
                  );
                } else if (
                  item.__typename ===
                  "DataProjectsPageProjectsDesktopImageGalleryThreeImages"
                ) {
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-12"
                      style={{ gap: `${gap}px` }}
                    >
                      <div className="col-span-4">
                        <Image
                          item={item}
                          height={item.height}
                          image={item.image1}
                          tinaName="image1"
                          widthFraction={1 / 3}
                        />
                      </div>
                      <div className="col-span-4">
                        <Image
                          item={item}
                          height={item.height}
                          image={item.image2}
                          tinaName="image2"
                          widthFraction={1 / 3}
                        />
                      </div>
                      <div className="col-span-4">
                        <Image
                          item={item}
                          height={item.height}
                          image={item.image3}
                          tinaName="image3"
                          widthFraction={1 / 3}
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
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
