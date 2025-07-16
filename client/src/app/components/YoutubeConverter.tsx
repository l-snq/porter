'use client';
import React, { useRef, useState } from 'react';
import "../page.css";

// Define audio format interface
interface AudioFormat {
  value: string;
  label: string;
}

// This is a dedicated client component for the YouTube converter
export default function YoutubeConverter() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [format, setFormat] = useState<string>('mp3');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [conversionStatus, setConversionStatus] = useState<string>('');
  
  // Store FFmpeg instance in a ref without initializing it
  const messageRef = useRef<HTMLPreElement | null>(null);
  
  // Define audio formats
  const audioFormats: AudioFormat[] = [
    { value: 'mp3', label: 'MP3' },
    { value: 'aac', label: 'AAC' },
    { value: 'flac', label: 'FLAC' },
    { value: 'ogg', label: 'OGG' },
    { value: 'wav', label: 'WAV' },
    { value: 'm4a', label: 'M4A' }
  ];

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    return youtubeRegex.test(url);
  };

  const convertWebmToAudio = async (webmBlob: Blob, outputFormat: string): Promise<Blob> => {
    
    
    try {
      // Dynamically import fetchFile
      // Write webm file to memory
      const inputFileName = 'input.webm';
      
      // Set output format and filename
      let outputFileName = `output.${outputFormat}`;
      
      // Set FFmpeg conversion arguments based on format
      let ffmpegArgs: string[] = [];
      
      switch (outputFormat) {
        case 'mp3':
          ffmpegArgs = ['-i', inputFileName, '-c:a', 'libmp3lame', '-q:a', '2', outputFileName];
          break;
        case 'aac':
          ffmpegArgs = ['-i', inputFileName, '-c:a', 'aac', '-b:a', '192k', outputFileName];
          break;
        case 'flac':
          ffmpegArgs = ['-i', inputFileName, '-c:a', 'flac', outputFileName];
          break;
        case 'ogg':
          ffmpegArgs = ['-i', inputFileName, '-c:a', 'libvorbis', '-q:a', '4', outputFileName];
          break;
        case 'wav':
          ffmpegArgs = ['-i', inputFileName, '-c:a', 'pcm_s16le', outputFileName];
          break;
        case 'm4a':
          ffmpegArgs = ['-i', inputFileName, '-c:a', 'aac', '-b:a', '192k', outputFileName];
          break;
        default:
          ffmpegArgs = ['-i', inputFileName, '-c:a', 'libmp3lame', '-q:a', '2', 'output.mp3'];
          outputFileName = 'output.mp3';
      }
      
      // Execute FFmpeg conversion
      setConversionStatus('Converting audio...');
      // Get appropriate MIME type
      let mimeType: string;
      switch (outputFormat) {
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
      
      // Create and return the output blob
      return new Blob([data.buffer], { type: mimeType });
    } catch (error) {
      console.error('Conversion error:', error);
      throw new Error(`Failed to convert audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);
      setConversionStatus('Starting download...');
      
      // Step 1: Get webm audio from server
      const apiUrl = `/api/download?url=${encodeURIComponent(url)}`;
      
      setConversionStatus('Downloading audio from YouTube...');
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download from YouTube');
      }
      
      // Get the webm blob
      const webmBlob = await response.blob();
      setConversionStatus('Download complete. Preparing conversion...');
      
      // Step 2: Convert to desired format using FFmpeg WASM
      setConversionStatus(`Converting to ${format.toUpperCase()}...`);
      const convertedBlob = await convertWebmToAudio(webmBlob, format);
      
      // Step 3: Create download link
      const videoTitle = url.includes('youtube.com') 
        ? url.split('v=')[1]?.split('&')[0] || 'youtube-audio'
        : url.includes('youtu.be') 
          ? url.split('youtu.be/')[1]?.split('?')[0] || 'youtube-audio'
          : 'youtube-audio';
      
      const downloadUrl = URL.createObjectURL(convertedBlob);
      const filename = `${videoTitle}.${format}`;
      
      // Trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, 100);
      
      setConversionStatus('Conversion complete!');
      setTimeout(() => {
        setConversionStatus('');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process the video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id='mainDiv'>
      <div id="logo">
        <div id="square">./</div>
        <div><h1>porter.</h1></div>
      </div>
      
      <h2>convert youtube videos to audio files.</h2>
        <form onSubmit={handleSubmit}>
          <div id='formDiv'>
            <label>youtube link: </label>
            <input 
              type='text'
              id='link'
              value={url}
              placeholder='https://youtube.com/.....'
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={isLoading}
            >
              {audioFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              type='submit'
              disabled={isLoading}
              className="submitButton"
            >
              {isLoading ? "Processing..." : `Convert to ${format.toUpperCase()}`}
            </button>
          </div>
        </form>
      {isLoading && (
        <div className="progress-container">
          <div className="progress-status">{conversionStatus}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{progress}%</div>
          <pre ref={messageRef} className="ffmpeg-log"></pre>
        </div>
      )}
      
      {error && (
        <div className="error">{error}</div>
      )}
      
      <div className="info">
        <h3>Supported formats:</h3>
        <ul>
          {audioFormats.map((format) => (
            <li key={format.value}>{format.label} (.{format.value})</li>
          ))}
        </ul>
        <p className="note">
          <strong>Note:</strong> The conversion happens entirely in your browser using FFmpeg WebAssembly.
          For longer videos, please be patient as the conversion may take some time.
        </p>
      </div>
    </div>
  );
}
