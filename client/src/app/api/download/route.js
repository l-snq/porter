import ytdl from '@distube/ytdl-core';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import os from 'os';

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
    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Sanitize title
    
    // Generate UUID for filename
    const fileId = uuidv4();
    const fileName = `${videoTitle}-${fileId}.${format}`;
    
    // Create temp directory for downloads if it doesn't exist
    const tmpDir = path.join(os.tmpdir(), 'youtube-downloads');
    await mkdir(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, fileName);
    
    // Set appropriate content type based on format
    let contentType;
    switch (format) {
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
    
    // Download the file first to disk to avoid streaming issues
    return new Promise((resolve, reject) => {
      const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        requestOptions: {
          headers: {
            // Add these headers to mimic a browser request
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
          }
        }
      });
      
      const fileStream = fs.createWriteStream(filePath);
      
      stream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(NextResponse.json({ error: 'Failed to download from YouTube: ' + error.message }, { status: 500 }));
      });
      
      fileStream.on('error', (error) => {
        console.error('File write error:', error);
        reject(NextResponse.json({ error: 'Failed to write file: ' + error.message }, { status: 500 }));
      });
      
      fileStream.on('finish', async () => {
        try {
          // Read the file back after download is complete
          const fileBuffer = await fs.promises.readFile(filePath);
          
          // Return the file in the response
          const response = new NextResponse(fileBuffer, {
            headers: {
              'Content-Disposition': `attachment; filename="${fileName}"`,
              'Content-Type': contentType,
            },
          });
          
          // Clean up - delete the file
          fs.promises.unlink(filePath).catch(err => console.error('Error deleting temp file:', err));
          
          resolve(response);
        } catch (readError) {
          console.error('Error reading file:', readError);
          reject(NextResponse.json({ error: 'Failed to prepare file for download' }, { status: 500 }));
        }
      });
      
      // Pipe the YouTube stream to the file
      stream.pipe(fileStream);
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json({ 
      error: 'Failed to download video: ' + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
