'use client';
import ytdl from 'ytdl-core';
import { useState } from 'react';


export default function Home() {
	const [inputValue, setInputValue] = useState('');
	const handleSubmit = (e) => {
		e.preventDefault();
		linkDownloader(inputValue);
		const clearInput = document.getElementById('link');
		clearInput.value = '';

	}
	const linkDownloader = (e) => {
		/*ytdl(e)
			.pipe(fs.createWriteStream('video.mp4')); */
		 console.log(e);
	}

  return (
    <div>
			<form onSubmit={handleSubmit}>
				<div>
					<label>youtube link: </label>
					<input 
						type='text'
						id='link'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</div>
				<div>
					<button>Download</button>
				</div>
			</form>
		</div>
  );
}
