import { VideoPlayerAbstract } from './VideoPlayerAbstract';

export default class VideoPlayer extends VideoPlayerAbstract {
	public changeVideoSource(): void {
		// TODO: Find a more swaagy video!
		this.myPlayer.url = 'http://mirrors.standaloneinstaller.com/video-sample/DLP_PART_2_768k.mp4';
	}
}
