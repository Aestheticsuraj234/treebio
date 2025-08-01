// app/api/og-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  favicon?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Validate URL
    new URL(url);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const ogData: OGData = {};

    // Extract Open Graph data
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    ogTags.forEach((tag) => {
      const property = tag.getAttribute('property');
      const content = tag.getAttribute('content');
      
      if (property && content) {
        switch (property) {
          case 'og:title':
            ogData.title = content;
            break;
          case 'og:description':
            ogData.description = content;
            break;
          case 'og:image':
            ogData.image = content;
            break;
          case 'og:url':
            ogData.url = content;
            break;
          case 'og:site_name':
            ogData.siteName = content;
            break;
          case 'og:type':
            ogData.type = content;
            break;
        }
      }
    });

    // Fallback to Twitter Card data if OG data is missing
    if (!ogData.title) {
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      ogData.title = twitterTitle?.getAttribute('content') || undefined;
    }

    if (!ogData.description) {
      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      ogData.description = twitterDesc?.getAttribute('content') || undefined;
    }

    if (!ogData.image) {
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      ogData.image = twitterImage?.getAttribute('content') || undefined;
    }

    // Fallback to HTML title and description
    if (!ogData.title) {
      const titleTag = document.querySelector('title');
      ogData.title = titleTag?.textContent || undefined;
    }

    if (!ogData.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      ogData.description = metaDesc?.getAttribute('content') || undefined;
    }

    // Get favicon
    const favicon = document.querySelector('link[rel="icon"]') || 
                   document.querySelector('link[rel="shortcut icon"]');
    if (favicon) {
      const faviconHref = favicon.getAttribute('href');
      if (faviconHref) {
        ogData.favicon = faviconHref.startsWith('http') 
          ? faviconHref 
          : new URL(faviconHref, url).href;
      }
    }

    // Convert relative image URLs to absolute URLs
    if (ogData.image && !ogData.image.startsWith('http')) {
      ogData.image = new URL(ogData.image, url).href;
    }

    return NextResponse.json(ogData);
  } catch (error) {
    console.error('Error fetching OG data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Open Graph data' }, 
      { status: 500 }
    );
  }
}