'use server'
import ytdl, { validateURL} from "ytdl-core"
import * as fs from 'fs';

export async function downloadYTLink(url: string) {
	if (validateURL(url)) {
		const download = ytdl(url, { filter: 'audioonly'});
		console.log(url);
	} else {
		console.log('not a valid url');
	}

}
