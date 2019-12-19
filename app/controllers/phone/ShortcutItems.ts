import { logger } from '/logger';
import { ShortcutItemsAbstract } from './ShortcutItemsAbstract';

export default class ShortcutItems extends ShortcutItemsAbstract {
	appShortcuts?: Titanium.UI.iOS.ApplicationShortcuts;

	constructor() {
		super();
		// If supported, create an applicationShortcuts instance
		if (Ti.UI.iOS.forceTouchSupported) {
			this.appShortcuts = Ti.UI.iOS.createApplicationShortcuts();
		}
	}

	/**
	 * Event handler set in view to list all static shortcuts
	 */

	public listStaticShortcuts(): void {
		if (!this.appShortcuts) {
			alert('This device does not support Force Touch');
			return;
		}

		logger.log('Ti.UI.iOS.ApplicationShortcuts.listStaticShortcuts', this.appShortcuts.listStaticShortcuts());
	}

	/**
	 * Event handler set in view to list all dynamic shortcuts
	 */

	public listDynamicShortcuts(): void {
		if (!this.appShortcuts) {
			alert('This device does not support Force Touch');
			return;
		}

		const res = this.appShortcuts.listDynamicShortcuts();

		logger.log('Ti.UI.iOS.ApplicationShortcuts.listDynamicShortcuts', res);

		// If don't have any, explain how to create it
		if (res.length === 0) {
			Ti.UI.createAlertDialog({
				title: 'None',
				message: 'Use createDynamicShortcut() to create a dynamic shortcut.',
			}).show();
		}
	}

	/**
	 * Event handler set in view to check if our dynamic shortcut exists
	 */

	public dynamicShortcutExists(): void {
		if (!this.appShortcuts) {
			alert('This device does not support Force Touch');
			return;
		}

		const res = this.appShortcuts.dynamicShortcutExists('details');

		logger.log('Ti.UI.iOS.ApplicationShortcuts.dynamicShortcutExists', 'details', res);

		// If don't have it, explain how to create it
		if (!res) {
			Ti.UI.createAlertDialog({
				title: 'Does not exist',
				message: 'Use createDynamicShortcut() to create a dynamic shortcut.',
			}).show();
		}
	}

	/**
	 * Event handler set in view to get our dynamic shortcut
	 */

	public getDynamicShortcut(): void {
		if (!this.appShortcuts) {
			alert('This device does not support Force Touch');
			return;
		}

		const res = this.appShortcuts.getDynamicShortcut('details');

		logger.log('Ti.UI.iOS.ApplicationShortcuts.getDynamicShortcut', 'details', res);

		// If don't have it, explain how to create it
		if (!res) {
			Ti.UI.createAlertDialog({
				title: 'Does not exist',
				message: 'Use createDynamicShortcut() to create a dynamic shortcut.',
			}).show();
		}
	}

	/**
	 * Event handler set in view to remove our dynamic shortcut
	 */

	public removeDynamicShortcut(): void {
		if (!this.appShortcuts) {
			alert('This device does not support Force Touch');
			return;
		}

		this.appShortcuts.removeDynamicShortcut('details');

		// Explain how to (re)create it
		Ti.UI.createAlertDialog({
			title: 'Removed',
			message: 'Use createDynamicShortcut() to create a dynamic shortcut.',
		}).show();
	}

	/**
	 * Event handler set in view to create a new dynamic shortcuts
	 */

	public createDynamicShortcut(): void {
		if (!this.appShortcuts) {
			alert('This device does not support Force Touch');
			return;
		}

		this.appShortcuts.addDynamicShortcut({
			// Must be unique to identify it in the shortcutitemclick-listener in index.js
			identifier: 'details',

			title: 'Titanium rocks!',
			subtitle: '(Dynamically created)',

			// A grey-scale icon of 35x35dp
			icon: 'images/icons/shortcutItemIcon.png',

			// Or a system-provided icon
			// icon: Ti.UI.iOS.SHORTCUT_ICON_TYPE_LOVE,

			// A custom payload
			userInfo: {
				created_at: Date.now(),
			},
		});
	}

	/**
	 * Event handler set in view to remove all dynamic shortcuts
	 */

	public removeAllDynamicShortcuts(): void {
		if (!this.appShortcuts) {
			alert('This device does not support Force Touch');
			return;
		}

		this.appShortcuts.removeAllDynamicShortcuts();

		// Explain how to create our dynamic shortcut
		Ti.UI.createAlertDialog({
			title: 'Removed',
			message: 'Use createDynamicShortcut() to create a dynamic shortcut.',
		}).show();
	}
}
