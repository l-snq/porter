'use server'
import ytdl from '@distube/ytdl-core';

import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  try {
    const { url, format } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }
    
    // Use MP3 as fallback if format is not provided
    const audioFormat = format || 'mp3';
    
    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    // Get video info
    const info = await ytdl.getInfo(url);
    
    // Generate UUID for filename
    const fileId = uuidv4();
    const fileName = `${fileId}.${audioFormat}`;
    
    // Set appropriate content type based on format
    let contentType;
    switch (audioFormat) {
      case 'mp3':
        contentType = 'audio/mpeg';
        break;
      case 'aac':
        contentType = 'audio/aac';
        break;
      case 'flac':
        contentType = 'audio/flac';
        break;
      case 'ogg':
        contentType = 'audio/ogg';
        break;
      case 'wav':
        contentType = 'audio/wav';
        break;
      case 'm4a':
        contentType = 'audio/m4a';
        break;
      default:
        contentType = 'audio/mpeg';
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', contentType);
    
    // Download audio only format with highest quality
    ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio',
      format: audioFormat
    }).pipe(res);
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
}
