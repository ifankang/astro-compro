# Contentful Setup Guide

## 1. Create Contentful Account
- Go to [contentful.com](https://www.contentful.com)
- Sign up (free)
- Create a new space

## 2. Get Your API Keys
In Contentful dashboard:
- Go to **Settings** → **API Keys**
- Copy your:
  - **Space ID**
  - **Content Delivery API Token** (for reading)
  - **Content Preview API Token** (for drafts, optional)

## 3. Set Environment Variables
Create `.env.local` in your project root:
```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_api_key
CONTENTFUL_PREVIEW_TOKEN=your_preview_token (optional)
```

## 4. Create Content Model in Contentful
In Contentful UI, create a "Blog Post" content model with:
- **title** (Short text)
- **slug** (Short text, unique)
- **description** (Short text)
- **pubDate** (Date and time)
- **updatedDate** (Date and time, optional)
- **author** (Short text)
- **body** (Rich text)
- **heroImage** (Media/Image, optional)

## 5. Start Using the Integration
```bash
npm run dev
```

Your site will now fetch blog posts from Contentful!

## Client Access
Your clients can:
1. Go to your Contentful space
2. Login with email
3. Click "Content" → Edit/Create blog posts
4. Publish directly

No GitHub knowledge needed!
