'use client';
import ytdl, { validateURL } from 'ytdl-core';
import { useState } from 'react';

export default function Home() {
	const [inputValue, setInputValue] = useState('');
	const handleSubmit = (e) => {
		e.preventDefault();
		linkDownloader(inputValue);
		const clearInput = document.getElementById('link');
		clearInput.value = '';
	}

	/*const linkDownloader = (e) => {
		if (validateURL(e)) {
			const download = ytdl(e, { filter: 'audioonly'})
					.pipe(fs.writefile('audio.mp3', 'audio')); 
			console.log(e);
		} else {
			console.log('not a valid url');
		}
	}*/

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
