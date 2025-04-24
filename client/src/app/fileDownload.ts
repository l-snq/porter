'use server'
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid'; 
import { downloadYTLink } from './ytdlAction';

export async function generateFileDownload(url: string) {
  // Generate a unique filename
  const filename = `${uuidv4()}.txt`;
  const filepath = join(process.cwd(), 'public', 'downloads', filename);

	let file;
  
  // Generate and write file content
  // unwrapping the promise, this returns WriteStream. Convert it?
	const content = await downloadYTLink(url);  
	if (content === undefined) {
		console.log("undefined")
	} else {
		file = await writeFile(filepath, content);
	}
  
  // Return the URL path to download
	/*
  return {
    downloadUrl: `/downloads/${filename}`,
    filename: "large-download.txt"
  };*/
	return file
}
