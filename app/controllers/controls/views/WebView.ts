import { logger } from '/logger';
import { WebViewAbstract } from './WebViewAbstract';

export default class WebView extends WebViewAbstract {
	public onBeforeLoad(e: Ti.UI.WebView_beforeload_Event): void {
		if (!OS_WINDOWS) {
			logger.log('Ti.UI.WebView will start loading content', e);
		} else {
			logger.log('Ti.UI.WebView will start loading content');
		}
	}

	public onLoad(e: Ti.UI.WebView_load_Event): void {
		if (!OS_WINDOWS) {
			logger.log('Ti.UI.WebView completed loading content', e);
		} else {
			logger.log('Ti.UI.WebView completed loading content');
		}
	}
}
