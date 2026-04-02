/**
 * Sketchfab embed URLs used by solution partner pages (Interactive + gallery).
 * Params align with migration Client Interactive embed behavior.
 */
export function sketchfabEmbedUrl(
  modelId: string,
  options?: { autostart?: 0 | 1; uiHelp?: 0 | 1 }
): string {
  const id = encodeURIComponent(modelId.trim());
  const params = new URLSearchParams({
    ui_infos: '0',
    ui_watermark: '0',
    autostart: String(options?.autostart ?? 0),
    ui_help: String(options?.uiHelp ?? 0),
  });
  return `https://sketchfab.com/models/${id}/embed?${params.toString()}`;
}

export function isValidSketchfabModelId(id: string | undefined): id is string {
  if (!id || typeof id !== 'string') return false;
  const t = id.trim();
  if (t.includes('[') || t.toLowerCase().includes('model-id')) return false;
  // Sketchfab model UUIDs are 32 hex chars
  return /^[a-f0-9]{32}$/i.test(t);
}
