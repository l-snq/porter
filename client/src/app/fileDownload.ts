'use server'

import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid'; 
import { downloadYTLink } from './ytdlAction';

export async function generateLargeFileDownload(url: string) {
  // Generate a unique filename
  const filename = `${uuidv4()}.txt`;
  const filepath = join(process.cwd(), 'public', 'downloads', filename);
  
  // Generate and write file content
	const content = downloadYTLink(url);
  await writeFile(filepath, content);
  
  // Return the URL path to download
  return {
    downloadUrl: `/downloads/${filename}`,
    filename: "large-download.txt"
  };
}
