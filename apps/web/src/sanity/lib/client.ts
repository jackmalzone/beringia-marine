import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Create client for server-side rendering
// useCdn: false ensures fresh data and avoids caching issues
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN for server-side to avoid caching issues
})
