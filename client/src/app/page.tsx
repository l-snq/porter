'use client';
import { useState} from 'react';
import { useRouter } from 'next/navigation';
import { generateFileDownload } from './fileDownload';
import "./page.css";
import SvgIcon from './porterIcon';

export default function Home() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState('');
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			const { downloadUrl } = await generateFileDownload(e);
			console.log(downloadUrl);
		} catch(error) {
			console.log("something went wrong: ", error);
		}
		//router.push(downloadUrl);
		const clearInput = document.getElementById('link');
		clearInput.value = '';
	}

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
						value={inputValue}
						placeholder='https://youtube.com/.....'
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<select id='audioFormat'>
						<option value='flac'>FLAC</option>
						<option value='MP3'>MP3</option>
						<option value='OPUS'>OPUS</option>
						<option value='OGG'>OGG</option>
					</select>
				</div>
				<div>
					<button>Download</button>
				</div>
			</form>
		</div>
  );
}
