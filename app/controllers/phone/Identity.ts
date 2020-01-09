import TiIdentity from 'ti.identity';
import { IdentityAbstract } from 'controllers/phone/IdentityAbstract';

export default class Identity extends IdentityAbstract {
	authPhrase = '';
	constructor() {
		super();
		if (!TiIdentity.isSupported()) {
			alert('Biometric authentication is not supported on this device \nor\nno identities are enrolled!');
			this.authenticate.enabled = false;
		}

		if (OS_IOS) {
			if (TiIdentity.biometryType == TiIdentity.BIOMETRY_TYPE_FACE_ID) {
				this.authPhrase = 'Face ID';
			} else if (TiIdentity.biometryType == TiIdentity.BIOMETRY_TYPE_TOUCH_ID) {
				this.authPhrase = 'Touch ID';
			} else {
				this.authPhrase = '(None available)';
			}
			this.authenticate.title = 'Authenticate with: ' + this.authPhrase;
		}

		if (OS_ANDROID) {
			this.authPhrase = 'Fingerprint';
			this.authenticate.title = 'Tap here to authenticate';
		}
	}
	validate() {
		if (OS_ANDROID) {
			const reason = 'Confirm fingerprint to authenticate';
			const title = 'Identity';
			this.androidFingerprint.setReason(reason);
			this.androidFingerprint.setTitle(title);
		}
		TiIdentity.authenticate({
			reason: 'Please authenticate to continue',
			fallbackTitle: '',
			callback: (e: any) => {
				if (OS_IOS) {
					TiIdentity.invalidate();
					if (!e.success) {
						alert(e.error);
					} else {
						setTimeout(function() {
							alert('Successfully authenticated!');
						}, 1000);
					}
				} else if (OS_ANDROID) {
					if (e.success) {
						this.androidFingerprint.success();
					} else {
						this.androidFingerprint.failure(e.error);
					}
				}
			},
		});
		if (OS_ANDROID) {
			this.androidFingerprint.show(function() {
				TiIdentity.invalidate();
			});
		}
	}
}
