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
  
	const content = await downloadYTLink(url);  
	console.log("+++++++++++", content);
	if (content === undefined) {
		console.log("undefined")
	} else {
		file = await writeFile(filepath, content);
	}
  //https://stackoverflow.com/questions/68490546/how-to-download-a-file-on-next-js-using-an-api-route#68495303
  
  // this returns void.
	return file
}
