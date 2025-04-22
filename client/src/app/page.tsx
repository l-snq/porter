'use client';
import { FormEventHandler, useState } from 'react';
import { downloadYTLink } from './ytdlAction';

export default function Home() {
	const [inputValue, setInputValue] = useState('');
	const handleSubmit = (e) => {
		e.preventDefault();
		downloadYTLink(inputValue);
		const clearInput = document.getElementById('link');
		clearInput.value = '';
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
