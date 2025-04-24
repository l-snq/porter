'use client';
import { useState} from 'react';
import { useRouter } from 'next/navigation';
import { generateFileDownload } from './fileDownload';

export default function Home() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState('');
	async function handleSubmit(e) {
		e.preventDefault();
		const { downloadUrl } = await generateFileDownload(e);
		//router.push(downloadUrl);
		console.log(downloadUrl);
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
