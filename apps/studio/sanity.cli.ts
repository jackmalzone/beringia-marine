import { defineCliConfig } from 'sanity/cli';

const readEnv = (value: string | undefined): string =>
  (value ?? '').trim().replace(/^['"]+|['"]+$/g, '');

export default defineCliConfig({
  api: {
    projectId: readEnv(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
    dataset: readEnv(process.env.NEXT_PUBLIC_SANITY_DATASET),
  },
  autoUpdates: true,
});
