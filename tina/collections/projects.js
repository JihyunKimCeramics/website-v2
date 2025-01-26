const projects = {
  label: "Projects Page",
  name: "projects",
  path: "content",
  format: "mdx",
  match: {
    include: "projects",
  },
  fields: [
    {
      type: "object",
      name: "header",
      label: "Header",
      fields: [
        {
          type: "boolean",
          name: "showProjectsPage",
          label: "Show Projects Page",
          description: "Show the projects page on the website.",
        },
        {
          type: "string",
          name: "title",
          label: "Title",
          description: "The title of the website.",
        },
        {
          type: "string",
          name: "buttonHoverColour",
          label: "Button Hover Colour",
          description: "The colour of buttons when hovering on the website.",
          ui: {
            component: "color",
            colorFormat: "hex",
            widget: "sketch",
          },
        },
      ],
    },
  ],
  ui: {
    router: () => "/projects",
  },
};

export default projects;
