import { createClient } from 'next-sanity'

// Server-side client (for Server Components and API routes)
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // Use today's date or your preferred version
  useCdn: false, // Set to false for fresh data, true for cached data
  // Only include token for write operations, remove for read-only
  // token: process.env.SANITY_API_TOKEN,
})

// Client-side client (for Client Components)
export const sanityClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for client-side requests
}

// Helper function for GROQ queries - List view
export async function fetchClients() {
  const query = `*[_type == "client"] {
    _id,
    name,
    slug,
    logo {
      asset->{
        url,
        metadata
      },
      alt,
      website
    },
    overview {
      description
    }
  }`
  
  return await sanityClient.fetch(query)
}

// Helper function for single client - Full details
export async function fetchClientBySlug(slug: string) {
  const query = `*[_type == "client" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    logo {
      asset->{
        url,
        metadata
      },
      alt,
      website
    },
    seo {
      title,
      description,
      ogImage {
        asset->{
          url,
          metadata
        }
      }
    },
    overview {
      title,
      description,
      headerImage {
        asset->{
          url,
          metadata
        }
      }
    },
    sellingPoints {
      title,
      points[] {
        id,
        title,
        description,
        icon {
          asset->{
            url,
            metadata
          }
        },
        features,
        link,
        documentation {
          specs {
            type,
            url,
            file {
              asset->{
                url,
                originalFilename
              }
            }
          },
          manual {
            type,
            url,
            file {
              asset->{
                url,
                originalFilename
              }
            }
          }
        }
      }
    },
    useCases {
      title,
      description,
      cases[] {
        id,
        title,
        description,
        keyPoints
      }
    },
    modelId,
    interactiveTitle,
    interactiveDescription,
    valueProposition {
      title,
      description,
      highlights
    },
    demo {
      title,
      description,
      videoFile {
        asset->{
          url,
          originalFilename
        }
      }
    },
    mediaLinks {
      website,
      youtube,
      linkedin,
      sketchfab,
      email
    },
    gallery[] {
      id,
      type,
      image {
        asset->{
          url,
          metadata
        },
        alt
      },
      videoFile {
        asset->{
          url,
          originalFilename
        }
      },
      videoOptions {
        autoplay,
        muted,
        controls,
        loop,
        preload
      },
      modelId,
      alt
    }
  }`
  
  return await sanityClient.fetch(query, { slug })
}

// Helper function for generating static params
export async function getAllClientSlugs() {
  const query = `*[_type == "client"] {
    "slug": slug.current
  }`
  
  return await sanityClient.fetch(query)
}

// Helper function to get image URL from Sanity
export function urlFor(source: any) {
  if (!source?.asset?._ref) return null
  
  const imageUrlBuilder = require('@sanity/image-url')
  const builder = imageUrlBuilder(sanityClient)
  
  return builder.image(source).url()
} 