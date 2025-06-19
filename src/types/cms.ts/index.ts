// Sanity CMS Types - Updated to match the comprehensive client schema

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  website?: string
}

// Resolved image from Sanity query
export interface ResolvedImage {
  asset: {
    url: string
    metadata?: any
  }
  alt?: string
  website?: string
}

export interface SanityFile {
  _type: 'file'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

// Resolved file from Sanity query
export interface ResolvedFile {
  asset: {
    url: string
    originalFilename?: string
  }
}

export interface SEO {
  title?: string
  description?: string
  ogImage?: ResolvedImage
}

export interface Overview {
  title?: string
  description?: string
  headerImage?: ResolvedImage
}

export interface SellingPoint {
  id?: string
  title?: string
  description?: string
  icon?: ResolvedImage
  features?: string[]
  link?: string
  documentation?: {
    specs?: {
      type?: 'url' | 'file'
      url?: string
      file?: ResolvedFile
    }
    manual?: {
      type?: 'url' | 'file'
      url?: string
      file?: ResolvedFile
    }
  }
}

export interface SellingPoints {
  title?: string
  points?: SellingPoint[]
}

export interface UseCase {
  id?: string
  title?: string
  description?: string
  keyPoints?: string[]
}

export interface UseCases {
  title?: string
  description?: string
  cases?: UseCase[]
}

export interface ValueProposition {
  title?: string
  description?: string
  highlights?: string[]
}

export interface Demo {
  title?: string
  description?: string
  videoFile?: ResolvedFile
}

export interface MediaLinks {
  website?: string
  youtube?: string
  linkedin?: string
  sketchfab?: string
  email?: string
}

export interface GalleryItem {
  id?: string
  type?: 'image' | 'video' | 'sketchfab'
  image?: ResolvedImage
  videoFile?: ResolvedFile
  videoOptions?: {
    autoplay?: boolean
    muted?: boolean
    controls?: boolean
    loop?: boolean
    preload?: 'none' | 'metadata' | 'auto'
  }
  modelId?: string
  alt?: string
}

export interface Client {
  _id: string
  _type: 'client'
  name: string
  slug: {
    _type: 'slug'
    current: string
  }
  logo?: ResolvedImage
  seo?: SEO
  overview?: Overview
  sellingPoints?: SellingPoints
  useCases?: UseCases
  modelId?: string
  interactiveTitle?: string
  interactiveDescription?: string
  valueProposition?: ValueProposition
  demo?: Demo
  mediaLinks?: MediaLinks
  gallery?: GalleryItem[]
}

export interface ClientListItem {
  _id: string
  name: string
  slug: {
    current: string
  }
  logo?: ResolvedImage
  overview?: {
    description?: string
  }
}

// API Response types
export interface ClientsResponse {
  clients: ClientListItem[]
}

export interface ClientResponse {
  client: Client | null
} 