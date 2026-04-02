// Simple video format detection utility
export const getPreferredVideoFormat = (): 'webm' | 'mp4' => {
  // Check if WebM is supported
  const video = document.createElement('video');
  const canPlayWebM = video.canPlayType('video/webm; codecs="vp8, vorbis"');

  // Use WebM if supported, otherwise fall back to MP4
  return canPlayWebM !== '' ? 'webm' : 'mp4';
};

// Get the best video source from available options
export const getBestVideoSource = (sources: {
  webm?: string;
  mp4?: string;
  high?: string;
  medium?: string;
  low?: string;
}): string | null => {
  const preferredFormat = getPreferredVideoFormat();

  // Try preferred format first
  if (preferredFormat === 'webm' && sources.webm) {
    return sources.webm;
  }

  // Fallback to MP4
  if (sources.mp4) {
    return sources.mp4;
  }

  // Fallback to quality-based sources
  return sources.high || sources.medium || sources.low || null;
};
