// YouTube utility functions for URL validation and video ID extraction

export interface YouTubeVideoInfo {
  videoId: string;
  thumbnailUrl: string;
  embedUrl: string;
  isValid: boolean;
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validate if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;
  
  const videoId = extractYouTubeVideoId(url);
  return videoId !== null && videoId.length === 11;
}

/**
 * Generate YouTube video information from URL
 */
export function getYouTubeVideoInfo(url: string): YouTubeVideoInfo {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return {
      videoId: '',
      thumbnailUrl: '',
      embedUrl: '',
      isValid: false
    };
  }

  return {
    videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    isValid: true
  };
}

/**
 * Generate embed HTML for YouTube video
 */
export function generateYouTubeEmbed(videoId: string, width = '100%', height = '315'): string {
  return `<iframe 
    width="${width}" 
    height="${height}" 
    src="https://www.youtube.com/embed/${videoId}" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
  </iframe>`;
}

/**
 * Validate YouTube URL and return formatted data
 */
export function validateAndFormatYouTubeUrl(url: string): {
  isValid: boolean;
  videoId?: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  originalUrl?: string;
  error?: string;
} {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  const videoInfo = getYouTubeVideoInfo(url);
  
  if (!videoInfo.isValid) {
    return { 
      isValid: false, 
      error: 'Invalid YouTube URL. Please use formats like: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID' 
    };
  }

  return {
    isValid: true,
    videoId: videoInfo.videoId,
    thumbnailUrl: videoInfo.thumbnailUrl,
    embedUrl: videoInfo.embedUrl,
    originalUrl: url
  };
}