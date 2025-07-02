// https://docs.astro.build/en/guides/content-collections/#defining-collections

import { z, defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/projects/en" }),
    schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    main: z.object({
      id: z.number(),
      content: z.string(),
      imgCard: image(),
      imgMain: image(),
      imgAlt: z.string(),
    }),
    tabs: z.array(
      z.object({
        id: z.string(),
        dataTab: z.string(),
        title: z.string(),
      })
    ),
    longDescription: z.object({
      title: z.string(),
      subTitle: z.string(),
      btnTitle: z.string(),
      btnURL: z.string(),
    }),
    descriptionList: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ),
    specificationsLeft: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ),
    specificationsRight: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ).optional(),
    tableData: z.array(
      z.object({
        feature: z.array(z.string()),
        description: z.array(z.array(z.string())),
      })
    ).optional(),
    blueprints: z.object({
      first: image().optional(),
      second: image().optional(),
    }),
    
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog/en" }),
  schema: ({ image }) => z.object ({
  title: z.string(),
  description: z.string(),
  contents: z.array(z.string()),
  author: z.string(),
  role: z.string().optional(),
  authorImage: image(),
  authorImageAlt: z.string(),
  pubDate: z.date(),
  cardImage: image(),
  cardImageAlt: z.string(),
  readTime: z.number(),
  tags: z.array(z.string()).optional(),
  }),
});

const insightsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/insights/en" }),
  schema: ({ image }) => z.object ({
  title: z.string(),
  description: z.string(),
  // contents: z.array(z.string()),
  cardImage: image(),
  cardImageAlt: z.string(),
  }),
});

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  'projects': projectsCollection,
  'blog': blogCollection,
  'insights': insightsCollection,
};