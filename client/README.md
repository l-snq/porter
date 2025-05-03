# porter !!

## NOTE !!! distubejs/ytdl-core is not working properly, and requires you to copy (this)[https://gist.github.com/luthfipun/3385a14816088d320ee00555667a1256] and replace the `sig.js` file in your node modules.
TODO:

1.(completed) create inputs. Inputs for:
- website url
- type of audio format you want (drop down): types of audio to offer are mp3, flac, ogg, opus.

2. (completed with the "processing" button) show the progress of the download
3. how to make the user be able to download the file.

Right now, the ytdl-core repo from distube is failing for others, for multiple reasons. Might have to look into the code, or look at other libs.
Maybe i should just use the ytdlp wrapper (the terminal based wrapper) and make
an app off of that, which albeit, is cursed. But if that works better, might be
a better idea.
check out: https://ytjs.dev/guide/getting-started.html and then use ffmpeg to convert the video to audio?
