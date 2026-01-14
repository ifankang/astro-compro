// Contentful integration utility
let createClient: any = null;

// Only initialize clients if we have the required environment variables
let client: any = null;
let previewClient: any = null;

// Lazy-load contentful client only when needed
async function initializeClients() {
  if (client !== null) return; // Already initialized
  
  try {
    const pkg = await import('contentful');
    createClient = pkg.createClient;
    
    if (import.meta.env.CONTENTFUL_SPACE_ID && import.meta.env.CONTENTFUL_ACCESS_TOKEN) {
      client = createClient({
        space: import.meta.env.CONTENTFUL_SPACE_ID,
        accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
        host: 'cdn.contentful.com',
      });

      previewClient = import.meta.env.CONTENTFUL_PREVIEW_TOKEN
        ? createClient({
            space: import.meta.env.CONTENTFUL_SPACE_ID,
            accessToken: import.meta.env.CONTENTFUL_PREVIEW_TOKEN,
            host: 'preview.contentful.com',
          })
        : client;
    }
  } catch (error) {
    console.error('Failed to initialize Contentful client:', error);
  }
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  author: string;
  body: string;
  heroImage?: {
    url: string;
    title?: string;
  };
}

export async function getBlogPosts(preview = false): Promise<BlogPost[]> {
  await initializeClients();
  const contentfulClient = preview ? previewClient : client;
  
  if (!contentfulClient) {
    return [];
  }

  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      order: ['-sys.createdAt'],
    });

    return entries.items.map((item: any) => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      description: item.fields.description,
      pubDate: item.fields.pubDate,
      updatedDate: item.fields.updatedDate,
      author: item.fields.author,
      body: item.fields.body,
      heroImage: item.fields.heroImage
        ? {
            url: `https:${item.fields.heroImage.fields.file.url}`,
            title: item.fields.heroImage.fields.title,
          }
        : undefined,
    }));
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string, preview = false): Promise<BlogPost | null> {
  await initializeClients();
  const contentfulClient = preview ? previewClient : client;
  
  if (!contentfulClient) {
    return null;
  }

  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    });

    if (entries.items.length === 0) return null;

    const item = entries.items[0] as any;
    return {
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      description: item.fields.description,
      pubDate: item.fields.pubDate,
      updatedDate: item.fields.updatedDate,
      author: item.fields.author,
      body: item.fields.body,
      heroImage: item.fields.heroImage
        ? {
            url: `https:${item.fields.heroImage.fields.file.url}`,
            title: item.fields.heroImage.fields.title,
          }
        : undefined,
    };
  } catch (error) {
    console.error('Error fetching blog post from Contentful:', error);
    return null;
  }
}
