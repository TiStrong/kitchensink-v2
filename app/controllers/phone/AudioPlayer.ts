import { AudioPlayerAbstract } from './AudioPlayerAbstract';

export default class AudioPlayer extends AudioPlayerAbstract {
	closingWindow = false;

	constructor() {
		super();

		if (OS_IOS) {
			Ti.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;
		}
	}

	public handleOpen(): void {
		this.audioProgression({
			progress: 0,
		});
		this.player.start();
	}

	public handleClose(): void {
		this.closingWindow = true;
		if (this.player.playing || this.player.paused) {
			this.player.stop();
		}
	}

	public doToggleBattle(): void {
		// Ignore button if already playing
		if (this.battlePlayer.playing) {
			this.battlePlayer.stop();
			this.toggleBattle.title = 'Play battle sounds';
		} else {
			this.battlePlayer.start();
			this.toggleBattle.title = 'Stop battle sounds';
		}
	}

	public changeVolume(e: Ti.UI.Slider_change_Event): void {
		// Both slider & volume is ranged from 0-1
		this.player.volume = e.value;
	}

	// Android only because STATE_STOPPED doesn't fire there
	public handleMusicComplete(): void {
		if (!OS_ANDROID) {
			return;
		}
		this.changeMusic({ state: Ti.Media.AUDIO_STATE_STOPPED });
	}

	public changeMusic(e: Ti.Media.AudioPlayer_change_Event | { state: number }): void {
		// Restart player when play is stopped
		if (e.state === Ti.Media.AUDIO_STATE_STOPPED && !this.closingWindow) {
			this.player.start();
		}
	}

	public audioProgression(e: Ti.Media.AudioPlayer_progress_Event | { progress: number }): void {
		this.progress.text = this.timeFormat(e.progress) + '/' + this.timeFormat(this.player.duration);
	}

	// Android only because STATE_STOPPING/STATE_STOPPED doesn't fire there
	public handleBattleComplete(): void {
		if (!OS_ANDROID) {
			return;
		}
		this.completeBattle({ state: Ti.Media.AUDIO_STATE_STOPPING });
		this.completeBattle({ state: Ti.Media.AUDIO_STATE_STOPPED });
	}

	public completeBattle(e: Ti.Media.AudioPlayer_change_Event | { state: number }): void {
		if (e.state === Ti.Media.AUDIO_STATE_STOPPING) {
			this.applause.start();
		} else if (e.state === Ti.Media.AUDIO_STATE_STOPPED) {
			this.toggleBattle.title = 'Play battle sounds';
		}
	}

	public timeFormat(time: number): string {
		time = Math.round(time / 1000);
		// Hours, minutes and seconds
		const hrs = ~~(time / 3600);
		const mins = ~~((time % 3600) / 60);
		const secs = time % 60;

		// Output like "1:01" or "4:03:59" or "123:03:59"
		let result = '';

		if (hrs > 0) {
			result += String(hrs) + ':' + (mins < 10 ? '0' : '');
		}

		result += String(mins) + ':' + (secs < 10 ? '0' : '');
		result += String(secs);

		return result;
	}
}
