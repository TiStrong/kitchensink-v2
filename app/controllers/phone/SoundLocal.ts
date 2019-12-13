import { logger } from '/logger';
import { SoundLocalAbstract } from './SoundLocalAbstract';

export default class SoundLocal extends SoundLocalAbstract {
	soundPlayer: Ti.Media.Sound;
	private playbackInterval?: number;

	constructor() {
		super();
		if (!OS_ANDROID) {
			Ti.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_AMBIENT;
		}

		this.soundPlayer = Ti.Media.createSound({
			url: '/sounds/cricket.wav',
		});

		this.soundPlayer.addEventListener('complete', this.onPlaybackComplete.bind(this));
		this.soundPlayer.addEventListener('resume', this.onPlaybackResume.bind(this));
	}

	public startPlayback(): void {
		this.soundPlayer.play();
		if (!this.playbackProgress) {
			return;
		}
		if (OS_ANDROID) {
			this.playbackProgress.max = this.soundPlayer.duration;
		} else {
			this.playbackProgress.max = this.soundPlayer.duration * 1000;
		}
	}

	public stopPlayback(): void {
		this.soundPlayer.stop();
		if (!this.playbackProgress) {
			return;
		}
		this.playbackProgress.value = 0;
	}

	public pausePlayback(): void {
		this.soundPlayer.pause();
	}

	public resetPlayback(): void {
		this.soundPlayer.reset();
		if (!this.playbackProgress) {
			return;
		}
		this.playbackProgress.value = 0;
	}

	public setVolumeUp(): void {
		if (this.soundPlayer.volume < 1.0) {
			this.soundPlayer.volume = this.soundPlayer.volume += 0.1;

			this.buttonVolumeUp.title = 'Volume++ (' + Math.round(this.soundPlayer.volume * 1000) / 1000 + ')';
			this.buttonVolumeDown.title = 'Volume--';
		}
	}

	public setVolumeDown(): void {
		if (this.soundPlayer.volume > 0.0) {
			// TODO: Too complicated for 1 line? :-)
			this.soundPlayer.volume = this.soundPlayer.volume < 0.1 ? 0 : (this.soundPlayer.volume -= 0.1);

			this.buttonVolumeDown.title = 'Volume-- (' + Math.round(this.soundPlayer.volume * 1000) / 1000 + ')';
			this.buttonVolumeUp.title = 'Volume++';
		}
	}

	public toggleLooping(): void {
		this.soundPlayer.setLooping(!this.soundPlayer.looping);
		this.buttonLooping.title = 'Looping (' + this.soundPlayer.isLooping() + ')';
	}

	public onPlaybackComplete(): void {
		if (this.playbackProgress) {
			this.playbackProgress.value = 0;
		}
	}

	public onPlaybackResume(): void {
		logger.log('Ti.Media.Sound', 'The sound player was resumed!');
	}

	public startInterval(): void {
		this.playbackInterval = setInterval(() => {
			if (this.soundPlayer.isPlaying()) {
				if (this.playbackProgress) {
					this.playbackProgress.value = this.soundPlayer.time;
				}
				logger.log('Ti.Media.Sound', 'Time: ' + this.soundPlayer.time);
			}
		}, 500);
	}

	public stopInterval(): void {
		clearInterval(this.playbackInterval);
		this.soundPlayer.release();
	}
}
