import { AudioRecorderAbstract } from './AudioRecorderAbstract';

export default class AudioRecorder extends AudioRecorderAbstract {
	audioRecorder = Ti.Media.createAudioRecorder();
	currentSessionCategory = Ti.Media.audioSessionCategory;
	record?: Ti.Filesystem.File;

	constructor() {
		super();
		if (OS_IOS) {
			this.audioRecorder.compression = Ti.Media.AUDIO_FORMAT_ULAW;
			this.audioRecorder.format = Ti.Media.AUDIO_FILEFORMAT_WAVE;

			Ti.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;
		}
	}

	public onOpen(): void {
		if (!Ti.Media.hasAudioRecorderPermissions()) {
			Ti.Media.requestAudioRecorderPermissions(e => {
				if (e.success) {
					this.startRecordingButton.visible = true;
				} else {
					Ti.API.error('Error: Unable to request audio recorder permissions:');
					const { code, error } = e;
					Ti.API.error(JSON.stringify({ code, error }));
				}
			});
		} else {
			this.startRecordingButton.visible = true;
		}
	}

	public onClose(): void {
		Ti.Media.audioSessionCategory = this.currentSessionCategory;
	}

	public startRecording(): void {
		this.audioRecorder.start();

		this.startRecordingButton.visible = false;
		this.pauseRecordingButton.visible = true;
		this.stopRecordingButton.visible = true;
	}

	public pauseRecording(): void {
		if (this.audioRecorder.paused) {
			this.pauseRecordingButton.title = 'Pause';
			this.audioRecorder.resume();
		} else {
			this.pauseRecordingButton.title = 'Resume';
			this.audioRecorder.pause();
		}
	}

	public stopRecording(): void {
		this.record = this.audioRecorder.stop();

		this.startRecordingButton.visible = true;
		this.playRecordingButton.visible = true;
		this.pauseRecordingButton.visible = false;
		this.stopRecordingButton.visible = false;
	}

	public playRecording(): void {
		if (!this.record) {
			return;
		}
		const audioPlayer = Ti.Media.createAudioPlayer({
			url: this.record.nativePath,
		});
		audioPlayer.start();
	}
}
