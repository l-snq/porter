'use server'
import ytdl, { validateURL} from "ytdl-core"
import * as fs from 'fs';

export async function downloadYTLink(url: string) {
	if (validateURL(url)) {
		const download = ytdl(url, { filter: 'audioonly'}).pipe(fs.writeFile('audio.mp3', content, err => {
			if (err) {
				console.log(err)
			} else {
				console.log("file written successfully")
			}
		}), 'audio');
		console.log(url);
	} else {
		console.log('not a valid url');
	}

}
