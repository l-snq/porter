'use client';
import { useState} from 'react';
import "./page.css";
import SvgIcon from './porterIcon';

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [url, setUrl] = useState('');
	const [format, setFormat] = useState('mp3');
	const [error, setError] = useState<string | null>(null);

	const audioFormats = [
    { value: 'mp3', label: 'MP3' },
    { value: 'aac', label: 'AAC' },
    { value: 'flac', label: 'FLAC' },
    { value: 'ogg', label: 'OGG' },
    { value: 'wav', label: 'WAV' },
    { value: 'm4a', label: 'M4A' }
	]

	// https://youtu.be/uXlVR98RT2I?si=j0bUsOvWfY7tR094
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Redirect to the download endpoint with format parameter
      window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
      
      // Reset loading state after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      setError('Failed to process the video');
      setIsLoading(false);
    }
  };

  return (
    <div id='mainDiv'>
			<div id="logo">
				<div id="square">
				./
				</div>
				<div> 
					<h1>porter.</h1>
				</div>
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
					/>
					<select
						id="format"
						value={format}
						onChange={(e) => setFormat(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
					>
					{isLoading ? "Processing...." : `Convert to ${format.toUpperCase()}`}
					</button>
				</div>
			</form>
			{error && (
				<div>Error: {error}</div>
			)}
		</div>
  );
}
