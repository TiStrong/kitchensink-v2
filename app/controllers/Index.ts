import Alloy from 'alloy';
import { logger } from '/logger';
import { IndexAbstract } from '/controllers/IndexAbstract';

export class Index extends IndexAbstract {
	constructor() {
		super();
		if (OS_IOS) {
			Ti.App.iOS.addEventListener('shortcutitemclick', this.handleShortcutItem.bind(this));
		}

		Alloy.CFG.tabGroup = this.Index;
		this.Index.open();
	}

	public validateDocsInfo(): void {
		if (!Ti.App.Properties.getBool('noticeShown', false)) {
			const alertNotice = Ti.UI.createAlertDialog({
				title: 'Notice',
				message:
					'While this KitchenSink provides an extensive demonstration of the Titanium API, it does not include examples for every available component. Please refer to our documentation for more details.',
				buttonNames: ['Alright!', 'Visit docs', "Don't show again"],
				cancel: 0,
				destructive: 2,
			});

			alertNotice.addEventListener('click', event => {
				if (event.index === 1) {
					Ti.Platform.openURL('https://docs.appcelerator.com/platform/latest/');
				} else if (event.index === 2) {
					Ti.App.Properties.setBool('noticeShown', true);
				}
			});

			alertNotice.show();
		}
	}

	public handleShortcutItem(e: Ti.App.iOS_shortcutitemclick_Event): void {
		logger.log('Ti.App.iOS.shortcutitemclick', e.title);
	}
}
