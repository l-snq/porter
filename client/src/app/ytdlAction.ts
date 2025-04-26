'use server'
import ytdl, { validateURL} from '@distube/ytdl-core';
import * as fs from 'fs';

export async function downloadYTLink(url: string) {
	if (validateURL(url)) {
		console.log(url);
		try {
			const something = ytdl(url, { filter: 'audioonly'});
			console.log(something);
		} catch(error) {
			console.log(error);
		}
	} else {
		console.log('not a valid url');
	}
}
