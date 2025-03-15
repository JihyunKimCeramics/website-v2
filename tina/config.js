import { defineConfig, wrapFieldsWithMeta } from "tinacms";
import React from "react";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        label: "Website Content",
        name: "data",
        path: "content",
        format: "mdx",
        match: {
          include: "index",
        },
        fields: [
          {
            type: "object",
            name: "theme",
            label: "Theme",
            fields: [
              {
                type: "string",
                name: "backgroundColour",
                label: "Background Colour",
                description: "The background colour of the website.",
                required: true,
                ui: {
                  component: "color",
                  colorFormat: "hex",
                  widget: "sketch",
                },
              },
              {
                type: "string",
                name: "textColour",
                label: "Text Colour",
                description: "The text colour of the website.",
                required: true,
                ui: {
                  component: "color",
                  colorFormat: "hex",
                  widget: "sketch",
                },
              },
              {
                type: "string",
                name: "buttonColour",
                label: "Button Colour",
                description: "The colour of buttons on the website.",
                required: true,
                ui: {
                  component: "color",
                  colorFormat: "hex",
                  widget: "sketch",
                },
              },
              {
                type: "string",
                name: "buttonHoverColour",
                label: "Button Hover Colour",
                description:
                  "The colour of buttons when hovering on the website.",
                required: true,
                ui: {
                  component: "color",
                  colorFormat: "hex",
                  widget: "sketch",
                },
              },
              {
                type: "string",
                name: "lineColour",
                label: "Line Colour",
                description: "The line colour under the quote.",
                required: true,
                ui: {
                  component: "color",
                  colorFormat: "hex",
                  widget: "sketch",
                },
              },
            ],
          },
          {
            type: "object",
            name: "header",
            label: "Header",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                description: "The title of the website.",
              },
              {
                type: "boolean",
                name: "showBanner",
                label: "Show Banner",
                description: "Show or hide the banner.",
              },
              {
                type: "rich-text",
                name: "bannerText",
                label: "Banner Text",
                description: "The text for the banner.",
                toolbarOverride: ["bold", "italic"],
              },
              {
                type: "string",
                name: "bannerColour",
                label: "Banner Colour",
                description: "The colour of the banner.",
                required: true,
                ui: {
                  component: "color",
                  colorFormat: "hex",
                  widget: "sketch",
                },
              },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              {
                type: "object",
                name: "signup",
                label: "Signup",
                fields: [
                  {
                    type: "boolean",
                    name: "toggle",
                    label: "Show / hide",
                    description: "Show or hide the signup form.",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "text",
                    label: "Text",
                    description: "Choose the text for the signup form.",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "placeholder",
                    label: "Placeholder",
                    description: "Choose the placeholder for the email input.",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "thankYouMessage",
                    label: "Thank you message",
                    description:
                      "Choose the message for the thank you message.",
                    required: true,
                  },
                ],
              },
              {
                type: "object",
                name: "insta",
                label: "Instagram",
                fields: [
                  {
                    type: "boolean",
                    name: "toggle",
                    label: "Show / hide",
                    description: "Show or hide the Instagram button.",
                  },
                  {
                    type: "string",
                    name: "link",
                    label: "Instagram link",
                    description: "Put the link to the Instagram page here.",
                  },
                ],
              },
              {
                type: "object",
                name: "contact",
                label: "Contact",
                fields: [
                  {
                    type: "boolean",
                    name: "toggle",
                    label: "Show / hide",
                    description: "Show or hide the Contact button.",
                  },
                  {
                    type: "string",
                    name: "email",
                    label: "Email address",
                    description: "Put the email address here.",
                  },
                  {
                    type: "string",
                    name: "text",
                    label: "Text",
                    description: "Choose the text for the button.",
                  },
                ],
              },
              {
                type: "object",
                name: "faqs",
                label: "FAQs",
                fields: [
                  {
                    type: "boolean",
                    name: "toggle",
                    label: "Show / hide",
                    description: "Show or hide the FAQs button.",
                  },
                  {
                    type: "string",
                    name: "text",
                    label: "Text",
                    description: "Choose the text for the button.",
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Title",
                    description: "Title for the FAQs section.",
                    required: true,
                  },
                  {
                    type: "object",
                    name: "faqs",
                    label: "FAQs",
                    list: true,
                    ui: {
                      itemProps: (item) => {
                        return { label: item?.question };
                      },
                    },
                    fields: [
                      {
                        type: "string",
                        name: "question",
                        label: "Question",
                        description: "Put the question here.",
                      },
                      {
                        type: "rich-text",
                        name: "answer",
                        label: "Answer",
                        description: "Put the answer here.",
                        toolbarOverride: ["bold", "italic"],
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "bottomText",
                label: "Bottom text",
                fields: [
                  {
                    type: "boolean",
                    name: "toggle",
                    label: "Show / hide",
                    description: "Show or hide the bottom text.",
                  },
                  {
                    type: "string",
                    name: "text",
                    label: "Text",
                    description: "Put the text you want to display here.",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "homePage",
            label: "Home Page",
            fields: [
              {
                type: "boolean",
                name: "showQuote",
                label: "Show Quote",
              },
              {
                type: "string",
                name: "text",
                label: "Quote",
                description: "A quote for the home page.",
              },
              {
                type: "boolean",
                name: "showLine",
                label: "Show Line",
              },
              {
                type: "boolean",
                name: "showGallery",
                label: "Show Gallery",
              },
              {
                type: "number",
                name: "imageSpacing",
                label: "Image Spacing",
                description: "The spacing between images.",
              },
              {
                type: "object",
                name: "imageGallery",
                label: "Image Gallery",
                list: true,
                templates: [
                  {
                    label: "One Image",
                    name: "oneImage",
                    fields: [
                      {
                        type: "image",
                        name: "image1",
                        label: "Image",
                      },
                      {
                        label: "Height",
                        name: "height",
                        type: "number",
                        description: "Choose the height of the image.",
                        ui: {
                          parse: (val) => Number(val),
                          component: wrapFieldsWithMeta(({ input }) => {
                            return (
                              <input
                                name="height"
                                id="height"
                                type="range"
                                min="0"
                                max="10"
                                step=".1"
                                {...input}
                              />
                            );
                          }),
                        },
                      },
                    ],
                  },
                  {
                    label: "Two Images",
                    name: "twoImages",
                    fields: [
                      {
                        type: "image",
                        name: "image1",
                        label: "Left Image",
                      },
                      {
                        type: "image",
                        name: "image2",
                        label: "Right Image",
                      },
                      {
                        label: "Height",
                        name: "height",
                        type: "number",
                        description: "Choose the height of the images.",
                        ui: {
                          parse: (val) => Number(val),
                          component: wrapFieldsWithMeta(({ input }) => {
                            return (
                              <input
                                name="height"
                                id="height"
                                type="range"
                                min="0"
                                max="10"
                                step=".1"
                                {...input}
                              />
                            );
                          }),
                        },
                      },
                    ],
                  },
                  {
                    label: "Three Images",
                    name: "threeImages",
                    fields: [
                      {
                        type: "image",
                        name: "image1",
                        label: "Left Image",
                      },
                      {
                        type: "image",
                        name: "image2",
                        label: "Middle Image",
                      },
                      {
                        type: "image",
                        name: "image3",
                        label: "Right Image",
                      },
                      {
                        label: "Image to separate for Mobile view",
                        name: "separateImage",
                        type: "string",
                        options: [
                          { value: "0", label: "Left" },
                          { value: "1", label: "Middle" },
                          { value: "2", label: "Right" },
                        ],
                      },
                      {
                        label: "Height",
                        name: "height",
                        type: "number",
                        description: "Choose the height of the images.",
                        ui: {
                          parse: (val) => Number(val),
                          component: wrapFieldsWithMeta(({ input }) => {
                            return (
                              <input
                                name="height"
                                id="height"
                                type="range"
                                min="0"
                                max="10"
                                step=".1"
                                {...input}
                              />
                            );
                          }),
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "projectsPage",
            label: "Projects Page",
            fields: [
              {
                type: "boolean",
                name: "showProjectsPage",
                label: "Show Projects Page",
              },
              {
                type: "string",
                name: "title",
                label: "Title",
                description: "The title of the projects page.",
                required: true,
              },
              {
                type: "boolean",
                name: "showLine",
                label: "Show Line",
              },
              {
                type: "number",
                name: "spacing",
                label: "Project main page spacing",
                description:
                  "The spacing between projects in the main projects page.",
              },
              {
                type: "number",
                name: "imageSpacing",
                label: "Image gallery spacing",
                description:
                  "The spacing between images in the image gallery of a specific project.",
              },
              {
                type: "object",
                name: "projects",
                label: "Projects",
                list: true,
                itemProps: (item) => ({
                  label: item?.title || "New Project",
                }),
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Title",
                    description:
                      "WARNING: Changing the title will change the URL so you will need to update the URL in the browser after saving.",
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Main Image",
                  },
                  {
                    type: "string",
                    name: "details",
                    label: "Details",
                    description: "Artwork details.",
                  },
                  {
                    type: "rich-text",
                    name: "description",
                    label: "Description",
                    description: "Description of the project.",
                    toolbarOverride: ["bold", "italic"],
                  },

                  {
                    type: "boolean",
                    name: "showGallery",
                    label: "Show Image Gallery",
                  },
                  {
                    type: "object",
                    name: "imageGallery",
                    label: "Image Gallery",
                    list: true,
                    templates: [
                      {
                        label: "One Image",
                        name: "oneImage",
                        fields: [
                          {
                            type: "image",
                            name: "image1",
                            label: "Image",
                          },
                          {
                            label: "Height",
                            name: "height",
                            type: "number",
                            description: "Choose the height of the image.",
                            ui: {
                              parse: (val) => Number(val),
                              component: wrapFieldsWithMeta(({ input }) => {
                                return (
                                  <input
                                    name="height"
                                    id="height"
                                    type="range"
                                    min="0"
                                    max="10"
                                    step=".1"
                                    {...input}
                                  />
                                );
                              }),
                            },
                          },
                        ],
                      },
                      {
                        label: "Two Images",
                        name: "twoImages",
                        fields: [
                          {
                            type: "image",
                            name: "image1",
                            label: "Left Image",
                          },
                          {
                            type: "image",
                            name: "image2",
                            label: "Right Image",
                          },
                          {
                            label: "Height",
                            name: "height",
                            type: "number",
                            description: "Choose the height of the images.",
                            ui: {
                              parse: (val) => Number(val),
                              component: wrapFieldsWithMeta(({ input }) => {
                                return (
                                  <input
                                    name="height"
                                    id="height"
                                    type="range"
                                    min="0"
                                    max="10"
                                    step=".1"
                                    {...input}
                                  />
                                );
                              }),
                            },
                          },
                        ],
                      },
                      {
                        label: "Three Images",
                        name: "threeImages",
                        fields: [
                          {
                            type: "image",
                            name: "image1",
                            label: "Left Image",
                          },
                          {
                            type: "image",
                            name: "image2",
                            label: "Middle Image",
                          },
                          {
                            type: "image",
                            name: "image3",
                            label: "Right Image",
                          },
                          {
                            label: "Image to separate for Mobile view",
                            name: "separateImage",
                            type: "string",
                            options: [
                              { value: "0", label: "Left" },
                              { value: "1", label: "Middle" },
                              { value: "2", label: "Right" },
                            ],
                          },
                          {
                            label: "Height",
                            name: "height",
                            type: "number",
                            description: "Choose the height of the images.",
                            ui: {
                              parse: (val) => Number(val),
                              component: wrapFieldsWithMeta(({ input }) => {
                                return (
                                  <input
                                    name="height"
                                    id="height"
                                    type="range"
                                    min="0"
                                    max="10"
                                    step=".1"
                                    {...input}
                                  />
                                );
                              }),
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "aboutPage",
            label: "About",
            fields: [
              {
                type: "boolean",
                name: "showAboutPage",
                label: "Show About Page",
              },
              {
                type: "string",
                name: "title",
                label: "Title",
                description: "The title of the about page.",
              },
            ],
          },
          {
            type: "object",
            name: "shopPage",
            label: "Shop",
            fields: [
              {
                type: "boolean",
                name: "showShopPage",
                label: "Show Shop Link",
              },
              {
                type: "string",
                name: "title",
                label: "Title",
                description: "The title of the shop link.",
              },
              {
                type: "string",
                name: "link",
                label: "Link",
                description: "The link to the shop.",
              },
            ],
          },
          {
            type: "object",
            name: "exhibitionsPage",
            label: "Exhibitions Page",
            fields: [
              {
                type: "boolean",
                name: "showExhibitionsPage",
                label: "Show Exhibitions Page",
              },
              {
                type: "string",
                name: "title",
                label: "Title",
                description: "The title of the exhibitions page.",
              },
              {
                type: "boolean",
                name: "showLine",
                label: "Show Line",
              },
              {
                type: "number",
                name: "spacing",
                label: "Spacing",
                description: "The spacing between exhibitions.",
              },
              {
                type: "object",
                name: "exhibitions",
                label: "Exhibitions",
                list: true,
                itemProps: (item) => ({
                  label: item?.title || "New Exhibition",
                }),
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Title",
                    description: "The title of the exhibition.",
                    required: true,
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Main Image",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "dates",
                    label: "Dates",
                    description: "Exhibition dates.",
                  },
                  {
                    type: "string",
                    name: "location",
                    label: "Location",
                    description: "Exhibition location.",
                  },
                  {
                    type: "rich-text",
                    name: "description",
                    label: "Description",
                    description: "Description of the exhibition.",
                    toolbarOverride: ["bold", "italic"],
                  },
                ],
              },
            ],
          },
        ],
        ui: {
          router: () => "/",
        },
      },
    ],
  },
});
