import { SanityClient, ClientData } from '../data/types'
import { client as sanityClient } from './sanity'

const clientFields = `
  _id,
  _type,
  name,
  slug,
  logo,
  seo,
  overview,
  sellingPoints,
  useCases,
  valueProposition,
  mediaLinks,
  gallery,
  demo,
  modelId,
  interactiveTitle,
  interactiveDescription
`

function transformSanityClient(sanityClient: SanityClient): ClientData {
  return {
    id: sanityClient._id,
    name: sanityClient.name || '',
    slug: sanityClient.slug.current || '',
    logo: sanityClient.logo?.asset.url || '',
    modelId: sanityClient.modelId || '',
    interactiveTitle: sanityClient.interactiveTitle || '',
    interactiveDescription: sanityClient.interactiveDescription || '',
    seo: {
      title: sanityClient.seo?.title || sanityClient.name || '',
      description: sanityClient.seo?.description || '',
      ogImage: sanityClient.seo?.ogImage?.asset.url || '',
    },
    overview: {
      title: sanityClient.overview?.title || '',
      description: sanityClient.overview?.description || '',
      headerImage: sanityClient.overview?.headerImage?.asset.url || '',
    },
    sellingPoints: {
      title: sanityClient.sellingPoints?.title || '',
      points: (sanityClient.sellingPoints?.points || []).map(point => ({
        id: point.id || '',
        title: point.title || '',
        description: point.description || '',
        icon: point.icon?.asset.url || '',
        features: point.features || [],
        link: point.link || '',
        documentation: point.documentation ? {
          specs: point.documentation.specs?.type === 'url' 
            ? point.documentation.specs.url || ''
            : point.documentation.specs?.file?.asset.url || '',
          manual: point.documentation.manual?.type === 'url'
            ? point.documentation.manual.url || ''
            : point.documentation.manual?.file?.asset.url || '',
        } : undefined,
      })),
    },
    useCases: {
      title: sanityClient.useCases?.title || '',
      description: sanityClient.useCases?.description || '',
      cases: (sanityClient.useCases?.cases || []).map(useCase => ({
        id: useCase.id || '',
        title: useCase.title || '',
        description: useCase.description || '',
        keyPoints: useCase.keyPoints || [],
      })),
    },
    valueProposition: {
      title: sanityClient.valueProposition?.title || '',
      description: sanityClient.valueProposition?.description || '',
      highlights: sanityClient.valueProposition?.highlights || [],
    },
    mediaLinks: {
      website: sanityClient.mediaLinks?.website || '',
      youtube: sanityClient.mediaLinks?.youtube || '',
      linkedin: sanityClient.mediaLinks?.linkedin || '',
      sketchfab: sanityClient.mediaLinks?.sketchfab || '',
      email: sanityClient.mediaLinks?.email || '',
    },
    gallery: (sanityClient.gallery || []).map(item => ({
      id: item.id || '',
      url: item.type === 'image' 
        ? item.image?.asset.url || ''
        : item.type === 'video'
          ? item.videoFile?.asset.url || ''
          : item.modelId ? `https://sketchfab.com/models/${item.modelId}/embed` : '',
      alt: item.alt || '',
      type: item.type || 'image',
      modelId: item.modelId || '',
      videoOptions: item.videoOptions,
    })),
    demo: sanityClient.demo ? {
      title: sanityClient.demo.title || '',
      description: sanityClient.demo.description || '',
      videoUrl: sanityClient.demo.videoFile?.asset.url || '',
    } : undefined,
  }
}

export async function fetchClients(): Promise<ClientData[]> {
  try {
    const query = `*[_type == "client"]{${clientFields}}`
    const clients = await sanityClient.fetch(query)
    return clients.map(transformSanityClient)
  } catch (error) {
    console.error('Error fetching clients:', error)
    throw new Error('Failed to fetch clients')
  }
}

export async function fetchClientBySlug(slug: string): Promise<ClientData | null> {
  try {
    const query = `*[_type == "client" && slug.current == $slug][0]{${clientFields}}`
    const client = await sanityClient.fetch(query, { slug })
    return client ? transformSanityClient(client) : null
  } catch (error) {
    console.error('Error fetching client:', error)
    throw new Error('Failed to fetch client')
  }
} 