import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for on-demand revalidation via Sanity webhooks
 * 
 * This endpoint is called by Sanity when content is published/unpublished
 * to immediately update the website without waiting for ISR revalidation.
 * 
 * Setup:
 * 1. Add REVALIDATION_SECRET to .env.local
 * 2. In Sanity Studio: Project Settings → API → Webhooks
 * 3. Add webhook: https://your-domain.com/api/revalidate?secret=YOUR_SECRET
 * 4. Trigger on: "Document published" and "Document unpublished"
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret for security
    const secret = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (!expectedSecret) {
      console.error('REVALIDATION_SECRET not configured');
      return NextResponse.json(
        { message: 'Revalidation secret not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.warn('Invalid revalidation secret attempted');
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const body = await request.json().catch(() => ({}));
    
    // Extract document type and slug from Sanity webhook payload
    const documentType = body._type;
    const slug = body.slug?.current || body.slug;

    // Revalidate based on document type
    if (documentType === 'article') {
      // Revalidate insights list page
      revalidatePath('/insights');
      revalidateTag('sanity', 'default');

      // Revalidate specific article page if slug is available
      if (slug) {
        revalidatePath(`/insights/${slug}`);
        console.log(`✅ Revalidated article: /insights/${slug}`);
      } else {
        console.log('✅ Revalidated insights page');
      }
    } else if (documentType === 'page') {
      // Revalidate dynamic pages
      if (slug) {
        revalidatePath(`/${slug}`);
        console.log(`✅ Revalidated page: /${slug}`);
      }
    } else if (documentType === 'service') {
      revalidatePath('/solutions');
      revalidateTag('sanity', 'default');
      if (slug) {
        console.log(`✅ Service document updated (slug: ${slug}); solutions overview revalidated`);
      }
    } else if (documentType === 'globalSettings') {
      // Revalidate all pages that use global settings
      revalidatePath('/', 'layout');
      console.log('✅ Revalidated global settings');
    } else {
      // Generic revalidation for unknown types
      revalidateTag('sanity', 'default');
      console.log(`✅ Revalidated Sanity content (type: ${documentType})`);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      documentType,
      slug: slug || null,
    });
  } catch (error) {
    console.error('Error in revalidation route:', error);
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing revalidation (development only)
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Not available in production' }, { status: 403 });
  }

  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  }

  return NextResponse.json({
    message: 'Revalidation endpoint ready',
    usage: 'POST with secret query param, or GET ?secret=XXX&path=/insights',
  });
}
