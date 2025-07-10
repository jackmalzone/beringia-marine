import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'rq9avsrj',
  dataset: 'production',
  apiVersion: '2024-03-19',
  useCdn: true,
  token: import.meta.env.VITE_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true
}) 