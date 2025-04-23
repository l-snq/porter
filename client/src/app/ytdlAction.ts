'use server'
import ytdl, { validateURL} from '@distube/ytdl-core';
import * as fs from 'fs';

export async function downloadYTLink(url: string) {
	if (validateURL(url)) {
		const something = ytdl(url, { filter: 'audioonly'}).pipe(fs.createWriteStream("audio.mp3"))
		console.log(url);
		console.log(something);
		return something
	} else {
		console.log('not a valid url');
	}
}
