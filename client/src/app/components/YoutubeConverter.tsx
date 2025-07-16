'use client';
import React, { useState } from 'react';
import "../page.css";
import Spinner from './Spinner';

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
  const [conversionStatus, setConversionStatus] = useState<string>('');
  
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
      setConversionStatus('Starting download and conversion...');
      
      // Call server endpoint with URL and format
      const apiUrl = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
      
      setConversionStatus(`Downloading and converting to ${format.toUpperCase()}...`);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download from YouTube');
      }
      
      // Get the audio file blob
      const audioBlob = await response.blob();
      
      // Get filename from response headers or create one
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `youtube-audio.${format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create download link and trigger download
      const downloadUrl = URL.createObjectURL(audioBlob);
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
      
      setConversionStatus('Download complete!');
      
      // Reset the input field after successful download
      setUrl('');
      
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
          <Spinner />
          <div className="progress-status">{conversionStatus}</div>
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
          <strong>Note:</strong> The conversion happens on the server using yt-dlp.
          Please be patient as the download and conversion may take some time depending on video length.
        </p>
      </div>
    </div>
  );
}