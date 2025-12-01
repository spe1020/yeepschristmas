# Videos Directory

Place your video files here for embedding in the Yeeps calendar.

## Instructions

1. **Add your video file** to this directory (e.g., `day1.mp4`)
2. **Update the data file** (`public/advent-data.json`) to reference your video:
   ```json
   "video": {
     "src": "/videos/day1.mp4",
     "title": "Your Video Title",
     "description": "Optional description"
   }
   ```

## Video Best Practices

### File Formats
- **Recommended**: MP4 (H.264 codec) - best browser compatibility
- **Alternative**: WebM (VP9 codec) - smaller file size, good quality
- **Fallback**: OGG - for older browsers

### Optimization Tips
1. **Compress your video** before uploading:
   - Use tools like HandBrake, FFmpeg, or online compressors
   - Target: 5-10MB per minute of video for web
   - Resolution: 1080p (1920x1080) is usually sufficient
   - Frame rate: 30fps is standard

2. **File size recommendations**:
   - Short videos (< 2 min): Keep under 20MB
   - Medium videos (2-5 min): Keep under 50MB
   - Longer videos: Consider hosting externally (YouTube, Vimeo)

3. **Create a poster image** (thumbnail):
   - Add a `poster` field to your video object
   - Example: `"poster": "/videos/day1-poster.jpg"`
   - Recommended size: 1920x1080 or 1280x720

## Alternative Hosting Options

If your video is very large (>50MB), consider:

1. **YouTube** (Free, unlimited):
   - Upload to YouTube (unlisted or public)
   - Use YouTube embed code
   - Update component to support iframe embeds

2. **Vimeo** (Free tier available):
   - Similar to YouTube
   - Better privacy controls

3. **Cloud Storage** (AWS S3, Cloudflare R2, etc.):
   - For production deployments
   - Better performance and CDN delivery

## Example Video Configuration

```json
{
  "video": {
    "src": "/videos/day1.mp4",
    "poster": "/videos/day1-poster.jpg",
    "title": "Welcome to Yeeps!",
    "description": "Learn about the Yeeps universe in this introductory video."
  }
}
```

