import { logger } from 'logger';
import fb from 'facebook';
import { FacebookAbstract } from 'controllers/mashups/FacebookAbstract';

export default class Facebook extends FacebookAbstract {
	constructor() {
		super();
		if (OS_ANDROID) {
			// Required for Android
			fb.createActivityWorker({
				lifecycleContainer: this.fbWin,
			});
		}

		this.setButtonState();

		// Listen for Login event
		fb.addEventListener('login', ({ success, cancelled, error }) => {
			if (success) {
				logger.log('Modules.Facebook', 'login');
			} else if (cancelled) {
				// user cancelled
				logger.log('Modules.Facebook', 'canceled');
			} else {
				logger.log('Modules.Facebook', error);
			}
			this.setButtonState();
		});

		// Listen for Logout event
		fb.addEventListener('logout', () => {
			this.setButtonState();
		});

		// Listen for share complete event
		fb.addEventListener('shareCompleted', ({ success }) => {
			if (success) {
				logger.log('Modules.Facebook', 'shareCompleted');
			} else {
				logger.log('Modules.Facebook', 'shareCompleted failed');
			}
		});
	}

	// gets user profile information (name, picture, friends, posts)
	getGraphPath() {
		fb.requestWithGraphPath(
			'me',
			{
				fields: 'id,name,picture,friends,posts',
			},
			'GET',
			(e: any) => {
				if (e.success) {
					const respObj = JSON.parse(e.result);
					logger.log('Modules.Facebook.requestWithGraphPath', respObj);

					this.fbUserImage.image = respObj.picture.data.url;
					this.fbUserName.text = 'Welcome ' + respObj.name;
					this.fbFriends.text = 'Total Friends ' + respObj.friends.summary.total_count;
				} else if (e.error) {
					logger.log(e.error);
				} else {
					logger.log('Unknown response');
				}
			},
		);
	}

	// Set the button state
	setButtonState() {
		this.fbLogin.visible = !fb.loggedIn;
		this.fbShare.visible = fb.loggedIn;
		this.fbLogout.visible = fb.loggedIn;

		if (fb.loggedIn) {
			this.getGraphPath();
			logger.log('Login', 'Logged in');
		} else {
			this.fbUserName.text = '';
			this.fbFriends.text = '';
			this.fbUserImage.image = '';
			logger.log('Logout', 'Logged out');
		}
	}

	// Logs out the current user
	logout() {
		fb.logout();
	}

	// Logs out the current user
	login() {
		fb.permissions = ['user_photos', 'email', 'user_friends', 'public_profile', 'user_birthday', 'user_likes'];
		fb.initialize();

		if (!fb.loggedIn) {
			fb.authorize();
		}
	}

	// Shares a post
	share() {
		fb.presentShareDialog({
			link: 'https://appcelerator.com/',
		});
	}
}
