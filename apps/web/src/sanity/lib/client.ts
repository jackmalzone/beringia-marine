import { createClient, type SanityClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

function buildClient(): SanityClient | null {
  if (!projectId || !dataset) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  })
}

export const client = buildClient()
