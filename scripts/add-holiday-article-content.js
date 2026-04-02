// Load environment variables
const envPaths = ['apps/web/.env.local', 'apps/studio/.env.local', '.env.local'];

for (const envPath of envPaths) {
  try {
    require('dotenv').config({ path: envPath, override: true });
    if (process.env.SANITY_API_TOKEN) {
      break;
    }
  } catch (e) {
    // Continue to next path
  }
}

const { createClient } = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u2atn42r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN ? process.env.SANITY_API_TOKEN.trim() : undefined,
  useCdn: false,
});

async function addContent() {
  try {
    // Read the generated content
    const content = JSON.parse(fs.readFileSync('/tmp/holiday-content-full.json', 'utf8'));

    const documentId = 'drafts.fdde4f8f-4aa5-4acb-8b95-c63657f69f86';

    // Patch the document with content
    const result = await client.patch(documentId).set({ content: content }).commit();

    console.log('✅ Successfully added content to article');
    console.log('Document ID:', result._id);
  } catch (error) {
    console.error('❌ Error adding content:', error.message);
    if (error.responseBody) {
      console.error('Response:', JSON.stringify(error.responseBody, null, 2));
    }
    process.exit(1);
  }
}

addContent();
