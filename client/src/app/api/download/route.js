import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { mkdir } from 'fs/promises';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request) {
  try {
    // Get URL and format from search params
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const format = searchParams.get('format') || 'mp3';
    
    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }
    
    // Validate YouTube URL
    const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    if (!youtubeRegex.test(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    
    // Generate UUID for filename
    const fileId = uuidv4();
    
    // Create temp directory for downloads if it doesn't exist
    const tmpDir = path.join(os.tmpdir(), 'youtube-downloads');
    await mkdir(tmpDir, { recursive: true });
    
    // Get video info first to get the title
    const infoCommand = `yt-dlp --get-title "${url}"`;
    const { stdout: titleOutput } = await execAsync(infoCommand);
    const videoTitle = titleOutput.trim().replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_');
    
    const fileName = `${videoTitle}-${fileId}.${format}`;
    const filePath = path.join(tmpDir, fileName);
    
    // Build yt-dlp command based on format
    let ytdlpCommand;
    
    switch (format) {
      case 'mp3':
        ytdlpCommand = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${filePath.replace(`.${format}`, '.%(ext)s')}" "${url}"`;
        break;
      case 'aac':
        ytdlpCommand = `yt-dlp -x --audio-format aac --audio-quality 0 -o "${filePath.replace(`.${format}`, '.%(ext)s')}" "${url}"`;
        break;
      case 'flac':
        ytdlpCommand = `yt-dlp -x --audio-format flac -o "${filePath.replace(`.${format}`, '.%(ext)s')}" "${url}"`;
        break;
      case 'ogg':
        ytdlpCommand = `yt-dlp -x --audio-format vorbis -o "${filePath.replace(`.${format}`, '.%(ext)s')}" "${url}"`;
        break;
      case 'wav':
        ytdlpCommand = `yt-dlp -x --audio-format wav -o "${filePath.replace(`.${format}`, '.%(ext)s')}" "${url}"`;
        break;
      case 'm4a':
        ytdlpCommand = `yt-dlp -x --audio-format m4a --audio-quality 0 -o "${filePath.replace(`.${format}`, '.%(ext)s')}" "${url}"`;
        break;
      default:
        ytdlpCommand = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${filePath.replace(`.${format}`, '.%(ext)s')}" "${url}"`;
    }
    
    // Execute yt-dlp command
    await execAsync(ytdlpCommand);
    
    // Find the actual downloaded file (yt-dlp might change the extension)
    const files = await fs.promises.readdir(tmpDir);
    const downloadedFile = files.find(file => file.startsWith(`${videoTitle}-${fileId}`));
    
    if (!downloadedFile) {
      return NextResponse.json({ error: 'Failed to find downloaded file' }, { status: 500 });
    }
    
    const actualFilePath = path.join(tmpDir, downloadedFile);
    
    // Read the file
    const fileBuffer = await fs.promises.readFile(actualFilePath);
    
    // Get appropriate MIME type
    let mimeType;
    switch (format) {
      case 'mp3':
        mimeType = 'audio/mpeg';
        break;
      case 'aac':
        mimeType = 'audio/aac';
        break;
      case 'flac':
        mimeType = 'audio/flac';
        break;
      case 'ogg':
        mimeType = 'audio/ogg';
        break;
      case 'wav':
        mimeType = 'audio/wav';
        break;
      case 'm4a':
        mimeType = 'audio/mp4';
        break;
      default:
        mimeType = 'audio/mpeg';
    }
    
    // Return the audio file
    const response = new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': mimeType,
      },
    });
    
    // Clean up
    fs.promises.unlink(actualFilePath)
      .catch(err => console.error('Error deleting temp file:', err));
    
    return response;
  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json({ 
      error: 'Failed to download video: ' + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}