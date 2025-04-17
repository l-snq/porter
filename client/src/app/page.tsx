'use client';
import ytdl from 'ytdl-core';
import { useState } from 'react';
import * as fs from 'fs-web';

export default function Home() {
	const [inputValue, setInputValue] = useState('');
	const handleSubmit = (e) => {
		e.preventDefault();
		linkDownloader(inputValue);
		const clearInput = document.getElementById('link');
		clearInput.value = '';

	}
	const linkDownloader = (e) => {
		const download = ytdl(e, { filter: 'audioonly'})
				.pipe(fs.createWriteStream('video.mp4')); 
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
						placeholder='https://youtube.com/.....'
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
