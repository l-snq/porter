# Porter - YouTube to Audio Converter

A simple web application that converts YouTube videos to audio files using yt-dlp.

## Features

- Download YouTube videos and convert them to various audio formats
- Supported formats: MP3, AAC, FLAC, OGG, WAV, M4A
- Server-side processing using yt-dlp
- Clean, simple interface

## Requirements

- Node.js 18+ 
- yt-dlp installed on the server

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Make sure yt-dlp is installed on your system:
   ```bash
   # On Ubuntu/Debian
   sudo apt install yt-dlp
   
   # On macOS
   brew install yt-dlp
   
   # Or install via pip
   pip install yt-dlp
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

The application consists of:
- **Client**: Next.js React application with a simple form interface
- **Server**: Next.js API route that handles YouTube downloads using yt-dlp
- **Processing**: Server-side audio conversion using yt-dlp's built-in conversion capabilities

## How it works

1. User submits a YouTube URL and selects desired audio format
2. Client sends request to `/api/download` endpoint
3. Server validates the URL and uses yt-dlp to download and convert the audio
4. Server streams the converted audio file back to the client
5. Client triggers automatic download of the audio file

## API Endpoints

### GET /api/download

Downloads and converts a YouTube video to audio format.

**Parameters:**
- `url` (required): YouTube video URL
- `format` (optional): Audio format (mp3, aac, flac, ogg, wav, m4a). Defaults to mp3.

**Response:**
- Success: Audio file stream with appropriate headers
- Error: JSON error response

## Development

To run in development mode:

```bash
npm run dev
```

To build for production:

```bash
npm run build
npm start
```

## Notes

- All processing happens on the server side
- Temporary files are cleaned up after download
- yt-dlp must be accessible from the server environment
- The application respects YouTube's terms of service