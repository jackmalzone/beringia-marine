# Environment variables (reference from prior app)

Copy values into `.env.local` in the new project. Do not commit secrets.

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
# Optional — only if the app writes to Sanity or uses private APIs
SANITY_API_TOKEN=your_sanity_api_token

# Optional: hosted Studio URL
# NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio
```
